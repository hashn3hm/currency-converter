import { SUBJECT } from "../../constants/messages";
import { sendOTPEmail } from "../../utils/helper";
import eventEmitter from "../eventEmitter";

eventEmitter.on('userRegistered', (user) => {
    console.log('User registered event received for:', user.email);
    sendOTPEmail(SUBJECT.USER_CONFIRM_OTP, user.email);
});

eventEmitter.on('userRendOtp', (email) => {
    console.log('User send otp event received for:', email);
    sendOTPEmail(SUBJECT.USER_CONFIRM_OTP, email);
});

eventEmitter.on('userVerified', (email) => {
    console.log('User verified event received for:', email);
});