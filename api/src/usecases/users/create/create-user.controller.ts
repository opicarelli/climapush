import { CreateUserUsecase } from "./create-user.usecase";
import { Logger } from "/opt/nodejs/infra/helpers/logs-helper";
import { HttpResponse, HttpRequest } from "/opt/nodejs/presentation/contracts/http";
import schema from "./create-user.validate";
import { UserNicknameAlreadyExists } from "/opt/nodejs/infra/auth/errors/user-nickname-already-exists-error";
import { UserEmailAlreadyExists } from "/opt/nodejs/infra/auth/errors/user-email-already-exists-error";

export default class CreateUserController {
    constructor(private usecase: CreateUserUsecase) {}

    async handle(request: HttpRequest): Promise<HttpResponse> {
        try {
            const body = request.body ?? {};
            const data = schema.parse(body);
            await this.usecase.handle(data);
            return HttpResponse.created({});
        } catch (error) {
            // TODO remove this AlreadyExists when migrate exceptions to list of errors
            if (error instanceof UserNicknameAlreadyExists) {
                return HttpResponse.conflict(error);
            }
            if (error instanceof UserEmailAlreadyExists) {
                return HttpResponse.conflict(error);
            }
            Logger.error(CreateUserController.name, error);
            return HttpResponse.serverError(error as Error);
        }
    }
}
