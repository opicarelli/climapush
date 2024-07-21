import {
    AdminCreateUserCommand,
    AdminCreateUserCommandInput,
    AdminDeleteUserCommand,
    AdminSetUserPasswordCommand,
    AdminUpdateUserAttributesCommand,
    AttributeType,
    CognitoIdentityProviderClient,
    CognitoIdentityProviderClientConfig,
} from "@aws-sdk/client-cognito-identity-provider";
import { IdentityProviderService } from "../identity-provider.service";

export class CognitoIdentityProviderService implements IdentityProviderService {
    protected cognitoIdpClient: CognitoIdentityProviderClient;

    constructor() {
        let config: CognitoIdentityProviderClientConfig = {};
        if (process.env.ENVIRONMENT_NAME === "local") {
            config = {
                ...config,
                region: process.env.AWS_REGION as string,
                credentials: {
                    accessKeyId: process.env.AWS_ACCESS_KEY as string,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
                },
            };
        }
        this.cognitoIdpClient = new CognitoIdentityProviderClient(config);
    }

    public async createUser(username: string, randomPassword: string, attributes: AttributeType[] | undefined) {
        const input: AdminCreateUserCommandInput = {
            // AdminCreateUserRequest
            UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID ?? "",
            Username: username,
            UserAttributes: attributes,
            TemporaryPassword: randomPassword,
        };

        const command = new AdminCreateUserCommand(input);
        await this.cognitoIdpClient.send(command);
    }

    public async verifyUser(username: string, password: string) {
        const commandToSetPassword = new AdminSetUserPasswordCommand({
            UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID ?? "",
            Username: username,
            Password: password,
            Permanent: true,
        });
        const attributes = [
            {
                // AttributeType
                Name: "email_verified",
                Value: "true",
            },
        ];
        await this.cognitoIdpClient.send(commandToSetPassword);
        await this.updateAttributes(username, attributes);
    }

    public async updateAttributes(username: string, attributes: AttributeType[]) {
        const command = new AdminUpdateUserAttributesCommand({
            UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID ?? "",
            Username: username,
            UserAttributes: attributes,
        });
        await this.cognitoIdpClient.send(command);
    }

    public async deleteUser(username: string) {
        const command = new AdminDeleteUserCommand({
            UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID ?? "",
            Username: username,
        });
        await this.cognitoIdpClient.send(command);
    }

    public async updateUserPassword(username: string, newPassword: string) {
        const commandToSetPassword = new AdminSetUserPasswordCommand({
            UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID ?? "",
            Username: username,
            Password: newPassword,
            Permanent: true,
        });
        await this.cognitoIdpClient.send(commandToSetPassword);
    }
}
