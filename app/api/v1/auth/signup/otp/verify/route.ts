import { VERIFICATION_REQUEST_KEY } from "@/features/auth/auth.constants";
import { deleteToken, getToken, getVerificationRequestById, isRequestingOnCooldown, isVerificationRequestExpired } from "@/features/auth/auth.services";
import type { OTPVerificationResponse } from "@/features/auth/auth.types";
import { codeSchema, signUpFormSchema } from "@/features/auth/schemas";
import { toHash, verifyHash } from "@/features/auth/utils/hash";
import { db } from "@/lib/db/index";
import { credentials, users, verificationRequests } from "@/lib/db/schema";
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

    const verificationRequestId = await getToken(VERIFICATION_REQUEST_KEY);
    const verificationRequest = await getVerificationRequestById(verificationRequestId);


    if (!verificationRequestId || !verificationRequest) {
        throw new BadRequestError("Invalid or Expired verification code.", 'VERIFICATION_ERROR');
    }

    if (isVerificationRequestExpired(verificationRequest.expiresAt)) {
        await deleteToken(VERIFICATION_REQUEST_KEY);
        throw new BadRequestError("Invalid or Expired verification code.", 'VERIFICATION_ERROR');
    };

    const isMatching = await verifyHash(code + process.env.CODE_PEPPER, verificationRequest.hashedCode);

    if (!isMatching) {
        throw new BadRequestError("Invalid or Expired verification code.", 'VERIFICATION_ERROR');
    }

    await db.transaction(async (tx) => {
        const { email, hashedPassword } = verificationRequest;
        const [user] = await tx.insert(users).values({
            email,
            nickname: email.split('@')[0],
        }).returning({ id: users.id });
        await tx.insert(credentials).values({
            email,
            password: hashedPassword,
            userId: user.id
        })
        await tx.delete(verificationRequests).where(eq(verificationRequests.id, verificationRequestId));
    })

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