import UpdateUserOptOutController from "./update-user-optout.controller";
import { UpdateUserOptOutRepository } from "./update-user-optout.repository";
import { UpdateUserOptOutUsecase } from "./update-user-optout.usecase";
import Configurations from "/opt/nodejs/infra/configurations/configurations";
import { AwsDynamoDBConfig } from "/opt/nodejs/infra/configurations/database/aws-dynamodb-configuration";
import DefaultConfigurations from "/opt/nodejs/infra/configurations/default-configurations";

export const fabricateUpdateUserOptOutController = () => {
    const configs = Configurations.getInstance();
    configs.addAll(DefaultConfigurations.getDefaults());
    configs.add(new AwsDynamoDBConfig());
    configs.load();
    const repository = new UpdateUserOptOutRepository();
    const usecase = new UpdateUserOptOutUsecase(repository);
    return new UpdateUserOptOutController(usecase);
};
