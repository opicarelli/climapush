import { CognitoJwtVerifier } from "aws-jwt-verify";
import Configuration from "/opt/nodejs/infra/configurations/configuration";
import Configurations from "/opt/nodejs/infra/configurations/configurations";

export class CognitoJwtVerifierConfig extends Configuration<any> {
    constructor() {
        super();
        this.beanName = CognitoJwtVerifierBean.BEAN_NAME;
    }

    load(): void {
        this.bean = CognitoJwtVerifier.create({
            userPoolId: process.env.AWS_COGNITO_USER_POOL_ID!,
            tokenUse: "id",
            clientId: [process.env.AWS_COGNITO_FRONTEND_CLIENT_ID!],
        });
    }
}

export class CognitoJwtVerifierBean {
    static readonly BEAN_NAME = "CognitoJwtVerifier";

    static get(): any {
        return Configurations.getBean(CognitoJwtVerifierBean.BEAN_NAME);
    }
}
