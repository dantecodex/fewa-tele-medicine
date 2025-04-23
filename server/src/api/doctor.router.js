import express from "express"
import doctorController from "../controller/doctor.controller.js"
import authorizeRole from "../middleware/authorization.middleware.js"

const doctorRouter = express.Router()

doctorRouter
  .route("/time-slot")
  .post(authorizeRole("DOCTOR"), doctorController.setDoctorAvailability)
doctorRouter.route("/meeting").get(authorizeRole("DOCTOR"), doctorController.upcomingMeetingList)
doctorRouter
  .route("/meeting/:status")
  .patch(authorizeRole("DOCTOR"), doctorController.updateMeetingStatus)

export default doctorRouter
