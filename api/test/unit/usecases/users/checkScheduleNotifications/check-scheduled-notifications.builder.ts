import { HttpResponse } from "/opt/nodejs/presentation/contracts/http";
import { AuthContext } from "/opt/nodejs/infra/auth/context";
import { AuthManager } from "/opt/nodejs/infra/auth/manager";
import { CheckScheduledNotificationsRepository } from "@usecases/users/checkScheduledNotifications/check-scheduled-notifications.repository";
import { CreateWeatherCityForecastRepository } from "@usecases/users/checkScheduledNotifications/create-weather-city-forecast.repository";
import { GetWeatherCityForecastRepository } from "@usecases/users/checkScheduledNotifications/get-weather-city-forecast.repository";
import { CheckScheduledNotificationsController } from "@usecases/users/checkScheduledNotifications/check-scheduled-notifications.controller";
import { CheckScheduledNotificationsUsecase } from "@usecases/users/checkScheduledNotifications/check-scheduled-notifications.usecase";
import { TopicService } from "/opt/nodejs/infra/message/topic/topic-service";
import { TopicProvider } from "/opt/nodejs/infra/message/topic/providers/topic-provider";
import { WeatherService } from "/opt/nodejs/infra/weather-api/weather.service";
import { WeatherCityForecast, WeatherProvider } from "/opt/nodejs/infra/weather-api/providers/weather-provider";
import { format, isBefore, subMinutes } from "date-fns";
import { faker } from "@faker-js/faker";

jest.mock("@usecases/users/checkScheduledNotifications/check-scheduled-notifications.repository");
jest.mock("@usecases/users/checkScheduledNotifications/create-weather-city-forecast.repository");
jest.mock("@usecases/users/checkScheduledNotifications/get-weather-city-forecast.repository");
jest.mock("/opt/nodejs/infra/message/topic/topic-service");
jest.mock("/opt/nodejs/infra/weather-api/weather.service");
jest.mock("/opt/nodejs/infra/configurations/auth/context-configuration", () => ({
    AuthContextConfigBean: {
        get: jest.fn(() => {
            return new AuthContext(expect.any(AuthManager)) as jest.Mocked<AuthContext>;
        }),
    },
}));
jest.mock("date-fns", () => ({ isBefore: jest.fn(), subMinutes: jest.fn(), format: jest.fn() }));

export class CheckScheduledNotificationsBuilder {
    protected repositoryCheckScheduledNotifications: jest.Mocked<CheckScheduledNotificationsRepository>;
    protected repositoryCreateWeatherCityForecast: jest.Mocked<CreateWeatherCityForecastRepository>;
    protected repositoryGetWeatherCityForecast: jest.Mocked<GetWeatherCityForecastRepository>;
    protected topicService: jest.Mocked<TopicService>;
    protected weatherService: jest.Mocked<WeatherService>;

    protected controller: CheckScheduledNotificationsController;
    protected usecase: CheckScheduledNotificationsUsecase;

    constructor() {
        this.repositoryCheckScheduledNotifications =
            new CheckScheduledNotificationsRepository() as jest.Mocked<CheckScheduledNotificationsRepository>;
        this.repositoryCreateWeatherCityForecast =
            new CreateWeatherCityForecastRepository() as jest.Mocked<CreateWeatherCityForecastRepository>;
        this.repositoryGetWeatherCityForecast =
            new GetWeatherCityForecastRepository() as jest.Mocked<GetWeatherCityForecastRepository>;
        this.topicService = new TopicService({} as TopicProvider) as jest.Mocked<TopicService>;
        this.weatherService = new WeatherService({} as WeatherProvider) as jest.Mocked<WeatherService>;

        this.usecase = new CheckScheduledNotificationsUsecase(
            this.repositoryCheckScheduledNotifications,
            this.repositoryCreateWeatherCityForecast,
            this.repositoryGetWeatherCityForecast,
            this.topicService,
            this.weatherService
        );
        this.controller = new CheckScheduledNotificationsController(this.usecase);
    }

    public aController(): CheckScheduledNotificationsController {
        return this.controller;
    }

    public aUsecase(): CheckScheduledNotificationsUsecase {
        return this.usecase;
    }

    public aRepositoryCheckScheduledNotifications(): CheckScheduledNotificationsRepository {
        return this.repositoryCheckScheduledNotifications;
    }

    public aRepositoryCreateWeatherCityForecastRepository(): CreateWeatherCityForecastRepository {
        return this.repositoryCreateWeatherCityForecast;
    }

    public aRepositoryGetWeatherCityForecastRepository(): GetWeatherCityForecastRepository {
        return this.repositoryGetWeatherCityForecast;
    }

    public aTopicService(): TopicService {
        return this.topicService;
    }

    public aWeatherService(): WeatherService {
        return this.weatherService;
    }

    public async controllerResponseSuccess(): Promise<HttpResponse> {
        this.mockRepositoryCheckScheduledNotificationsRepository();
        this.mockWeatherServiceGetWeatherForecastByCity();
        this.mockRepositoryGetWeatherCityForecastRepository();
        this.mockRepositoryCreateWeatherCityForecastRepository();
        this.mockTopicServiceSendToEndpoint();
        const controller = this.aController();
        return controller.handle();
    }

    public async usecaseSuccess(): Promise<void> {
        this.mockRepositoryCheckScheduledNotificationsRepository();
        this.mockDateFnsIsBefore();
        this.mockWeatherServiceGetWeatherForecastByCity();
        this.mockRepositoryGetWeatherCityForecastRepository();
        this.mockRepositoryCreateWeatherCityForecastRepository();
        this.mockTopicServiceSendToEndpoint();
        const usecase = this.aUsecase();
        return usecase.handle();
    }

    public async usecaseSuccessCreateWeatherCityCreateFallback(): Promise<void> {
        this.mockRepositoryCheckScheduledNotificationsRepository();
        this.mockDateFnsIsBefore();
        this.mockWeatherServiceGetWeatherForecastByCity();
        this.mockRepositoryGetWeatherCityForecastNotFoundRepository();
        this.mockRepositoryCreateWeatherCityForecastRepository();
        this.mockTopicServiceSendToEndpoint();
        const usecase = this.aUsecase();
        return usecase.handle();
    }

    public async usecaseSuccessCreateWeatherCityGetFallback(): Promise<void> {
        this.mockRepositoryCheckScheduledNotificationsRepository();
        this.mockDateFnsIsBefore();
        this.mockWeatherServiceGetWeatherForecastByCityError();
        this.mockRepositoryGetWeatherCityForecastRepository();
        this.mockRepositoryCreateWeatherCityForecastRepository();
        this.mockTopicServiceSendToEndpoint();
        const usecase = this.aUsecase();
        return usecase.handle();
    }

    private mockRepositoryCheckScheduledNotificationsRepository(): void {
        this.repositoryCheckScheduledNotifications.handle.mockImplementation(async () => {
            return [
                {
                    nickname: "any_valid_nickname",
                    frequency: "0 * * * *",
                    deviceToken: "any_valid_deviceToken",
                    endpoint: "any_valid_endpoint",
                    city: "any_valid_city_code",
                },
            ];
        });
    }

    private mockRepositoryCreateWeatherCityForecastRepository(): void {
        this.repositoryCreateWeatherCityForecast.handle.mockImplementation(() => Promise.resolve());
    }

    private mockRepositoryGetWeatherCityForecastRepository() {
        this.repositoryGetWeatherCityForecast.handle.mockImplementation(async () => {
            return {
                city: "any_city",
                temperature: 30,
                condition: "any_condition",
                name: "any_city",
                federatedState: "any_federated_state",
                date: "any_valid_date",
                forecast: [
                    {
                        day: "any-valid-date",
                        weather: "any-valid-weather",
                        max: 30,
                        min: 20,
                        iuv: 3,
                    },
                ],
            } as WeatherCityForecast;
        });
    }

    private mockTopicServiceSendToEndpoint() {
        this.topicService.sendToEndpoint.mockImplementation(async () => {
            return "any-valid-message-id";
        });
    }

    private mockRepositoryGetWeatherCityForecastNotFoundRepository() {
        this.repositoryGetWeatherCityForecast.handle.mockImplementation(async () => undefined);
    }

    private mockWeatherServiceGetWeatherForecastByCity() {
        this.weatherService.getWeatherForecastByCity.mockImplementation(async () => {
            return {
                city: "any_city",
                temperature: 30,
                condition: "any_condition",
                name: "any_city",
                federatedState: "any_federated_state",
                date: "any_valid_date",
                forecast: [
                    {
                        day: "any-valid-date",
                        weather: "any-valid-weather",
                        max: 30,
                        min: 20,
                        iuv: 3,
                    },
                ],
            } as WeatherCityForecast;
        });
    }

    private mockWeatherServiceGetWeatherForecastByCityError() {
        this.weatherService.getWeatherForecastByCity.mockImplementation(async () => {
            throw new Error("any_error");
        });
    }

    private mockDateFnsIsBefore() {
        (isBefore as jest.Mock).mockImplementation(() => true);
        (subMinutes as jest.Mock).mockImplementation(() => faker.date.past());
        (format as jest.Mock).mockImplementation(() => "any-valid-date");
    }
}
