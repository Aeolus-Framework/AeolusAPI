import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_ISSUER = process.env.JWT_ISSUER || "none";
const JWT_SECRET = process.env.JWT_SECRET || "123";

declare module "jsonwebtoken" {
    export interface JwtPayload {
        email: string;
        exp?: number;
        iat?: number;
        iss?: string;
        role: string;

        /** Full name of user */
        name: string;

        /** User id */
        sub?: string;
    }
}

export function createToken(userid: string, role: string, email: string, name: string) {
    const payload = {
        sub: userid,
        role: role,
        email: email,
        name: name
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h", issuer: JWT_ISSUER });
}

export function verifyToken(token: string): { token: JwtPayload; valid: boolean } {
    try {
        return {
            token: jwt.verify(token, JWT_SECRET, { issuer: JWT_ISSUER }),
            valid: true
        };
    } catch (error) {
        return {
            token: undefined,
            valid: false
        };
    }
}
