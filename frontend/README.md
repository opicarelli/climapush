# Frontend

- [Frontend](#frontend)
  - [Executar em ambiente local](#executar-em-ambiente-local)
    - [Variáveis de ambiente](#variáveis-de-ambiente)
      - [React Application Environments must have prefix REACT\_APP\_](#react-application-environments-must-have-prefix-react_app_)
    - [Executar](#executar)

## Executar em ambiente local

### Variáveis de ambiente

Criar um arquivo .env.local e adicionar as seguintes variáveis:

 * ``REACT_APP_IS_LOCAL_SERVER``: Valor booleano que define se é execução local
 * ``REACT_APP_CRYPTOGRAPHIT_AES_KEY``: Senha de criptografia para armazenar valores no Local Storage
 * ``REACT_APP_FIREBASE_API_KEY``: API Key do Firebase
 * ``REACT_APP_FIREBASE_AUTH_DOMAIN``: URL de Autenticação do Firebase
 * ``REACT_APP_FIREBASE_PROJECT_ID``: ID do projeto Firebase
 * ``REACT_APP_FIREBASE_STORAGE_BUCKET``: URL do bucket do Firebase
 * ``REACT_APP_FIREBASE_MESSAGING_SENDER_ID``: ID do serviço de envio de mensagem do Firebase
 * ``REACT_APP_FIREBASE_APP_ID``: ID do app cadastrado no Firebase
 * ``REACT_APP_FIREBASE_MESSAGING_VAPID_KEY``: Chave pública do Firebase Cloud Messaging
 * ``REACT_APP_BACKEND_URL``: URL da API do backend

SKIP_PREFLIGHT_CHECK=true
PORT=5000

#### React Application Environments must have prefix REACT_APP_

```
PORT=5000

# React Application Environments must have prefix REACT_APP_

REACT_APP_PROJECT_ENVIRONMENT='local'
REACT_APP_IS_LOCAL_SERVER=true
REACT_APP_CRYPTOGRAPHIT_AES_KEY='TTkPb+VR3m+E@H^2'

# Firebase
REACT_APP_FIREBASE_API_KEY=''
REACT_APP_FIREBASE_AUTH_DOMAIN=''
REACT_APP_FIREBASE_PROJECT_ID=''
REACT_APP_FIREBASE_STORAGE_BUCKET=''
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=''
REACT_APP_FIREBASE_APP_ID=''
REACT_APP_FIREBASE_MESSAGING_VAPID_KEY=''

REACT_APP_BACKEND_URL=http://localhost:8080
```

### Executar

```
npm build
```

```
npm start
```
