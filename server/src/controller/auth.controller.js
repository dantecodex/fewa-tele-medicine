import authService from "../service/auth.service.js"
import apiResponseHandler from "../utils/apiResponseHandler.js"
import asyncErrorHandler from "../utils/asyncErrorHandler.js"
import authValidation from "../validation/auth.validation.js"

const signup = asyncErrorHandler(async (req, res) => {
  const validatedData = authValidation.signup.validate(req.body)
  const newUser = await authService.signup(validatedData)

  res.status(201).json(apiResponseHandler("Signup successful", newUser))
})

const login = asyncErrorHandler(async (req, res) => {
  const validatedData = authValidation.login.validate(req.body)
  const user = await authService.login(validatedData)
  res.status(200).json(apiResponseHandler("Login successful", user))
})

const verifyEmail = asyncErrorHandler(async (req, res) => {
  const validatedData = authValidation.verifyEmail.validate(req.body)
  const data = await authService.verifyEmail(validatedData)
  res.status(200).json(
    apiResponseHandler("Email verified successfully", data)
  )
})

const resendVerifyEmailOTP = asyncErrorHandler(async (req, res) => {
  const validatedData = await authValidation.initiateForgotPassword.validate(req.body)
  const data = await authService.resendVerifyEmailOTP(validatedData)
  res.status(200).json(
    apiResponseHandler("OTP sent successfully", data)
  )
})

const sendForgotPasswordOTP = asyncErrorHandler(async (req, res) => {
  const validatedData = authValidation.sendForgotPasswordOTP.validate(req.body)
  await authService.sendForgotPasswordOTP(validatedData)
  res.status(200).json(
    apiResponseHandler("Forgot password OTP sent to your email", {
      forgotEmailSent: true,
    })
  )
})

const verifyForgotPasswordOTP = asyncErrorHandler(async (req, res) => {
  const validatedData = authValidation.verifyForgotPasswordOTP.validate({ otp: req.query?.otp })

  const data = await authService.verifyForgotPasswordOTP(validatedData)
  res.status(200).json(
    apiResponseHandler("Forgot password OTP has been varified", data)
  )
})

const resetForgotPassword = asyncErrorHandler(async (req, res) => {
  const validatedData = authValidation.resetForgotPassword.validate(req.body)
  await authService.resetForgotPassword(validatedData, req.query.token)
  res.status(200).json(apiResponseHandler("Password has been reset successfully", {
    passwordReset: true
  }))
})

export default {
  signup,
  login,
  verifyEmail,
  sendForgotPasswordOTP,
  resetForgotPassword,
  resendVerifyEmailOTP,
  verifyForgotPasswordOTP
}
