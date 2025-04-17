import joi from "joi"
import ValidationHelper from "../utils/validationHelper.js"
const signup = new ValidationHelper({
  first: joi.string().min(3).trim().required(),
  last: joi.string().min(3).trim().required(),
  phone: joi.string().min(10).trim().required(),
  username: joi.string().min(3).trim().required(),
  email: joi.string().email().trim().required(),
  password: joi.string().min(6).required(),
  role: joi.string().valid("DOCTOR", "PATIENT").required(),
})
const login = new ValidationHelper({
  identifier: joi.string().min(3).required(),
  password: joi.string().min(6).required(),
})

const verifyEmail = new ValidationHelper({
  otp: joi.string().length(6).required(),
})

const sendForgotPasswordOTP = new ValidationHelper({
  email: joi.string().email().trim().required(),
})

const resetForgotPassword = new ValidationHelper({
  password: joi.string().min(6).required(),
  resetPasswordToken: joi.string().required(),
})

const verifyForgotPasswordOTP = new ValidationHelper({
  otp: joi.string().length(6).trim().required(),
})

export default {
  signup,
  login,
  verifyEmail,
  sendForgotPasswordOTP,
  resetForgotPassword,
  verifyForgotPasswordOTP,
}
