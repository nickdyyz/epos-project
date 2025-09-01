import React, { useState, useEffect } from 'react';
import { signIn, signUp, confirmSignUp, signOut, getCurrentUser, updateUserAttributes, fetchUserAttributes } from 'aws-amplify/auth';
import logo from './epos-logo.png';
import Dashboard from './Dashboard';
import Onboarding from './Onboarding';
import { useOrganizationProfileUnified } from './hooks/useOrganizationProfileUnified';

function CustomAuth() {
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
  
  // Organization profile hook
  const { profile, loading: profileLoading, isOnboardingComplete, fetchProfile, backendStatus } = useOrganizationProfileUnified();

  // Track profile state changes
  useEffect(() => {
    console.log('🔄 PROFILE STATE CHANGED:');
    console.log('- profile:', profile);
    console.log('- profileLoading:', profileLoading);
    console.log('- isOnboardingComplete:', isOnboardingComplete);
    console.log('- showOnboarding:', showOnboarding);
  }, [profile, profileLoading, isOnboardingComplete, showOnboarding]);

  // Check if user is already authenticated
  useEffect(() => {
    console.log('CustomAuth: Component mounted, checking auth state...');
    console.log('=== AUTH STATE DIAGNOSTICS ===');
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    console.log('CustomAuth: Checking auth state...');
    
    // Try fetchAuthSession first (more reliable)
    console.log('CustomAuth: Trying fetchAuthSession first...');
    try {
      const session = await fetchAuthSession();
      console.log('CustomAuth: Auth session fetched:', session);
      
      if (session.tokens && session.tokens.idToken) {
        console.log('CustomAuth: User has valid tokens');
        
        // Create currentUser object from session
        const currentUser = {
          userId: session.tokens.idToken.payload.sub,
          username: session.tokens.idToken.payload.email || 'unknown',
        };
        console.log('CustomAuth: Current user created from session:', currentUser);
        
        // Fetch user attributes to ensure we have the latest data including names
        try {
          const userAttributes = await fetchUserAttributes();
          console.log('CustomAuth: User attributes:', userAttributes);
          // Update user object with attributes
          const userWithAttributes = {
            ...currentUser,
            attributes: userAttributes
          };
          setUser(userWithAttributes);
        } catch (attrError) {
          console.log('CustomAuth: Could not fetch user attributes, using basic user object:', attrError);
          setUser(currentUser);
        }
        
        // Don't fetch profile here - let the profile hook handle it
        console.log('CustomAuth: User authenticated, profile will be fetched by hook');
      } else {
        console.log('CustomAuth: No valid tokens in session');
        setUser(null);
      }
    } catch (sessionError) {
      console.log('CustomAuth: fetchAuthSession failed:', sessionError);
      
      // Fallback: try getCurrentUser with timeout
      console.log('CustomAuth: Trying getCurrentUser as fallback...');
      const authTimeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          console.log('⏰ CustomAuth AUTH TIMEOUT: getCurrentUser timed out after 5 seconds');
          reject(new Error('CustomAuth getCurrentUser timeout after 5 seconds'));
        }, 5000);
      });
      
      try {
        // Race between getCurrentUser and timeout
        const currentUser = await Promise.race([
          getCurrentUser(),
          authTimeoutPromise
        ]);
        console.log('CustomAuth: getCurrentUser successful:', currentUser);
        
        // Fetch user attributes to ensure we have the latest data including names
        try {
          const userAttributes = await fetchUserAttributes();
          console.log('CustomAuth: User attributes:', userAttributes);
          // Update user object with attributes
          const userWithAttributes = {
            ...currentUser,
            attributes: userAttributes
          };
          setUser(userWithAttributes);
        } catch (attrError) {
          console.log('CustomAuth: Could not fetch user attributes, using basic user object:', attrError);
          setUser(currentUser);
        }
        
        // Don't fetch profile here - let the profile hook handle it
        if (currentUser) {
          console.log('CustomAuth: User authenticated, profile will be fetched by hook');
        }
      } catch (error) {
        console.log('CustomAuth: Both authentication methods failed, error:', error);
        console.log('Auth state error details:', {
          name: error.name,
          code: error.code,
          message: error.message
        });
        setUser(null);
      }
    } finally {
      console.log('CustomAuth: Setting loading to false');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
    setError(''); // Clear error when user types
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    try {
      console.log('=== SIGN-IN DIAGNOSTICS ===');
      console.log('Attempting sign-in with email:', form.username);
      console.log('Sign-in parameters:', { 
        username: form.username, 
        password: form.password ? '[REDACTED]' : 'undefined' 
      });
      
      // Check if user exists first
      console.log('Checking if user exists...');
      
      // Since the user pool is configured with email as username, we use the email field as username
      const { isSignedIn, nextStep } = await signIn({ username: form.username, password: form.password });
      console.log('Sign-in response:', { isSignedIn, nextStep });
      
      if (isSignedIn) {
        const user = await getCurrentUser();
        console.log('Sign-in successful, user:', user);
        
        // Fetch user attributes to ensure we have the latest data including names
        try {
          const userAttributes = await fetchUserAttributes();
          console.log('User attributes:', userAttributes);
          // Update user object with attributes
          const userWithAttributes = {
            ...user,
            attributes: userAttributes
          };
          setUser(userWithAttributes);
          
          // Fetch profile after successful authentication
          console.log('Sign-in successful, fetching profile...');
          await fetchProfile();
        } catch (attrError) {
          console.log('Could not fetch user attributes, using basic user object:', attrError);
          setUser(user);
          
          // Still fetch profile even if attributes fail
          console.log('Fetching profile after sign-in...');
          await fetchProfile();
        }
      } else {
        console.log('Sign-in not complete, next step:', nextStep);
        if (nextStep?.signInStep === 'CONFIRM_SIGN_UP') {
          console.log('User needs to confirm sign-up');
          setFormType('confirmSignUp');
        }
      }
    } catch (error) {
      console.error('=== SIGN-IN ERROR DIAGNOSTICS ===');
      console.error('Error name:', error.name);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      console.error('Full error object:', JSON.stringify(error, null, 2));
      
      // Provide more specific error messages
      if (error.name === 'UserNotFoundException') {
        setError('User not found. Please check your email address or sign up for a new account.');
      } else if (error.name === 'NotAuthorizedException') {
        setError('Incorrect password. Please try again.');
      } else if (error.name === 'UserNotConfirmedException') {
        setError('Please confirm your email address before signing in.');
        setFormType('confirmSignUp');
      } else {
        setError(`Sign-in failed: ${error.message}`);
      }
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!form.acceptTerms) {
      setError('You must accept the Terms and Conditions to create an account.');
      return;
    }
    
    // Validate required fields
    if (!form.username || !form.password) {
      setError('Email and password are required to create an account.');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.username)) {
      setError('Please enter a valid email address.');
      return;
    }
    
    try {
      console.log('Attempting sign-up with attributes:', {
        username: form.username, // This is the email address
        email: form.username, // Use the same email for both
        firstName: form.firstName,
        lastName: form.lastName
      });

      // Sign-up with name attributes if provided
      let signUpResult;
      const userAttributes = {
        email: form.username, // Use the same email
      };
      
      // Add name attributes if provided (using standard Cognito attributes)
      if (form.firstName) {
        userAttributes['given_name'] = form.firstName;
      }
      if (form.lastName) {
        userAttributes['family_name'] = form.lastName;
      }
      // Note: Organization will be stored in the organization profile instead
      
      try {
        console.log('Attempting sign-up with attributes:', userAttributes);
        signUpResult = await signUp({
          username: form.username, // This is the email address
          password: form.password,
          options: {
            userAttributes,
          },
        });
        console.log('Sign-up successful:', signUpResult);
      } catch (signUpError) {
        console.log('Sign-up failed:', signUpError.message);
        console.log('Error details:', {
          name: signUpError.name,
          code: signUpError.code,
          message: signUpError.message
        });
        throw signUpError;
      }
      
      const { isSignUpComplete, userId, nextStep } = signUpResult;
      console.log('Sign-up result:', { isSignUpComplete, userId, nextStep });
      
      // Check if we need to confirm the sign-up
      if (nextStep?.signUpStep === 'CONFIRM_SIGN_UP' || !isSignUpComplete) {
        setFormType('confirmSignUp');
        console.log('Moving to confirmation step');
        setError(''); // Clear any previous errors
      } else if (isSignUpComplete) {
        console.log('Sign-up completed, moving to sign-in');
        setFormType('signIn');
        setError(''); // Clear any previous errors
      }
    } catch (error) {
      console.error('Sign-up error details:', error);
      setError(`Sign-up failed: ${error.message}`);
    }
  };

  const handleConfirmSignUp = async (e) => {
    e.preventDefault();
    setError('');
    try {
      console.log('Confirming sign-up for email:', form.username);
      const { isSignUpComplete, nextStep } = await confirmSignUp({
        username: form.username, // This should be the email address
        confirmationCode: form.confirmationCode
      });
      console.log('Confirmation result:', { isSignUpComplete, nextStep });
      
      if (isSignUpComplete) {
        console.log('Sign-up confirmed successfully, moving to sign-in');
        setFormType('signIn');
        setForm({ ...form, confirmationCode: '' });
        setError(''); // Clear any previous errors
      } else {
        console.log('Sign-up not complete, next step:', nextStep);
        setError('Confirmation completed but sign-up process not finished. Please try signing in.');
      }
    } catch (error) {
      console.error('Confirmation error:', error);
      setError(`Confirmation failed: ${error.message}`);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      setFormType('signIn');
      setForm({ username: '', password: '', email: '', firstName: '', lastName: '', confirmationCode: '', acceptTerms: false });
      setShowOnboarding(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleOnboardingComplete = async () => {
    console.log('🚀 handleOnboardingComplete called - fetching profile...');
    console.log('Current state before fetch:');
    console.log('- showOnboarding:', showOnboarding);
    console.log('- profile:', profile);
    console.log('- isOnboardingComplete:', isOnboardingComplete);
    
    // Force a fresh profile fetch
    try {
      const freshProfile = await fetchProfile();
      console.log('✅ Fresh profile fetched:', freshProfile);
      console.log('✅ Fresh profile isOnboardingComplete:', freshProfile?.isOnboardingComplete);
      console.log('🔄 Setting showOnboarding to false...');
      setShowOnboarding(false);
      
      // Add a small delay to ensure state updates are processed
      setTimeout(() => {
        console.log('=== AFTER ONBOARDING COMPLETE DEBUG ===');
        console.log('Profile after fetch:', profile);
        console.log('Fresh profile result:', freshProfile);
        console.log('Is onboarding complete after fetch:', isOnboardingComplete);
        console.log('Show onboarding state:', showOnboarding);
        console.log('=== END DEBUG ===');
      }, 1000);
    } catch (error) {
      console.error('❌ Error fetching profile after onboarding:', error);
      // Even if fetch fails, try to hide onboarding
      console.log('🔄 Setting showOnboarding to false due to error...');
      setShowOnboarding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
          <p className="text-xs text-gray-500 mt-2">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (user) {
    console.log('=== CUSTOMAUTH RENDER DEBUG ===');
    console.log('Component re-rendering with user:', user);
    console.log('Profile:', profile);
    console.log('Profile loading:', profileLoading);
    console.log('Is onboarding complete:', isOnboardingComplete);
    console.log('Show onboarding:', showOnboarding);
    console.log('Profile exists:', !!profile);
    console.log('Profile isOnboardingComplete:', profile?.isOnboardingComplete);
    console.log('=== END RENDER DEBUG ===');
    
    // Check if user needs to complete onboarding
    if (!profileLoading && !profile && !showOnboarding) {
      console.log('🔴 CONDITION 1: No profile found, setting showOnboarding to true');
      setShowOnboarding(true);
    } else if (!profileLoading && profile && !profile.isOnboardingComplete && !showOnboarding) {
      console.log('🔴 CONDITION 2: Profile exists but onboarding not complete, setting showOnboarding to true');
      setShowOnboarding(true);
    } else {
      console.log('🟢 No onboarding conditions met - profile state is:', {
        profileLoading,
        hasProfile: !!profile,
        profileIsOnboardingComplete: profile?.isOnboardingComplete,
        showOnboarding
      });
    }
    
    if (showOnboarding) {
      console.log('🔄 RENDERING: Onboarding component');
      return <Onboarding onComplete={handleOnboardingComplete} onSignOut={handleSignOut} />;
    }
    
    console.log('🔄 RENDERING: Dashboard component');
    return <Dashboard user={user} plans={[]} signOut={handleSignOut} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Logo */}
      <div className="fixed top-6 left-6 z-20">
        <img src={logo} alt="EPOS Logo" className="w-32 max-w-[160px] h-auto object-contain drop-shadow-lg" style={{maxHeight: '60px'}} />
      </div>
      
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-300/10 to-purple-300/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          {/* Auth Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {formType === 'signIn' ? 'Welcome Back' : formType === 'signUp' ? 'Create Account' : 'Confirm Email'}
              </h1>
              <p className="text-gray-600 text-sm">
                {formType === 'signIn' ? 'Sign in to your EPOS account' : 
                 formType === 'signUp' ? 'Join EPOS for emergency plan management' : 
                 'Enter the confirmation code sent to your email'}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Forms */}
            {formType === 'signIn' && (
              <form onSubmit={handleSignIn} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="username"
                      placeholder="Enter your email"
                      value={form.username}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                >
                  Sign In
                </button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setFormType('signUp')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
                  >
                    Don't have an account? Sign up
                  </button>
                </div>
              </form>
            )}

            {formType === 'signUp' && (
              <form onSubmit={handleSignUp} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name (Optional)</label>
                      <input
                        type="text"
                        name="firstName"
                        placeholder="Enter your first name"
                        value={form.firstName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name (Optional)</label>
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Enter your last name"
                        value={form.lastName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Organization (Optional)</label>
                    <input
                      type="text"
                      name="organization"
                      placeholder="Enter your organization name"
                      value={form.organization}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="username"
                      placeholder="Enter your email"
                      value={form.username}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Create a password"
                      value={form.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      name="acceptTerms"
                      id="acceptTerms"
                      checked={form.acceptTerms}
                      onChange={handleChange}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      required
                    />
                    <label htmlFor="acceptTerms" className="text-sm text-gray-700">
                      I accept the{' '}
                      <button
                        type="button"
                        onClick={() => window.open('#', '_blank')}
                        className="text-blue-600 hover:text-blue-700 underline"
                      >
                        Terms and Conditions
                      </button>
                      {' '}and{' '}
                      <button
                        type="button"
                        onClick={() => window.open('#', '_blank')}
                        className="text-blue-600 hover:text-blue-700 underline"
                      >
                        Privacy Policy
                      </button>
                      . I understand that EPOS is a tool designed to assist in emergency planning and that L.E.S. Consulting assumes no liability for the results or accuracy of generated plans.
                    </label>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                >
                  Create Account
                </button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setFormType('signIn')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
                  >
                    Already have an account? Sign in
                  </button>
                </div>
              </form>
            )}

            {formType === 'confirmSignUp' && (
              <form onSubmit={handleConfirmSignUp} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirmation Code</label>
                    <input
                      type="text"
                      name="confirmationCode"
                      placeholder="Enter the code from your email"
                      value={form.confirmationCode}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                >
                  Confirm Account
                </button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setFormType('signIn')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
                  >
                    Back to Sign In
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomAuth; 