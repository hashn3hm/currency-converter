import User from "../../models/User";
import { hashPassword } from "../../utils/SecuringPassword";
import eventEmitter from "../../events/eventEmitter";

export const registerService = async (email: string, password: string, role: string, fullName: string) => {
    // ✅ Await the hashed password
    const hashedPassword = await hashPassword(password);

    // Create a new user
    const newUser = new User({
        email,
        fullName,
        role,
        password: hashedPassword, // ✅ Now correctly storing a string
    });


    // Registration ke baad 'userRegistered' event emit karein
    eventEmitter.emit('userRegistered', newUser);

    await newUser.save();

    // sendOTPEmail(SUBJECT.USER_CONFIRM_OTP, email);

    // Construct response with token
    return newUser.toObject();
};