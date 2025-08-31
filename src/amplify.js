import { Amplify } from 'aws-amplify';

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || 'placeholder-user-pool-id',
      userPoolClientId: import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID || 'placeholder-client-id',
      signUpVerificationMethod: 'code', // 'code' | 'link'
      loginWith: {
        email: true,
        phone: false,
        username: false
      }
    }
  },
  API: {
    GraphQL: {
      endpoint: import.meta.env.VITE_GRAPHQL_ENDPOINT || 'https://placeholder-api-id.execute-api.region.amazonaws.com/graphql',
      region: import.meta.env.VITE_AWS_REGION || 'us-east-1'
    }
  }
};

// Only configure Amplify if we have valid user pool ID
if (import.meta.env.VITE_COGNITO_USER_POOL_ID && import.meta.env.VITE_COGNITO_USER_POOL_ID !== 'placeholder-user-pool-id') {
  Amplify.configure(amplifyConfig);
} else {
  console.warn('AWS Cognito configuration not found. Authentication features will be disabled.');
} 