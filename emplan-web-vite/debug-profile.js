// Debug script for organization profile functionality
import { Amplify } from 'aws-amplify';
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';
import amplifyOutputs from './src/amplify_outputs.json';

// Configure Amplify
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
      defaultAuthMode: 'iam',
      customEndpoint: false,
    },
  },
});

const APPSYNC_ENDPOINT = amplifyOutputs.data.url;

// Helper function to make GraphQL requests
const makeGraphQLRequest = async (query, variables = {}) => {
  try {
    const session = await fetchAuthSession();
    const token = session.tokens.idToken.toString();
    
    console.log('Making GraphQL request with token:', token.substring(0, 20) + '...');
    
    const response = await fetch(APPSYNC_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });
    
    const result = await response.json();
    console.log('GraphQL response:', result);
    
    if (result.errors) {
      throw new Error(`GraphQL Error: ${result.errors[0].message}`);
    }
    
    return result.data;
  } catch (error) {
    console.error('GraphQL request error:', error);
    throw error;
  }
};

// Test functions
const testFetchProfile = async () => {
  try {
    console.log('Testing fetch profile...');
    const currentUser = await getCurrentUser();
    console.log('Current user:', currentUser);
    
    const data = await makeGraphQLRequest(`
      query GetOrganizationProfile($userId: String!) {
        listOrganizationProfiles(filter: { userId: { eq: $userId } }) {
          items {
            id
            organizationName
            organizationType
            userId
            createdAt
            updatedAt
          }
        }
      }
    `, { userId: currentUser.userId });
    
    console.log('Profile data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

const testCreateProfile = async () => {
  try {
    console.log('Testing create profile...');
    const currentUser = await getCurrentUser();
    
    const profileData = {
      organizationName: 'Test Organization',
      organizationType: 'CorporateOffice',
      userId: currentUser.userId,
      isOnboardingComplete: true,
      lastUpdated: new Date().toISOString(),
    };
    
    const data = await makeGraphQLRequest(`
      mutation CreateOrganizationProfile($input: CreateOrganizationProfileInput!) {
        createOrganizationProfile(input: $input) {
          id
          organizationName
          organizationType
          userId
          createdAt
          updatedAt
        }
      }
    `, { input: profileData });
    
    console.log('Created profile:', data);
    return data;
  } catch (error) {
    console.error('Error creating profile:', error);
    throw error;
  }
};

// Main test function
const runTests = async () => {
  try {
    console.log('Starting organization profile tests...');
    
    // Test 1: Fetch existing profiles
    console.log('\n=== Test 1: Fetch existing profiles ===');
    await testFetchProfile();
    
    // Test 2: Create a new profile
    console.log('\n=== Test 2: Create new profile ===');
    await testCreateProfile();
    
    // Test 3: Fetch profiles again
    console.log('\n=== Test 3: Fetch profiles after creation ===');
    await testFetchProfile();
    
    console.log('\nAll tests completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Run the tests
runTests(); 