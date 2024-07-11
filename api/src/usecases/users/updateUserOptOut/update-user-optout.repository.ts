import { DynamoDBDocumentClient, UpdateCommand, UpdateCommandInput } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { AwsDynamoDBBean } from "/opt/nodejs/infra/configurations/database/aws-dynamodb-configuration";
import { UpdateUserOptOutRequest } from "./update-user-optout.usecase";

export class UpdateUserOptOutRepository {
    constructor(private readonly databaseClient: DynamoDBClient = AwsDynamoDBBean.get()) {}

    async handle(nickname: string, data: UpdateUserOptOutRequest): Promise<void> {
        const commandInput: UpdateCommandInput = {
            TableName: process.env.AWS_DYNAMODB_TABLE_NAME,
            Key: {
                PK: `USER#${nickname}`,
                SK: "METADATA",
            },
            UpdateExpression: "set #optOut = :optOut, #frequency = :frequency, #city = :city",
            ConditionExpression: "attribute_exists(PK) AND attribute_exists(SK)",
            ExpressionAttributeNames: {
                "#city": "city",
                "#frequency": "frequency",
                "#optOut": "optOut",
            },
            ExpressionAttributeValues: {
                ":city": data.city,
                ":frequency": data.frequency,
                ":optOut": data.optOut,
            },
            ReturnValues: "NONE",
        };
        const ddbDocClient = DynamoDBDocumentClient.from(this.databaseClient);
        await ddbDocClient.send(new UpdateCommand(commandInput));
    }
}
