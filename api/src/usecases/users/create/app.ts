import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { LambdaHttpRequestAdapter } from "/opt/nodejs/presentation/adapters/lambda-http-request-adapter";
import { fabricateCreateUserController } from "./create-user.factory";
import { LambdaHttpResponseAdapter } from "/opt/nodejs/presentation/adapters/lambda-http-response-adapter";

const controller = fabricateCreateUserController();

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const httpRequest = LambdaHttpRequestAdapter.adapt(event);
    const response = await controller.handle(httpRequest);
    return LambdaHttpResponseAdapter.adapt(response);
};
