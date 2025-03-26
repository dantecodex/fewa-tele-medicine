import jwt from "jsonwebtoken";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import CustomError from "../utils/customErrorHandler.js";
import prisma from "../../prisma/client/prismaClient.js";

const AUTH_SCHEME = "Bearer";
const TOKEN_REGEX = new RegExp(`^${AUTH_SCHEME}\\s+(?<token>[a-zA-Z0-9_-]+\\.[a-zA-Z0-9_-]+\\.[a-zA-Z0-9_-]+)$`);

const validateAuthorizationHeader = (header) => {
    if (!header) {
        throw new CustomError("Authentication required", 401);
    }

    const match = header.match(TOKEN_REGEX);

    if (!match?.groups?.token) {
        throw new CustomError(`Invalid authentication format. Use ${AUTH_SCHEME} schema`, 400);
    }

    return match.groups.token;
};

const checkAuth = asyncErrorHandler(async (req, res, next) => {

    const token = validateAuthorizationHeader(req.headers.authorization);

    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
        algorithms: ["HS256"],
        issuer: process.env.JWT_ISSUER,
        ignoreExpiration: false,
    });


    if (!decoded?.id || typeof decoded.id !== "number") {
        throw new CustomError("Invalid token payload", 401);
    }

    const user = await prisma.user.findUnique({
        where: { id: decoded.id }
    });


    if (!user) throw new CustomError("User account not found", 401);
    if (!user.is_active) throw new CustomError("Account deactivated", 403);

    if (user.password_changed_at > new Date(decoded.iat * 1000)) {
        throw new CustomError("Security credentials expired", 401);
    }

    req.user = user

    next();
});

export default checkAuth;