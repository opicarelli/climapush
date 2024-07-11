- [Backend](#backend)
  - [AWS Profile](#aws-profile)
  - [RUN docker compose](#run-docker-compose)
  - [DynamoDB](#dynamodb)
    - [Create table](#create-table)
    - [Remove user by key (partition key and sort key)](#remove-user-by-key-partition-key-and-sort-key)
    - [Find user by sort key](#find-user-by-sort-key)
  - [Cognito](#cognito)
    - [Login with cognito-idp](#login-with-cognito-idp)
  - [Development](#development)
    - [Run](#run)
      - [SAM (Serverless)](#sam-serverless)
      - [Express (Microservice)](#express-microservice)
      - [Create user](#create-user)
      - [Set user deviceToken](#set-user-devicetoken)
      - [Update user optout](#update-user-optout)
    - [Lint](#lint)
    - [Prettier](#prettier)
    - [Deploy Manual](#deploy-manual)

# Backend

## AWS Profile

Definir variáveis para auxiliar os próximos comandos:

```shell
ENVIRONMENT_NAME=dev
APPLICATION_NAME=climapush
PROFILE="${ENVIRONMENT_NAME}-${APPLICATION_NAME}"
```

```shell
aws configure --profile $PROFILE
```

```shell
AWS_REGION=$(aws configure get region --profile $PROFILE)
```

## RUN docker compose

Iniciar um banco de dados DynamoDB local.

```shell
docker compose up
```

## DynamoDB

Criar a tabela utilizando o padrão ``single table``.

### Create table

```shell
aws dynamodb create-table --table-name SINGLE_TABLE \
--attribute-definitions \
AttributeName=PK,AttributeType=S \
AttributeName=SK,AttributeType=S \
AttributeName=GSI1PK,AttributeType=S \
AttributeName=GSI1SK,AttributeType=S \
AttributeName=GSI2PK,AttributeType=S \
AttributeName=GSI2SK,AttributeType=S \
--key-schema \
AttributeName=PK,KeyType=HASH \
AttributeName=SK,KeyType=RANGE \
--global-secondary-indexes file://ddb/schema/single_table-gsi-local.json \
--provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 \
--endpoint-url http://localhost:8000 \
--profile $PROFILE
```

### Remove user by key (partition key and sort key)
 
```shell
aws dynamodb delete-item --table-name SINGLE_TABLE \
--key '{ "PK": {"S": "USER#nickname"}, "SK": {"S": "METADATA"}}' \
--endpoint-url http://localhost:8000
```

### Find user by sort key
 
```shell
aws dynamodb query --table-name SINGLE_TABLE \
--key-condition-expression "PK = :v_pk AND begins_with(SK, :v_sk)" \
--expression-attribute-values '{":v_pk":{"S":"USER#anyid"}, ":v_sk": {"S": "METADATA"} }' \
--endpoint-url http://localhost:8000
```

## Cognito

Definir variáveis para auxiliar os próximos comandos:

```shell
AWS_COGNITO_USER_POOL_ID=$(aws cloudformation describe-stacks --query "Stacks[?starts_with(StackName,\`${ENVIRONMENT_NAME}-${APPLICATION_NAME}-StackAuth\`)][].Outputs[?OutputKey=='CognitoUserPoolId'].OutputValue" --output text --profile $PROFILE)
AWS_COGNITO_FRONTEND_CLIENT_ID=$(aws cloudformation describe-stacks --query "Stacks[?starts_with(StackName,\`${ENVIRONMENT_NAME}-${APPLICATION_NAME}-StackAuth\`)][].Outputs[?OutputKey=='CognitoFrontendUserPoolClientId'].OutputValue" --output text --profile $PROFILE)
AWS_COGNITO_OAUTH_DOMAIN=$(aws cloudformation describe-stacks --query "Stacks[?starts_with(StackName,\`${ENVIRONMENT_NAME}-${APPLICATION_NAME}-StackAuth\`)][].Outputs[?OutputKey=='CognitoOAuthDomain'].OutputValue" --output text --profile $PROFILE)
AWS_COGNITO_CLIENT_SECRET=$(aws cognito-idp describe-user-pool-client --user-pool-id "${AWS_COGNITO_USER_POOL_ID}" --client-id "${AWS_COGNITO_FRONTEND_CLIENT_ID}" --query "UserPoolClient.ClientSecret"  --output text --profile $PROFILE)
AWS_COGNITO_OAUTH_CODE_GRANT_SCOPES="openid+email+profile"
USER_NICKNAME="nickname"
USER_EMAIL="user@mail.com"
USER_PASSWORD="P@ssw0rd"
```

### Login with cognito-idp

Realizar um login com linha de comando utilizando a ferramenta ``aws cli``, para obter o ID_TOKEN do usuário.

```shell
USER_ID_TOKEN=$(aws cognito-idp initiate-auth \
--auth-flow USER_PASSWORD_AUTH \
--auth-parameters=USERNAME="${USER_NICKNAME}",PASSWORD="${USER_PASSWORD}" \
--client-id "${AWS_COGNITO_FRONTEND_CLIENT_ID}" \
--query "AuthenticationResult.IdToken" \
--output text \
--profile $PROFILE)
```

## Development

Definir variáveis para auxiliar os próximos comandos:

```shell
AWS_API_GATEWAY_URL=$(aws cloudformation describe-stacks --query "Stacks[?starts_with(StackName,\`${AWS_SAM_STACK_NAME}\`)][].Outputs[?OutputKey=='ApiGatewayUrl'].OutputValue" --output text --profile $PROFILE)
```

### Run

#### SAM (Serverless)

É possível simular o ambiente Cloud em uma arquitetura serverless utilizando a ferramenta ``sam cli``.

```shell
./sam-start-local.sh
```

#### Express (Microservice)

É possível simular o ambiente que será executado em uma arquitetura de Microserviços utilizando a biblioteca [expressjs](https://expressjs.com/).

```shell
npm run serve:local
```

Para o ambiente utilizando Express é possível utilizar o Swagger UI que representa a documentação da API.

```shell
http://localhost:8080/api-docs/
```

#### Create user

Para criar um usuário não é necessário utilizar um token de segurança.

```shell
#API_URL="${AWS_API_GATEWAY_URL}/v1"
API_URL=http://localhost:8080
curl --request POST "${API_URL}/users" \
--header 'Content-Type: application/json' \
--data-raw '{ "nickname": "opicarellilive", "email": "opicarelli@live.com", "fullName": "Oto Live", "password": "P@ssw0rd" }'
```

#### Set user deviceToken

Para armazenar o token do dispositivo (browser) do usuário é necessário utilizar o ``USER_ID_TOKEN`` obtido anteriormente.

```shell
#API_URL="${AWS_API_GATEWAY_URL}/v1"
API_URL=http://localhost:8080 \
curl --request PATCH "${API_URL}/users/devicetoken" \
--header "Authorization: ${USER_ID_TOKEN}" \
--header 'Content-Type: application/json' \
--data-raw '{ "deviceToken": "anyValidDeviceToken" }'
```

#### Update user optout

Para atualizar a decisão opt out/in do usuário é necessário utilizar o ``USER_ID_TOKEN`` obtido anteriormente.

```shell
#API_URL="${AWS_API_GATEWAY_URL}/v1"
API_URL=http://localhost:8080 \
curl --request PATCH "${API_URL}/users/optout" \
--header "Authorization: ${USER_ID_TOKEN}" \
--header 'Content-Type: application/json' \
--data-raw '{ "city": "3656", "frequency": "*/15 * * * *", "optOut": false }'
```

### Lint

```shell
npm run lint
```

Fix errors

```shell
npm run lint:fix
```

### Prettier

```shell
npm run format
```

Fix formatters

```shell
npm run format:fix
```

### Deploy Manual

Definir variáveis para auxiliar os próximos comandos:

```shell
AWS_SAM_STACK_NAME="${ENVIRONMENT_NAME}-${APPLICATION_NAME}-api"
```

```shell
AWS_SNS_PLATFORM_APPLICATION_GCM=""
```

```shell
npm install -g esbuild
```

```shell
sam build
sam deploy --stack-name $AWS_SAM_STACK_NAME \
--template-file .aws-sam/build/template.yaml \
--resolve-s3 \
--capabilities CAPABILITY_IAM CAPABILITY_AUTO_EXPAND \
--parameter-overrides ParameterKey=CognitoUserPoolId,ParameterValue="${AWS_COGNITO_USER_POOL_ID}" ParameterKey=CognitoAuthorizerFrontendClientId,ParameterValue="${AWS_COGNITO_FRONTEND_CLIENT_ID}" ParameterKey=SnsPlatformApplicationGcmArn,ParameterValue="${AWS_SNS_PLATFORM_APPLICATION_GCM}" \
--profile $PROFILE
```
