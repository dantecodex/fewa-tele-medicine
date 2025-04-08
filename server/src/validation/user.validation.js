import joi from "joi"
import ValidationHelper from "../utils/validationHelper.js"

// Base fields common to both profiles
const baseProfileFields = {
  first: joi.string().min(3).empty(""),
  last: joi.string().min(3).empty(""),
  phone: joi.string().min(10).empty(""),
  username: joi.string().min(3).empty(""),
  email: joi.string().email().empty(""),
  password: joi.string().min(6).empty(""),
}

// Patient-specific fields
const patientFields = {
  ...baseProfileFields,
  title: joi.string().allow("MR", "MRS", "MISS").empty(""),
}

// Doctor-specific fields
const doctorFields = {
  ...baseProfileFields,
  title: joi.string().allow("DR").empty(""),
  designation: joi.string().min(2).empty(""),
}

const patientProfile = new ValidationHelper(patientFields)
const doctorProfile = new ValidationHelper(doctorFields)

export default {
  patientProfile,
  doctorProfile,
}
