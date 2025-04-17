import { PrismaClient } from "@prisma/client"
import * as argon2 from "argon2"

const prisma = new PrismaClient()

async function main() {
  // Simple user data
  const password = await argon2.hash("password", 8)

  await prisma.user.create({
    data: {
      first: "Saurbh",
      last: "Jain",
      email: "saurbhjain@gmail.com",
      phone: "9876543210",
      username: "saurabh",
      password,
      role: "DOCTOR",
    },
  })

  console.log("🌱 Seed completed")
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
