const { CognitoIdentityProviderClient, ListUserPoolsCommand, DescribeUserPoolCommand } = require('@aws-sdk/client-cognito-identity-provider');

async function testConnectivity() {
  console.log('Testing AWS connectivity...');
  
  const client = new CognitoIdentityProviderClient({ 
    region: 'us-east-2',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
  });

  try {
    // Test basic connectivity
    console.log('1. Testing basic AWS connectivity...');
    const listCommand = new ListUserPoolsCommand({ MaxResults: 5 });
    const result = await client.send(listCommand);
    console.log('✅ AWS connectivity successful');
    console.log('User pools found:', result.UserPools?.length || 0);

    // Test specific user pool
    console.log('\n2. Testing specific user pool...');
    const userPoolId = 'us-east-2_tyvTmwBJn';
    const describeCommand = new DescribeUserPoolCommand({ UserPoolId: userPoolId });
    const poolResult = await client.send(describeCommand);
    console.log('✅ User pool accessible');
    console.log('User pool name:', poolResult.UserPool?.Name);
    console.log('User pool status:', poolResult.UserPool?.Status);

  } catch (error) {
    console.error('❌ AWS connectivity test failed:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.$metadata?.httpStatusCode);
  }
}

testConnectivity(); 