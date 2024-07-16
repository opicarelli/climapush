import { DynamoDBDocumentClient, GetCommand, GetCommandInput, GetCommandOutput } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { AwsDynamoDBBean } from "/opt/nodejs/infra/configurations/database/aws-dynamodb-configuration";
import { WeatherCityForecast } from "/opt/nodejs/infra/weather-api/providers/weather-provider";

type ItemResponse = WeatherCityForecast;

export class GetWeatherCityForecastRepository {
    constructor() {}

    async handle(cityCode: string, date: string): Promise<ItemResponse | undefined> {
        const databaseClient: DynamoDBClient = AwsDynamoDBBean.get();
        const commandInput: GetCommandInput = {
            TableName: process.env.AWS_DYNAMODB_TABLE_NAME,
            Key: {
                PK: `WFC#${cityCode}`,
                SK: `WFC#DATE${date}`,
            },
        };
        const ddbDocClient = DynamoDBDocumentClient.from(databaseClient);
        const result: GetCommandOutput = await ddbDocClient.send(new GetCommand(commandInput));
        return result.Item ? (result.Item as ItemResponse) : undefined;
    }
}
