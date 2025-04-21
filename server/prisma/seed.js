import { PrismaClient } from "@prisma/client"
import * as argon2 from "argon2"

const prisma = new PrismaClient()

async function main() {

  const password = await argon2.hash("password", 8)

  const usersList = [
    {
      first: "Saurbh",
      last: "Jain",
      email: "saurbhjain@gmail.com",
      phone: "9876543210",
      username: "saurabh",
      password,
      role: "DOCTOR",
      is_verified: true
    },
    {
      first: "Anita",
      last: "Verma",
      email: "anitaverma@gmail.com",
      phone: "9876512345",
      username: "anitav",
      password,
      role: "DOCTOR",
      is_verified: true
    },
    {
      first: "Ramesh",
      last: "Kumar",
      email: "rameshk@gmail.com",
      phone: "9876598765",
      username: "rameshk",
      password,
      role: "DOCTOR",
      is_verified: true
    },
    {
      first: "Priya",
      last: "Sharma",
      email: "priyasharma@gmail.com",
      phone: "9876501234",
      username: "priyash",
      password,
      role: "PATIENT",
      is_verified: true
    },
    {
      first: "Aman",
      last: "Gupta",
      email: "amangupta@gmail.com",
      phone: "9876587654",
      username: "amangu",
      password,
      role: "PATIENT",
      is_verified: false
    },
    {
      first: "Kiran",
      last: "Desai",
      email: "kirandesai@gmail.com",
      phone: "9876523456",
      username: "kirand",
      password,
      role: "PATIENT",
      is_verified: true
    }
  ]


  // Simple user data

  await prisma.user.createMany({
    data: usersList
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
