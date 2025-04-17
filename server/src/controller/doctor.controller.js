import doctorService from "../service/doctor.service.js"
import apiResponseHandler from "../utils/apiResponseHandler.js"
import asyncErrorHandler from "../utils/asyncErrorHandler.js"
import doctorValidation from "../validation/doctor.validation.js"

const setDoctorAvailability = asyncErrorHandler(async (req, res) => {
  // console.log(req.body);

  const validatedData = doctorValidation.setDoctorAvailability.validate(req.body)

  await doctorService.setDoctorAvailability(validatedData, req.user.id)

  res.status(201).json(apiResponseHandler("Time slot has been created", { timeslotAdded: true }))
})

export default {
  setDoctorAvailability,
}
