import { WeatherCityForecast, WaveCityForecast, WeatherProvider } from "./providers/weather-provider";

export class WeatherService {
    public provider: WeatherProvider;

    /**
     *
     * @param {WeatherProvider} provider Weather provider
     */
    constructor(provider: WeatherProvider) {
        this.provider = provider;
    }

    async getWeatherForecastByCity(city: string): Promise<WeatherCityForecast | null> {
        return this.provider.getWeatherForecastByCity(city);
    }
    async getWaveForecastByCity(city: string, day: number): Promise<WaveCityForecast | null> {
        return this.provider.getWaveForecastByCity(city, day);
    }
}
