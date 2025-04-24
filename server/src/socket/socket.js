import { Server } from "socket.io"
import validateToken from "../utils/jwtValidator.js"
import messagesQueue from "../jobs/queues/chat.queue.js"

let io

const initSocket = (server, corsOptions) => {
  io = new Server(server, { cors: corsOptions })

  io.use(async (socket, next) => {
    try {
      const tokenHeader = socket.handshake.auth?.token
      if (!tokenHeader?.startsWith("Bearer ")) {
        return next(new Error("Authentication required"))
      }

      const token = tokenHeader.split(" ")[1]
      const user = await validateToken(token)

      socket.user = user // attach user to socket
      next()
    } catch (err) {
      next(new Error("Authentication failed: " + err.message))
    }
  })

  io.on("connection", (socket) => {
    console.log("✅ Socket connected:", socket.id, "User:", socket.user.email)

    socket.on("join", ({ roomId }) => {
      socket.join(roomId)
    })

    socket.on("private_message", async ({ roomId, text, receiverId }) => {
      const senderId = socket.user.id
      await messagesQueue.add("saveMessage", {
        senderId,
        receiverId,
        text,
        roomId,
      })
      io.to(roomId).emit("private_message", { senderId, receiverId, text, roomId })
    })

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected:", socket.id)
    })
  })

  return io
}

export default initSocket
