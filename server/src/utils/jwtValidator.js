import jwt from "jsonwebtoken"
import prisma from "../../prisma/client/prismaClient.js"
import CustomError from "./customErrorHandler.js"

const validateToken = async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET, {
    algorithms: ["HS256"],
    issuer: process.env.JWT_ISSUER,
    ignoreExpiration: false,
  })

  if (!decoded?.id || typeof decoded.id !== "number") {
    throw new CustomError("Invalid token payload", 401)
  }

  const user = await prisma.user.findUnique({ where: { id: decoded.id } })

  if (!user) throw new CustomError("User account not found", 401)
  if (!user.is_active) throw new CustomError("Account deactivated", 403)
  if (user.password_changed_at > new Date(decoded.iat * 1000)) {
    throw new CustomError("Security credentials expired", 401)
  }

  return user
}

export default validateToken
