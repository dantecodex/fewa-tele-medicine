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

  const meetingList = [
    {
      meeting_id: '96549027346',
      topic: 'Test Meeting',
      agenda: null,
      join_url: 'https://zoom.us/j/96549027346?pwd=YfnjslFav5IzacNVakERtgp23wKYDZ.1',
      password: 'aP1Sqe',
      start_time: new Date('2025-04-23T07:29:17Z'),
      duration: 60,
      timezone: 'UTC',
      status: 'PENDING',
      created_at: new Date('2025-04-23T07:29:17Z'),
      patient_id: 6,
      doctor_id: 1,
    },
    {
      meeting_id: '42359065432',
      topic: 'Diabetes Consultation',
      agenda: 'Discuss lifestyle management',
      join_url: 'https://zoom.us/j/42359065432?pwd=Zxc123Fghj098',
      password: 'dx4L7e',
      start_time: new Date('2025-04-25T09:00:00Z'),
      duration: 45,
      timezone: 'UTC',
      status: 'PENDING',
      created_at: new Date('2025-04-22T10:00:00Z'),
      patient_id: 6,
      doctor_id: 1,
    },
    {
      meeting_id: '76439018276',
      topic: 'Post-Surgery Checkup',
      agenda: 'Review recovery progress',
      join_url: 'https://zoom.us/j/76439018276?pwd=Abc456Def789',
      password: 'ms6ZoP',
      start_time: new Date('2025-04-28T11:30:00Z'),
      duration: 30,
      timezone: 'UTC',
      status: 'PENDING',
      created_at: new Date('2025-04-23T12:00:00Z'),
      patient_id: 6,
      doctor_id: 1,
    }
  ]

  await prisma.meeting.createMany({
    data: meetingList
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
