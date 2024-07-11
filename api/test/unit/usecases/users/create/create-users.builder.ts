import { HttpRequest } from "/opt/nodejs/presentation/contracts/http";
import { CreateUserRepository } from "@usecases/users/create/create-user.repository";
import { CreateUserUsecase } from "@usecases/users/create/create-user.usecase";
import { GetUserByEmailRepository } from "@usecases/users/create/get-user-by-email.repository";
import { HttpResponse } from "/opt/nodejs/presentation/contracts/http";
import { CognitoIdentityProviderService } from "/opt/nodejs/infra/auth/identity-providers/cognito/cognito-identity-provider.service";
import { faker } from "@faker-js/faker";
import { AuthContext } from "/opt/nodejs/infra/auth/context";
import { AuthManager } from "/opt/nodejs/infra/auth/manager";
import { GetUserByNicknameRepository } from "@usecases/users/create/get-user-by-nickname.repository";
import { DeleteUserRepository } from "@usecases/users/create/delete-user.repository";
import CreateUserController from "@usecases/users/create/create-user.controller";
import { User } from "@usecases/users/create/user.entity";
import { CreateUserRequest } from "@usecases/users/create/create-user.dto";

jest.mock("@usecases/users/create/create-user.repository");
jest.mock("@usecases/users/create/get-user-by-email.repository");
jest.mock("@usecases/users/create/get-user-by-nickname.repository");
jest.mock("@usecases/users/create/delete-user.repository");
jest.mock("/opt/nodejs/infra/auth/identity-providers/cognito/cognito-identity-provider.service");
jest.mock("/opt/nodejs/infra/configurations/auth/context-configuration", () => ({
    AuthContextConfigBean: {
        get: jest.fn(() => {
            return new AuthContext(expect.any(AuthManager)) as jest.Mocked<AuthContext>;
        }),
    },
}));

export class CreateUserBuilder {
    protected user: User = {} as User;

    protected repositoryCreateUser: jest.Mocked<CreateUserRepository>;
    protected repositoryGetUserByNickname: jest.Mocked<GetUserByNicknameRepository>;
    protected repositoryGetUserByEmail: jest.Mocked<GetUserByEmailRepository>;
    protected repositoryDeleteUser: jest.Mocked<DeleteUserRepository>;
    protected serviceUserIdentityProvider: jest.Mocked<CognitoIdentityProviderService>;

    protected controller: CreateUserController;
    protected usecase: CreateUserUsecase;

    constructor() {
        this.repositoryCreateUser = new CreateUserRepository() as jest.Mocked<CreateUserRepository>;
        this.repositoryGetUserByNickname =
            new GetUserByNicknameRepository() as jest.Mocked<GetUserByNicknameRepository>;
        this.repositoryGetUserByEmail = new GetUserByEmailRepository() as jest.Mocked<GetUserByEmailRepository>;
        this.repositoryDeleteUser = new DeleteUserRepository() as jest.Mocked<DeleteUserRepository>;
        this.serviceUserIdentityProvider =
            new CognitoIdentityProviderService() as jest.Mocked<CognitoIdentityProviderService>;

        this.usecase = new CreateUserUsecase(
            this.repositoryCreateUser,
            this.repositoryGetUserByNickname,
            this.repositoryGetUserByEmail,
            this.repositoryDeleteUser,
            this.serviceUserIdentityProvider
        );
        this.controller = new CreateUserController(this.usecase);
    }

    public userAdd(overriders: Partial<User>): this {
        this.user = {
            nickname: faker.string.uuid(),
            email: faker.internet.email(),
            fullName: faker.person.fullName(),
            ...overriders,
        } as User;

        return this;
    }

    public aController(): CreateUserController {
        return this.controller;
    }

    public aUsecase(): CreateUserUsecase {
        return this.usecase;
    }

    public aRepositoryCreateUser(): CreateUserRepository {
        return this.repositoryCreateUser;
    }

    public aRepositoryGetUserByNickname(): GetUserByNicknameRepository {
        return this.repositoryGetUserByNickname;
    }

    public aRepositoryGetUserByEmail(): GetUserByEmailRepository {
        return this.repositoryGetUserByEmail;
    }

    public aRepositoryDeleteUser(): DeleteUserRepository {
        return this.repositoryDeleteUser;
    }

    public aServiceUserIdentityProvider(): CognitoIdentityProviderService {
        return this.serviceUserIdentityProvider;
    }

    public async controllerValidationFails(): Promise<HttpResponse> {
        const controller = this.aController();
        const request = this.httpRequestController({});
        return controller.handle(request);
    }

    public async controllerResponseSuccess(body): Promise<HttpResponse> {
        this.mockRepositoryGetUserByNicknameNotFoundHandler();
        this.mockRepositoryGetUserByEmailNotFoundHandler();
        this.mockRepositoryCreateUserHandler();
        this.mockRepositoryDeleteUserHandler();
        const controller = this.aController();
        const request = this.httpRequestController(body);
        return controller.handle(request);
    }

    public async usecaseUserEmailAlreadyExists(dto: CreateUserRequest): Promise<void> {
        this.mockRepositoryGetUserByNicknameNotFoundHandler();
        this.mockRepositoryGetUserByEmailHandler();
        this.mockRepositoryDeleteUserHandler();
        const usecase = this.aUsecase();
        return usecase.handle(dto);
    }

    public async usecaseUserNicknameAlreadyExists(dto: CreateUserRequest): Promise<void> {
        this.mockRepositoryGetUserByNicknameHandler();
        this.mockRepositoryGetUserByEmailNotFoundHandler();
        this.mockRepositoryDeleteUserHandler();
        const usecase = this.aUsecase();
        return usecase.handle(dto);
    }

    public async usecaseSuccess(dto: CreateUserRequest): Promise<void> {
        this.mockRepositoryGetUserByEmailNotFoundHandler();
        this.mockRepositoryCreateUserHandler();
        this.mockRepositoryDeleteUserHandler();
        const usecase = this.aUsecase();
        return usecase.handle(dto);
    }

    private mockRepositoryCreateUserHandler(): void {
        this.repositoryCreateUser.handle.mockImplementation(() => Promise.resolve());
    }

    private mockRepositoryDeleteUserHandler(): void {
        this.repositoryDeleteUser.handle.mockImplementation(() => Promise.resolve());
    }

    private mockRepositoryGetUserByEmailNotFoundHandler() {
        this.repositoryGetUserByEmail.handle.mockImplementation(async () => {
            return undefined;
        });
    }

    private mockRepositoryGetUserByEmailHandler() {
        this.repositoryGetUserByEmail.handle.mockImplementation(async () => {
            return {
                email: "any_email",
                nickname: "any_nickname",
            };
        });
    }

    private mockRepositoryGetUserByNicknameNotFoundHandler() {
        this.repositoryGetUserByNickname.handle.mockImplementation(async () => {
            return undefined;
        });
    }

    private mockRepositoryGetUserByNicknameHandler() {
        this.repositoryGetUserByNickname.handle.mockImplementation(async () => {
            return {
                email: "any_email",
                nickname: "any_nickname",
            };
        });
    }

    private httpRequestController(body): HttpRequest {
        const headers = { "Content-Type": "application/json" };
        return new HttpRequest(null, JSON.stringify(body), headers, null);
    }
}
