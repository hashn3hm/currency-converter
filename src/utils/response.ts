// src/utils/response.ts

import { Response } from "express";
import { asyncLocalStorage } from "../middleware/asyncLocalStorage";
import { STATUS_CODES } from "../constants/statusCodes";

// interface ApiResponse {
//     success: boolean;
//     message: string;
//     data?: any;
//     error?: any;
// }

/**
 * Send a success response
 */
// export const success = (res: Response, message: string, data?: any, status: number = 200) => {
//     return res.status(status).json({
//         success: true,
//         message,
//         data,
//     } as ApiResponse);
// };

/**
 * Send an error response
 */
// export const error = (res: Response, message: string, status: number = 400, errorDetails?: any) => {
//     return res.status(status).json({
//         success: false,
//         message,
//         error: errorDetails,
//     } as ApiResponse);
// };

class ResponseHandler {
    private static getResponse(): Response {
        const store = asyncLocalStorage.getStore();
        if (!store || !store.res) {
            throw new Error("Response object is not available in the current context.");
        }
        return store.res;
    }

    /**
   * Success response bhejne ke liye static method
   */
    public static success(message: string, data?: any, status: number = STATUS_CODES.SUCCESS): Response {
        const res = this.getResponse();
        return res.status(status).json({
            success: true,
            message,
            data,
        });
    }

    /**
     * Error response bhejne ke liye static method
     */
    public static error(message: string, status: number = STATUS_CODES.BAD_REQUEST, errorDetails?: any): Response {
        const res = this.getResponse();
        return res.status(status).json({
            success: false,
            message,
            error: errorDetails,
        });
    }
}

export default ResponseHandler;

