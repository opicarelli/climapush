import { Amplify } from 'aws-amplify';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.REACT_APP_AWS_COGNITO_USER_POOL_ID as string,
      userPoolClientId: process.env.REACT_APP_AWS_COGNITO_FRONTEND_CLIENT_ID as string,
    }
  },
  API: {
    REST: {
      climapushApi: {
        endpoint: process.env.REACT_APP_BACKEND_URL as string,
        region: process.env.REACT_APP_AWS_REGION as string
      },
    }
  }
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
