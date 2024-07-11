import Configuration from "/opt/nodejs/infra/configurations/configuration";
import Configurations from "/opt/nodejs/infra/configurations/configurations";
import { SNSClient } from "@aws-sdk/client-sns";

export class AwsSNSConfig extends Configuration<SNSClient> {
    constructor() {
        super();
        this.beanName = AwsSNSBean.BEAN_NAME;
    }

    load(): void {
        const awsRegion = process.env.AWS_REGION;
        const client = new SNSClient({ region: awsRegion });
        this.bean = client;
    }
}

export class AwsSNSBean {
    static readonly BEAN_NAME = "AwsSNS";

    static get(): SNSClient {
        return Configurations.getBean(AwsSNSBean.BEAN_NAME);
    }
}
