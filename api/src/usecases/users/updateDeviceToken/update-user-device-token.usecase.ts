import { UpdateUserDeviceTokenRepository } from "./update-user-device-token.repository";
import { TopicService } from "/opt/nodejs/infra/message/topic/topic-service";

export class UpdateUserDeviceTokenUsecase {
    constructor(
        private readonly repository: UpdateUserDeviceTokenRepository,
        private readonly topicService: TopicService
    ) {}

    async handle(nickname: string, deviceToken: string): Promise<void> {
        const endpoint = await this.topicService.createEndpoint(deviceToken);
        await this.repository.handle(nickname, deviceToken, endpoint);
    }
}
