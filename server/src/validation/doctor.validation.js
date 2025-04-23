import Joi from "joi"
import ValidationHelper from "../utils/validationHelper.js"

const setDoctorAvailability = new ValidationHelper(
  Joi.array()
    .items({
      weekday: Joi.string()
        .valid("SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY")
        .required(),
      startTime: Joi.date().iso().required(),
      endTime: Joi.date().iso().required(),
      mode: Joi.string().valid("ONLINE", "OFFLINE"),
    })
    .required()
    .min(1)
)

const updateMeetingStatus = new ValidationHelper({
  meetingId: Joi.string().trim().required(),
  status: Joi.string().uppercase().valid("COMPLETED", "PENDING", "CANCELLED").required(),
})

export default {
  setDoctorAvailability,
  updateMeetingStatus,
}
