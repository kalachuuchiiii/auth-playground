import "next-auth";

declare module "next-auth" {
    interface User {
        id: string;
        nickname: string;
        email: string;
        name: string;
    }

    interface Session {
        user: {
            id: string;
            nickname: string;
            email: string;
            name: string;
        };
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        nickname: string;
        email: string;
        name: string;
    }
}

export type VerifyLoginReturn = {
    ok: false
} | {

    nickname: string;
    image: string;
    email: string;
    userId: string;
    ok: true;

}