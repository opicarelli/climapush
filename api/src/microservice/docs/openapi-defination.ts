import pathsDocs from "./paths.docs";
const host = process.env.HOST ?? "localhost";
const port = process.env.PORT ?? "8080";
const awsRegion = process.env.AWS_REGION ?? "us-east-2";
const cognitoPrefixDomain = process.env.AWS_COGNITO_PREFIX_DOMAIN ?? "dev-climapush-auth";
const cognitoOAuthDomain = `https://${cognitoPrefixDomain}.auth.${awsRegion}.amazoncognito.com/oauth2`;
const apiGatewayId = process.env.AWS_API_GATEWAY_ID ?? "invalid";

const definitions = {
    openapi: "3.0.1",
    info: {
        title: "dev-api",
        version: "1.0",
    },
    servers: [
        {
            description: "Development",
            url: "http://{host}:{port}",
            variables: {
                host: { default: host },
                port: { default: port },
            },
        },
        {
            description: "AWS",
            url: "https://{subdomain}.amazonaws.com/{basePath}",
            variables: {
                subdomain: {
                    default: `${apiGatewayId}.execute-api.${awsRegion}`,
                },
                basePath: {
                    default: "v1",
                },
            },
        },
    ],
    tags: [],
    paths: { ...pathsDocs },
    components: {
        securitySchemes: {
            CognitoAuthorizer: {
                type: "oauth2",
                in: "header",
                name: "Authorization",
                "x-tokenName": "id_token",
                flows: {
                    authorizationCode: {
                        authorizationUrl: `${cognitoOAuthDomain}/authorize`,
                        tokenUrl: `${cognitoOAuthDomain}/token`,
                        scopes: {
                            email: "email",
                            openid: "openid",
                            profile: "profile",
                        },
                    },
                },
            },
        },
    },
};

export default definitions;
