
type APIResponse<T extends string, K extends string> = {
    message: string;
    success: boolean;
    code: T,
    nextStep?: K,
    redirect: false
} | {
    message: string;
    success: boolean;
    code: T,
    nextStep?: K,
    redirect: true,
    redirectTo: string;
}

export type OTPVerificationResponse = APIResponse<'OTP_VERIFICATION_SUCCESS', 'sign-in'>;

export type SendSignupOtpResponse = APIResponse<'SENT_SIGNUP_OTP', 'verify-otp'>;