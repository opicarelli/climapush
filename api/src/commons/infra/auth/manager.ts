import { CognitoIdTokenPayload } from "aws-jwt-verify/jwt-model";
import { Logger } from "/opt/nodejs/infra/helpers/logs-helper";
import { InvalidUserTokenError } from "/opt/nodejs/infra/auth/errors/invalid-user-token-error";
import { CognitoJwtVerifierBean } from "/opt/nodejs/infra/configurations/auth/cognito-jwt-verifier-configuration";

export class AuthManager {
    /**
     * Verify cognito token
     *
     * @param {string} token id token
     * @returns { Promise<CognitoIdTokenPayload & { email: string }> } decoded token
     */
    async verifyToken(token: string): Promise<CognitoIdTokenPayload & { email: string }> {
        const verifier = CognitoJwtVerifierBean.get();
        try {
            return verifier.verify(token);
        } catch (error) {
            Logger.error("AuthManager.verifyToken", error);
            throw new InvalidUserTokenError();
        }
    }
}
