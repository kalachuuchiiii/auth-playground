import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { signInFormSchema } from "./features/auth/schemas";
import { db } from "./lib/db/index";
import { eq } from "drizzle-orm";
import { credentials, users } from "./lib/db/schema";
import { verifyHash } from "./features/auth/utils/hash";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { verifyGithubLogin, verifyGoogleLogin } from "./features/auth/auth.services";
import type { VerifyLoginReturn } from "./types/next-auth";



export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    secret: process.env.JWT_SECRET,
    providers: [
        CredentialsProvider({
            name: "Credentials",

            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },

            async authorize(cred) {
                const { email, password } = signInFormSchema.parse(cred);

                const [credential] = await db.select({
                    password: credentials.password,
                    user: {
                        id: users.id,
                        nickname: users.nickname
                    }
                })
                    .from(credentials)
                    .where(eq(credentials.email, email))
                    .innerJoin(users, eq(credentials.userId, users.id));

                if (!credential) {
                    return null;
                }

                const isPasswordCorrect = await verifyHash(password + process.env.PASSWORD_PEPPER, credential.password);
                if (!isPasswordCorrect) return null;

                return {
                    email,
                    id: credential.user.id,
                    nickname: credential.user.nickname,
                    name: credential.user.nickname
                }
            },
        }),
        GoogleProvider({
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
            clientId: process.env.AUTH_GOOGLE_ID!,
        }),
        GitHubProvider({
            clientId: process.env.AUTH_GITHUB_ID!,
            clientSecret: process.env.AUTH_GITHUB_SECRET!,
        }),

    ],
    callbacks: {
        async signIn({ account, profile, user }) {
            console.log('account', account, 'profile', profile);
            if (account?.provider === 'credentials') {
                return true;
            }

            let userProfile: VerifyLoginReturn | undefined = undefined;
            if (account?.provider === 'google') {
                userProfile = await verifyGoogleLogin(profile);
            } else if (account?.provider === 'github') {
                userProfile = await verifyGithubLogin(profile)
            }

            if (!userProfile || !userProfile.ok) {
                return false;
            }

            const { image, nickname, userId } = userProfile;

            user.image = image;
            user.name = nickname || user.nickname;
            user.nickname = nickname || user.nickname;
            user.id = userId;

            return true;

        },
        jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
            }
            return token;
        },
        session({ session, token }) {
            session.user.id = token.id;
            session.user.email = token.email;
            session.user.nickname = token.nickname;
            session.user.name = token.name;
            return session;
        }
    }
};