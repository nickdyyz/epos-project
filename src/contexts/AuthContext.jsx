import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      // Only try to use Amplify if it's properly configured
      if (import.meta.env.VITE_COGNITO_USER_POOL_ID && 
          import.meta.env.VITE_COGNITO_USER_POOL_ID !== 'placeholder-user-pool-id') {
        const { getCurrentUser, fetchUserAttributes } = await import('aws-amplify/auth');
        const user = await getCurrentUser();
        const attributes = await fetchUserAttributes();
        
        setCurrentUser(user);
        setUserProfile({
          email: attributes.email,
          profile: {
            fullName: attributes.name || '',
            organizationName: attributes['custom:organizationName'] || '',
            organizationType: attributes['custom:organizationType'] || '',
            location: attributes['custom:location'] || '',
            onboardingComplete: attributes['custom:onboardingComplete'] === 'true',
            createdAt: attributes.created_at
          },
          subscription: {
            plan: attributes['custom:plan'] || 'free',
            planLimit: parseInt(attributes['custom:planLimit']) || 3,
            plansCreated: parseInt(attributes['custom:plansCreated']) || 0
          },
          preferences: {
            emailNotifications: attributes['custom:emailNotifications'] !== 'false',
            theme: attributes['custom:theme'] || 'light'
          }
        });
      } else {
        // Amplify not configured, set as not authenticated
        setCurrentUser(null);
        setUserProfile(null);
      }
    } catch (error) {
      console.log('No authenticated user:', error);
      setCurrentUser(null);
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async () => {
    try {
      if (import.meta.env.VITE_COGNITO_USER_POOL_ID && 
          import.meta.env.VITE_COGNITO_USER_POOL_ID !== 'placeholder-user-pool-id') {
        const { signOut } = await import('aws-amplify/auth');
        await signOut();
      }
      setCurrentUser(null);
      setUserProfile(null);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      // Even if sign out fails, clear local state
      setCurrentUser(null);
      setUserProfile(null);
      navigate('/');
    }
  };

  const value = {
    currentUser,
    userProfile,
    signOut: signOutUser,
    loading,
    checkAuthState
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 