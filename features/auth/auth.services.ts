import { db } from "@/lib/db/index";
import { verificationRequests } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { VERIFICATION_REQUEST_KEY } from "./auth.constants";

export const getToken = async (key: string) => {
    const cookieStore = await cookies();
    const token = cookieStore.get(key)?.value;
    return token;
}

export const isRequestingOnCooldown = (createdAt?: Date | string | null) => {
    if (!createdAt) return false;
    const createdAtTime = typeof createdAt === 'string' ? new Date(createdAt).getTime() : createdAt.getTime();
    if (Date.now() - createdAtTime <= 60_000) {
        return true;
    }
    return false;
}

export const isVerificationRequestExpired = (expiresAt: Date | string) => {
    const expiresAtTime = typeof expiresAt === 'string' ? new Date(expiresAt).getTime() : expiresAt.getTime();
    if (Date.now() > expiresAtTime) {
        return true;
    }
    return false;
}

export const getVerificationRequestById = async (id?: string | null) => {
    if (!id) return undefined;
    const verificationRequest = await db.query.verificationRequests.findFirst({
        where: eq(verificationRequests.id, id)
    })
    return verificationRequest;
}

export const getVerificationRequest = async () => {
    const verificationRequestId = await getToken(VERIFICATION_REQUEST_KEY);
    const verificationRequest = await getVerificationRequestById(verificationRequestId);
    return verificationRequest;
}

export const deleteVerificationRequestById = async (id: string) => {
    return await db.delete(verificationRequests).where(eq(verificationRequests.id, id));
}


export const setToken = async (key: string, token: string, expiresInSeconds: number) => {
    const cookieStore = await cookies();

    return cookieStore.set(key, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: expiresInSeconds
    });
}

export const deleteToken = async (key: string) => {
    const cookieStore = await cookies();

    return cookieStore.delete(key);
}

