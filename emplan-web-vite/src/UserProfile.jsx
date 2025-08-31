import React, { useState, useEffect } from 'react';
import { getCurrentUser, fetchUserAttributes, updateUserAttributes, updatePassword } from 'aws-amplify/auth';
import logo from './epos-logo.png';

function UserProfile({ onBack, onSignOut }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const currentUser = await getCurrentUser();
      const userAttributes = await fetchUserAttributes();
      
      setUser(currentUser);
      setForm({
        firstName: userAttributes.given_name || '',
        lastName: userAttributes.family_name || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Error loading user profile:', error);
      setError('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setMessage('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      // Update name attributes if changed
      const updates = {};
      if (form.firstName !== (user?.attributes?.given_name || '')) {
        updates.given_name = form.firstName;
      }
      if (form.lastName !== (user?.attributes?.family_name || '')) {
        updates.family_name = form.lastName;
      }

      if (Object.keys(updates).length > 0) {
        await updateUserAttributes(updates);
        setMessage('Profile updated successfully!');
      }

      // Update password if provided
      if (form.newPassword) {
        if (form.newPassword !== form.confirmPassword) {
          setError('New passwords do not match');
          setSaving(false);
          return;
        }
        if (form.newPassword.length < 8) {
          setError('Password must be at least 8 characters long');
          setSaving(false);
          return;
        }
        
        await updatePassword({
          oldPassword: form.currentPassword,
          newPassword: form.newPassword
        });
        
        setMessage('Profile and password updated successfully!');
        // Clear password fields
        setForm(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      } else if (Object.keys(updates).length > 0) {
        setMessage('Profile updated successfully!');
      }

      // Reload user profile to get updated attributes
      await loadUserProfile();
      
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.name === 'NotAuthorizedException') {
        setError('Current password is incorrect');
      } else if (error.name === 'InvalidPasswordException') {
        setError('Password does not meet requirements');
      } else {
        setError(`Update failed: ${error.message}`);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = () => {
    if (onSignOut) {
      onSignOut();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            {/* Back Button - Far Left */}
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
            </div>
            
            {/* Logo - Center */}
            <div className="flex items-center justify-center flex-1">
              <img src={logo} alt="EPOS Logo" className="h-24 w-auto object-contain" />
            </div>
            
            {/* Sign Out - Right */}
            <div className="flex items-center">
              <button 
                onClick={handleSignOut}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Update Profile</h1>
          
          {/* Success/Error Messages */}
          {message && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-800">{message}</p>
            </div>
          )}
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
            </div>

            {/* Password Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Change Password</h2>
              <p className="text-sm text-gray-600 mb-4">
                Leave password fields blank if you don't want to change your password.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={form.currentPassword}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your current password"
                  />
                </div>
                
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your new password"
                  />
                  <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters long</p>
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Confirm your new password"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserProfile; 