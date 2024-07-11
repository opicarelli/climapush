import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { fabricateUpdateUserOptOutController } from "./update-user-optout.factory";
import { LambdaHttpRequestAdapter } from "/opt/nodejs/presentation/adapters/lambda-http-request-adapter";
import { LambdaHttpResponseAdapter } from "/opt/nodejs/presentation/adapters/lambda-http-response-adapter";

const controller = fabricateUpdateUserOptOutController();

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const httpRequest = LambdaHttpRequestAdapter.adapt(event);
    const response = await controller.handle(httpRequest);
    return LambdaHttpResponseAdapter.adapt(response);
};
