import { format, isBefore, subMinutes } from "date-fns";
import { CheckScheduledNotificationsRepository } from "./check-scheduled-notifications.repository";
import parser from "cron-parser";
import { TopicService } from "/opt/nodejs/infra/message/topic/topic-service";
import { WeatherService } from "/opt/nodejs/infra/weather-api/weather.service";
import { WaveCityForecast, WeatherCityForecast } from "/opt/nodejs/infra/weather-api/providers/weather-provider";
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
                // FIXME to scale it send messages (user) to SQS and consume with another lambda usecase

                const cron = user.frequency;
                console.log(`Sending notification to ${user.nickname}; cron ${cron}`);

                const nextDate = this.getNextDate(subMinutes(now, 1), cron);
                console.log(`Sending notification to ${user.nickname}; nextDate ${nextDate}`);

                if (user.endpoint && isBefore(nextDate, now)) {
                    console.log(`Sending notification to ${user.nickname}; ${now}`);

                    const cityCode = user.city;
                    let weatherForecast: WeatherCityForecast | undefined | null = mapForecast.get(cityCode);
                    if (!weatherForecast) {
                        weatherForecast = await this.getWeatherForecastByCity(cityCode, format(now, "yyyy-MM-dd"));
                    }

                    if (weatherForecast) {
                        mapForecast.set(cityCode, weatherForecast);
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
        // FIXME should be better send one KEY "FORECAST_NEXT_4_DAYS", and the values. And pass the responsability to translante in client/frontend
        const title = "Forecast";
        const body = this.formatNotificationForNextDays(weatherForecast);
        return {
            GCM: JSON.stringify({
                data: {
                    notification: {
                        title: title,
                        body: body,
                    },
                },
            }),
        };
    }

    private formatNotificationForNextDays(weatherForecast: WeatherCityForecast): string {
        const watherForecast = weatherForecast.forecast.map((item) => {
            return `${item.day}: ${item.weather}; max ${item.max}; min ${item.min}; iuv ${item.iuv}\n`;
        });
        const waveForecast = weatherForecast.waveForecast ? this.formatWaveForecast(weatherForecast.waveForecast) : "";
        return `The next 4 days forecast for ${weatherForecast.name} is:\n${watherForecast + waveForecast}`;
    }

    private formatWaveForecast(waveForecast: WaveCityForecast): string {
        return this.formatWaveForecastPeriod([
            { period: "morning", ...waveForecast.morning },
            { period: "afternoon", ...waveForecast.afternoon },
            { period: "night", ...waveForecast.night },
        ]);
    }

    private formatWaveForecastPeriod(
        waveForecast: {
            period: string;
            waveAgitation: string;
            height: string;
            waveDirection: string;
            windSpeed: string;
            windDirection: string;
        }[]
    ): string {
        return waveForecast
            .map((item) => {
                return `${item.period}: wave height ${item.height}; wave direction ${item.waveDirection}; wind speed ${item.windSpeed}; wind direction ${item.windDirection}\n`;
            })
            .join("");
    }

    private getNextDate(date: Date, cron: string): Date {
        const interval = parser.parseExpression(cron, { currentDate: date });
        return new Date(interval.next().toString());
    }

    private async getWeatherForecastByCity(
        cityCode: string,
        dateNow: string
    ): Promise<WeatherCityForecast | undefined | null> {
        let forecast: WeatherCityForecast | undefined | null;
        try {
            forecast = await this.weatherService.getWeatherForecastByCity(cityCode, true);
        } catch (error) {
            // fallback
            console.warn("Weather service out of service", error);
        }
        try {
            const forecastDb = await this.getWeatherCityForecastRepository.handle(cityCode, dateNow);
            if (!forecast) {
                forecast = forecastDb;
            } else {
                if (!forecastDb) {
                    await this.createWeatherCityForecastRepository.handle(cityCode, forecast);
                }
            }
        } catch (error) {
            console.error("Error handling fallback", error);
        }
        return forecast;
    }
}
