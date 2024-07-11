import { DynamoDBDocumentClient, PutCommand, PutCommandInput } from "@aws-sdk/lib-dynamodb";
import { UserRole } from "/opt/nodejs/infra/configurations/auth/user-role";
import { AwsDynamoDBBean } from "/opt/nodejs/infra/configurations/database/aws-dynamodb-configuration";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { User } from "./user.entity";

export class CreateUserRepository {
    constructor() {}

    async handle(user: User): Promise<void> {
        const databaseClient: DynamoDBClient = AwsDynamoDBBean.get();
        const commandInput: PutCommandInput = {
            TableName: process.env.AWS_DYNAMODB_TABLE_NAME,
            Item: {
                ...user,
                PK: `USER#${user.nickname}`,
                SK: "METADATA",
                GSI1PK: `ROLE#${UserRole.USER}`,
                GSI1SK: `USER#${user.email}`,
            },
        };
        const ddbDocClient = DynamoDBDocumentClient.from(databaseClient);
        await ddbDocClient.send(new PutCommand(commandInput));
    }
}
