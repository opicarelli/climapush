import { APIGatewayProxyResult } from "aws-lambda";
import { HttpResponse } from "/opt/nodejs/presentation/contracts/http";

export class LambdaHttpResponseAdapter {
    static adapt(httpResponse: HttpResponse): APIGatewayProxyResult {
        return {
            ...httpResponse,
            body: httpResponse.body ? JSON.stringify(httpResponse.body) : "",
        };
    }
}
