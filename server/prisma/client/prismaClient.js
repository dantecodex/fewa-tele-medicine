import { PrismaClient } from "@prisma/client";
import logger from "../../src/utils/logger.js";

const prisma = new PrismaClient({
    omit: {
        user: { password: true }
    },
    log: [
        { level: 'warn', emit: 'event' },
        { level: 'error', emit: 'event' },
    ],
});

prisma.$on('warn', (e) => {
    logger.warn('Prisma Warning:', e);
});

prisma.$on('error', (e) => {
    logger.error('Prisma Error:', e);
});

export default prisma;
