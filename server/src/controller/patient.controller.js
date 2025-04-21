import patientService from "../service/patient.service.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";

const patientList = asyncErrorHandler(async (req, res) => {
    const list = await patientService.patientList()
})

export default {
    patientList
}