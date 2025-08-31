# EPOS Onboarding Feature

## Overview

The EPOS onboarding feature collects comprehensive organization information to enable personalized emergency plan generation. This data is stored securely in AWS DynamoDB and associated with the user's account.

## Features

### Multi-Step Onboarding Process

The onboarding flow consists of 5 steps:

1. **Basic Organization Information**
   - Organization name
   - Organization type (Corporate Office, Healthcare Facility, Educational Institution, etc.)
   - Industry

2. **Primary Contact Information**
   - Primary contact name, email, and phone
   - Secondary contact information (optional)

3. **Location Information**
   - Primary address, city, state, postal code
   - Building information (type, floors, occupancy, age)

4. **Emergency Contact Information**
   - Emergency contact details
   - Nearest emergency services (hospital, fire station, police station)

5. **Additional Information**
   - Operating hours
   - Special populations (children, elderly, disabled, etc.)
   - Accessibility features
   - Special considerations

### Data Storage

Organization profiles are stored in AWS DynamoDB with the following security features:

- **Owner-based authorization**: Users can only access their own organization profile
- **Authenticated access**: Read access for authenticated users (for future features)
- **User association**: Each profile is linked to a specific user ID

### Integration Points

- **Authentication Flow**: Onboarding is triggered after successful sign-in if no organization profile exists
- **Dashboard Integration**: Organization data is displayed in the profile management section
- **Plan Generation**: Organization data will be used to personalize emergency plan generation

## Technical Implementation

### Backend (Amplify Gen2)

```typescript
// amplify/data/resource.ts
const schema = a.schema({
  OrganizationProfile: a
    .model({
      // Organization fields...
      userId: a.string().required(),
      isOnboardingComplete: a.boolean().default(false),
      lastUpdated: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().read(),
    ])
    .index('byUserId', ['userId']),
});
```

### Frontend Components

- **Onboarding.jsx**: Multi-step form component
- **useOrganizationProfile.js**: Custom hook for profile management
- **CustomAuth.jsx**: Integration with authentication flow
- **Dashboard.jsx**: Profile display and management

### Data Flow

1. User signs in successfully
2. System checks for existing organization profile
3. If no profile exists, onboarding is triggered
4. User completes multi-step form
5. Data is saved to DynamoDB
6. User is redirected to dashboard
7. Organization data is available for plan generation

## Security Considerations

- All data is encrypted at rest in DynamoDB
- Access is controlled through AWS IAM and Cognito
- User data is isolated by user ID
- No sensitive data is stored in client-side storage

## Future Enhancements

- Profile editing functionality
- Multiple organization support
- Data export capabilities
- Integration with emergency plan templates
- Automated data validation and suggestions

## Usage

1. Sign up for an EPOS account
2. Complete email verification
3. Sign in to your account
4. Complete the onboarding process
5. Access your organization profile in the dashboard
6. Generate personalized emergency plans

## Troubleshooting

If onboarding doesn't appear after sign-in:
1. Check browser console for errors
2. Verify AWS Amplify configuration
3. Ensure DynamoDB table is created
4. Check user authentication status

For technical support, contact: training@lesconsulting.org 