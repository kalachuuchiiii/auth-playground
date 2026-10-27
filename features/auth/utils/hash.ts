import 'server-only';
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export async function toHash(code: string): Promise<string> {
    return bcrypt.hash(code, SALT_ROUNDS);
}

export async function verifyHash(
    code: string,
    hashedCode: string,
): Promise<boolean> {
    return bcrypt.compare(code, hashedCode);
}
