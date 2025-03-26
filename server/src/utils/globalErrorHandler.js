

import CustomError from "./customErrorHandler.js";
import logger from "./logger.js";
import { Prisma } from '@prisma/client';


const PRISMA_ERROR_MAP = {
    P2002: 409,
    P2003: 409,
    P2025: 404,
    P2016: 400,
    P2021: 503,
    P2022: 503,
    P1017: 503,
};

const NODE_ENV = process.env.NODE_ENV || 'production';


const parseValidationError = (message) => {

    const typeMismatchMatch = message.match(/Expected (.+?), provided (\w+)/);
    if (typeMismatchMatch) {
        return {
            expectedType: typeMismatchMatch[1],
            receivedType: typeMismatchMatch[2],
            message: `Expected ${typeMismatchMatch[1]} but received ${typeMismatchMatch[2]}`
        };
    }


    const valueMatch = message.match(/Got invalid value (.+?) at/);
    if (valueMatch) {
        return {
            invalidValue: valueMatch[1].replace(/'/g, ''),
            message: `Invalid value format: ${valueMatch[1]}`
        };
    }


    const fieldMatch = message.match(/Unknown argument `(\w+)`/);
    if (fieldMatch) {
        return {
            unknownField: fieldMatch[1],
            message: `Unexpected field: ${fieldMatch[1]}`
        };
    }


    return { message: message };
};


const handlePrismaError = (error) => {

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        const statusCode = PRISMA_ERROR_MAP[error.code] || 500;
        const errorMeta = error.meta || {};

        const messageMap = {
            P2002: `Conflict: ${errorMeta.target?.join(', ') || 'Field'} already exists`,
            P2025: errorMeta.modelName
                ? `${errorMeta.modelName} not found`
                : 'Resource not found',
            P2016: 'Missing required field',
        };

        return new CustomError(
            messageMap[error.code] || 'Database request error',
            statusCode,
            {
                prismaCode: error.code,

                ...(NODE_ENV === 'development' && { meta: error.meta })
            }
        );
    }


    if (error instanceof Prisma.PrismaClientValidationError) {
        const details = parseValidationError(error.message);
        return new CustomError(
            'Invalid request structure',
            400,
            { validation: details || error.message }
        );
    }


    if (error instanceof Prisma.PrismaClientInitializationError) {
        logger.error('Prisma startup failed:', error);
        return new CustomError(
            'Database connection error',
            503,
            { code: 'DB_CONNECTION_FAILURE' }
        );
    }


    if (error instanceof Prisma.PrismaClientRustPanicError) {
        logger.fatal('Prisma engine crashed:', error);
        return new CustomError(
            'Database system error',
            500,
            { code: 'DB_ENGINE_FAILURE' }
        );
    }


    return error;
};


const globalErrorHandler = (error, req, res, next) => {

    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';


    error.request = {
        method: req.method,
        path: req.path,
        timestamp: new Date().toISOString()
    };


    if (

        error.constructor.name.startsWith('PrismaClient')
    ) {
        error = handlePrismaError(error);
    }


    logger.error({
        message: error.message,
        code: error.code || 'INTERNAL_ERROR',
        statusCode: error.statusCode,
        path: req.path,
        userId: req.user?.id,
        prismaCode: error.prismaCode,
        details: error.details,
        ...(NODE_ENV === 'development' && { stack: error.stack })
    });


    const response = {
        success: false,
        status: error.status,
        message: error.message,
        ...(error.details && { details: error.details }),
        ...(NODE_ENV === 'development' && {
            stack: error.stack,
            prismaCode: error.prismaCode
        })
    };


    if (NODE_ENV === 'production') {
        if (!error.isOperational) {
            response.message = 'An unexpected error occurred';
            delete response.details;
        }
        delete response.prismaCode;
    }

    res.status(error.statusCode).json(response);
};


process.on('uncaughtException', (error) => {
    logger.fatal('Uncaught Exception:', error);
    process.exit(1);
});


process.on('unhandledRejection', (reason) => {
    logger.fatal('Unhandled Rejection:', reason);
    process.exit(1);
});

export default globalErrorHandler;
