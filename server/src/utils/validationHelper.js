import Joi from "joi"
import CustomError from "./customErrorHandler.js"

class ValidationHelper {
  constructor(validationSchema) {
    // If it's already a Joi schema (object or array), use as-is
    if (Joi.isSchema(validationSchema)) {
      this.schema = validationSchema
    }
    // If it's a plain JS object, convert to Joi.object
    else if (typeof validationSchema === "object" && validationSchema !== null) {
      this.schema = Joi.object(validationSchema)
    } else {
      throw new Error("Invalid schema provided to ValidationHelper")
    }
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
      const fieldName = currentError.context?.label || currentError.path?.[0] || "unknown"
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
