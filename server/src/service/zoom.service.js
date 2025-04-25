import redis from "../utils/redis.js"
import zoomConfig from "../config/zoom.config.js"
import CustomError from "../utils/customErrorHandler.js"
import prisma from "../../prisma/client/prismaClient.js"
import logger from "../utils/logger.js"
import emailQueue from "../jobs/queues/email.queue.js" // Not used, consider removing
import { DateTime } from "luxon"
import timezoneList from "../constants/timezone.constant.json" with { type: "json" }

const ZOOM_TOKEN_KEY = "zoom_access_token"
const ZOOM_TOKEN_EXPIRY = 3500 // in seconds
const { ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET } = zoomConfig
const ZOOM_API_BASE = "https://api.zoom.us/v2"

// Get or cache Zoom OAuth token
const getZoomAccessToken = async () => {
  const cachedToken = await redis.get(ZOOM_TOKEN_KEY)
  if (cachedToken) return cachedToken

  const authHeader = Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString("base64")
  const url = `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${ZOOM_ACCOUNT_ID}`

  const response = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Basic ${authHeader}` },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new CustomError(`Zoom token error: ${response.status} ${errorText}`, 400)
  }

  const { access_token } = await response.json()
  await redis.set(ZOOM_TOKEN_KEY, access_token, "EX", ZOOM_TOKEN_EXPIRY)
  return access_token
}

// Create Zoom meeting and persist to DB
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

  if (!timezoneList?.[timezone]) {
    throw new CustomError("Invalid timezone provided", 400)
  }

  const payload = {
    topic,
    type: 2, // Scheduled meeting
    start_time,
    timezone,
    settings: { waiting_room: true },
    ...(description && { agenda: description }),
  }

  const token = await getZoomAccessToken()
  const meetingRes = await fetch(`${ZOOM_API_BASE}/users/me/meetings`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!meetingRes.ok) {
    const errorText = await meetingRes.text()
    throw new CustomError(`Zoom create meeting error: ${meetingRes.status} ${errorText}`, 400)
  }

  const meetingData = await meetingRes.json()

  const meeting = await prisma.meeting.create({
    data: {
      meeting_id: String(meetingData.id),
      topic: meetingData.topic,
      agenda: description || null,
      join_url: meetingData.join_url,
      password: meetingData.password,
      start_time: meetingData.start_time,
      duration: meetingData.duration,
      timezone: meetingData.timezone,
      created_at: meetingData.created_at,
      patient_id: userId,
      doctor_id: doctorData.id,
    },
  })

  // Queue email notification
  await emailQueue.add("sendEmail", {
    email: user.email,
    subject: "Zoom Meeting Scheduled",
    message: `Your meeting with Dr. ${doctorData.name} is scheduled. Join here: ${meetingData.join_url}`,
  })

  const formattedStartTime = DateTime.fromISO(meetingData.start_time, { zone: "utc" })
    .setZone(meetingData.timezone)
    .toFormat("MMM dd, yyyy, hh:mm a")

  const offsetName = DateTime.fromISO(meetingData.start_time, { zone: "utc" }).setZone(
    meetingData.timezone
  ).offsetNameLong

  return {
    ...meeting,
    start_time: `${formattedStartTime} (${offsetName})`,
  }
}

export default { createZoomMeeting }
