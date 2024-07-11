import { DynamoDBDocumentClient, PutCommand, PutCommandInput } from "@aws-sdk/lib-dynamodb";
import { AwsDynamoDBBean } from "/opt/nodejs/infra/configurations/database/aws-dynamodb-configuration";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { WeatherCityForecast } from "/opt/nodejs/infra/weather-api/providers/weather-provider";

export class CreateWeatherCityForecastRepository {
    constructor() {}

    async handle(cityCode: string, forecast: WeatherCityForecast): Promise<void> {
        const databaseClient: DynamoDBClient = AwsDynamoDBBean.get();
        const commandInput: PutCommandInput = {
            TableName: process.env.AWS_DYNAMODB_TABLE_NAME,
            Item: {
                ...forecast,
                PK: `WFC#${cityCode}`,
                SK: `WFC#DATE${forecast.date}`,
            },
            ConditionExpression: "attribute_not_exists(PK) AND attribute_not_exists(SK)",
        };
        const ddbDocClient = DynamoDBDocumentClient.from(databaseClient);
        await ddbDocClient.send(new PutCommand(commandInput));
    }
}
