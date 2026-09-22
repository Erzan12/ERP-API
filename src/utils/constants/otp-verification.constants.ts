import { randomInt } from 'crypto';

export const OTP_VERIFICATION = {
  FORGOT_PASSWORD: 'ForgotPassword',
} as const;

export const OTP_EXPIRATION = {
  ONE_MINUTE: 1,
  THREE_MINUTES: 3,
  FIVE_MINUTES: 5,
  TEN_MINUTES: 10,
} as const;

export function generateOtp(length = 6): string {
  const min = 10 ** (length - 1);
  const max = 10 ** length;

  return randomInt(min, max).toString();
}

export function getOtpExpiration(
  minutes: (typeof OTP_EXPIRATION)[keyof typeof OTP_EXPIRATION] = OTP_EXPIRATION.FIVE_MINUTES,
): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}
