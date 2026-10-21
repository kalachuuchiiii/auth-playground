import { VERIFICATION_REQUEST_EXPIRES_AFTER, VERIFICATION_REQUEST_KEY } from "@/features/auth/auth.constants";
import { setToken } from "@/features/auth/auth.services";
import type { SendSignupOtpResponse } from "@/features/auth/auth.types";
import { signUpFormSchema } from "@/features/auth/schemas";
import { toHash } from "@/features/auth/utils/hash";
import { db } from "@/lib/db/index";
import { verificationRequests } from "@/lib/db/schema";
import { sendOtpEmail } from "@/lib/gmail";
import { catchErrors } from "@/utils/catchErrors";
import ms from "ms";
import { NextRequest, NextResponse } from "next/server"
import { randomInt } from "node:crypto";

// DELETE VERIFICATION REQUEST, 
// AND CREATE A NEW ONE, THEN SEND THE CODE.

//RESEND ENDPOINT IS SEPARATED

export const POST = catchErrors<SendSignupOtpResponse>(async (req: NextRequest) => {
    const body = await req.json();
    const { email, password } = signUpFormSchema.parse(body);
    const code = randomInt(0, 1_000_000)
        .toString()
        .padStart(6, "0");

    const [hashedCode, hashedPassword] = await Promise.all([toHash(code, process.env.CODE_PEPPER!), toHash(password, process.env.PASSWORD_PEPPER)]);
    const verificationRequestValues = {
        email,
        hashedPassword,
        hashedCode,
        updatedAt: new Date(),
        expiresAt: new Date(Date.now() + ms(VERIFICATION_REQUEST_EXPIRES_AFTER))
    };

    const [result] = await db
        .insert(verificationRequests)
        .values(verificationRequestValues)
        .onConflictDoUpdate({
            target: verificationRequests.email,
            set: verificationRequestValues,
        })
        .returning({ id: verificationRequests.id });

    await setToken(VERIFICATION_REQUEST_KEY, result.id, ms(VERIFICATION_REQUEST_EXPIRES_AFTER) / 1000);
    await sendOtpEmail(email, code);

    return NextResponse.json({
        message: `Sent code to ${email}`,
        code: 'SENT_SIGNUP_OTP',
        success: true,
        nextStep: 'verify-otp',
        redirect: false
    }, {
        status: 200
    })
})