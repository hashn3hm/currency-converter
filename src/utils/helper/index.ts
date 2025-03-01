import User from "../../models/User";
import crypto from "crypto";
import { getFileContent, sendEmails } from "../mailerService";

export const sendOTPEmail = async (subject: string, email: string) => {
    try {
        // Generate OTP
        const otp = generateOTP();

        // Find the user by email
        const data = await User.findOne({ email });

        if (!data) {
            console.error("User not found");
        }

        // Update the user's profile with the new OTP
        await User.findByIdAndUpdate(data?.id, { otp }, { new: true });

        // Prepare and send the OTP verification email
        const subject = "Confirmation Email OTP Verification";
        let template = await getFileContent(
            "src/utils/emails/otpVerification.html"
        );

        template = template.replace("{{otp}}", otp);
        sendEmails({
            to: email, subject, content: template, next: (error, info) => {
                if (error) {
                    console.error("Error sending OTP email:", error);
                } else {
                    console.log("OTP email sent:", info);
                }
            }
        });

    } catch (error) {
        if (error instanceof Error) {
            console.error("Error in sendOTPEmail:", error.message);
        } else {
            console.error("Error in sendOTPEmail:", error);
        }
    }
};

export const generateOTP = () => {
    const otp = crypto.randomInt(100000, 999999); // Generate a random number between 100000 and 999999
    return otp.toString();
};
