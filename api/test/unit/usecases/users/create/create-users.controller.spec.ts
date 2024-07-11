import { CognitoIdTokenPayload } from "aws-jwt-verify/jwt-model";
import { CreateUserBuilder } from "./create-users.builder";
import { AuthContext } from "/opt/nodejs/infra/auth/context";

describe("Create Users Controller", () => {
    let builder: CreateUserBuilder;

    beforeEach(() => {
        jest.spyOn(AuthContext.prototype, "verifyToken").mockImplementation(() => {
            return Promise.resolve({} as CognitoIdTokenPayload);
        });
        builder = new CreateUserBuilder();
    });

    it("test response validate fails", async () => {
        const result = await builder.controllerValidationFails();
        expect(result.statusCode).toBe(422);
        expect(result.body.message).toBe("Unprocessable Entity.");
        expect(result.body.errors.length).toBe(4);
        expect(result.body.errors).toStrictEqual(
            expect.arrayContaining([
                { fullName: ["Required"] },
                { email: ["Required"] },
                { nickname: ["Required"] },
                { password: ["Required"] },
            ])
        );
    });

    it("test response create user success", async () => {
        builder.userAdd({});

        const body = {
            fullName: "Fake User",
            email: "fakeuser@fake.com.br",
            nickname: "fakeuser",
            password: "P@ssw0rd",
        };
        const result = await builder.controllerResponseSuccess(body);

        expect(result).toHaveProperty("statusCode", 201);
        expect(result).toHaveProperty("body");
        expect(builder.aRepositoryCreateUser().handle).toHaveBeenCalledTimes(1);
    });
});
