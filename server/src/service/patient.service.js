import prisma from "../../prisma/client/prismaClient.js"

const patientList = async () => {
    const patientList = await prisma.user.findMany({
        where: {
            is_active: true,
            deleted_at: null,
            is_verified: true,
            role: "PATIENT"
        },
        select: {
            id: true,
            email: true,
            first: true,
            last: true,
            phone: true
        }
    })

    return patientList
}

const upcomingMeetingList = async (patientID) => {
    const list = await prisma.meeting.findMany({
        where: {
            patient_id: patientID
        },
        include: {
            doctor: {
                select: {
                    first: true,
                    last: true,
                    phone: true,
                    email: true
                }
            }
        }
    })

    return list
}

export default { patientList, upcomingMeetingList }