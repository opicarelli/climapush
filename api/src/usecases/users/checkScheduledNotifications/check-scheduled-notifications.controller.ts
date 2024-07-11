import { CheckScheduledNotificationsUsecase } from "./check-scheduled-notifications.usecase";
import { Logger } from "/opt/nodejs/infra/helpers/logs-helper";
import { HttpResponse } from "/opt/nodejs/presentation/contracts/http";

export class CheckScheduledNotificationsController {
    constructor(private readonly usecase: CheckScheduledNotificationsUsecase) {}

    async handle(): Promise<HttpResponse> {
        try {
            await this.usecase.handle();
            return HttpResponse.ok();
        } catch (error) {
            Logger.error(CheckScheduledNotificationsController.name, error);
            return HttpResponse.serverError(error as Error);
        }
    }
}
