import { Worker } from "bullmq"
import redis from "../../utils/redis.js"
import sendEmail from "../processors/email.processor.js"
import logger from "../../utils/logger.js"

// console.log("Email worker running...")
const emailWorker = new Worker(
    "sendEmail",
    async (job) => {
        try {
            logger.info(`➡️  Processing job ${job.id} - ${job.name} to ${job.data.email}`)
            await sendEmail(job.data)
            logger.info(`✅ Job ${job.id} completed`)
        } catch (error) {
            logger.error(`❌ Job ${job.id} failed: ${error.message}`)
            throw error
        }
    },
    {
        connection: redis,
    }
)

emailWorker.on("completed", (job) => {
    logger.info(`🎉 Job ${job.id} completed successfully`)
})

emailWorker.on("failed", (job, err) => {
    logger.error(`🔥 Job ${job.id} failed with error: ${err.message}`)
})

emailWorker.on("error", (err) => {
    logger.error(`🚨 Worker error: ${err.message}`)
})
