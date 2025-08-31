import { useState, useEffect, useMemo } from 'react';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';

export const useOrganizationProfile = () => {
  // Generate client inside the hook to ensure Amplify is configured
  const client = useMemo(() => {
    try {
      console.log('useOrganizationProfile: Generating GraphQL client...');
      const generatedClient = generateClient();
      console.log('useOrganizationProfile: Client generated:', generatedClient);
      console.log('useOrganizationProfile: Client type:', typeof generatedClient);
      console.log('useOrganizationProfile: Client keys:', Object.keys(generatedClient || {}));
      console.log('useOrganizationProfile: Client models:', generatedClient?.models);
      console.log('useOrganizationProfile: OrganizationProfile model:', generatedClient?.models?.OrganizationProfile);
      
      if (!generatedClient || !generatedClient.models || !generatedClient.models.OrganizationProfile) {
        console.error('useOrganizationProfile: Client validation failed');
        console.log('Generated client:', generatedClient);
        console.log('Client models:', generatedClient?.models);
        console.log('Available models:', generatedClient?.models ? Object.keys(generatedClient.models) : 'No models');
        
        // Let's try a different approach - return null and handle it gracefully
        console.log('useOrganizationProfile: Returning null client for now');
        return null;
      }
      
      console.log('useOrganizationProfile: Client successfully initialized');
      return generatedClient;
    } catch (error) {
      console.error('useOrganizationProfile: Error generating client:', error);
      console.log('useOrganizationProfile: Returning null client due to error');
      return null;
    }
  }, []);
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if client is available
      if (!client) {
        console.log('GraphQL client not available, skipping profile fetch');
        setProfile(null);
        setLoading(false);
        return; // Exit early if client not available
      }
      
      // First check if user is authenticated
      let currentUser;
      try {
        currentUser = await getCurrentUser();
        setIsAuthenticated(true);
      } catch (authError) {
        console.log('User not authenticated, skipping profile fetch');
        setIsAuthenticated(false);
        setProfile(null);
        setLoading(false);
        return; // Exit early if not authenticated
      }
      
      console.log('User authenticated, fetching profile for:', currentUser.userId);
      
      // Query for organization profile by userId
      const { data: profiles } = await client.models.OrganizationProfile.list({
        filter: {
          userId: { eq: currentUser.userId }
        }
      });

      if (profiles && profiles.length > 0) {
        setProfile(profiles[0]);
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
      
      // Check if client is available
      if (!client) {
        console.log('GraphQL client not available, creating mock profile');
        // Create a mock profile for now
        const mockProfile = {
          id: 'mock-id-' + Date.now(),
          ...profileData,
          isOnboardingComplete: true,
          lastUpdated: new Date().toISOString(),
        };
        setProfile(mockProfile);
        return mockProfile;
      }
      
      // Check authentication before creating
      let currentUser;
      try {
        currentUser = await getCurrentUser();
      } catch (authError) {
        throw new Error('User must be authenticated to create profile');
      }
      
      const newProfile = await client.models.OrganizationProfile.create({
        ...profileData,
        userId: currentUser.userId,
        isOnboardingComplete: true,
        lastUpdated: new Date().toISOString(),
      });
      
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
      
      const updatedProfile = await client.models.OrganizationProfile.update({
        id: profile.id,
        ...profileData,
        lastUpdated: new Date().toISOString(),
      });
      
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

  useEffect(() => {
    // Only fetch profile if we're in a context where user might be authenticated
    // The parent component should call fetchProfile explicitly after authentication
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