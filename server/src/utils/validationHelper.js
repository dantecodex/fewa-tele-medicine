import Joi from "joi"
import CustomError from "./customErrorHandler.js"

class ValidationHelper {
  constructor(validationSchema) {
    this.schema = Joi.object(validationSchema)
  }

  validate(requestData) {
    const { error, value } = this.schema.validate(requestData, {
      abortEarly: false,
    })

    if (error) {
      const formattedErrors = this.formatValidationErrors(error.details)
      throw new CustomError("Validation failed", 400, formattedErrors)
    }

    return value
  }

  formatValidationErrors(errorDetails) {
    return errorDetails.reduce((errorObject, currentError) => {
      const fieldName = currentError.context.label
      const errorMessage = this.formatErrorMessage(currentError)

      errorObject[fieldName] = errorMessage
      return errorObject
    }, {})
  }

  formatErrorMessage(errorDetail) {
    let message = errorDetail.message.replace(/"/g, "")
    return message.charAt(0).toUpperCase() + message.slice(1)
  }
}

export default ValidationHelper
