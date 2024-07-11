import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { fabricateUpdateUserDeviceTokenController } from "./update-user-device-token.factory";
import { LambdaHttpRequestAdapter } from "/opt/nodejs/presentation/adapters/lambda-http-request-adapter";
import { LambdaHttpResponseAdapter } from "/opt/nodejs/presentation/adapters/lambda-http-response-adapter";

const controller = fabricateUpdateUserDeviceTokenController();

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const httpRequest = LambdaHttpRequestAdapter.adapt(event);
    const response = await controller.handle(httpRequest);
    return LambdaHttpResponseAdapter.adapt(response);
};
