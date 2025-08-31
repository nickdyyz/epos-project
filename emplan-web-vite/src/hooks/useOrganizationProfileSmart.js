import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import { getCurrentUser } from 'aws-amplify/auth';
import type { Schema } from '../../../amplify/data/resource';

const client = generateClient<Schema>();

export const useOrganizationProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useMockData, setUseMockData] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (useMockData) {
        // Use mock data from localStorage
        const savedProfile = localStorage.getItem('mockOrganizationProfile');
        if (savedProfile) {
          setProfile(JSON.parse(savedProfile));
        } else {
          setProfile(null);
        }
      } else {
        // Try real AWS first
        try {
          const currentUser = await getCurrentUser();
          
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
        } catch (awsError) {
          console.log('AWS profile fetch failed, switching to mock mode:', awsError);
          setUseMockData(true);
          
          // Fallback to mock data
          const savedProfile = localStorage.getItem('mockOrganizationProfile');
          if (savedProfile) {
            setProfile(JSON.parse(savedProfile));
          } else {
            setProfile(null);
          }
        }
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
      
      if (useMockData) {
        // Create mock profile
        const newProfile = {
          id: 'mock-profile-' + Date.now(),
          ...profileData,
          userId: 'mock-user-id',
          isOnboardingComplete: true,
          lastUpdated: new Date().toISOString(),
        };
        
        localStorage.setItem('mockOrganizationProfile', JSON.stringify(newProfile));
        setProfile(newProfile);
        return newProfile;
      } else {
        // Try real AWS first
        try {
          const currentUser = await getCurrentUser();
          
          const newProfile = await client.models.OrganizationProfile.create({
            ...profileData,
            userId: currentUser.userId,
            isOnboardingComplete: true,
            lastUpdated: new Date().toISOString(),
          });
          
          setProfile(newProfile);
          return newProfile;
        } catch (awsError) {
          console.log('AWS profile creation failed, switching to mock mode:', awsError);
          setUseMockData(true);
          
          // Fallback to mock creation
          const newProfile = {
            id: 'mock-profile-' + Date.now(),
            ...profileData,
            userId: 'mock-user-id',
            isOnboardingComplete: true,
            lastUpdated: new Date().toISOString(),
          };
          
          localStorage.setItem('mockOrganizationProfile', JSON.stringify(newProfile));
          setProfile(newProfile);
          return newProfile;
        }
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
      
      if (useMockData) {
        // Update mock profile
        const updatedProfile = {
          ...profile,
          ...profileData,
          lastUpdated: new Date().toISOString(),
        };
        
        localStorage.setItem('mockOrganizationProfile', JSON.stringify(updatedProfile));
        setProfile(updatedProfile);
        return updatedProfile;
      } else {
        // Try real AWS first
        try {
          const updatedProfile = await client.models.OrganizationProfile.update({
            id: profile.id,
            ...profileData,
            lastUpdated: new Date().toISOString(),
          });
          
          setProfile(updatedProfile);
          return updatedProfile;
        } catch (awsError) {
          console.log('AWS profile update failed, switching to mock mode:', awsError);
          setUseMockData(true);
          
          // Fallback to mock update
          const updatedProfile = {
            ...profile,
            ...profileData,
            lastUpdated: new Date().toISOString(),
          };
          
          localStorage.setItem('mockOrganizationProfile', JSON.stringify(updatedProfile));
          setProfile(updatedProfile);
          return updatedProfile;
        }
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
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    createProfile,
    updateProfile,
    isOnboardingComplete: profile?.isOnboardingComplete || false,
    useMockData,
  };
}; 