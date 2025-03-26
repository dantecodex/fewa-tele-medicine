import { createTransport } from "nodemailer";
import logger from "./logger.js";

const sendEmail = async (options) => {
    const transporter = createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    })

    const emailOptions = {
        from: `"Provider" ${process.env.EMAIL_FROM}`,
        to: options.email,
        subject: options.subject,
        html: options.message
    }

    const info = await transporter.sendMail(emailOptions)
    logger.info(`Email sent ${info.messageId}`)
}

export default sendEmail