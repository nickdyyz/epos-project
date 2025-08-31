import { useState, useEffect } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';

const STORAGE_KEY = 'emplan_organization_profiles';

export const useOrganizationProfileLocal = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Helper to get all profiles from localStorage
  const getAllProfiles = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return {};
    }
  };

  // Helper to save profiles to localStorage
  const saveProfiles = (profiles) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if user is authenticated
      let currentUser;
      try {
        currentUser = await getCurrentUser();
        setIsAuthenticated(true);
      } catch (authError) {
        console.log('User not authenticated, skipping profile fetch');
        setIsAuthenticated(false);
        setProfile(null);
        setLoading(false);
        return;
      }
      
      console.log('User authenticated, fetching profile for:', currentUser.userId);
      
      // Get profiles from localStorage
      const profiles = getAllProfiles();
      const userProfile = profiles[currentUser.userId];
      
      if (userProfile) {
        setProfile(userProfile);
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error('Error fetching organization profile:', err);
      setError(err);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Check authentication before creating
      let currentUser;
      try {
        currentUser = await getCurrentUser();
      } catch (authError) {
        throw new Error('User must be authenticated to create profile');
      }
      
      const newProfile = {
        id: 'local-' + Date.now(),
        ...profileData,
        userId: currentUser.userId,
        isOnboardingComplete: true,
        lastUpdated: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
      
      // Save to localStorage
      const profiles = getAllProfiles();
      profiles[currentUser.userId] = newProfile;
      saveProfiles(profiles);
      
      setProfile(newProfile);
      return newProfile;
    } catch (err) {
      console.error('Error creating organization profile:', err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);

      if (!profile) {
        throw new Error('No profile to update');
      }

      const updatedProfile = {
        ...profile,
        ...profileData,
        lastUpdated: new Date().toISOString(),
      };
      
      // Save to localStorage
      const profiles = getAllProfiles();
      profiles[profile.userId] = updatedProfile;
      saveProfiles(profiles);
      
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      console.error('Error updating organization profile:', err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Clear all profiles (useful for testing)
  const clearAllProfiles = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProfile(null);
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  return {
    profile,
    loading,
    error,
    isAuthenticated,
    fetchProfile,
    createProfile,
    updateProfile,
    clearAllProfiles,
    isOnboardingComplete: profile?.isOnboardingComplete || false,
  };
}; 