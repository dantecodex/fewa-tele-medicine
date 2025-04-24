import { Router } from "express"
import chatController from "../controller/chat.controller.js"

const chatRouter = Router()

chatRouter.get("/", chatController.fetchMessages)

export default chatRouter
