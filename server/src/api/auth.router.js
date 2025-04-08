import { Router } from "express"

import authController from "../controller/auth.controller.js"
import rateLimiter from "../utils/rateLimiter.js"

const authRouter = Router()

authRouter.route("/auth/signup").post(rateLimiter(10, "15min"), authController.signup)
authRouter.route("/auth/login").post(rateLimiter(5, "10min"), authController.login)
authRouter
  .route("/auth/resend-verify-email")
  .post(rateLimiter(3, "10min"), authController.resendVerifyEmailOTP)
authRouter.route("/auth/verify-email").post(rateLimiter(5, "10min"), authController.verifyEmail)

authRouter
  .route("/auth/forgot-password")
  .post(rateLimiter(5, "10min"), authController.sendForgotPasswordOTP)
  .get(rateLimiter(5, "10min"), authController.verifyForgotPasswordOTP)
  .patch(rateLimiter(5, "10min"), authController.resetForgotPassword)

export default authRouter
