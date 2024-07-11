import axios, { AxiosInstance } from "axios";
import { XMLParser } from "fast-xml-parser";
import { WaveCityForecast, WeatherCityForecast, WeatherProvider } from "./weather-provider";

type PrevisaoCidadeOndasCptecResponse = {
    cidade: {
        nome: string;
        uf: string;
        atualizacao: string;
        manha: {
            dia: string;
            agitacao: string;
            altura: string;
            direcao: string;
            vento: string;
            vento_dir: string;
        };
        tarde: {
            dia: string;
            agitacao: string;
            altura: string;
            direcao: string;
            vento: string;
            vento_dir: string;
        };
        noite: {
            dia: string;
            agitacao: string;
            altura: string;
            direcao: string;
            vento: string;
            vento_dir: string;
        };
    };
};

type PrevisaoCidadeCptecResponse = {
    cidade: {
        nome: string;
        uf: string;
        atualizacao: string;
        previsao: {
            dia: string;
            tempo: string;
            maxima: number;
            minima: number;
            iuv: number;
        }[];
    };
};

export class WeatherCptecApiProvider implements WeatherProvider {
    private httpClient: AxiosInstance;
    private xmlParser: XMLParser;

    constructor() {
        const baseURL = "http://servicos.cptec.inpe.br/XML";
        this.httpClient = axios.create({ baseURL });
        this.xmlParser = new XMLParser();
    }

    async getWeatherForecastByCity(cityCode: string): Promise<WeatherCityForecast | null> {
        const { data } = await this.httpClient.get(`/cidade/${cityCode}/previsao.xml`);
        const xmlParsed = this.xmlParser.parse(data);
        const parsed = xmlParsed as PrevisaoCidadeCptecResponse;
        if (parsed.cidade.nome == "null") {
            return null;
        }
        const result: WeatherCityForecast = {
            name: parsed.cidade.nome,
            federatedState: parsed.cidade.uf,
            date: parsed.cidade.atualizacao,
            forecast: parsed.cidade.previsao.map((itemPrevisao) => ({
                day: itemPrevisao.dia,
                weather: itemPrevisao.tempo,
                max: itemPrevisao.maxima,
                min: itemPrevisao.minima,
                iuv: itemPrevisao.iuv,
            })),
        };
        return result;
    }

    async getWaveForecastByCity(cityCode: string, day: number): Promise<WaveCityForecast | null> {
        const { data } = await this.httpClient.get(`/cidade/${cityCode}/dia/${day}/ondas.xml`);
        const parsed = this.xmlParser.parse(data) as PrevisaoCidadeOndasCptecResponse;
        if (parsed.cidade.nome == "null") {
            return null;
        }
        const result: WaveCityForecast = {
            name: parsed.cidade.nome,
            federatedState: parsed.cidade.uf,
            date: parsed.cidade.atualizacao,
            morning: {
                date: parsed.cidade.manha.dia,
                waveAgitation: parsed.cidade.manha.agitacao,
                height: parsed.cidade.manha.altura,
                waveDirection: parsed.cidade.manha.direcao,
                windSpeed: parsed.cidade.manha.vento,
                windDirection: parsed.cidade.manha.vento_dir,
            },
            afternoon: {
                date: parsed.cidade.tarde.dia,
                waveAgitation: parsed.cidade.tarde.agitacao,
                height: parsed.cidade.tarde.altura,
                waveDirection: parsed.cidade.tarde.direcao,
                windSpeed: parsed.cidade.tarde.vento,
                windDirection: parsed.cidade.tarde.vento_dir,
            },
            night: {
                date: parsed.cidade.noite.dia,
                waveAgitation: parsed.cidade.noite.agitacao,
                height: parsed.cidade.noite.altura,
                waveDirection: parsed.cidade.noite.direcao,
                windSpeed: parsed.cidade.noite.vento,
                windDirection: parsed.cidade.noite.vento_dir,
            },
        };
        return result;
    }
}
