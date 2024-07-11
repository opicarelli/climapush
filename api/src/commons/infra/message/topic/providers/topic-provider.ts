export interface TopicProvider {
    send(topic: string, message: string): Promise<string>;
    createEndpoint(deviceToken: string): Promise<string>;
    sendToEndpoint(snsTargetArn: string, message: string): Promise<string>;
}
