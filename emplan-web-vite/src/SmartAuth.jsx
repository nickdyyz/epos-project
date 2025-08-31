import React, { useState, useEffect } from 'react';
import { signIn, signUp, confirmSignUp, signOut, getCurrentUser, updateUserAttributes, fetchUserAttributes } from 'aws-amplify/auth';
import logo from './epos-logo.png';
import Dashboard from './Dashboard';
import Onboarding from './Onboarding';
import { useOrganizationProfileUnified } from './hooks/useOrganizationProfileUnified';

// Mock authentication functions as fallback
const mockSignIn = async ({ username, password }) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (!username || !password) {
    throw new Error('Username and password are required');
  }
  
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }
  
  return {
    isSignedIn: true,
    nextStep: { signInStep: 'DONE' }
  };
};

const mockGetCurrentUser = async () => {
  const savedUser = localStorage.getItem('mockUser');
  if (!savedUser) {
    throw new Error('No authenticated user');
  }
  return JSON.parse(savedUser);
};

const mockSignUp = async ({ username, password, options }) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (!username || !password) {
    throw new Error('Username and password are required');
  }
  
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }
  
  const mockUser = {
    userId: 'mock-user-' + Date.now(),
    username: username,
    attributes: {
      email: username,
      email_verified: false,
      ...options?.userAttributes
    }
  };
  
  localStorage.setItem('mockUser', JSON.stringify(mockUser));
  
  return {
    isSignUpComplete: false,
    nextStep: { signUpStep: 'CONFIRM_SIGN_UP' }
  };
};

const mockConfirmSignUp = async ({ username, confirmationCode }) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (!confirmationCode || confirmationCode.length < 3) {
    throw new Error('Invalid confirmation code');
  }
  
  const savedUser = localStorage.getItem('mockUser');
  if (savedUser) {
    const user = JSON.parse(savedUser);
    user.attributes.email_verified = true;
    localStorage.setItem('mockUser', JSON.stringify(user));
  }
  
  return { isSignUpComplete: true };
};

const mockSignOut = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  localStorage.removeItem('mockUser');
  localStorage.removeItem('mockOrganizationProfile');
};

const mockFetchUserAttributes = async () => {
  const savedUser = localStorage.getItem('mockUser');
  if (!savedUser) {
    throw new Error('No authenticated user');
  }
  return JSON.parse(savedUser).attributes;
};

function SmartAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formType, setFormType] = useState('signIn');
  const [form, setForm] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    organization: '',
    confirmationCode: '',
    acceptTerms: false,
  });
  const [error, setError] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [useMockAuth, setUseMockAuth] = useState(false);
  
  // Organization profile hook
  const { profile, loading: profileLoading, isOnboardingComplete, fetchProfile, backendStatus } = useOrganizationProfileUnified();

  // Check if user is already authenticated
  useEffect(() => {
    console.log('SmartAuth: Component mounted, checking auth state...');
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    console.log('SmartAuth: Checking auth state...');
    try {
      // Try real AWS first
      const currentUser = await getCurrentUser();
      console.log('SmartAuth: Real AWS user found:', currentUser);
      setUser(currentUser);
      setUseMockAuth(false);
      
      // Check if user has completed onboarding
      await fetchProfile();
    } catch (error) {
      console.log('SmartAuth: Real AWS auth failed, trying mock auth...', error);
      
      // Fallback to mock authentication
      try {
        const mockUser = await mockGetCurrentUser();
        console.log('SmartAuth: Mock user found:', mockUser);
        setUser(mockUser);
        setUseMockAuth(true);
      } catch (mockError) {
        console.log('SmartAuth: No user found in either system');
        setUser(null);
        setUseMockAuth(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
    setError('');
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    try {
      console.log('SmartAuth: Attempting sign-in...');
      
      let signInResult;
      if (useMockAuth) {
        signInResult = await mockSignIn({ username: form.username, password: form.password });
      } else {
        signInResult = await signIn({ username: form.username, password: form.password });
      }
      
      console.log('Sign-in response:', signInResult);
      
      if (signInResult.isSignedIn) {
        let user;
        if (useMockAuth) {
          user = await mockGetCurrentUser();
        } else {
          user = await getCurrentUser();
          try {
            const userAttributes = await fetchUserAttributes();
            user = {
              ...user,
              attributes: userAttributes
            };
          } catch (attrError) {
            console.log('Could not fetch user attributes, using basic user object:', attrError);
          }
        }
        
        console.log('Sign-in successful, user:', user);
        setUser(user);
      } else {
        console.log('Sign-in not complete, next step:', signInResult.nextStep);
        setError('Sign-in requires additional steps');
      }
    } catch (err) {
      console.error('Sign-in error:', err);
      
      // If real AWS fails, try mock auth
      if (!useMockAuth && (err.message.includes('User pool client') || err.message.includes('does not exist'))) {
        console.log('Real AWS failed, switching to mock auth...');
        setUseMockAuth(true);
        setError('Switched to demo mode due to AWS configuration issues. Please try signing in again.');
      } else {
        setError(err.message);
      }
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    try {
      console.log('SmartAuth: Attempting sign-up...');
      
      const options = {
        userAttributes: {
          email: form.username,
          given_name: form.firstName,
          family_name: form.lastName,
          'custom:organization': form.organization,
        },
        autoSignIn: true
      };
      
      let signUpResult;
      if (useMockAuth) {
        signUpResult = await mockSignUp({ username: form.username, password: form.password, options });
      } else {
        signUpResult = await signUp({ username: form.username, password: form.password, options });
      }
      
      console.log('Sign-up response:', signUpResult);
      
      if (signUpResult.isSignUpComplete) {
        setFormType('signIn');
        setError('');
      } else {
        setFormType('confirmSignUp');
        setError('');
      }
    } catch (err) {
      console.error('Sign-up error:', err);
      
      // If real AWS fails, try mock auth
      if (!useMockAuth && (err.message.includes('User pool client') || err.message.includes('does not exist'))) {
        console.log('Real AWS failed, switching to mock auth...');
        setUseMockAuth(true);
        setError('Switched to demo mode due to AWS configuration issues. Please try signing up again.');
      } else {
        setError(err.message);
      }
    }
  };

  const handleConfirmSignUp = async (e) => {
    e.preventDefault();
    setError('');
    try {
      console.log('SmartAuth: Confirming sign-up...');
      
      let confirmResult;
      if (useMockAuth) {
        confirmResult = await mockConfirmSignUp({ username: form.username, confirmationCode: form.confirmationCode });
      } else {
        confirmResult = await confirmSignUp({ username: form.username, confirmationCode: form.confirmationCode });
      }
      
      if (confirmResult.isSignUpComplete) {
        setFormType('signIn');
        setError('');
      }
    } catch (err) {
      console.error('Confirm sign-up error:', err);
      setError(err.message);
    }
  };

  const handleSignOut = async () => {
    try {
      if (useMockAuth) {
        await mockSignOut();
      } else {
        await signOut();
      }
      setUser(null);
      setUseMockAuth(false);
      console.log('SmartAuth: Sign-out successful');
    } catch (error) {
      console.error('Sign-out error:', error);
      setError('Sign-out failed');
    }
  };

  const handleOnboardingComplete = async () => {
    setShowOnboarding(false);
    console.log('SmartAuth: Onboarding completed');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, show dashboard or onboarding
  if (user) {
    return (
      <div>
        {showOnboarding ? (
          <Onboarding onComplete={handleOnboardingComplete} />
        ) : (
          <Dashboard user={user} signOut={handleSignOut} />
        )}
        {useMockAuth && (
          <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded shadow-lg">
            Demo Mode - Using Mock Authentication
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <img className="mx-auto h-12 w-auto max-w-[160px] object-contain" src={logo} alt="EPOS Logo" style={{maxHeight: '60px'}} />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {formType === 'signIn' ? 'Sign in to your account' : formType === 'signUp' ? 'Create your account' : 'Confirm your account'}
          </h2>
          {useMockAuth && (
            <div className="mt-2 text-center text-sm text-yellow-600 bg-yellow-50 border border-yellow-200 rounded px-3 py-2">
              Demo Mode - Using Mock Authentication
            </div>
          )}
          <p className="mt-2 text-center text-sm text-gray-600">
            {formType === 'signIn' ? (
              <>
                Or{' '}
                <button
                  onClick={() => setFormType('signUp')}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  create a new account
                </button>
              </>
            ) : formType === 'signUp' ? (
              <>
                Or{' '}
                <button
                  onClick={() => setFormType('signIn')}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  sign in to existing account
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setFormType('signIn')}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Back to sign in
                </button>
              </>
            )}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={formType === 'signIn' ? handleSignIn : formType === 'signUp' ? handleSignUp : handleConfirmSignUp}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {formType === 'signUp' && (
              <>
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name *
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={form.firstName}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name *
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={form.lastName}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="organization" className="block text-sm font-medium text-gray-700">
                    Organization
                  </label>
                  <input
                    id="organization"
                    name="organization"
                    type="text"
                    value={form.organization}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <input
                id="username"
                name="username"
                type="email"
                autoComplete="email"
                required
                value={form.username}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={formType === 'signIn' ? 'current-password' : 'new-password'}
                required
                value={form.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {formType === 'confirmSignUp' && (
              <div>
                <label htmlFor="confirmationCode" className="block text-sm font-medium text-gray-700">
                  Confirmation Code *
                </label>
                <input
                  id="confirmationCode"
                  name="confirmationCode"
                  type="text"
                  required
                  value={form.confirmationCode}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter the code sent to your email"
                />
              </div>
            )}

            {formType === 'signUp' && (
              <div className="flex items-center">
                <input
                  id="acceptTerms"
                  name="acceptTerms"
                  type="checkbox"
                  required
                  checked={form.acceptTerms}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-900">
                  I agree to the{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-500">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-500">
                    Privacy Policy
                  </a>
                </label>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {formType === 'signIn' ? 'Sign in' : formType === 'signUp' ? 'Create account' : 'Confirm account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SmartAuth; 