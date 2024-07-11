import { CreateUserRepository } from "./create-user.repository";
import { CognitoIdentityProviderServiceException } from "@aws-sdk/client-cognito-identity-provider";
import { GetUserByNicknameRepository } from "./get-user-by-nickname.repository";
import { CreateUserRequest } from "./create-user.dto";
import { IdentityProviderService } from "/opt/nodejs/infra/auth/identity-providers/identity-provider.service";
import { UserRole } from "/opt/nodejs/infra/configurations/auth/user-role";
import { User } from "./user.entity";
import { GetUserByEmailRepository } from "./get-user-by-email.repository";
import { UserEmailAlreadyExists } from "/opt/nodejs/infra/auth/errors/user-email-already-exists-error";
import { UserNicknameAlreadyExists } from "/opt/nodejs/infra/auth/errors/user-nickname-already-exists-error";
import { DeleteUserRepository } from "./delete-user.repository";

export class CreateUserUsecase {
    constructor(
        private repository: CreateUserRepository,
        private getUserByNicknameRepository: GetUserByNicknameRepository,
        private getUserByEmailRepository: GetUserByEmailRepository,
        private deleteUserRepository: DeleteUserRepository,
        private identityProviderService: IdentityProviderService
    ) {}

    async handle(dto: CreateUserRequest): Promise<void> {
        try {
            await this.verifyIfUserAlreadyExists(dto);
            const user = this.buildUser(dto);
            await this.repository.handle(user);
            await this.createUserInIdentityProvider(user, dto.password);
        } catch (e) {
            // TODO Migrate this exceptions to list of errors
            if (e instanceof CognitoIdentityProviderServiceException) {
                this.deleteUserRepository.handle(dto.nickname);
            }
            throw e;
        }
    }

    private buildUser(dto: CreateUserRequest): User {
        return new User(dto.fullName, dto.nickname, dto.email);
    }

    private async verifyIfUserAlreadyExists(dto: CreateUserRequest) {
        // TODO Migrate this exceptions to list of errors
        const userByNickname = await this.getUserByNicknameRepository.handle(dto.email);
        if (userByNickname) {
            throw new UserNicknameAlreadyExists();
        }
        const userByEmail = await this.getUserByEmailRepository.handle(dto.email);
        if (userByEmail) {
            throw new UserEmailAlreadyExists();
        }
    }

    private async createUserInIdentityProvider(user: User, password: string) {
        const details = [
            {
                Name: "email",
                Value: user.email,
            },
            {
                Name: "name",
                Value: user.fullName,
            },
            {
                Name: "custom:role",
                Value: UserRole.USER,
            },
        ];
        await this.identityProviderService.createUser(user.nickname, password, details);
        await this.identityProviderService.verifyUser(user.nickname, password);
    }
}
