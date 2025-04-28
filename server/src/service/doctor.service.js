import { DateTime } from "luxon"
import prisma from "../../prisma/client/prismaClient.js"
import redis from "../utils/redis.js"

const setDoctorAvailability = async (validatedData, doctorId) => {
  const dataToInsert = validatedData.map((data) => {
    return {
      doctor_id: doctorId,
      weekday: data.weekday,
      start_time: data.startTime,
      end_time: data.endTime,
      mode: data.mode,
    }
  })

  await prisma.timeslot.createMany({ data: dataToInsert })
}

const upcomingMeetingList = async (doctorId) => {
  const redisKey = `meetingHistory:${doctorId}`

  const meetingHistory = await redis.get(redisKey)
  if (meetingHistory) {
    const parsed = JSON.parse(meetingHistory)
    if (parsed.length > 0) return parsed
  }

  const list = await prisma.meeting.findMany({
    where: {
      doctor_id: doctorId,
    },
    include: {
      patient: {
        select: {
          first: true,
          last: true,
          email: true,
          phone: true,
        },
      },
    },
  })
  const formatedList = list.map((data) => {
    return {
      ...data,
      start_time: DateTime.fromISO(data.start_time, { zone: "utc" })
        .setZone(data.timezone)
        .toFormat("MMM dd, yyyy, hh:mm a"),
    }
  })
  await redis.set(`meetingHistory:${doctorId}`, JSON.stringify(formatedList))
  return formatedList
}

const updateMeetingStatus = async (validatedData, doctorId) => {
  await prisma.meeting.update({
    where: {
      doctor_id: doctorId,
      meeting_id: validatedData.meetingId,
    },
    data: { status: validatedData.status },
  })
}

export default {
  setDoctorAvailability,
  upcomingMeetingList,
  updateMeetingStatus,
}
