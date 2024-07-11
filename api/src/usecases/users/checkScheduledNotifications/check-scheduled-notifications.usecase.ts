import { format, isBefore, subMinutes } from "date-fns";
import { CheckScheduledNotificationsRepository } from "./check-scheduled-notifications.repository";
import parser from "cron-parser";
import { TopicService } from "/opt/nodejs/infra/message/topic/topic-service";
import { WeatherService } from "/opt/nodejs/infra/weather-api/weather.service";
import { WeatherCityForecast } from "/opt/nodejs/infra/weather-api/providers/weather-provider";
import { CreateWeatherCityForecastRepository } from "./create-weather-city-forecast.repository";
import { GetWeatherCityForecastRepository } from "./get-weather-city-forecast.repository";

export class CheckScheduledNotificationsUsecase {
    constructor(
        private readonly repository: CheckScheduledNotificationsRepository,
        private readonly createWeatherCityForecastRepository: CreateWeatherCityForecastRepository,
        private readonly getWeatherCityForecastRepository: GetWeatherCityForecastRepository,
        private readonly topicService: TopicService,
        private readonly weatherService: WeatherService
    ) {}

    async handle() {
        const users = await this.repository.handle();
        console.log(`Sending notification to ${users.length} users`);
        const now = new Date();
        const mapForecast = new Map<string, WeatherCityForecast>();
        await Promise.all(
            users.map(async (user) => {
                const cron = user.frequency;
                console.log(`Sending notification to ${user.nickname}; cron ${cron}`);

                const nextDate = this.getNextDate(subMinutes(now, 1), cron);
                console.log(`Sending notification to ${user.nickname}; nextDate ${nextDate}`);

                if (user.endpoint && isBefore(nextDate, now)) {
                    console.log(`Sending notification to ${user.nickname}; ${now}`);

                    let weatherForecast = mapForecast.get(user.city);
                    if (!weatherForecast) {
                        weatherForecast = await this.getWeatherForecastByCity(user.city, format(now, "yyyy-MM-dd"));
                    }

                    if (weatherForecast) {
                        mapForecast.set(user.city, weatherForecast);
                        await this.sendNotification(weatherForecast, user);
                        console.log(`Sending notification to ${user.nickname}; success`);
                    }

                }
            })
        );
    }

    private async sendNotification(
        weatherForecast: WeatherCityForecast,
        user: { nickname: string; frequency: string; deviceToken: string; endpoint: string; city: string }
    ) {
        const payload = this.createNotificationPayload(weatherForecast);
        await this.topicService.sendToEndpoint(user.endpoint, JSON.stringify(payload));
    }

    private createNotificationPayload(weatherForecast: WeatherCityForecast) {
        const forecastForNextDays = this.formatNotificationForNextDays(weatherForecast);
        return {
            GCM: JSON.stringify({
                data: {
                    notification: {
                        title: "Forecast",
                        body: `The next 4 days forecast for ${weatherForecast.name} is:\n${forecastForNextDays}`,
                    },
                },
            }),
        };
    }

    private formatNotificationForNextDays(weatherForecast: WeatherCityForecast) {
        return weatherForecast.forecast.map((item) => {
            return `${item.day}: ${item.weather}; max ${item.max}; min ${item.min}; iuv ${item.iuv}\n`;
        });
    }

    private getNextDate(date: Date, cron: string): Date {
        const interval = parser.parseExpression(cron, { currentDate: date });
        return new Date(interval.next().toString());
    }

    private async getWeatherForecastByCity(city: string, date: string): Promise<WeatherCityForecast | undefined> {
        let forecast: WeatherCityForecast | undefined | null;
        try {
            forecast = await this.weatherService.getWeatherForecastByCity(city);
        } catch (error) {
            // fallback
            console.warn("Weather service out of service", error);
        }
        const forecastDb = await this.getWeatherCityForecastRepository.handle(city, date);
        if (!forecast) {
            forecast = forecastDb;
        } else {
            if (!forecastDb) {
                await this.createWeatherCityForecastRepository.handle(city, forecast);
            }
        }
        return forecast;
    }

}
