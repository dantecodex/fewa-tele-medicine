import express from "express"
import authorizeRole from "../middleware/authorization.middleware.js"
import patientController from "../controller/patient.controller.js"

const patientRouter = express.Router()

patientRouter.route("/list").get(authorizeRole("DOCTOR"), patientController.patientList)
patientRouter.route("/meeting").get(authorizeRole("PATIENT"), patientController.upcomingMeetingList)

export default patientRouter
