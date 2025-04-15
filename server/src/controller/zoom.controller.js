import zoomService from "../service/zoom.service.js"
import apiResponseHandler from "../utils/apiResponseHandler.js"
import asyncErrorHandler from "../utils/asyncErrorHandler.js"

const createMeeting = asyncErrorHandler(async (req, res) => {
  const meetingData = await zoomService.createMeeting()
  res.status(201).json(apiResponseHandler("Zoom meeting has been created", meetingData))
})

export default { createMeeting }
