import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Amplify } from 'aws-amplify';
import amplifyOutputs from './amplify_outputs.json';

console.log('main.jsx: Starting application...');

console.log('Amplify config:', amplifyOutputs);
console.log('User Pool ID:', amplifyOutputs.auth.user_pool_id);
console.log('Client ID:', amplifyOutputs.auth.user_pool_client_id);
console.log('Identity Pool ID:', amplifyOutputs.auth.identity_pool_id);

// Configure Amplify with the correct format
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: amplifyOutputs.auth.user_pool_id,
      userPoolClientId: amplifyOutputs.auth.user_pool_client_id,
      identityPoolId: amplifyOutputs.auth.identity_pool_id,
      signUpVerificationMethod: 'code',
      loginWith: {
        email: true,
        phone: false,
        username: false,
      },
    },
  },
  API: {
    GraphQL: {
      endpoint: amplifyOutputs.data.url,
      region: amplifyOutputs.data.aws_region,
      defaultAuthMode: 'userPool',
      customEndpoint: false,
    },
  },
});

console.log('Amplify configured successfully');

const root = ReactDOM.createRoot(document.getElementById('root'));
console.log('main.jsx: Creating React root...');

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log('main.jsx: App rendered successfully');

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
