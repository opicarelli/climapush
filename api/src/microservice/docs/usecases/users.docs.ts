const security = [{ CognitoAuthorizer: [] }];

const defaultSchema = {
    fullName: {
        type: "string",
        example: "Fake User",
    },
    nickname: {
        type: "string",
        example: "fakeuser",
    },
    email: {
        type: "string",
        example: "fakeuser@fake.com.br",
    },
    password: {
        type: "string",
        format: "password",
        minLength: 6,
        example: "P@ssw0rd",
    },
    userRole: {
        type: "string",
        enum: ["USER"],
        example: "USER",
    },
    optOut: {
        type: "boolean",
        example: "true",
    },
    city: {
        type: "string",
        example: "3656",
    },
    frequency: {
        type: "string",
        example: "*/15 * * * *",
    },
    deviceToken: {
        type: "string",
        example: "fake-device-token",
    },
};

const create = {
    tags: ["User"],
    description: "Create user",
    requestBody: {
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        fullName: {
                            ...defaultSchema.fullName,
                            required: true,
                        },
                        nickname: {
                            ...defaultSchema.nickname,
                            required: true,
                        },
                        email: {
                            ...defaultSchema.email,
                            required: true,
                        },
                        password: {
                            ...defaultSchema.password,
                            required: true,
                        },
                    },
                },
            },
        },
        required: true,
    },
    responses: {
        default: {
            description: "Create user",
        },
    },
};

const updateOptOut = {
    tags: ["User"],
    description: "Updated user opt out",
    security,
    requestBody: {
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        optOut: {
                            ...defaultSchema.optOut,
                            required: true,
                        },
                        city: {
                            ...defaultSchema.city,
                            required: true,
                        },
                        frequency: {
                            ...defaultSchema.frequency,
                            required: true,
                        },
                    },
                },
            },
        },
        required: true,
    },
    responses: {
        default: {
            description: "Update user opt out",
        },
    },
};

const updateDeviceToken = {
    tags: ["User"],
    description: "Updated user device token",
    security,
    requestBody: {
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        deviceToken: {
                            ...defaultSchema.deviceToken,
                            required: true,
                        },
                    },
                },
            },
        },
        required: true,
    },
    responses: {
        default: {
            description: "Update user deviceToken",
        },
    },
};

export default {
    "/users": {
        post: create,
    },
    "/users/optout": {
        patch: updateOptOut,
    },
    "/users/devicetoken": {
        patch: updateDeviceToken,
    },
};
