import { AwsSNSBean } from "/opt/nodejs/infra/configurations/message/topic/aws-sns-configuration";
import { TopicProvider } from "/opt/nodejs/infra/message/topic/providers/topic-provider";
import {
    SNSClient,
    PublishCommand,
    PublishCommandInput,
    CreatePlatformEndpointInput,
    CreatePlatformEndpointCommand,
    CreatePlatformEndpointCommandOutput,
} from "@aws-sdk/client-sns";

export class TopicAwsSNSProvider implements TopicProvider {
    service: SNSClient;

    constructor() {
        this.service = AwsSNSBean.get();
        if (!this.service) {
            throw new Error("Invalid AWS SNS bean service");
        }
    }

    async send(snsTopicArn: string, message: string): Promise<string> {
        const input: PublishCommandInput = {
            Message: JSON.stringify({
                default: JSON.stringify(message),
            }),
            MessageStructure: "json",
            TopicArn: snsTopicArn,
        };
        const command = new PublishCommand(input);
        const response = await this.service.send(command);
        return response.MessageId ?? "invalidMessageId";
    }

    async createEndpoint(deviceToken: string): Promise<string> {
        const input: CreatePlatformEndpointInput = {
            PlatformApplicationArn: process.env.AWS_SNS_PLATFORM_APPLICATION_GCM,
            Token: deviceToken,
        };
        const command = new CreatePlatformEndpointCommand(input);
        const response: CreatePlatformEndpointCommandOutput = await this.service.send(command);
        return response.EndpointArn ?? "invalidEndpointArn";
    }

    async sendToEndpoint(snsTargetArn: string, message: string): Promise<string> {
        const input: PublishCommandInput = {
            Message: message,
            MessageStructure: "json",
            TargetArn: snsTargetArn,
        };
        const command = new PublishCommand(input);
        const response = await this.service.send(command);
        return response.MessageId ?? "invalidMessageId";
    }
}
