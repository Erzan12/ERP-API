import { randomInt } from "crypto";

export const OTP_VERIFICATION = {
    FORGOT_PASSWORD: "ForgotPassword",
}

export function generateOtp(): string {
    return randomInt(100000, 999999).toString();
}