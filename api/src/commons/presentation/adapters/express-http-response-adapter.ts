import { Response } from "express";
import { HttpResponse } from "/opt/nodejs/presentation/contracts/http";

class ExpressHttpResponseAdapter {
    /**
     *  Adapter for Express responses
     *
     * @param {HttpResponse} httpResponse HTTP Response
     * @param {Response} expressResponse Express response object
     */
    static adapt(httpResponse: HttpResponse, expressResponse: Response) {
        expressResponse
            .status(httpResponse.statusCode)
            .set(httpResponse.headers)
            .send(
                httpResponse.body
                    ? JSON.stringify(httpResponse.body, (_, v) => (typeof v === "bigint" ? v.toString() : v))
                    : ""
            );
    }
}

export default ExpressHttpResponseAdapter;
