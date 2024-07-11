import { DynamoDBClient, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import Configuration from "/opt/nodejs/infra/configurations/configuration";
import Configurations from "/opt/nodejs/infra/configurations/configurations";

export class AwsDynamoDBConfig extends Configuration<DynamoDBClient> {
    constructor() {
        super();
        this.beanName = AwsDynamoDBBean.BEAN_NAME;
    }

    load(): void {
        let config: DynamoDBClientConfig = {};
        if (process.env.ENVIRONMENT_NAME == "local-with-dynamodb-cloud") {
            config = {
                region: process.env.AWS_REGION as string,
                credentials: {
                    accessKeyId: process.env.AWS_ACCESS_KEY as string,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
                },
            };
        } else if (process.env.ENVIRONMENT_NAME == "local") {
            config = {
                endpoint: {
                    hostname: "localhost",
                    port: 8000,
                    path: "",
                    protocol: "http:",
                },
            };
        }
        const client = new DynamoDBClient(config);
        this.bean = client;
    }
}

export class AwsDynamoDBBean {
    static readonly BEAN_NAME = "AwsDynamoDB";

    static get(): DynamoDBClient {
        console.log("AwsDynamoDBBean.get()");
        return Configurations.getBean(AwsDynamoDBBean.BEAN_NAME);
    }
}
