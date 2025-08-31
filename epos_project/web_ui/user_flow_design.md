# EmPlan.co User Management & Onboarding Flow

## 🎯 User Journey Overview

### 1. **Landing Page** (`/`)
- Hero section: "Create Emergency Plans in Minutes"
- Key benefits: AI-powered, customized, professional
- Call-to-action: "Get Started Free"
- Existing user: "Sign In"

### 2. **Authentication Flow**

#### Sign Up (`/signup`)
```
Email/Password → Email Verification → Profile Setup → Dashboard
```

#### Sign In (`/signin`)
```
Email/Password → Dashboard (if verified)
```

#### Email Verification
- Automatic email sent after signup
- Link redirects to `/verify-email?token=xxx`
- Success redirects to profile setup

### 3. **Profile Setup** (`/onboarding`)
**Step 1: Basic Info**
- Full Name
- Organization Name
- Organization Type (dropdown)
- Location (City, Country)

**Step 2: Quick Assessment**
- "What's your primary concern?" (Fire, Natural Disaster, Security, etc.)
- "How many people in your organization?" (size categories)
- "Do you have an existing emergency plan?" (Yes/No/Partial)

**Step 3: Welcome**
- Brief tutorial: "How EmPlan Works"
- Option to "Create Your First Plan" or "Explore Dashboard"

### 4. **Dashboard** (`/dashboard`)
- Welcome message with user name
- Quick stats: Plans created, last updated
- Action buttons:
  - "Create New Plan" (primary CTA)
  - "Chat with Assistant"
  - "View All Plans"
- Recent plans list

## 🔐 User Management Features

### Account States
1. **Unregistered**: Can view landing page only
2. **Registered, Unverified**: Limited access, verification prompt
3. **Verified, Incomplete Profile**: Redirected to onboarding
4. **Active User**: Full access to all features

### User Data Structure
```javascript
{
  uid: "firebase-user-id",
  email: "user@example.com",
  profile: {
    fullName: "John Smith",
    organizationName: "ACME Corp",
    organizationType: "Corporate Office",
    location: "Toronto, ON",
    createdAt: timestamp,
    onboardingComplete: true
  },
  subscription: {
    plan: "free", // free, pro
    planLimit: 3,  // number of plans allowed
    plansCreated: 1
  },
  preferences: {
    emailNotifications: true,
    theme: "light"
  }
}
```

## 🚀 Onboarding UX Principles

### Keep It Simple
- Max 3 steps in onboarding
- Optional advanced settings
- Progressive disclosure

### Immediate Value
- Show sample emergency plan during onboarding
- "Skip for now" options on non-essential fields
- Quick win: Generate first plan in under 5 minutes

### Trust & Security
- Clear privacy policy link
- "Your data is encrypted and never shared"
- Industry compliance mentions (if applicable)

## 📱 Responsive Design Priorities

### Mobile First
- Touch-friendly buttons (min 44px)
- Single column layouts
- Swipe gestures for multi-step forms

### Progressive Enhancement
- Works without JavaScript (basic forms)
- Enhanced with React interactivity
- Offline capability for viewing existing plans

## 🔄 User States & Navigation

### Authenticated Navigation
```
Header: [Logo] [Dashboard] [Plans] [Chat] [Profile] [Sign Out]
```

### Unauthenticated Navigation  
```
Header: [Logo] [Features] [Pricing] [Sign In] [Get Started]
```

## 📊 Analytics & Metrics

### Key Metrics to Track
- Sign-up completion rate
- Email verification rate  
- Onboarding completion rate
- Time to first plan creation
- Plan generation success rate

### User Engagement
- Dashboard visits
- Chat interactions
- Plan downloads/exports
- Feature usage patterns
