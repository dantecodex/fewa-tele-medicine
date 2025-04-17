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

export default {
    setDoctorAvailability,
}
