import prisma from "../../../prisma/client/prismaClient.js"

const saveChatMessages = async (messageData) => {
  const msg = await prisma.message.create({
    data: {
      sender_Id: messageData.senderId,
      receiver_Id: messageData.receiverId,
      text: messageData.text,
      room_id: messageData.roomId,
    },
  })
  return msg
}
export default saveChatMessages
