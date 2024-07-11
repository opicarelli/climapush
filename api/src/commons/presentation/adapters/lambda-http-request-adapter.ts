import { APIGatewayProxyEvent } from "aws-lambda";
import { HttpRequest } from "/opt/nodejs/presentation/contracts/http";

export class LambdaHttpRequestAdapter {
    /**
     *  Adapter for AWS Lambda requests
     *
     * @param {APIGatewayProxyEvent} event Lambda request event
     * @returns {HttpRequest} HTTP Request
     */
    static adapt(event: APIGatewayProxyEvent): HttpRequest {
        const { pathParameters, body, headers, queryStringParameters } = event;

        return new HttpRequest(pathParameters, body ?? "", headers, queryStringParameters);
    }
}
