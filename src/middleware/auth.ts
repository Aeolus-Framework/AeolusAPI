import { verifyToken } from "../security/jsonWebToken";
import { Request, Response, NextFunction } from "express";

export enum Roles {
    admin = "admin",
    user = "user"
}

/**
 * Authenticate a JSON web token.
 * @param req Request object
 * @param res Response object
 * @param next Next function to run after middleware function finishes
 * @returns
 * If the token is valid, `next` function will execute and a user object with `role` and `uid` will be assigned to `req` parameter.
 *
 * If no token was found in the authorization header or was invalid, HTTP status code 401 is returned.
 */
export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const token = getTokenFromHeader(req);

    if (!token) return res.status(401).send();

    const tokenVerification = verifyToken(token);
    if (!tokenVerification.valid) {
        return res.status(401).send();
    }

    req.user = {
        uid: tokenVerification.token.sub,
        role: tokenVerification.token.role
    };
    next();
}

export function authorize(...roles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        const { user } = req;

        if (user && roles.map(v => v.toLowerCase()).includes(user.role?.toLowerCase())) next();
        else return res.status(403).send();
    };
}

function getTokenFromHeader(req: Request): string | undefined {
    const authHeader = req.headers.authorization;
    return authHeader?.split(" ")[1];
}
