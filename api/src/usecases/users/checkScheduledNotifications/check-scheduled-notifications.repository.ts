import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { AwsDynamoDBBean } from "/opt/nodejs/infra/configurations/database/aws-dynamodb-configuration";
import { DynamoDBDocumentClient, QueryCommandInput, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { UserRole } from "/opt/nodejs/infra/configurations/auth/user-role";

type ItemResponse = {
    nickname: string;
    frequency: string;
    deviceToken: string;
    endpoint: string;
    city: string;
};

export class CheckScheduledNotificationsRepository {
    constructor(private readonly databaseClient: DynamoDBClient = AwsDynamoDBBean.get()) {}

    async handle(): Promise<ItemResponse[]> {
        const commandInput: QueryCommandInput = {
            TableName: process.env.AWS_DYNAMODB_TABLE_NAME,
            IndexName: "GSI1",
            ExpressionAttributeNames: {
                "#GSI1PK": "GSI1PK",
                "#GSI1SK": "GSI1SK",
            },
            ExpressionAttributeValues: {
                ":GSI1PK": `ROLE#${UserRole.USER}`,
                ":GSI1SK": "USER#",
                ":optOutFalse": false,
            },
            KeyConditionExpression: "#GSI1PK = :GSI1PK AND begins_with(#GSI1SK, :GSI1SK)",
            FilterExpression: "optOut = :optOutFalse AND attribute_exists(frequency)",
            ProjectionExpression: "nickname, frequency, deviceToken, endpoint, city",
        };
        const result = await this.queryAll(commandInput);
        const users = result?.map((item) => item as ItemResponse);
        return users;
    }

    private async queryAll(commandInput: QueryCommandInput): Promise<Record<string, any>[]> {
        let done = false;
        let resultItems: Record<string, any>[] = [];

        const ddbDocClient = DynamoDBDocumentClient.from(this.databaseClient);

        while (!done) {
            const { Items, LastEvaluatedKey } = await ddbDocClient.send(new QueryCommand(commandInput));

            if (LastEvaluatedKey) {
                commandInput.ExclusiveStartKey = LastEvaluatedKey;
            }

            if (Items && Items.length > 0) {
                resultItems = resultItems.concat(Items);
            }

            done = !LastEvaluatedKey;
        }

        return resultItems;
    }
}
