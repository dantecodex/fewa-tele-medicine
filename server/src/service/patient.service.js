import prisma from "../../prisma/client/prismaClient.js"

const patientList = async () => {
    const patientList = await prisma.user.findMany({
        where: {
            is_active: true,
            deleted_at: null,
            is_verified: true
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

export default { patientList }