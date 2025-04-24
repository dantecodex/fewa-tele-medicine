import { Queue } from "bullmq"
import redis from "../../utils/redis.js"

const messagesQueue = new Queue("chat-messages", {
  connection: redis,
})

export default messagesQueue
