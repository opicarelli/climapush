import UpdateUserDeviceTokenController from "./update-user-device-token.controller";
import { UpdateUserDeviceTokenRepository } from "./update-user-device-token.repository";
import { UpdateUserDeviceTokenUsecase } from "./update-user-device-token.usecase";
import Configurations from "/opt/nodejs/infra/configurations/configurations";
import { AwsDynamoDBConfig } from "/opt/nodejs/infra/configurations/database/aws-dynamodb-configuration";
import DefaultConfigurations from "/opt/nodejs/infra/configurations/default-configurations";
import { AwsSNSConfig } from "/opt/nodejs/infra/configurations/message/topic/aws-sns-configuration";
import { TopicAwsSNSProvider } from "/opt/nodejs/infra/message/topic/providers/topic-aws-sns-provider";
import { TopicService } from "/opt/nodejs/infra/message/topic/topic-service";

export const fabricateUpdateUserDeviceTokenController = () => {
    const configs = Configurations.getInstance();
    configs.addAll(DefaultConfigurations.getDefaults());
    configs.add(new AwsDynamoDBConfig());
    configs.add(new AwsSNSConfig());
    configs.load();
    const repository = new UpdateUserDeviceTokenRepository();
    const topicService = new TopicService(new TopicAwsSNSProvider());
    const usecase = new UpdateUserDeviceTokenUsecase(repository, topicService);
    return new UpdateUserDeviceTokenController(usecase);
};
