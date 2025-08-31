import { useState, useEffect } from 'react';
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

export const useOrganizationProfileREST = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Base URL for your REST API (you would deploy this separately)
  const API_BASE_URL = 'https://your-api-gateway-url.amazonaws.com/prod';

  const getAuthHeaders = async () => {
    try {
      const session = await fetchAuthSession();
      return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.tokens.idToken.toString()}`,
      };
    } catch (error) {
      console.error('Error getting auth headers:', error);
      return {
        'Content-Type': 'application/json',
      };
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
      
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/profiles/${currentUser.userId}`, {
        method: 'GET',
        headers,
      });
      
      if (response.ok) {
        const profileData = await response.json();
        setProfile(profileData);
      } else if (response.status === 404) {
        setProfile(null);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
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
      
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/profiles`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...profileData,
          userId: currentUser.userId,
          isOnboardingComplete: true,
          lastUpdated: new Date().toISOString(),
        }),
      });
      
      if (response.ok) {
        const newProfile = await response.json();
        setProfile(newProfile);
        return newProfile;
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
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

      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/profiles/${profile.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          ...profileData,
          lastUpdated: new Date().toISOString(),
        }),
      });
      
      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        return updatedProfile;
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      console.error('Error updating organization profile:', err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
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
    isOnboardingComplete: profile?.isOnboardingComplete || false,
  };
}; 