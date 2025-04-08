import userService from "../service/user.service.js"
import apiResponseHandler from "../utils/apiResponseHandler.js"
import asyncErrorHandler from "../utils/asyncErrorHandler.js"
import userValidation from "../validation/user.validation.js"

const updateProfile = asyncErrorHandler(async (req, res) => {
  const role = req.user.role

  const validatorMap = {
    ADMIN: userValidation.doctorProfile,
    PATIENT: userValidation.patientProfile,
  }

  const validator = validatorMap[role] || userValidation.patientProfile
  const validatedData = validator.validate(req.body)

  const updatedUser = await userService.updateProfile(validatedData, req.user.id)

  res.status(200).json(apiResponseHandler("User has been updated successfully", updatedUser))
})
export default {
  updateProfile,
}
