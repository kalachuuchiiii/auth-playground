import { VERIFICATION_REQUEST_KEY } from "@/features/auth/auth.constants";
import { getToken, getVerificationRequestById, isRequestingOnCooldown, isVerificationRequestExpired } from "@/features/auth/auth.services";
import type { OTPVerificationResponse } from "@/features/auth/auth.types";
import { codeSchema, signUpFormSchema } from "@/features/auth/schemas";
import { toHash, verifyHash } from "@/features/auth/utils/hash";
import { db } from "@/lib/db/index";
import { credentials, users } from "@/lib/db/schema";
import { BadRequestError } from "@/lib/errors/httpErrors";
import { catchErrors } from "@/utils/catchErrors";
import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";


//IF LATEST VERIFICATION CODE IS EXPIRED, THROW, ELSE COMPARE HASHES. IF MATCH, SIGN UP, AND REDIRECT, ELSE THROW.
export const POST = catchErrors<OTPVerificationResponse>(async (req: NextRequest) => {
    const body = await req.json();
    const { data: code } = codeSchema.safeParse(body.code);

    if (!code) {
        throw new BadRequestError("Invalid or Expired verification code.", 'VERIFICATION_ERROR');
    }

    const verificationId = await getToken(VERIFICATION_REQUEST_KEY);
    const verificationRequest = await getVerificationRequestById(verificationId);

    if (!verificationRequest || isVerificationRequestExpired(verificationRequest.expiresAt)) {
        throw new BadRequestError("Invalid or Expired verification code.", 'VERIFICATION_ERROR');
    }

    const isMatching = await verifyHash(code, verificationRequest.hashedCode, process.env.CODE_PEPPER);

    if (!isMatching) {
        throw new BadRequestError("Invalid or Expired verification code.", 'VERIFICATION_ERROR');
    }



    return NextResponse.json({
        message: 'OTP Verification successful!',
        code: 'OTP_VERIFICATION_SUCCESS',
        nextStep: 'sign-in',
        success: true,
        redirect: true,
        redirectTo: '/signin'
    }, {
        status: 201
    });
})