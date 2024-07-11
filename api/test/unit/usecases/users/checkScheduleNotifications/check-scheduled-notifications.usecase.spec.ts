import { CheckScheduledNotificationsBuilder } from "./check-scheduled-notifications.builder";

describe("heck Scheduled Notifications UseCase", () => {
    let builder: CheckScheduledNotificationsBuilder;

    beforeEach(() => {
        builder = new CheckScheduledNotificationsBuilder();
    });

    it("test response check scheduled notifications success", async () => {
        await builder.usecaseSuccess();
        expect(builder.aRepositoryCheckScheduledNotifications().handle).toHaveBeenCalledTimes(1);
        expect(builder.aWeatherService().getWeatherForecastByCity).toHaveBeenCalledTimes(1);
        expect(builder.aRepositoryGetWeatherCityForecastRepository().handle).toHaveBeenCalledTimes(1);
        expect(builder.aRepositoryCreateWeatherCityForecastRepository().handle).toHaveBeenCalledTimes(0);
        expect(builder.aTopicService().sendToEndpoint).toHaveBeenCalledTimes(1);
    });

    it("test response check scheduled notifications success create fallback weather city forecast", async () => {
        await builder.usecaseSuccessCreateWeatherCityCreateFallback();
        expect(builder.aRepositoryCheckScheduledNotifications().handle).toHaveBeenCalledTimes(1);
        expect(builder.aWeatherService().getWeatherForecastByCity).toHaveBeenCalledTimes(1);
        expect(builder.aRepositoryGetWeatherCityForecastRepository().handle).toHaveBeenCalledTimes(1);
        expect(builder.aRepositoryCreateWeatherCityForecastRepository().handle).toHaveBeenCalledTimes(1);
        expect(builder.aTopicService().sendToEndpoint).toHaveBeenCalledTimes(1);
    });

    it("test response check scheduled notifications success get fallback weather city forecast", async () => {
        await builder.usecaseSuccessCreateWeatherCityGetFallback();
        expect(builder.aRepositoryCheckScheduledNotifications().handle).toHaveBeenCalledTimes(1);
        expect(builder.aWeatherService().getWeatherForecastByCity).toHaveBeenCalledTimes(1);
        expect(builder.aRepositoryGetWeatherCityForecastRepository().handle).toHaveBeenCalledTimes(1);
        expect(builder.aRepositoryCreateWeatherCityForecastRepository().handle).toHaveBeenCalledTimes(0);
        expect(builder.aTopicService().sendToEndpoint).toHaveBeenCalledTimes(1);
    });

});
