import redis from "../utils/redis.js"
import zoomConfig from "../config/zoom.config.js"
import CustomError from "../utils/customErrorHandler.js"
import prisma from "../../prisma/client/prismaClient.js"
import logger from "../utils/logger.js"
import emailQueue from "../jobs/queues/email.queue.js"

const __dirname = import.meta.dirname
import fs from "fs/promises"
import path from "path"

const getZoomAccessToken = async () => {
  const cachedToken = await redis.get("zoom_access_token")

  if (cachedToken) return cachedToken

  const tokenUrl = `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${zoomConfig.ZOOM_ACCOUNT_ID}`
  const auth = Buffer.from(
    `${zoomConfig.ZOOM_CLIENT_ID}:${zoomConfig.ZOOM_CLIENT_SECRET}`
  ).toString("base64")

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
    },
  })

  if (!response.ok) {
    throw new CustomError(
      `Failed to get access token: ${response.status} ${await response.text()}`,
      400
    )
  }

  // console.log("validatedData start time", validatedData.start_time)
  // console.log(String(validatedData.start_time))
  const data = await response.json()
  const accessToken = data.access_token

  await redis.set("zoom_access_token", accessToken, "EX", 3500)
  return accessToken
}

const createZoomMeeting = async (validatedData, doctorData) => {
  const userData = await prisma.user.findFirst({
    where: { id: validatedData.userId },
    select: { email: true },
  })

  if (!userData) {
    logger.info("Invalid patient ID provided when creating a zoom meeting")
    throw new CustomError("Invalid patient ID provided when creating a zoom meeting", 404)
  }

  const token = await getZoomAccessToken()

  const userId = "me"
  const url = `https://api.zoom.us/v2/users/${userId}/meetings`

  const timezonePath = path.join(__dirname + "./../constants/timezone.constant.json")

  const jsonString = await fs.readFile(timezonePath, "utf8")
  const timezoneList = JSON.parse(jsonString)

  if (!Object.hasOwn(timezoneList, validatedData.timezone)) {
    throw new CustomError("Invalid timezone provided", 400)
  }

  const meetingDetails = {
    topic: validatedData.topic,
    start_time: validatedData.start_time,
    type: 2,
    timezone: validatedData.timezone,
    settings: {
      waiting_room: true,
    },
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(meetingDetails),
  })

  if (!response.ok) {
    throw new CustomError(
      `Failed to create meeting: ${response.status} ${await response.text()}`,
      400
    )
  }

  const meetingData = await response.json()
  // console.log("meetingData", meetingData.start_time)
  // console.log("timezone", meetingData.timezone)
  // console.log(meetingData.start_time.toLocaleString("en-IN", { timeZone: validatedData.timezone }))

  const meeting = await prisma.meeting.create({
    data: {
      meeting_id: String(meetingData.id),
      topic: meetingData.topic,
      agenda: meetingData.description ?? null,
      join_url: meetingData.join_url,
      password: meetingData.password,
      start_time: String(validatedData.start_time),
      duration: meetingData.duration,
      timezone: meetingData.timezone,
      created_at: meetingData.created_at,
      patient_id: validatedData.userId,
      doctor_id: doctorData.id,
    },
  })

  await emailQueue.add("sendEmail", {
    email: userData.email,
    subject: "Zoom meeting Scheduled",
    message: `Your zoom meeting with Dr. ${doctorData.name}, Your meeting link: ${meetingData.join_url}`,
  })

  return meeting
}

export default { createZoomMeeting }
