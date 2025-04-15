import Redis from "ioredis";
import redisConfig from "../config/redis.config.js";

let redis;
// console.log(rediscon);

try {
    redis = new Redis({
        host: process.env.REDIS_HOST,
        port: redisConfig.port, // make sure it's a number
        // password: process.env.REDIS_PASSWORD,
        maxRetriesPerRequest: null
    });

    redis.on("connect", () => {
        console.log("Connected to Redis");
    });

    redis.on("error", (err) => {
        console.error("Redis error (event):", err);
    });

} catch (err) {
    console.error("Redis initialization error (catch):", err);
    process.exit(1); // optional: exit if Redis is required
}

process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection:", reason);
});

export default redis
