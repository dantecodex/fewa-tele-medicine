import express from "express"

import userController from "../controller/user.controller.js"

import checkAuth from "../middleware/checkAuth.middleware.js"
import authRouter from "./auth.router.js"
import Upload from "../middleware/multer.middleware.js"
import zoomController from "../controller/zoom.controller.js"
import authorizeRole from "../middleware/authorization.middleware.js"
import doctorRouter from "./doctor.router.js"
import patientRouter from "./patient.router.js"
import chatRouter from "./chat.router.js"

const apiRouter = express.Router()

apiRouter.use(authRouter) // Authentication related routes

apiRouter.use(checkAuth) // Middleware to check if the user exist or not

apiRouter.route("/user/profile").put(Upload().single("avatar"), userController.updateProfile)

apiRouter.use("/doctor", doctorRouter)

apiRouter.use("/patient", patientRouter)

apiRouter.use("/chat", chatRouter)

apiRouter
  .route("/zoom/create-meeting")
  .post(authorizeRole("DOCTOR"), zoomController.createZoomMeeting)

export default apiRouter
