import { Worker } from "bullmq"
import redis from "../../utils/redis.js"
import saveChatMessages from "../processors/chat.processor.js"

const worker = new Worker(
  "messageQueue",
  async (job) => {
    try {
      // Save the message to your database
      const msg = await saveChatMessages(job.data)

      console.log(`Message saved: ${msg.text} from ${job.senderId} to ${job.receiverId}`)
    } catch (err) {
      console.error("Error saving message:", err)
    }
  },
  {
    connection: redis,
    limiter: {
      max: 1000, // Max jobs per second
      duration: 1000, // Limit duration
    },
  }
)

worker.on("completed", (job) => {
  console.log(`Job completed: ${job.id}`)
})

worker.on("failed", (job, err) => {
  console.log(`Job failed: ${job.id}, Error: ${err.message}`)
})
