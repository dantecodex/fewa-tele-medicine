import * as argon2 from "argon2"
import prisma from "../../prisma/client/prismaClient.js"
import CustomError from "../utils/customErrorHandler.js"

const ARGON_CONFIG = {
  type: argon2.argon2id,
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
  hashLength: 32,
}

const profileData = async (userID) => {
  const user = await prisma.user.findUnique({
    where: { id: userID },
  })

  if (!user) throw new CustomError("Profile details can't be fetched", 400)

  return {
    ...user,
    deleted_at: undefined,
  }
}

const updateProfile = async (validatedData, userID) => {
  if (validatedData.password) {
    validatedData.password = await argon2.hash(validatedData.password, ARGON_CONFIG)
    validatedData.password_changed_at = new Date()
  }

  const updatedUser = await prisma.user.update({
    where: { id: userID },
    data: validatedData,
    select: {
      first: true,
      last: true,
      role: true,
      username: true,
      email: true,
      title: true,
      designation: true
    }
  })

  return updatedUser
}

export default {
  profileData,
  updateProfile,
}
