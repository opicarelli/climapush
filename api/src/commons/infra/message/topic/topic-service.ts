import { TopicProvider } from "/opt/nodejs/infra/message/topic/providers/topic-provider";

export class TopicService {
    public provider: TopicProvider;

    /**
     *
     * @param {TopicProvider} provider Topic provider
     */
    constructor(provider: TopicProvider) {
        this.provider = provider;
    }

    async send(topic: string, message: string): Promise<string> {
        return this.provider.send(topic, message);
    }

    async createEndpoint(deviceToken: string): Promise<string> {
        return this.provider.createEndpoint(deviceToken);
    }

    async sendToEndpoint(snsTargetArn: string, message: string): Promise<string> {
        return this.provider.sendToEndpoint(snsTargetArn, message);
    }
}
