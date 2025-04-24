import prisma from "../../prisma/client/prismaClient.js"
import CustomError from "../utils/customErrorHandler.js"

const getConversation = async (roomId) => {
  const messages = await prisma.message.findMany({
    where: { roomId: roomId },
    orderBy: { created_at: "asc" },
  })

  if (messages.length === 0) {
    throw new CustomError("No messages found", 404)
  }

  return messages
}

export default {
  getConversation,
}
