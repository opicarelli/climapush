import { DynamoDBDocumentClient, GetCommand, GetCommandInput, GetCommandOutput } from "@aws-sdk/lib-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { AwsDynamoDBBean } from "/opt/nodejs/infra/configurations/database/aws-dynamodb-configuration";

type ItemResponse = {
    nickname: string;
    email: string;
};

export class GetUserByNicknameRepository {
    constructor() {}

    async handle(nickname: string): Promise<ItemResponse | undefined> {
        const databaseClient: DynamoDBClient = AwsDynamoDBBean.get();
        const commandInput: GetCommandInput = {
            TableName: process.env.AWS_DYNAMODB_TABLE_NAME,
            Key: {
                PK: `USER#${nickname}`,
                SK: "METADATA",
            },
            ProjectionExpression: "nickname, email",
        };
        const ddbDocClient = DynamoDBDocumentClient.from(databaseClient);
        const result: GetCommandOutput = await ddbDocClient.send(new GetCommand(commandInput));
        return result.Item ? (unmarshall(result.Item) as ItemResponse) : undefined;
    }
}
