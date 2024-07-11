import CreateUsersController from "./create-user.controller";
import { CreateUserRepository } from "./create-user.repository";
import { CreateUserUsecase } from "./create-user.usecase";
import { DeleteUserRepository } from "./delete-user.repository";
import { GetUserByEmailRepository } from "./get-user-by-email.repository";
import { GetUserByNicknameRepository } from "./get-user-by-nickname.repository";
import { CognitoIdentityProviderService } from "/opt/nodejs/infra/auth/identity-providers/cognito/cognito-identity-provider.service";
import Configurations from "/opt/nodejs/infra/configurations/configurations";
import { AwsDynamoDBConfig } from "/opt/nodejs/infra/configurations/database/aws-dynamodb-configuration";
import DefaultConfigurations from "/opt/nodejs/infra/configurations/default-configurations";

export const fabricateCreateUserController = () => {
    // configs
    const configs = Configurations.getInstance();
    configs.addAll(DefaultConfigurations.getDefaults());
    configs.add(new AwsDynamoDBConfig());
    configs.load();

    // use case
    const repository = new CreateUserRepository();
    const getUserByNicknameRepository = new GetUserByNicknameRepository();
    const getUserByEmailRepository = new GetUserByEmailRepository();
    const deleteUserRepository = new DeleteUserRepository();
    const identityProviderService = new CognitoIdentityProviderService();
    const usecase = new CreateUserUsecase(
        repository,
        getUserByNicknameRepository,
        getUserByEmailRepository,
        deleteUserRepository,
        identityProviderService
    );
    return new CreateUsersController(usecase);
};
