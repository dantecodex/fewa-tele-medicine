import redis from "../utils/redis.js"
import zoomConfig from "../config/zoom.config.js"
import CustomError from "../utils/customErrorHandler.js"
import prisma from "../../prisma/client/prismaClient.js"
import logger from "../utils/logger.js"
import emailQueue from "../jobs/queues/email.queue.js"
import { DateTime } from "luxon"
import timezoneList from "../constants/timezone.constant.json" with { type: "json" }

const ZOOM_TOKEN_KEY = "zoom_access_token"
const ZOOM_TOKEN_EXPIRY = 3500 // seconds
const ZOOM_ACCOUNT_ID = zoomConfig.ZOOM_ACCOUNT_ID
const ZOOM_API_BASE = "https://api.zoom.us/v2"

// Fetch or cache Zoom OAuth token
const getZoomAccessToken = async () => {
  const cached = await redis.get(ZOOM_TOKEN_KEY)
  if (cached) return cached

  const authHeader = Buffer.from(
    `${zoomConfig.ZOOM_CLIENT_ID}:${zoomConfig.ZOOM_CLIENT_SECRET}`
  ).toString("base64")
  const url = `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${ZOOM_ACCOUNT_ID}`

  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Basic ${authHeader}` },
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new CustomError(`Zoom token error: ${res.status} ${errText}`, 400)
  }

  const { access_token } = await res.json()
  await redis.set(ZOOM_TOKEN_KEY, access_token, "EX", ZOOM_TOKEN_EXPIRY)
  return access_token
}

const createZoomMeeting = async (
  { topic, description, start_time, timezone, userId },
  doctorData
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  })
  if (!user) {
    logger.error(`User not found: ${userId}`)
    throw new CustomError("Invalid patient ID", 404)
  }

  // Validate timezone
  if (!Object.prototype.hasOwnProperty.call(timezoneList, timezone)) {
    throw new CustomError("Invalid timezone provided", 400)
  }

  // Format local start time
  const localISO = DateTime.fromISO(start_time, { zone: "utc" })
    .setZone(timezone)
    .toISO({ suppressMilliseconds: true })

  // Prepare Zoom payload
  const meetingPayload = {
    topic,
    ...(description && { agenda: description }),
    type: 2,
    start_time: localISO,
    timezone,
    settings: { waiting_room: true },
  }

  const token = await getZoomAccessToken()
  const zoomRes = await fetch(`${ZOOM_API_BASE}/users/me/meetings`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(meetingPayload),
  })

  if (!zoomRes.ok) {
    const errText = await zoomRes.text()
    throw new CustomError(`Zoom create meeting error: ${zoomRes.status} ${errText}`, 400)
  }

  const data = await zoomRes.json()

  // Save meeting in DB
  const meeting = await prisma.meeting.create({
    data: {
      meeting_id: String(data.id),
      topic: data.topic,
      agenda: description || null,
      join_url: data.join_url,
      password: data.password,
      start_time: data.start_time,
      duration: data.duration,
      timezone: data.timezone,
      created_at: data.created_at,
      patient_id: userId,
      doctor_id: doctorData.id,
    },
  })

  // Queue email notification
  await emailQueue.add("sendEmail", {
    email: user.email,
    subject: "Zoom Meeting Scheduled",
    message: `Your meeting with Dr. ${doctorData.name} is scheduled. Join here: ${data.join_url}`,
  })

  const dt = DateTime.fromISO(meeting.start_time, { zone: "utc" }).setZone(meeting.timezone)

  return {
    ...meeting,
    start_time: dt.toFormat("MMM dd, yyyy, hh:mm:ss a") + " " + `(${dt.offsetNameLong})`,
  }
}

export default { createZoomMeeting }
