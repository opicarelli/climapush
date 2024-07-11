import { DeleteCommand, DeleteCommandInput, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { AwsDynamoDBBean } from "/opt/nodejs/infra/configurations/database/aws-dynamodb-configuration";

export class DeleteUserRepository {
    constructor() {}

    async handle(nickname: string): Promise<void> {
        const databaseClient: DynamoDBClient = AwsDynamoDBBean.get();
        const commandInput: DeleteCommandInput = {
            TableName: process.env.AWS_DYNAMODB_TABLE_NAME,
            Key: {
                PK: `USER#${nickname}`,
                SK: "METADATA",
            },
        };
        const ddbDocClient = DynamoDBDocumentClient.from(databaseClient);
        await ddbDocClient.send(new DeleteCommand(commandInput));
    }
}
