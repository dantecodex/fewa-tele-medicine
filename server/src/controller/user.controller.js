import userService from "../service/user.service.js"
import apiResponseHandler from "../utils/apiResponseHandler.js"
import asyncErrorHandler from "../utils/asyncErrorHandler.js"
import userValidation from "../validation/user.validation.js"

const updateProfile = asyncErrorHandler(async (req, res) => {
  const { role, ...profileData } = req.body

  const validatorMap = {
    DOCTOR: userValidation.doctorProfile,
    PATIENT: userValidation.patientProfile,
  }

  const validator = validatorMap[role] || userValidation.patientProfile
  const validatedData = validator.validate(profileData)

  const updatedUser = await userService.updateProfile(validatedData, req.user.id)

  res.status(200).json(apiResponseHandler("User has been updated successfully", updatedUser))
})
export default {
  updateProfile,
}
