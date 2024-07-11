import { DynamoDBDocumentClient, QueryCommandInput, QueryCommand, QueryCommandOutput } from "@aws-sdk/lib-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { AwsDynamoDBBean } from "/opt/nodejs/infra/configurations/database/aws-dynamodb-configuration";
import { UserRole } from "/opt/nodejs/infra/configurations/auth/user-role";

type ItemResponse = {
    nickname: string;
    email: string;
};

export class GetUserByEmailRepository {
    constructor() {}

    async handle(email: string): Promise<ItemResponse | undefined> {
        const databaseClient: DynamoDBClient = AwsDynamoDBBean.get();
        const commandInput: QueryCommandInput = {
            TableName: process.env.AWS_DYNAMODB_TABLE_NAME,
            IndexName: "GSI1",
            ExpressionAttributeNames: {
                "#GSI1PK": "GSI1PK",
                "#GSI1SK": "GSI1SK",
            },
            ExpressionAttributeValues: {
                ":GSI1PK": `ROLE#${UserRole.USER}`,
                ":GSI1SK": `USER#${email}`,
            },
            KeyConditionExpression: "#GSI1PK = :GSI1PK AND #GSI1SK = :GSI1SK",
            ProjectionExpression: "nickname, email",
        };
        const ddbDocClient = DynamoDBDocumentClient.from(databaseClient);
        const result: QueryCommandOutput = await ddbDocClient.send(new QueryCommand(commandInput));
        return result.Items?.map((item) => unmarshall(item) as ItemResponse).pop();
    }
}
