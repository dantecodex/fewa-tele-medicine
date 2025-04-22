import patientService from "../service/patient.service.js";
import apiResponseHandler from "../utils/apiResponseHandler.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";

const patientList = asyncErrorHandler(async (req, res) => {
    const list = await patientService.patientList()
    res.status(200).json(apiResponseHandler("Patient list has been fetched", list))
})

const upcomingMeetingList = asyncErrorHandler(async (req, res) => {
    const list = await patientService.upcomingMeetingList(req.user.id)
    res.status(200).json(apiResponseHandler("Meeting list has been fetched", list))
})

export default {
    patientList,
    upcomingMeetingList
}