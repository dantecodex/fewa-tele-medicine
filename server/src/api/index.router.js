import express from "express"

import userController from "../controller/user.controller.js"

import checkAuth from "../middleware/checkAuth.middleware.js"
import authRouter from "./auth.router.js"
import Upload from "../middleware/multer.middleware.js"
import zoomController from "../controller/zoom.controller.js"
import authorizeRole from "../middleware/authorization.middleware.js"
import doctorController from "../controller/doctor.controller.js"

const apiRouter = express.Router()

apiRouter.use(authRouter) // Authentication related routes

apiRouter.use(checkAuth) // Middleware to check if the user exist or not

apiRouter.route("/user/profile").put(Upload().single("avatar"), userController.updateProfile)

apiRouter.route("/zoom/create-meeting").post(authorizeRole("DOCTOR"), zoomController.createMeeting)

apiRouter
  .route("/doctor/time-slot")
  .post(authorizeRole("DOCTOR"), doctorController.setDoctorAvailability)

export default apiRouter
