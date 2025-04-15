import { createTransport } from "nodemailer"
import logger from "../../utils/logger.js"
import emailConfig from "../../config/email.config.js"

const sendEmail = async (options) => {
  const transporter = createTransport({
    host: emailConfig.HOST,
    port: emailConfig.PORT,
    auth: {
      user: emailConfig.USER,
      pass: emailConfig.PASSWORD,
    },
  })

  const emailOptions = {
    from: `"Provider" ${emailConfig.FROM}`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  }

  const info = await transporter.sendMail(emailOptions)
  logger.info(`Email sent ${info.messageId}`)
}

export default sendEmail
