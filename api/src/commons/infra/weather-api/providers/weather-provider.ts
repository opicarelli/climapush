type WaveForecast = {
    date: string;
    waveAgitation: string;
    height: string;
    waveDirection: string;
    windSpeed: string;
    windDirection: string;
};

export type WaveCityForecast = {
    name: string;
    federatedState: string;
    date: string;
    morning: WaveForecast;
    afternoon: WaveForecast;
    night: WaveForecast;
};

type WeatherForecast = {
    day: string;
    weather: string;
    max: number;
    min: number;
    iuv: number;
};

export type WeatherCityForecast = {
    name: string;
    federatedState: string;
    date: string;
    forecast: WeatherForecast[];
};

export interface WeatherProvider {
    getWeatherForecastByCity(city: string): Promise<WeatherCityForecast | null>;
    getWaveForecastByCity(city: string, day: number): Promise<WaveCityForecast | null>;
}
