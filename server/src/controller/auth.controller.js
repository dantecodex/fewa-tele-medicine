import authService from "../service/auth.service.js"
import apiResponseHandler from "../utils/apiResponseHandler.js"
import asyncErrorHandler from "../utils/asyncErrorHandler.js"
import userValidation from "../validation/auth.validation.js"

const signup = asyncErrorHandler(async (req, res) => {
  const validatedData = userValidation.signup.validate(req.body)
  const newUser = await authService.signup(validatedData)

  res.status(201).json(apiResponseHandler("Signup successful", newUser))
})

const login = asyncErrorHandler(async (req, res) => {
  const validatedData = userValidation.login.validate(req.body)
  const user = await authService.login(validatedData)
  res.status(200).json(apiResponseHandler("Login successful", user))
})

export default {
  signup,
  login,
}
