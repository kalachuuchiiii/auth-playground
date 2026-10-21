import 'server-only';
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export async function toHash(code: string, pepper: string = ''): Promise<string> {
    return bcrypt.hash(code + pepper, SALT_ROUNDS);
}

export async function verifyHash(
    code: string,
    hashedCode: string,
    pepper: string = ''
): Promise<boolean> {
    return bcrypt.compare(code + pepper, hashedCode);
}
