import Joi from "joi"
import ValidationHelper from "../utils/validationHelper.js"

const createZoomMeeting = new ValidationHelper({
  topic: Joi.string().min(3).trim().required(),
  description: Joi.string().min(3).max(1999).empty(""),
  timezone: Joi.string().required(),
  start_time: Joi.string().isoDate().raw().required(),
  userId: Joi.number().required(),
})

export default {
  createZoomMeeting,
}
