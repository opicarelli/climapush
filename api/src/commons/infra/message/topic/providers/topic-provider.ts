export interface TopicProvider {
    send(topic: string, message: string): Promise<string>;
    createEndpoint(deviceToken: string): Promise<string>;
    updateEndpoint(snsTargetArn: string, deviceToken: string): Promise<void>;
    sendToEndpoint(snsTargetArn: string, message: string): Promise<string>;
}
