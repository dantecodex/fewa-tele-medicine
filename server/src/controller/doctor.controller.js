import doctorService from "../service/doctor.service.js"
import apiResponseHandler from "../utils/apiResponseHandler.js"
import asyncErrorHandler from "../utils/asyncErrorHandler.js"
import doctorValidation from "../validation/doctor.validation.js"

const setDoctorAvailability = asyncErrorHandler(async (req, res) => {
  const validatedData = doctorValidation.setDoctorAvailability.validate(req.body)

  await doctorService.setDoctorAvailability(validatedData, req.user.id)

  res.status(201).json(apiResponseHandler("Time slot has been created", { timeslotAdded: true }))
})

const upcomingMeetingList = asyncErrorHandler(async (req, res) => {
  const list = await doctorService.upcomingMeetingList(req.user.id)
  res.status(200).json(apiResponseHandler("Meeting list has been fetched", list))

})

export default {
  setDoctorAvailability,
  upcomingMeetingList
}
