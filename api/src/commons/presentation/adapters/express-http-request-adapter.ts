import { Request } from "express";
import { HttpRequest } from "/opt/nodejs/presentation/contracts/http";

class ExpressHttpRequestAdapter {
    /**
     *  Adapter for Express requests
     *
     * @param {Request} request Express request object
     * @returns {HttpRequest} HTTP Request
     */
    static adapt(request: Request): HttpRequest {
        const { params, body, headers, query } = request;

        return new HttpRequest(params, body, headers, query);
    }
}

export default ExpressHttpRequestAdapter;
