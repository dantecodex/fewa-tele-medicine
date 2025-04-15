import { Queue } from "bullmq"
import redis from "../../utils/redis.js"

const emailQueue = new Queue('sendEmail', {
    connection: redis
})

export default emailQueue