import { NextFunction, Request, Response } from 'express';
import ResponseHandler from '../utils/response';
import { STATUS_CODES } from '../constants/statusCodes';
import { registerService } from '../services/users/AuthService';
import { MESSAGES } from '../constants/messages';
import User from '../models/User';
import eventEmitter from '../events/eventEmitter';
import { generateToken } from '../utils/Token';
import { comparePassword } from '../utils/SecuringPassword';


export const signup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, fullName, role } = req.body;

        if (!email || !password || !fullName || !role) {
            ResponseHandler.error("Please Provide fullName , email and password");
            return;
        }

        // Check if the email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            ResponseHandler.error(MESSAGES.USER_ALREADY_EXISTS);
            return;
        }

        const registrationUser = await registerService(email, password, role, fullName);

        ResponseHandler.success(MESSAGES.OTP_SENT, registrationUser);
        return;
    } catch (err) {
        console.log("Signup error:", err);
        ResponseHandler.error(MESSAGES.INTERNAL_SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR);
        return;
    }
};


export const resendOTP = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;

        if (!email || !email.trim()) {
            ResponseHandler.error("Please Provide email");
            return;
        }

        // Check if the email already exists
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            ResponseHandler.error(MESSAGES.USER_NOT_FOUND);
            return;
        }

        // Send OTP via Email
        eventEmitter.emit('userRendOtp', email);

        ResponseHandler.success(MESSAGES.OTP_SENT, {}, STATUS_CODES.SUCCESS);
        return;
    } catch (err) {
        console.log("resend otp error:", err);
        ResponseHandler.error(MESSAGES.INTERNAL_SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR);
        return;
    }
};

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, otp } = req.body;

        if (!email?.trim() || !otp?.trim()) {
            ResponseHandler.error("Please provide email and OTP");
            return;
        }

        // Check if the email exists
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            ResponseHandler.error(MESSAGES.USER_NOT_FOUND);
            return;
        }

        // Validate OTP
        if (existingUser.otp !== otp) {
            ResponseHandler.error(MESSAGES.INVALID_OTP);
            return;
        }

        // Update user verification status
        existingUser.otp = null;
        existingUser.is_verified = true;
        await existingUser.save();

        // Generate authentication token
        const token = generateToken({
            email,
            id: String(existingUser._id),
        });


        ResponseHandler.success(MESSAGES.OTP_VERIFIED, {
            ...existingUser.toObject(),
            token,
        }, STATUS_CODES.SUCCESS);
        return;
    } catch (err) {
        console.log("verify otp error:", err);
        if (!res.headersSent) { // Prevent multiple response attempts
            ResponseHandler.error(MESSAGES.INTERNAL_SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR);
            return;
        }
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            ResponseHandler.error("Please Provide email and password");
            return;
        }

        // Check if the email exists
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            ResponseHandler.error(MESSAGES.USER_NOT_FOUND);
            return;
        }

        const isValidPassword = await comparePassword(existingUser.password as string, password);

        if (!isValidPassword) {
            ResponseHandler.error(MESSAGES.INVALID_PASSWORD);
            return;
        }

        // Generate authentication token
        const token = generateToken({
            email,
            id: String(existingUser._id),
        });

        ResponseHandler.success(MESSAGES.LOGIN_SUCCESS, {
            ...existingUser.toObject(),
            token,
        }, STATUS_CODES.SUCCESS);
        return;
    } catch (err) {
        console.log("Login error:", err);
        ResponseHandler.error(MESSAGES.INTERNAL_SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR);
        return;
    }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;

        if (!email || !email.trim()) {
            ResponseHandler.error("Please Provide email");
            return;
        }

        // Check if the email already exists
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            ResponseHandler.error(MESSAGES.USER_NOT_FOUND);
            return;
        }

        // Send OTP via Email
        eventEmitter.emit('userRendOtp', email);

        ResponseHandler.success(MESSAGES.FORGOTPASSWORD);
        return;
    } catch (err) {
        console.log("forgot password error:", err);
        ResponseHandler.error(MESSAGES.INTERNAL_SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR);
        return;
    }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, confirm_password } = req.body;

        if (!email || !email.trim() || !password || !confirm_password) {
            ResponseHandler.error("Please Provide email password confrim_password");
            return;
        }

        // Check if the email already exists
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            ResponseHandler.error(MESSAGES.USER_NOT_FOUND);
            return;
        }

        if (password !== confirm_password) {
            ResponseHandler.error(MESSAGES.PASSWORD_MISMATCH);
            return;
        }

        // Update Password
        existingUser.password = password;
        await existingUser.save();

        ResponseHandler.success(MESSAGES.FORGOTPASSWORD, existingUser, STATUS_CODES.SUCCESS);
        return;
    } catch (err) {
        console.log("reset password error:", err);
        ResponseHandler.error(MESSAGES.INTERNAL_SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR);
        return;
    }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user as { id: string };

        const existingUser = await User.findById(user.id);

        if (!existingUser) {
            ResponseHandler.error(MESSAGES.USER_NOT_FOUND);
            return;
        }

        ResponseHandler.success(MESSAGES.USER_FETCHED, existingUser);
    } catch (err) {
        console.log("get profile error:", err);
        ResponseHandler.error(MESSAGES.INTERNAL_SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR);
        return;
    }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        ResponseHandler.success(MESSAGES.USER_LOGGED_OUT);
        return;
    } catch (err) {
        console.log("logout error:", err);
        ResponseHandler.error(MESSAGES.INTERNAL_SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR);
        return;
    }
};

export const changePassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user as { id: string };

        const { old_password, new_password, confirm_password } = req.body;

        if (!old_password || !new_password || !confirm_password) {
            ResponseHandler.error("Please Provide old_password, new_password and confirm_password");
            return;
        }

        if (new_password !== confirm_password) {
            ResponseHandler.error(MESSAGES.PASSWORD_MISMATCH);
            return;
        }

        const existingUser = await User.findById(user.id);

        if (!existingUser) {
            ResponseHandler.error(MESSAGES.USER_NOT_FOUND);
            return;
        }

        const isValidPassword = await comparePassword(existingUser.password as string, old_password);

        if (!isValidPassword) {
            ResponseHandler.error(MESSAGES.INVALID_PASSWORD);
            return;
        }

        // Update Password
        existingUser.password = new_password;
        await existingUser.save();

        ResponseHandler.success(MESSAGES.PASSWORD_CHANGED, existingUser, STATUS_CODES.SUCCESS);
        return;
    } catch (error) {
        console.log("Change Password error:", error);
        ResponseHandler.error(MESSAGES.INTERNAL_SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR);
        return;
    }
};