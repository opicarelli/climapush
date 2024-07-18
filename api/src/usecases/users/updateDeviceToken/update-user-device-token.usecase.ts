import { GetDeviceTokenByUserIdRepository } from "./get-device-token-by-user-id.repository";
import { UpdateUserDeviceTokenRepository } from "./update-user-device-token.repository";
import { TopicService } from "/opt/nodejs/infra/message/topic/topic-service";

export class UpdateUserDeviceTokenUsecase {
    constructor(
        private readonly repository: UpdateUserDeviceTokenRepository,
        private readonly getDeviceTokenByUserIdRepository: GetDeviceTokenByUserIdRepository,
        private readonly topicService: TopicService
    ) {}

    async handle(nickname: string, deviceToken: string): Promise<void> {
        const userDeviceToken = await this.getDeviceTokenByUserIdRepository.handle(nickname);
        let endpoint = userDeviceToken?.endpoint;
        if (!endpoint) {
            endpoint = await this.topicService.createEndpoint(deviceToken);
        } else {
            await this.topicService.updateEndpoint(endpoint, deviceToken);
        }
        await this.repository.handle(nickname, deviceToken, endpoint);
    }
}
