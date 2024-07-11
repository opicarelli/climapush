import { CheckScheduledNotificationsController } from "./check-scheduled-notifications.controller";
import { CheckScheduledNotificationsRepository } from "./check-scheduled-notifications.repository";
import { CheckScheduledNotificationsUsecase } from "./check-scheduled-notifications.usecase";
import { CreateWeatherCityForecastRepository } from "./create-weather-city-forecast.repository";
import { GetWeatherCityForecastRepository } from "./get-weather-city-forecast.repository";
import Configurations from "/opt/nodejs/infra/configurations/configurations";
import { AwsDynamoDBConfig } from "/opt/nodejs/infra/configurations/database/aws-dynamodb-configuration";
import DefaultConfigurations from "/opt/nodejs/infra/configurations/default-configurations";
import { AwsSNSConfig } from "/opt/nodejs/infra/configurations/message/topic/aws-sns-configuration";
import { TopicAwsSNSProvider } from "/opt/nodejs/infra/message/topic/providers/topic-aws-sns-provider";
import { TopicService } from "/opt/nodejs/infra/message/topic/topic-service";
import { WeatherCptecApiProvider as WeatherCptecApiProvider } from "/opt/nodejs/infra/weather-api/providers/weather-cptec-api-provider";
import { WeatherService } from "/opt/nodejs/infra/weather-api/weather.service";

export const fabricateCheckScheduledNotificationsController = () => {
    const configs = Configurations.getInstance();
    configs.addAll(DefaultConfigurations.getDefaults());
    configs.add(new AwsDynamoDBConfig());
    configs.add(new AwsSNSConfig());
    configs.load();
    const repository = new CheckScheduledNotificationsRepository();
    const createWeatherCityForecastRepository = new CreateWeatherCityForecastRepository();
    const getWeatherCityForecastRepository = new GetWeatherCityForecastRepository();
    const topicService = new TopicService(new TopicAwsSNSProvider());
    const weatherService = new WeatherService(new WeatherCptecApiProvider());
    const usecase = new CheckScheduledNotificationsUsecase(
        repository,
        createWeatherCityForecastRepository,
        getWeatherCityForecastRepository,
        topicService,
        weatherService
    );
    return new CheckScheduledNotificationsController(usecase);
};
