#!/bin/bash

# Setup script for EPOS Amplify deployment permissions
# This script creates and attaches the necessary IAM policy to epos-cli-user

echo "Setting up EPOS Amplify deployment permissions..."

# Create the IAM policy
echo "Creating IAM policy: EPOSAmplifyDeploymentPolicy"
aws iam create-policy \
  --policy-name EPOSAmplifyDeploymentPolicy \
  --policy-document file://amplify-deployment-policy.json \
  --description "Policy for EPOS Amplify backend deployment" \
  --profile epos-cli-user

# Get the policy ARN
POLICY_ARN=$(aws iam list-policies --query 'Policies[?PolicyName==`EPOSAmplifyDeploymentPolicy`].Arn' --output text --profile epos-cli-user)

if [ -n "$POLICY_ARN" ]; then
    echo "Policy created successfully: $POLICY_ARN"
    
    # Attach the policy to epos-cli-user
    echo "Attaching policy to epos-cli-user..."
    aws iam attach-user-policy \
      --user-name epos-cli-user \
      --policy-arn "$POLICY_ARN" \
      --profile epos-cli-user
    
    echo "Permissions setup complete!"
    echo "You can now run: npx ampx sandbox"
else
    echo "Failed to create policy. Please check AWS permissions."
fi 