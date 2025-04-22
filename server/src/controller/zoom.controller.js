import zoomService from "../service/zoom.service.js"
import apiResponseHandler from "../utils/apiResponseHandler.js"
import asyncErrorHandler from "../utils/asyncErrorHandler.js"
import zoomValidation from "../validation/zoom.validation.js"

const createZoomMeeting = asyncErrorHandler(async (req, res) => {
  const validatedData = zoomValidation.createZoomMeeting.validate(req.body)

  const meetingData = await zoomService.createZoomMeeting(validatedData, { id: req.user.id, name: req.user.first + ' ' + req.user.last })
  res.status(201).json(apiResponseHandler("Zoom meeting has been created", meetingData))
})

export default { createZoomMeeting }
