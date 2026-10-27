import { db } from "@/lib/db/index";
import { users, verificationRequests } from "@/lib/db/schema";
import { eq, type SelectedFields } from "drizzle-orm";
import { cookies } from "next/headers";
import { VERIFICATION_REQUEST_KEY } from "./auth.constants";
import type { Profile } from "next-auth";
import type { PgColumn, PgTable } from "drizzle-orm/pg-core";
import type { GithubProfile } from "next-auth/providers/github";
import type { GoogleProfile } from "next-auth/providers/google";
import type { VerifyLoginReturn } from "@/types/next-auth";

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

export const getUserByEmail = async<T extends SelectedFields<PgColumn, PgTable>>(email: string, columns: T) => {
    const user = await db.select(columns).from(users).where(eq(users.email, email));
    return user;
}

export const upsertUser = async (email: string, nickname: string) => {
    let result;
    result = await db.query.users.findFirst({
        where: eq(users.email, email),
        columns: {
            id: true
        }
    })
    if (!result) {
        result = (await db.insert(users).values({
            email,
            nickname
        }).returning({ id: users.id }) || [])[0];
    }

    return result;

}




export const verifyGoogleLogin = async (profile?: Profile): Promise<VerifyLoginReturn> => {
    const pfp = profile as GoogleProfile;
    if (!pfp.email_verified || !pfp.email) {
        return {
            ok: false as const
        };
    }
    const user = await upsertUser(pfp.email, pfp.name);
    if (!user.id) {
        return {
            ok: false as const
        }
    }
    return {
        nickname: pfp.name,
        image: pfp.picture,
        email: pfp.email,
        userId: user.id,
        ok: true as const
    }
}

export const verifyGithubLogin = async (profile?: Profile): Promise<VerifyLoginReturn> => {
    const pfp = profile as GithubProfile;
    if (!pfp.email) {
        return {
            ok: false as const
        };
    }
    const user = await upsertUser(pfp.email, pfp.login);
    if (!user.id) {
        return {
            ok: false as const
        }
    }
    return {
        nickname: pfp.login,
        userId: user.id,
        image: pfp.avatar_url,
        email: pfp.email,
        ok: true as const
    }
}




