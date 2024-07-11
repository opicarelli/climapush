import { UnauthorizedUserError } from "/opt/nodejs/infra/auth/errors/unauthorized-user-error";
import { ZodError } from "zod";

/* eslint-disable @typescript-eslint/no-explicit-any */
let allowCors = {};

if (process.env.ENVIRONMENT_NAME && ["local", "dev"].includes(process.env.ENVIRONMENT_NAME)) {
    allowCors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
    };
}

export interface Headers {
    [name: string]: string | string[] | undefined;
}

export interface PathParameters {
    [name: string]: string | undefined;
}

export interface QueryStringParameters {
    [name: string]: string | string[] | undefined | QueryStringParameters | QueryStringParameters[];
}

export class HttpRequest {
    params: PathParameters | null;
    headers: Headers;
    query: QueryStringParameters | null;
    body: Record<string, unknown> | string;

    constructor(params: PathParameters | null, body: string, headers: Headers, query: QueryStringParameters | null) {
        this.params = params;
        this.headers = headers;
        this.query = query;

        // try to parse the body to json
        try {
            this.body = JSON.parse(body);
        } catch (err) {
            this.body = body;
        }
    }
}

export class HttpResponse {
    statusCode = 0;
    body: any;
    headers: any;
    // 200
    static ok(data?: unknown): HttpResponse {
        return {
            statusCode: 200,
            body: data,
            headers: Object.assign(
                {
                    "Content-Type": "application/json",
                },
                allowCors
            ),
        };
    }

    static okCsv(data: unknown, fileName: string): HttpResponse {
        return {
            statusCode: 200,
            body: data,
            headers: Object.assign(
                {
                    "Content-Type": "application/csv",
                    "Content-Disposition": `attachment; filename="${fileName}"`,
                },
                allowCors
            ),
        };
    }

    // 204
    static noContent(): HttpResponse {
        return {
            statusCode: 204,
            body: null,
            headers: Object.assign(
                {
                    "Content-Type": "application/json",
                },
                allowCors
            ),
        };
    }

    // 201
    static created(data: unknown): HttpResponse {
        return {
            statusCode: 201,
            body: data,
            headers: Object.assign(
                {
                    "Content-Type": "application/json",
                },
                allowCors
            ),
        };
    }

    // 400
    static badRequest(error: unknown): HttpResponse {
        return {
            statusCode: 400,
            body: { error: error },
            headers: Object.assign(
                {
                    "Content-Type": "application/json",
                },
                allowCors
            ),
        };
    }

    // 401
    static unauthorized(data: unknown): HttpResponse {
        return {
            statusCode: 401,
            body: data,
            headers: Object.assign(
                {
                    "Content-Type": "application/json",
                },
                allowCors
            ),
        };
    }

    // 403
    static forbidden(data: unknown): HttpResponse {
        return {
            statusCode: 403,
            body: data,
            headers: Object.assign(
                {
                    "Content-Type": "application/json",
                },
                allowCors
            ),
        };
    }

    // 404
    static notFound(data: unknown): HttpResponse {
        return {
            statusCode: 404,
            body: data,
            headers: Object.assign(
                {
                    "Content-Type": "application/json",
                },
                allowCors
            ),
        };
    }

    static conflict(error: Error): HttpResponse {
        return {
            statusCode: 409,
            body: { message: error.message },
            headers: Object.assign(
                {
                    "Content-Type": "application/json",
                },
                allowCors
            ),
        };
    }

    static validation(errors: { [key: string]: string[] }[], message = "Unprocessable Entity."): HttpResponse {
        return {
            statusCode: 422,
            body: {
                message: message,
                errors,
            },
            headers: Object.assign(
                {
                    "Content-Type": "application/json",
                },
                allowCors
            ),
        };
    }

    // 500
    static serverError(error: Error): HttpResponse {
        const knownError = HttpKnownErrors.handle(error);
        if (knownError) {
            return knownError;
        }
        return {
            statusCode: 500,
            body: { message: error.message },
            headers: Object.assign(
                {
                    "Content-Type": "application/json",
                },
                allowCors
            ),
        };
    }
}

export class HttpKnownErrors {
    public static handle(error: Error) {
        if (error instanceof ZodError) {
            return HttpResponse.validation(
                error.errors.map((validation) => {
                    const key = validation.path.join(".");

                    return {
                        [key]: [validation.message],
                    };
                })
            );
        }

        if (error instanceof UnauthorizedUserError) {
            return HttpResponse.unauthorized({
                message: error.message,
            });
        }

        return null;
    }
}
