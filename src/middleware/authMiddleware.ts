// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../constants/environment';
import ResponseHandler from '../utils/response';
import { STATUS_CODES } from '../constants/statusCodes';
import { MESSAGES } from '../constants/messages';

// Extend Express request interface
declare global {
    namespace Express {
        interface Request {
            user?: string | object;
        }
    }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    // Extract token from Authorization header (expected format: "Bearer <token>")
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        ResponseHandler.error(MESSAGES.UNAUTHENTICATION, STATUS_CODES.UNAUTHORIZED);
        return;
    }

    const token = authHeader.split(' ')[1]; // "Bearer token"
    if (!token) {
        ResponseHandler.error(MESSAGES.UNAUTHENTICATION, STATUS_CODES.UNAUTHORIZED);
        return;
    }

    try {
        // Verify token using secret key
        const secret = JWT_SECRET as string;
        const decoded = jwt.verify(token, secret);
        // Attach decoded data (e.g., user id, roles) to request object
        req.user = decoded;
        next(); // Proceed to next middleware or route handler
    } catch (error) {
        ResponseHandler.error(MESSAGES.UNAUTHENTICATION, STATUS_CODES.UNAUTHORIZED);
        return;
    }
};
