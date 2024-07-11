import { DynamoDBDocumentClient, UpdateCommand, UpdateCommandInput } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { AwsDynamoDBBean } from "/opt/nodejs/infra/configurations/database/aws-dynamodb-configuration";

export class UpdateUserDeviceTokenRepository {
    constructor(private readonly databaseClient: DynamoDBClient = AwsDynamoDBBean.get()) {}

    async handle(nickname: string, deviceToken: string, endpoint: string): Promise<void> {
        const commandInput: UpdateCommandInput = {
            TableName: process.env.AWS_DYNAMODB_TABLE_NAME,
            Key: {
                PK: `USER#${nickname}`,
                SK: "METADATA",
            },
            UpdateExpression: "set #deviceToken = :deviceToken, #endpoint = :endpoint",
            ExpressionAttributeNames: {
                "#deviceToken": "deviceToken",
                "#endpoint": "endpoint",
            },
            ExpressionAttributeValues: {
                ":deviceToken": deviceToken,
                ":endpoint": endpoint,
            },
            ReturnValues: "NONE",
        };
        const ddbDocClient = DynamoDBDocumentClient.from(this.databaseClient);
        await ddbDocClient.send(new UpdateCommand(commandInput));
    }
}
