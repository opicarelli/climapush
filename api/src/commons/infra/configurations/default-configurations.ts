import { CognitoJwtVerifierConfig } from "/opt/nodejs/infra/configurations/auth/cognito-jwt-verifier-configuration";
import { AuthContextConfig } from "/opt/nodejs/infra/configurations/auth/context-configuration";
import Configuration from "/opt/nodejs/infra/configurations/configuration";

export default class DefaultConfigurations {
    static getDefaults(): Configuration<any>[] {
        return [DefaultConfigurations.Defaults.authContext(), DefaultConfigurations.Defaults.cognitoJwt()];
    }

    static Defaults = class {
        static authContext() {
            return new AuthContextConfig();
        }
        static cognitoJwt() {
            return new CognitoJwtVerifierConfig();
        }
    };
}
