import { useState, useEffect, useCallback } from 'react';
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';
import amplifyOutputs from '../amplify_outputs.json';



export const useOrganizationProfileUnified = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [backendStatus, setBackendStatus] = useState('unknown'); // 'unknown', 'available', 'unavailable'

  // Test backend connectivity
  const testBackendConnection = useCallback(async () => {
    try {
      console.log('🔍 Testing backend connectivity...');
      const client = generateClient();
      
      // Try a simple introspection query
      const result = await client.graphql({
        query: `
          query TestConnection {
            listOrganizationProfiles(limit: 1) {
              items {
                id
                organizationName
              }
            }
          }
        `,
        authMode: 'userPool',
      });
      
      console.log('✅ Backend connection successful');
      setBackendStatus('available');
      return true;
    } catch (error) {
      console.log('❌ Backend connection failed:', error.message);
      console.log('❌ Error details:', {
        name: error.name,
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      setBackendStatus('unavailable');
      return false;
    }
  }, []);



  // Fetch profile with fallback strategy
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check authentication
      let currentUser;
      try {
        currentUser = await getCurrentUser();
        setIsAuthenticated(true);
        console.log('✅ User authenticated:', currentUser.userId);
      } catch (authError) {
        console.log('❌ User not authenticated');
        setIsAuthenticated(false);
        setProfile(null);
        setLoading(false);
        return null;
      }

      // Test backend connection
      const backendAvailable = await testBackendConnection();

      if (backendAvailable) {
        try {
          console.log('🔄 Fetching profile from AWS...');
          const client = generateClient();
          
          const result = await client.graphql({
            query: `
              query GetOrganizationProfile {
                listOrganizationProfiles(limit: 1) {
                  items {
                    id
                    organizationName
                    organizationType
                    industry
                    naicsCode
                    naicsDescription
                    customOrganizationType
                    customIndustry
                    primaryContactName
                    primaryContactEmail
                    primaryContactPhone
                    alternateContact1Name
                    alternateContact1Email
                    alternateContact1Phone
                    alternateContact2Name
                    alternateContact2Email
                    alternateContact2Phone
                    primaryAddress
                    city
                    state
                    zipCode
                    country
                    buildingName

                    
                    buildingType
                    numberOfFloors
                    totalOccupancy
                    buildingAge
                    totalSquareFootage
                    building2Name
                    building2Type
                    building2Floors
                    building2Age
                    building2SquareFootage
                    building3Name
                    building3Type
                    building3Floors
                    building3Age
                    building3SquareFootage
                    building4Name
                    building4Type
                    building4Floors
                    building4Age
                    building4SquareFootage
                    building5Name
                    building5Type
                    building5Floors
                    building5Age
                    building5SquareFootage
                    maximumOccupancy
                    averageOccupancyWorkday
                    averageOccupancyOffHours
                    peopleWithDisabilities
                    evacuationRoutes
                    assemblyAreas
                    emergencyContactName
                    emergencyContactPhone
                    emergencyContactEmail
                    otherEmergencyServices
                    nearestHospital
                    nearestFireStation
                    nearestPoliceStation
                    specialConsiderations
                    isOnboardingComplete
                    lastUpdated
                    createdAt
                    updatedAt
                  }
                }
              }
            `,
            authMode: 'userPool',
          });

          const profiles = result.data.listOrganizationProfiles?.items || [];
          
          if (profiles.length > 0) {
            const userProfile = profiles[0];
            console.log('✅ Profile fetched from AWS:', userProfile);
            console.log('🔍 Profile keys from AWS:', Object.keys(userProfile));
            console.log('🏢 Building Name from AWS:', userProfile.buildingName);
            console.log('📐 Total Square Footage from AWS:', userProfile.totalSquareFootage);
            console.log('🏗️ Building Type from AWS:', userProfile.buildingType);
            setProfile(userProfile);

            
            return userProfile;
          } else {
            console.log('ℹ️ No profile found in AWS');
            setProfile(null);
            return null;
          }
        } catch (awsError) {
          console.log('❌ AWS fetch failed:', awsError.message);
          setBackendStatus('unavailable');
          setProfile(null);
          return null;
        }
      } else {
        // Backend unavailable
        console.log('❌ Backend unavailable');
        setBackendStatus('unavailable');
        setProfile(null);
        return null;
      }
    } catch (error) {
      console.error('❌ Error fetching profile:', error);
      setError(error.message);
      setProfile(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [testBackendConnection]);

  // Create profile with fallback strategy
  const createProfile = useCallback(async (profileData) => {
    try {
      setLoading(true);
      setError(null);

      // Check authentication
      let currentUser;
      try {
        currentUser = await getCurrentUser();
        setIsAuthenticated(true);
      } catch (authError) {
        throw new Error('User must be authenticated to create profile');
      }

      // Prepare profile data with proper data type conversion
      const fullProfileData = {
        ...profileData,
        isOnboardingComplete: true,
        lastUpdated: new Date().toISOString(),
      };

      // Ensure organizationName is present (required field)
      if (!fullProfileData.organizationName || fullProfileData.organizationName.trim() === '') {
        console.log('❌ Missing required field: organizationName');
        throw new Error('Organization name is required');
      }

      // Filter out any fields that don't exist in the GraphQL schema
      const validFields = [
        'organizationName', 'organizationType', 'industry', 'naicsCode', 'naicsDescription', 
        'customOrganizationType', 'customIndustry', 'primaryContactName', 'primaryContactEmail', 
        'primaryContactPhone', 'alternateContact1Name', 'alternateContact1Email', 'alternateContact1Phone',
        'alternateContact2Name', 'alternateContact2Email', 'alternateContact2Phone', 'primaryAddress',
        'city', 'state', 'zipCode', 'country', 'buildingName', 'buildingType', 'numberOfFloors', 'totalOccupancy',
        'buildingAge', 'totalSquareFootage', 'building2Name', 'building2Type', 'building2Floors',
        'building2Age', 'building2SquareFootage', 'building3Name', 'building3Type', 'building3Floors',
        'building3Age', 'building3SquareFootage', 'building4Name', 'building4Type', 'building4Floors',
        'building4Age', 'building4SquareFootage', 'building5Name', 'building5Type', 'building5Floors',
        'building5Age', 'building5SquareFootage', 'maximumOccupancy', 'averageOccupancyWorkday',
        'averageOccupancyOffHours', 'peopleWithDisabilities', 'evacuationRoutes', 'assemblyAreas',
        'emergencyContactName', 'emergencyContactPhone', 'emergencyContactEmail', 'otherEmergencyServices',
        'nearestHospital', 'nearestFireStation', 'nearestPoliceStation', 'specialConsiderations',
        'isOnboardingComplete', 'lastUpdated'
      ];

      const filteredData = {};
      Object.keys(fullProfileData).forEach(key => {
        if (validFields.includes(key)) {
          filteredData[key] = fullProfileData[key];
        } else {
          console.log(`⚠️ Filtering out invalid field: ${key}`);
        }
      });

      // Replace fullProfileData with filtered data
      Object.assign(fullProfileData, filteredData);

      // Filter out empty enum values (GraphQL enums don't accept empty strings)
      const enumFields = [
        'organizationType', 'buildingType', 'building2Type', 'building3Type', 'building4Type', 'building5Type'
      ];

      enumFields.forEach(field => {
        if (fullProfileData[field] === '' || fullProfileData[field] === null || fullProfileData[field] === undefined) {
          console.log(`⚠️ Removing empty enum field: ${field}`);
          delete fullProfileData[field];
        }
      });

      // Convert string numbers to integers for GraphQL schema
      const integerFields = [
        'numberOfFloors', 'totalOccupancy', 'buildingAge', 'totalSquareFootage',
        'building2Floors', 'building2Age', 'building2SquareFootage',
        'building3Floors', 'building3Age', 'building3SquareFootage',
        'building4Floors', 'building4Age', 'building4SquareFootage',
        'building5Floors', 'building5Age', 'building5SquareFootage',
        'maximumOccupancy', 'averageOccupancyWorkday', 'averageOccupancyOffHours'
      ];

      integerFields.forEach(field => {
        if (fullProfileData[field] && fullProfileData[field] !== '') {
          const numValue = parseInt(fullProfileData[field], 10);
          if (!isNaN(numValue)) {
            fullProfileData[field] = numValue;
          } else {
            // Remove invalid integer fields
            delete fullProfileData[field];
          }
        } else {
          // Remove empty integer fields
          delete fullProfileData[field];
        }
      });

      console.log('📝 Creating profile with data:', fullProfileData);

      // Test backend connection directly
      console.log('🔍 Testing backend connection for profile creation...');
      const backendAvailable = await testBackendConnection();
      console.log('🔍 Backend available for profile creation:', backendAvailable);
      
      if (backendAvailable) {
        try {
          console.log('🔄 Creating profile in AWS...');
          console.log('📤 Sending data to AWS:', JSON.stringify(fullProfileData, null, 2));
          console.log('📤 Data keys being sent:', Object.keys(fullProfileData));
          console.log('📤 Data types being sent:', Object.fromEntries(
            Object.entries(fullProfileData).map(([key, value]) => [key, typeof value])
          ));
          const client = generateClient();
          
          const result = await client.graphql({
            query: `
              mutation CreateOrganizationProfile($input: CreateOrganizationProfileInput!) {
                createOrganizationProfile(input: $input) {
                  id
                  organizationName
                  organizationType
                  industry
                  naicsCode
                  naicsDescription
                  customOrganizationType
                  customIndustry
                  primaryContactName
                  primaryContactEmail
                  primaryContactPhone
                  alternateContact1Name
                  alternateContact1Email
                  alternateContact1Phone
                  alternateContact2Name
                  alternateContact2Email
                  alternateContact2Phone
                  primaryAddress
                  city
                  state
                  zipCode
                  country
                  buildingName
                  buildingType
                  numberOfFloors
                  totalOccupancy
                  buildingAge
                  totalSquareFootage
                  maximumOccupancy
                  averageOccupancyWorkday
                  averageOccupancyOffHours
                  peopleWithDisabilities
                  evacuationRoutes
                  assemblyAreas
                  emergencyContactName
                  emergencyContactPhone
                  emergencyContactEmail
                  otherEmergencyServices
                  nearestHospital
                  nearestFireStation
                  nearestPoliceStation
                  building2Name
                  building2Type
                  building2Floors
                  building2Age
                  building2SquareFootage
                  building3Name
                  building3Type
                  building3Floors
                  building3Age
                  building3SquareFootage
                  building4Name
                  building4Type
                  building4Floors
                  building4Age
                  building4SquareFootage
                  building5Name
                  building5Type
                  building5Floors
                  building5Age
                  building5SquareFootage
                  specialConsiderations
                  isOnboardingComplete
                  lastUpdated
                  createdAt
                  updatedAt
                }
              }
            `,
            variables: { input: fullProfileData },
            authMode: 'userPool',
          });

          const newProfile = result.data.createOrganizationProfile;
          console.log('✅ Profile created in AWS:', newProfile);
          
          setProfile(newProfile);
          
          return newProfile;
        } catch (awsError) {
          console.log('❌ AWS creation failed:', awsError.message);
          console.log('❌ AWS creation error details:', awsError);
          console.log('❌ AWS creation error type:', typeof awsError);
          console.log('❌ AWS creation error keys:', Object.keys(awsError));
          
          // Enhanced GraphQL error logging
          if (awsError.errors && Array.isArray(awsError.errors)) {
            console.log('❌ GraphQL errors:', awsError.errors);
            console.log('❌ GraphQL errors length:', awsError.errors.length);
            awsError.errors.forEach((error, index) => {
              console.log(`❌ GraphQL error ${index}:`, error);
              console.log(`❌ GraphQL error ${index} message:`, error.message);
              console.log(`❌ GraphQL error ${index} path:`, error.path);
              console.log(`❌ GraphQL error ${index} locations:`, error.locations);
            });
          }
          
          if (awsError.data) {
            console.log('❌ AWS error data:', awsError.data);
          }
          
          // Create a more informative error object
          const enhancedError = new Error();
          enhancedError.message = awsError.message || 'GraphQL operation failed';
          enhancedError.errors = awsError.errors || [];
          enhancedError.data = awsError.data || null;
          enhancedError.originalError = awsError;
          
          setBackendStatus('unavailable');
          throw enhancedError;
        }
      } else {
        // Backend unavailable
        console.log('❌ Backend unavailable');
        setBackendStatus('unavailable');
        throw new Error('Backend is unavailable. Cannot create profile.');
      }
    } catch (error) {
      console.error('❌ Error creating profile:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [backendStatus]);

  // Test function to create minimal profile
  const testMinimalProfile = useCallback(async () => {
    try {
      console.log('🧪 Testing minimal profile creation...');
      const minimalData = {
        organizationName: 'Test Organization',
        isOnboardingComplete: true,
        lastUpdated: new Date().toISOString(),
      };
      
      console.log('🧪 Minimal data:', minimalData);
      const client = generateClient();
      
      const result = await client.graphql({
        query: `
          mutation CreateOrganizationProfile($input: CreateOrganizationProfileInput!) {
            createOrganizationProfile(input: $input) {
              id
              organizationName
              isOnboardingComplete
              lastUpdated
            }
          }
        `,
        variables: { input: minimalData },
        authMode: 'userPool',
      });
      
      console.log('✅ Minimal profile test successful:', result.data.createOrganizationProfile);
      return result.data.createOrganizationProfile;
    } catch (error) {
      console.log('❌ Minimal profile test failed:', error);
      if (error.errors) {
        console.log('❌ Minimal profile GraphQL errors:', error.errors);
      }
      throw error;
    }
  }, []);

  // Update profile with fallback strategy
  const updateProfile = useCallback(async (profileData) => {
    try {
      setLoading(true);
      setError(null);

      if (!profile) {
        throw new Error('No profile to update');
      }

      const updateData = {
        ...profileData,
        lastUpdated: new Date().toISOString(),
      };

      // Convert string numbers to integers for GraphQL schema
      const integerFields = [
        'numberOfFloors', 'totalOccupancy', 'buildingAge', 'totalSquareFootage',
        'building2Floors', 'building2Age', 'building2SquareFootage',
        'building3Floors', 'building3Age', 'building3SquareFootage',
        'building4Floors', 'building4Age', 'building4SquareFootage',
        'building5Floors', 'building5Age', 'building5SquareFootage',
        'maximumOccupancy', 'averageOccupancyWorkday', 'averageOccupancyOffHours'
      ];

      integerFields.forEach(field => {
        if (updateData[field] && updateData[field] !== '') {
          const numValue = parseInt(updateData[field], 10);
          if (!isNaN(numValue)) {
            updateData[field] = numValue;
          } else {
            // Remove invalid integer fields
            delete updateData[field];
          }
        } else {
          // Remove empty integer fields
          delete updateData[field];
        }
      });

      // Filter out empty enum values (GraphQL enums don't accept empty strings)
      const enumFields = [
        'organizationType', 'buildingType', 'building2Type', 'building3Type', 'building4Type', 'building5Type'
      ];

      enumFields.forEach(field => {
        if (updateData[field] === '' || updateData[field] === null || updateData[field] === undefined) {
          console.log(`⚠️ Removing empty enum field: ${field}`);
          delete updateData[field];
        }
      });

      console.log('📝 Updating profile with data:', updateData);

      // Test backend connection directly
      console.log('🔍 Testing backend connection for profile update...');
      const backendAvailable = await testBackendConnection();
      console.log('🔍 Backend available for profile update:', backendAvailable);
      
      if (backendAvailable) {
        try {
          console.log('🔄 Updating profile in AWS...');
          const client = generateClient();
          
          const result = await client.graphql({
            query: `
              mutation UpdateOrganizationProfile($input: UpdateOrganizationProfileInput!) {
                updateOrganizationProfile(input: $input) {
                  id
                  organizationName
                  organizationType
                  industry
                  naicsCode
                  naicsDescription
                  customOrganizationType
                  customIndustry
                  primaryContactName
                  primaryContactEmail
                  primaryContactPhone
                  alternateContact1Name
                  alternateContact1Email
                  alternateContact1Phone
                  alternateContact2Name
                  alternateContact2Email
                  alternateContact2Phone
                  primaryAddress
                  city
                  state
                  zipCode
                  country
                  buildingName
                  buildingType
                  numberOfFloors
                  totalOccupancy
                  buildingAge
                  totalSquareFootage
                  maximumOccupancy
                  averageOccupancyWorkday
                  averageOccupancyOffHours
                  peopleWithDisabilities
                  evacuationRoutes
                  assemblyAreas
                  emergencyContactName
                  emergencyContactPhone
                  emergencyContactEmail
                  otherEmergencyServices
                  nearestHospital
                  nearestFireStation
                  nearestPoliceStation
                  specialConsiderations
                  isOnboardingComplete
                  lastUpdated
                  createdAt
                  updatedAt
                }
              }
            `,
            variables: { 
              input: {
                id: profile.id,
                ...updateData
              }
            },
            authMode: 'userPool',
          });

          const updatedProfile = result.data.updateOrganizationProfile;
          console.log('✅ Profile updated in AWS:', updatedProfile);
          
          setProfile(updatedProfile);
          
          return updatedProfile;
        } catch (awsError) {
          console.log('❌ AWS update failed:', awsError.message);
          setBackendStatus('unavailable');
          throw awsError;
        }
      } else {
        // Backend unavailable
        console.log('❌ Backend unavailable');
        setBackendStatus('unavailable');
        throw new Error('Backend is unavailable. Cannot update profile.');
      }
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [profile, backendStatus]);



  // Initialize on mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    // State
    profile,
    loading,
    error,
    isAuthenticated,
    backendStatus,
    isOnboardingComplete: profile?.isOnboardingComplete || false,
    
    // Actions
    fetchProfile,
    createProfile,
    updateProfile,
    testBackendConnection,
    testMinimalProfile,
  };
};
