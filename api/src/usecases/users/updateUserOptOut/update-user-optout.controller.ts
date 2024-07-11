import { UpdateUserOptOutUsecase } from "./update-user-optout.usecase";
import { schemaBody } from "./update-user-optout.validate";
import { AuthContextConfigBean } from "/opt/nodejs/infra/configurations/auth/context-configuration";
import { UserRole } from "/opt/nodejs/infra/configurations/auth/user-role";
import { Logger } from "/opt/nodejs/infra/helpers/logs-helper";
import { HttpRequest, HttpResponse } from "/opt/nodejs/presentation/contracts/http";

export default class UpdateUserOptOutController {
    constructor(private readonly usecase: UpdateUserOptOutUsecase) {}

    async handle(request: HttpRequest) {
        try {
            const authContext = AuthContextConfigBean.get();
            const loggedUser = await authContext.getLoggedUser(request, UserRole.USER);
            const body = request.body ?? {};
            const data = schemaBody.parse(body);
            await this.usecase.handle(loggedUser.nickname, data);
            return HttpResponse.ok();
        } catch (error) {
            Logger.error(UpdateUserOptOutController.name, error);
            return HttpResponse.serverError(error as Error);
        }
    }
}
