import express from "express"

import userController from "../controller/user.controller.js"

import checkAuth from "../middleware/checkAuth.middleware.js"
import authRouter from "./auth.router.js"
import Upload from "../middleware/multer.middleware.js"
import zoomController from "../controller/zoom.controller.js"
import authorizeRole from "../middleware/authorization.middleware.js"
import doctorController from "../controller/doctor.controller.js"
import patientController from "../controller/patient.controller.js"

const apiRouter = express.Router()

apiRouter.use(authRouter) // Authentication related routes

apiRouter.use(checkAuth) // Middleware to check if the user exist or not

apiRouter.route("/user/profile").put(Upload().single("avatar"), userController.updateProfile)

apiRouter.route("/zoom/create-meeting").post(authorizeRole("DOCTOR"), zoomController.createZoomMeeting)

apiRouter
  .route("/doctor/time-slot")
  .post(authorizeRole("DOCTOR"), doctorController.setDoctorAvailability)
apiRouter.route("/doctor/meeting").get(authorizeRole("DOCTOR"), doctorController.upcomingMeetingList)

apiRouter.route('/patient/list').get(authorizeRole("DOCTOR"), patientController.patientList)
apiRouter.route('/patient/meeting').get(authorizeRole("PATIENT"), patientController.upcomingMeetingList)

export default apiRouter
