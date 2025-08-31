# Firebase Setup for EmPlan.co

## 🔥 Firebase Project Configuration

### 1. Create Firebase Project
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Create new project
firebase init

# Select these features:
# ✅ Authentication
# ✅ Firestore Database  
# ✅ Functions
# ✅ Hosting
```

### 2. Firebase Config (`src/firebase.js`)
```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
```

### 3. Environment Variables (`.env`)
```
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=emplan-co.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=emplan-co
REACT_APP_FIREBASE_STORAGE_BUCKET=emplan-co.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

## 🗃️ Firestore Database Structure

### Collections Design
```
/users/{userId}
  - email: string
  - profile: object
  - subscription: object
  - preferences: object
  - createdAt: timestamp

/users/{userId}/plans/{planId}
  - title: string
  - organizationType: string
  - hazards: array
  - content: string
  - status: "draft" | "published"
  - createdAt: timestamp
  - updatedAt: timestamp

/users/{userId}/chats/{chatId}
  - messages: array
  - createdAt: timestamp

/templates/{templateId}
  - name: string
  - category: string
  - content: string
  - isPublic: boolean
```

### Security Rules (`firestore.rules`)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // User's plans
      match /plans/{planId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      // User's chats
      match /chats/{chatId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    // Public templates (read-only)
    match /templates/{templateId} {
      allow read: if resource.data.isPublic == true;
    }
  }
}
```

## ⚡ Firebase Functions

### Plan Generation Function (`functions/index.js`)
```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { Configuration, OpenAIApi } = require('openai');

admin.initializeApp();

exports.generatePlan = functions.https.onCall(async (data, context) => {
  // Verify user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { organizationInputs } = data;
  
  try {
    // Call your local Ollama API or integrate emergency plan generation logic
    const planContent = await generateEmergencyPlan(organizationInputs);
    
    // Save to Firestore
    const planRef = await admin.firestore()
      .collection('users')
      .doc(context.auth.uid)
      .collection('plans')
      .add({
        title: `${organizationInputs.organizationName} Emergency Plan`,
        content: planContent,
        inputs: organizationInputs,
        status: 'published',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

    return { planId: planRef.id, content: planContent };
    
  } catch (error) {
    console.error('Plan generation failed:', error);
    throw new functions.https.HttpsError('internal', 'Plan generation failed');
  }
});

async function generateEmergencyPlan(inputs) {
  // This would integrate with your EPOS system
  // For now, return a placeholder
  return `Generated emergency plan for ${inputs.organizationName}...`;
}
```

## 🎨 React Project Structure

### Project Setup
```bash
npx create-react-app emplan-web
cd emplan-web

# Install dependencies
npm install firebase
npm install @headlessui/react @heroicons/react
npm install react-router-dom
npm install tailwindcss @tailwindcss/forms
npm install react-hook-form
npm install @hookform/resolvers yup
```

### Directory Structure
```
src/
├── components/
│   ├── auth/
│   │   ├── SignUp.jsx
│   │   ├── SignIn.jsx
│   │   └── EmailVerification.jsx
│   ├── onboarding/
│   │   ├── ProfileSetup.jsx
│   │   └── QuickAssessment.jsx
│   ├── dashboard/
│   │   ├── Dashboard.jsx
│   │   └── PlansList.jsx
│   ├── plan/
│   │   ├── PlanGenerator.jsx
│   │   └── PlanViewer.jsx
│   └── layout/
│       ├── Header.jsx
│       └── Layout.jsx
├── hooks/
│   ├── useAuth.js
│   └── useUser.js
├── services/
│   ├── auth.js
│   ├── firestore.js
│   └── plans.js
├── utils/
│   └── validation.js
└── pages/
    ├── Landing.jsx
    ├── Dashboard.jsx
    └── PlanGenerator.jsx
```

## 🚀 Deployment Configuration

### Firebase Hosting (`firebase.json`)
```json
{
  "hosting": {
    "public": "build",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css|png|jpg|jpeg|gif|svg|webp)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

### Domain Setup
1. In Firebase Console → Hosting → Add custom domain
2. Add `emplan.co` and `www.emplan.co`
3. Follow DNS verification steps
4. Firebase will automatically provision SSL certificate
