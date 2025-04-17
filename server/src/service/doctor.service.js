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
  // console.log("dataToInsert", dataToInsert);

  await prisma.timeslot.createMany({ data: dataToInsert })
}

export default {
  setDoctorAvailability,
}
