import { CognitoIdTokenPayload } from "aws-jwt-verify/jwt-model";
import { HttpRequest } from "/opt/nodejs/presentation/contracts/http";
import { InvalidUserTokenError } from "/opt/nodejs/infra/auth/errors/invalid-user-token-error";
import { AuthManager } from "/opt/nodejs/infra/auth/manager";
import { UserRole } from "../configurations/auth/user-role";
import { UnauthorizedUserError } from "./errors/unauthorized-user-error";

type LoggedUser = {
    nickname: string;
    email: string;
    userRole: string;
    name: string;
};

export class AuthContext {
    manager: AuthManager;

    constructor(manager: AuthManager) {
        this.manager = manager;
    }

    async getLoggedUser(request: HttpRequest, ...roles: UserRole[]): Promise<LoggedUser> {
        const decodedToken = await this.verifyToken(request, ...roles);
        const username = decodedToken["cognito:username"] as string;
        const email = decodedToken["email"] as string;
        const role = decodedToken["custom:role"] as string;
        const name = decodedToken["name"] as string;
        if (!username) {
            throw new InvalidUserTokenError();
        }
        return {
            nickname: username,
            email: email,
            userRole: role,
            name: name,
        };
    }

    async verifyToken(request: HttpRequest, ...roles: UserRole[]): Promise<CognitoIdTokenPayload> {
        const headers = request.headers;
        const keyAuthorization = Object.keys(headers).find((key: string) => key.toLowerCase() === "authorization");
        if (!keyAuthorization) {
            throw new Error("Missing header authorization");
        }
        const authorization = headers[keyAuthorization];
        const decodedToken = await this.manager.verifyToken((authorization as string).replace("Bearer", "").trim());
        const role = decodedToken["custom:role"] as string;
        if (roles.length > 0 && !roles.includes(role as UserRole)) {
            throw new UnauthorizedUserError(`Unauthorized user with role: ${role}`);
        }
        return decodedToken;
    }
}
