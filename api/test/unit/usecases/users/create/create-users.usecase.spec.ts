import { CreateUserBuilder } from "./create-users.builder";
import { UserEmailAlreadyExists } from "/opt/nodejs/infra/auth/errors/user-email-already-exists-error";
import { UserNicknameAlreadyExists } from "/opt/nodejs/infra/auth/errors/user-nickname-already-exists-error";

describe("Create Users UseCase", () => {
    let builder: CreateUserBuilder;

    beforeEach(() => {
        builder = new CreateUserBuilder();
    });

    it("test create user error email already exists", async () => {
        const dto = {
            fullName: "Fake User",
            email: "fakeuser@fake.com.br",
            nickname: "fakeuser",
            password: "P@ssw0rd",
        };
        expect(async () => {
            await builder.usecaseUserEmailAlreadyExists(dto);
        }).rejects.toThrow(UserEmailAlreadyExists);
    });

    it("test create user error nickname already exists", async () => {
        const dto = {
            fullName: "Fake User",
            email: "fakeuser@fake.com.br",
            nickname: "fakeuser",
            password: "P@ssw0rd",
        };
        expect(async () => {
            await builder.usecaseUserNicknameAlreadyExists(dto);
        }).rejects.toThrow(UserNicknameAlreadyExists);
    });

    it("test create user success", async () => {
        const dto = {
            fullName: "Fake User",
            email: "fakeuser@fake.com.br",
            nickname: "fakeuser",
            password: "P@ssw0rd",
        };
        builder.userAdd({});
        await builder.usecaseSuccess(dto);

        expect(builder.aRepositoryGetUserByEmail().handle).toHaveBeenCalledTimes(1);
        expect(builder.aServiceUserIdentityProvider().createUser).toHaveBeenCalledTimes(1);
        expect(builder.aServiceUserIdentityProvider().verifyUser).toHaveBeenCalledTimes(1);
        expect(builder.aRepositoryCreateUser().handle).toHaveBeenCalledTimes(1);
    });
});
