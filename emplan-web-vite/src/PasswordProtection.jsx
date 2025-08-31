import React, { useState, useEffect } from 'react';
import logo from './epos-logo.png';
import PASSWORD_CONFIG from './config/passwordConfig';

const PasswordProtection = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(null);

  // Configuration from config file
  const { CORRECT_PASSWORD, MAX_ATTEMPTS, LOCKOUT_DURATION, AUTH_KEY, LOCKOUT_KEY } = PASSWORD_CONFIG;

  useEffect(() => {
    // Check if user is already authenticated (stored in sessionStorage)
    const authenticated = sessionStorage.getItem(AUTH_KEY);
    if (authenticated === 'true') {
      setIsAuthenticated(true);
    }

    // Check if user is locked out
    const lockoutUntil = localStorage.getItem(LOCKOUT_KEY);
    if (lockoutUntil) {
      const lockoutTime = parseInt(lockoutUntil);
      const now = Date.now();
      if (now < lockoutTime) {
        setIsLocked(true);
        setLockoutTime(lockoutTime);
      } else {
        // Lockout expired, clear it
        localStorage.removeItem(LOCKOUT_KEY);
        setAttempts(0);
      }
    }
  }, [AUTH_KEY, LOCKOUT_KEY]);

  useEffect(() => {
    // Update lockout countdown
    if (isLocked && lockoutTime) {
      const interval = setInterval(() => {
        const now = Date.now();
        if (now >= lockoutTime) {
          setIsLocked(false);
          setLockoutTime(null);
          setAttempts(0);
          localStorage.removeItem(LOCKOUT_KEY);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isLocked, lockoutTime]);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem(AUTH_KEY, 'true');
      setAttempts(0);
      localStorage.removeItem(LOCKOUT_KEY);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= MAX_ATTEMPTS) {
        // Lock out the user
        const lockoutUntil = Date.now() + LOCKOUT_DURATION;
        setIsLocked(true);
        setLockoutTime(lockoutUntil);
        localStorage.setItem(LOCKOUT_KEY, lockoutUntil.toString());
        setError(`Too many failed attempts. Please try again in 15 minutes.`);
      } else {
        const remainingAttempts = MAX_ATTEMPTS - newAttempts;
        setError(`Incorrect password. ${remainingAttempts} attempts remaining.`);
      }
      
      setPassword('');
    }
  };

  const formatTimeRemaining = () => {
    if (!lockoutTime) return '';
    
    const now = Date.now();
    const remaining = Math.max(0, lockoutTime - now);
    
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // If already authenticated, show the main app
  if (isAuthenticated) {
    return children;
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
          {/* Password Protection Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Access Required
              </h1>
              <p className="text-gray-600 text-sm">
                Enter the access password to continue to EPOS
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Lockout Message */}
            {isLocked && (
              <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg text-sm">
                <div className="flex items-center justify-between">
                  <span>Account temporarily locked</span>
                  <span className="font-mono font-bold">{formatTimeRemaining()}</span>
                </div>
              </div>
            )}

            {/* Password Form */}
            {!isLocked && (
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Access Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter access password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                >
                  Continue to EPOS
                </button>
              </form>
            )}

            {/* Attempts Counter */}
            {!isLocked && attempts > 0 && (
              <div className="text-center mt-4">
                <p className="text-xs text-gray-500">
                  Failed attempts: {attempts}/{MAX_ATTEMPTS}
                </p>
              </div>
            )}

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500">
                EPOS Emergency Plan Generation System
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Early Access - Confidential
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordProtection;
