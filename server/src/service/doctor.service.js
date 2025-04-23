import prisma from "../../prisma/client/prismaClient.js"

const setDoctorAvailability = async (validatedData, doctorId) => {
  // console.log("validatedData", validatedData);

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
  const list = await prisma.meeting.findMany({
    where: {
      doctor_id: doctorId
    },
    include: {
      patient: {
        select: {
          first: true,
          last: true,
          email: true,
          phone: true
        }
      }
    }
  })
  return list
}

const updateMeetingStatus = async (validatedData, doctorId) => {
  await prisma.meeting.update({
    where: {
      doctor_id: doctorId,
      meeting_id: validatedData.meetingId
    },
    data: { status: validatedData.status }
  })
}

export default {
  setDoctorAvailability,
  upcomingMeetingList,
  updateMeetingStatus
}
