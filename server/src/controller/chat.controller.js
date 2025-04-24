import chatService from "../service/chat.service.js"
import asyncErrorHandler from "../utils/asyncErrorHandler.js"
import CustomError from "../utils/customErrorHandler.js"

const fetchMessages = asyncErrorHandler(async (req, res) => {
  const { with: roomId } = req.query

  if (!roomId) {
    throw new CustomError("Room ID is required in the query parameter", 400)
  }

  const messages = await chatService.getConversation(roomId)

  res.status(200).json("Chat history has been fetched", messages)
})

export default {
  fetchMessages,
}
