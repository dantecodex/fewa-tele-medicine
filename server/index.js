import express from "express"
import cors from "cors"
import helmet from "helmet"
import compression from "compression"
import httpErrors from "http-errors"
import "dotenv/config"
import morgan from "morgan"

import logger from "./src/utils/logger.js"
import apiRouter from "./src/api/index.router.js"
import globalErrorHandler from "./src/utils/globalErrorHandler.js"
import requestId from "./src/middleware/requestId.middleware.js"
import rateLimiter from "./src/utils/rateLimiter.js"

// Starting workers
import "./src/jobs/index.worker.js"

const requiredEnvVars = [
  "NODE_ENV",
  "CORS_ORIGINS",
  "DATABASE_URL",
  "JWT_ISSUER",
  "JWT_SECRET",
  "EMAIL_HOST",
  "EMAIL_PORT",
  "EMAIL_USER",
  "EMAIL_PASS",
  "EMAIL_FROM",
]
if (process.env.NODE_ENV === "production") {
  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      logger.error(`Missing required environment variable: ${varName}`)
      process.exit(1)
    }
  })
}

const app = express()

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  })
)

app.use(rateLimiter(1000, "1h"))
app.use(morgan("dev"))
app.use(requestId)

app.use(compression())

app.use(express.json({ limit: "10kb" }))
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))

const corsOptions = {
  origin: process.env.CORS_ORIGINS?.split(",") || "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: process.env.NODE_ENV === "production",
  optionsSuccessStatus: 200,
}

app.use(cors(corsOptions))

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`, {
    requestId: req.requestId,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  })
  next()
})

app.use("/api/v1", apiRouter)

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  })
})

app.use("*", (req, res, next) => {
  next(httpErrors.NotFound(`Resource not found: ${req.originalUrl}`))
})

app.use(globalErrorHandler)

const PORT = process.env.PORT || 2000
const server = app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})

const shutdown = (signal) => {
  logger.info(`${signal} received: Closing HTTP server`)
  server.close(() => {
    logger.info("HTTP server closed")
    process.exit(0)
  })
}

process.on("SIGINT", shutdown)
process.on("SIGTERM", shutdown)
