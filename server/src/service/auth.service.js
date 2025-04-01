import * as argon2 from "argon2"
import crypto from "crypto"
import jwt from "jsonwebtoken"

import prisma from "../../prisma/client/prismaClient.js"
import CustomError from "../utils/customErrorHandler.js"
import logger from "../utils/logger.js"
import sendEmail from "../utils/sendEmail.js"

const JWT_CONFIG = {
  algorithm: "HS256",
  expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  issuer: process.env.JWT_ISSUER || "our-app-name",
}
const ARGON_CONFIG = {
  type: argon2.argon2id,
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
  hashLength: 32,
}
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, JWT_CONFIG)
}
const signup = async (validatedData) => {

  const hashedPassword = await argon2.hash(validatedData.password, ARGON_CONFIG)

  const newUser = await prisma.user.create({
    data: {
      ...validatedData,
      password: hashedPassword,
      password_changed_at: new Date(),
      otp: crypto.randomInt(100000, 999999).toString(),
      otp_expires_at: new Date(Date.now() + 10 * 60 * 1000),
    },
    select: { id: true, email: true, username: true, otp: true, created_at: true },
  })

  const sendOtpEmailOptions = {
    email: newUser.email,
    subject: "Verify Email address",
    message: `Email Verification OTP: ${newUser.otp}`,
  }
  await sendEmail(sendOtpEmailOptions)
  logger.info(`User created: ${newUser.email}`)

  return {
    ...newUser,
    // accessToken: generateToken(newUser.id),
    otp: undefined,
  }
}

const login = async (validatedData) => {
  const { identifier, password } = validatedData

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: { equals: identifier, mode: "insensitive" } },
        { username: { equals: identifier, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      first: true,
      last: true,
      email: true,
      username: true,
      created_at: true,
      is_verified: true,
      is_active: true,
      password: true,
    },
  })

  if (!user || !(await argon2.verify(user.password, password))) {
    logger.warn(`Failed login attempt for: ${identifier}`)
    throw new CustomError("Invalid credentials", 401)
  }

  if (!user.is_active) {
    logger.warn(`Login attempt for deactivated account: ${user.id}`)
    throw new CustomError("Account deactivated", 403)
  }

  if (!user.is_verified) {
    logger.warn(`Login attempt for Unverified email address: ${user.id}`)
    throw new CustomError("Please verify email address", 400)
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { last_login: new Date() },
  })

  logger.info(`User logged in: ${user.email}`)
  delete user.password
  delete user.otp
  return {
    ...user,
    accessToken: generateToken(user.id),
  }
}

const verifyEmail = async ({ otp }) => {
  if (otp.length !== 6) throw new CustomError("Invalid OTP", 400)

  const user = await prisma.user.findFirst({
    where: { otp, is_verified: false },
  })

  if (!user) {
    logger.warn("Invalid OTP entered for email verification")
    throw new CustomError("Invalid OTP", 400)
  }

  if (user.otp_expires_at && user.otp_expires_at < new Date()) {
    logger.warn(`OTP expired for user: ${user.id}`)
    throw new CustomError("OTP expired, Please verify again", 400, { otpExpired: true })
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { is_verified: true, otp: null, otp_expires_at: null },
  })

  logger.info(`User ${user.id} verified successfully`)
  return {
    emailVerified: true
  }
}

const resendVerifyEmailOTP = async ({ email }) => {
  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    logger.warn("User not found with entered email for to resend verify email OTP")
    throw new CustomError("User not found with the entered email", 404)
  }

  const newOTP = crypto.randomInt(100000, 999999).toString()
  await prisma.user.update({
    where: { id: user.id },
    data: {
      otp: newOTP,
      otp_expires_at: new Date(Date.now() + 10 * 60 * 1000)
    }
  })


  const sendOtpEmailOptions = {
    email: user.email,
    subject: "Verify Email address",
    message: `Email Verification OTP: ${newOTP}`,
  }
  await sendEmail(sendOtpEmailOptions)
  logger.info(`Resent email verification otp`)
  return {
    otpResent: true
  }
}

const sendForgotPasswordOTP = async ({ email }) => {
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    logger.warn(`Invalid email address provided for password reset: ${email}`);
    throw new CustomError("Invalid email address provided", 404);
  }

  if (!user.is_active) {
    logger.warn(`Forgot Password attempt for deactivated account: ${user.id}`)
    throw new CustomError("Account deactivated", 403)
  }

  const passwordResetOTP = crypto.randomInt(100000, 999999).toString()

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password_reset_otp: passwordResetOTP,
      password_reset_otp_expires_at: new Date(Date.now() + 10 * 60 * 1000),
    },
  })

  const sendPasswordResetOTPOptions = {
    email: user.email,
    subject: "Password reset link",
    message: `${process.env.PUBLIC_URL}/forgot-password?token=${passwordResetOTP}`,
  }
  await sendEmail(sendPasswordResetOTPOptions)
}

const verifyForgotPasswordOTP = async ({ otp }) => {
  const user = await prisma.user.findUnique({
    where: { password_reset_otp: otp }
  })
  if (!user) {
    logger.warn(`Invalid OTP has been provided`)
    throw new CustomError("Invalid OTP has been provided", 400)
  }

  if (user.password_reset_otp_expires_at < new Date()) {
    logger.warn(`Forgot password OTP has been expxired for ${user.id}`)
    throw new CustomError("Forgot password OTP has been expired, Please try again", 400)
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password_reset_otp: null,
      password_reset_otp_expires_at: null
    }
  })

  const resetPasswordToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: "10m" })

  return {
    forgotPasswordOTPVerfied: true,
    resetPasswordToken
  }

}

const resetForgotPassword = async ({ password, resetPasswordToken }) => {
  const { email } = jwt.verify(resetPasswordToken, process.env.JWT_SECRET)
  if (!email) {
    logger.warn("User tried to reset password with an invalid token");
    throw new CustomError("Invalid reset password token", 400);
  }
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  })

  const newHashedPassword = await argon2.hash(password, ARGON_CONFIG);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: newHashedPassword,
      password_changed_at: new Date()
    },
  })
}



export default { signup, login, verifyEmail, sendForgotPasswordOTP, verifyForgotPasswordOTP, resetForgotPassword, resendVerifyEmailOTP }
