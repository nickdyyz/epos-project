import React, { useState, useEffect, useCallback } from 'react';
import { getCurrentUser, signOut, fetchUserAttributes } from 'aws-amplify/auth';
import logo from './epos-logo.png';
import { useOrganizationProfileUnified } from './hooks/useOrganizationProfileUnified';
import OrganizationTypeSelector from './components/OrganizationTypeSelector';
import AddressAutocomplete from './components/AddressAutocomplete';
import { COUNTRIES, usesZipCode, getPostalCodePlaceholder } from './data/countries';

function Onboarding({ onComplete, onSignOut, hideHeader = false }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [showAlternateContact1, setShowAlternateContact1] = useState(false);
  const [showAlternateContact2, setShowAlternateContact2] = useState(false);
  
  // Dynamic subsection states for Step 3
  const [showBuildingInfo, setShowBuildingInfo] = useState(false);
  const [showOccupancyAccessibility, setShowOccupancyAccessibility] = useState(false);
  
  // Additional buildings states
  const [showBuilding2, setShowBuilding2] = useState(false);
  const [showBuilding3, setShowBuilding3] = useState(false);
  const [showBuilding4, setShowBuilding4] = useState(false);
  const [showBuilding5, setShowBuilding5] = useState(false);
  const [useCityOnly, setUseCityOnly] = useState(false);
  
  // Use the organization profile hook
  const { createProfile, loading, backendStatus } = useOrganizationProfileUnified();
  
  const [formData, setFormData] = useState({
    // Basic Organization Information
    organizationName: '',
    organizationType: '',
    industry: '',
    naicsCode: '',
    naicsDescription: '',
    customOrganizationType: '',
    customIndustry: '',
    
    // Contact Information
    primaryContactName: '',
    primaryContactEmail: '',
    primaryContactPhone: '',
    alternateContact1Name: '',
    alternateContact1Email: '',
    alternateContact1Phone: '',
    alternateContact2Name: '',
    alternateContact2Email: '',
    alternateContact2Phone: '',
    
    // Location Information
    primaryAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Canada',
    
    // Primary Building Information
    buildingName: '',
    buildingType: '',
    numberOfFloors: '',
    totalOccupancy: '',
    buildingAge: '',
    totalSquareFootage: '',
    
    // Additional Buildings (up to 5)
    building2Name: '',
    building2Type: '',
    building2Floors: '',
    building2Age: '',
    building2SquareFootage: '',
    
    building3Name: '',
    building3Type: '',
    building3Floors: '',
    building3Age: '',
    building3SquareFootage: '',
    
    building4Name: '',
    building4Type: '',
    building4Floors: '',
    building4Age: '',
    building4SquareFootage: '',
    
    building5Name: '',
    building5Type: '',
    building5Floors: '',
    building5Age: '',
    building5SquareFootage: '',
    
    // Occupancy & Accessibility Information
    maximumOccupancy: '',
    averageOccupancyWorkday: '',
    averageOccupancyOffHours: '',
    peopleWithDisabilities: '',
    evacuationRoutes: '',
    assemblyAreas: '',
    
    // Emergency Information
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactEmail: '',
    otherEmergencyServices: '',
    nearestHospital: '',
    nearestFireStation: '',
    nearestPoliceStation: '',
    
    // Additional Information
    specialConsiderations: '',
  });

  const totalSteps = 6;

  useEffect(() => {
    const getUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        
        // Fetch user attributes to ensure we have the latest data including names
        try {
          const userAttributes = await fetchUserAttributes();
          console.log('Onboarding: User attributes:', userAttributes);
          // Update user object with attributes
          const userWithAttributes = {
            ...currentUser,
            attributes: userAttributes
          };
          setUser(userWithAttributes);
          
          // Pre-populate primary contact with current user information
          setFormData(prev => ({
            ...prev,
            primaryContactName: `${userAttributes.givenName || ''} ${userAttributes.familyName || ''}`.trim(),
            primaryContactEmail: userAttributes.email || '',
          }));
        } catch (attrError) {
          console.log('Onboarding: Could not fetch user attributes, using basic user object:', attrError);
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Error getting current user:', error);
      }
    };
    getUser();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleOrganizationTypeChange = useCallback((e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      organizationType: value,
      industry: '',
      naicsCode: '',
      naicsDescription: ''
    }));
    setError('');
  }, []);

  const handleIndustryChange = useCallback((industryCode) => {
    setFormData(prev => ({
      ...prev,
      industry: industryCode,
      naicsCode: industryCode,
      naicsDescription: industryCode
    }));
    setError('');
  }, []);

  const handleSubcategoryChange = useCallback((subcategoryCode) => {
    setFormData(prev => ({
      ...prev,
      naicsCode: subcategoryCode,
      naicsDescription: subcategoryCode
    }));
    setError('');
  }, []);

  const handleCustomOrganizationTypeChange = useCallback((customType) => {
    setFormData(prev => ({
      ...prev,
      customOrganizationType: customType
    }));
    setError('');
  }, []);

  const handleCustomIndustryChange = useCallback((customIndustry) => {
    setFormData(prev => ({
      ...prev,
      customIndustry: customIndustry
    }));
    setError('');
  }, []);

  // Dynamic subsection handlers for Step 3
  const handleShowBuildingInfo = () => {
    setShowBuildingInfo(true);
  };

  const handleShowOccupancyAccessibility = () => {
    setShowOccupancyAccessibility(true);
  };

  // Additional buildings handlers
  const handleShowBuilding2 = () => {
    setShowBuilding2(true);
  };

  const handleShowBuilding3 = () => {
    setShowBuilding3(true);
  };

  const handleShowBuilding4 = () => {
    setShowBuilding4(true);
  };

  const handleShowBuilding5 = () => {
    setShowBuilding5(true);
  };

  const handleToggleCityOnly = () => {
    setUseCityOnly(!useCityOnly);
    // Clear primary address when switching to city-only mode
    if (!useCityOnly) {
      setFormData(prev => ({
        ...prev,
        primaryAddress: ''
      }));
    }
  };

  const handleAddAlternateContact1 = () => {
    setShowAlternateContact1(true);
  };

  const handleAddAlternateContact2 = () => {
    setShowAlternateContact2(true);
  };

  const handleRemoveAlternateContact1 = () => {
    setShowAlternateContact1(false);
    setFormData(prev => ({
      ...prev,
      alternateContact1Name: '',
      alternateContact1Email: '',
      alternateContact1Phone: ''
    }));
  };

  const handleRemoveAlternateContact2 = () => {
    setShowAlternateContact2(false);
    setFormData(prev => ({
      ...prev,
      alternateContact2Name: '',
      alternateContact2Email: '',
      alternateContact2Phone: ''
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      console.log('🚀 Onboarding: Starting profile creation...');
      console.log('Current step:', currentStep);
      console.log('Total steps:', totalSteps);
      console.log('Form data:', formData);
      console.log('Form data keys:', Object.keys(formData));
      console.log('Organization name:', formData.organizationName);
      console.log('Organization type:', formData.organizationType);
      console.log('Primary contact name:', formData.primaryContactName);
      console.log('Primary contact email:', formData.primaryContactEmail);
      console.log('Industry:', formData.industry);
      console.log('Primary address:', formData.primaryAddress);
      console.log('City:', formData.city);
      console.log('State:', formData.state);
      console.log('Emergency contact name:', formData.emergencyContactName);
      console.log('Emergency contact phone:', formData.emergencyContactPhone);
      
      // Add validation debugging
      console.log('=== FORM VALIDATION DEBUG ===');
      console.log('Step 1 valid:', isStepValid(1));
      console.log('Step 2 valid:', isStepValid(2));
      console.log('Step 3 valid:', isStepValid(3));
      console.log('Step 4 valid:', isStepValid(4));
      console.log('Step 5 valid:', isStepValid(5));
      console.log('Step 6 valid:', isStepValid(6));
      console.log('Current step:', currentStep);
      console.log('Total steps:', totalSteps);
      console.log('=== END VALIDATION DEBUG ===');
      
      // Check if all required fields are filled
      console.log('=== REQUIRED FIELDS CHECK ===');
      console.log('organizationName filled:', !!formData.organizationName);
      console.log('organizationType filled:', !!formData.organizationType);
      console.log('primaryContactName filled:', !!formData.primaryContactName);
      console.log('primaryContactEmail filled:', !!formData.primaryContactEmail);
      console.log('primaryAddress filled:', !!formData.primaryAddress);
      console.log('city filled:', !!formData.city);
      console.log('emergencyContactName filled:', !!formData.emergencyContactName);
      console.log('emergencyContactPhone filled:', !!formData.emergencyContactPhone);
      console.log('=== END REQUIRED FIELDS CHECK ===');
      
      // Validate that we have the minimum required data
      if (!formData.organizationName || !formData.organizationType) {
        throw new Error('Organization name and type are required');
      }
      
      if (!formData.primaryContactName || !formData.primaryContactEmail) {
        throw new Error('Primary contact name and email are required');
      }
      
      if (!formData.city) {
        throw new Error('City is required');
      }
      
      console.log('✅ Validation passed, creating profile...');
      const result = await createProfile(formData);
      console.log('✅ Onboarding: Profile created successfully:', result);
      
      // Show immediate success feedback
      alert('✅ Organization profile created successfully! Redirecting to dashboard...');
      
      // Only call onComplete if profile creation was successful
      if (onComplete) {
        console.log('🔄 Calling onComplete immediately...');
        onComplete();
      }
    } catch (error) {
      console.error('❌ Onboarding: Failed to create profile:', error);
      
      // Extract detailed error information
      let errorMessage = 'Unknown error occurred';
      
      if (error.errors && Array.isArray(error.errors) && error.errors.length > 0) {
        // GraphQL errors
        const graphQLErrors = error.errors.map(err => err.message).join(', ');
        errorMessage = `GraphQL Error: ${graphQLErrors}`;
        console.error('❌ GraphQL Errors:', error.errors);
      } else if (error.message) {
        // Regular error message
        errorMessage = error.message;
      }
      
      // Log the full error object for debugging
      console.error('❌ Full error object:', JSON.stringify(error, null, 2));
      
      alert(`Failed to create organization profile: ${errorMessage}`);
      // Don't call onComplete if there was an error
    }
  };

  const handleSkip = async () => {
    console.log('Skip button clicked - creating minimal profile...');
    console.log('=== SKIP DEBUG ===');
    console.log('Current form data when skipping:', formData);
    console.log('Current step when skipping:', currentStep);
    console.log('=== END SKIP DEBUG ===');
    try {
      // Create a minimal profile when user skips onboarding
      const minimalProfile = {
        organizationName: 'Organization',
        organizationType: 'Other',
        isOnboardingComplete: true,
        lastUpdated: new Date().toISOString(),
      };
      
      console.log('Creating minimal profile:', minimalProfile);
      await createProfile(minimalProfile);
      console.log('Minimal profile created successfully');
      
      // Show immediate success feedback
      alert('✅ Minimal profile created successfully! Redirecting to dashboard...');
      
      if (onComplete) {
        console.log('Calling onComplete callback immediately...');
        onComplete();
      }
    } catch (error) {
      console.error('Error creating minimal profile:', error);
      // If creating profile fails, still try to complete onboarding
      if (onComplete) {
        console.log('Profile creation failed, but calling onComplete anyway...');
        onComplete();
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      if (onSignOut) {
        onSignOut();
      }
    } catch (error) {
      console.error('Sign-out error:', error);
    }
  };

  const isStepValid = (step) => {
    switch (step) {
      case 1:
        // For Step 1, we need organization name and type
        const hasBasicInfo = formData.organizationName && formData.organizationType;
        if (!hasBasicInfo) return false;
        
        // If organization type is "Other", industry is optional
        if (formData.organizationType === 'Other') {
          return true;
        }
        
        // For other organization types, industry is required
        return formData.industry;
      case 2:
        return formData.primaryContactName && formData.primaryContactEmail;
              case 3:
        // City is always required
        if (!formData.city) return false;
        
        // Country is always required (for both city-only and full address modes)
        if (!formData.country) return false;
        
        // If using complete address mode (not city-only), then state and zip/postal code are required
        if (!useCityOnly) {
          const hasRequiredLocationFields = formData.state && formData.zipCode;
          if (!hasRequiredLocationFields) return false;
        }
        
        // If occupancy & accessibility section is shown, maximum occupancy is required
        if (showOccupancyAccessibility && !formData.maximumOccupancy) {
          return false;
        }
        
        // City-only mode only requires city and country
        return true;
      case 4:
        return true; // All fields are optional in Emergency Services step
      case 5:
        return true; // Optional information
      case 6:
        return true; // Summary step - always valid for review
      default:
        return false;
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Organization Information</h3>
        <p className="text-gray-600 mb-6">Let's start with the basics about your organization.</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Organization Name *
          </label>
          <input
            type="text"
            name="organizationName"
            value={formData.organizationName}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your organization name"
            required
          />
        </div>

        <OrganizationTypeSelector
          value={formData.organizationType}
          onChange={handleOrganizationTypeChange}
          onIndustryChange={handleIndustryChange}
          onSubcategoryChange={handleSubcategoryChange}
          onCustomOrganizationType={handleCustomOrganizationTypeChange}
          onCustomIndustry={handleCustomIndustryChange}
          industryValue={formData.industry}
          subcategoryValue={formData.naicsCode}
          customOrganizationType={formData.customOrganizationType}
          customIndustry={formData.customIndustry}
          required={true}
          className="space-y-4"
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Primary Contact Information</h3>
        <p className="text-gray-600 mb-6">Who should we contact for emergency plan matters?</p>
      </div>
      
      <div className="space-y-4">
        {/* Primary Contact */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Primary Contact Name *
          </label>
          <input
            type="text"
            name="primaryContactName"
            value={formData.primaryContactName}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Full name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Primary Contact Email *
          </label>
          <input
            type="email"
            name="primaryContactEmail"
            value={formData.primaryContactEmail}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="email@organization.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Primary Contact Phone
          </label>
          <input
            type="tel"
            name="primaryContactPhone"
            value={formData.primaryContactPhone}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="(555) 123-4567"
          />
        </div>

        {/* Alternate Contact 1 */}
        {!showAlternateContact1 && !showAlternateContact2 && (
          <div className="border-t pt-4">
            <button
              type="button"
              onClick={handleAddAlternateContact1}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add an additional contact
            </button>
          </div>
        )}

        {showAlternateContact1 && (
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-md font-medium text-gray-900">Alternate Contact 1</h4>
              <button
                type="button"
                onClick={handleRemoveAlternateContact1}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Remove
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alternate Contact 1 Name
                </label>
                <input
                  type="text"
                  name="alternateContact1Name"
                  value={formData.alternateContact1Name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alternate Contact 1 Email
                </label>
                <input
                  type="email"
                  name="alternateContact1Email"
                  value={formData.alternateContact1Email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="email@organization.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alternate Contact 1 Phone
                </label>
                <input
                  type="tel"
                  name="alternateContact1Phone"
                  value={formData.alternateContact1Phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            {/* Add second alternate contact button */}
            {!showAlternateContact2 && (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleAddAlternateContact2}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add another contact
                </button>
              </div>
            )}
          </div>
        )}

        {/* Alternate Contact 2 */}
        {showAlternateContact2 && (
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-md font-medium text-gray-900">Alternate Contact 2</h4>
              <button
                type="button"
                onClick={handleRemoveAlternateContact2}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Remove
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alternate Contact 2 Name
                </label>
                <input
                  type="text"
                  name="alternateContact2Name"
                  value={formData.alternateContact2Name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alternate Contact 2 Email
                </label>
                <input
                  type="email"
                  name="alternateContact2Email"
                  value={formData.alternateContact2Email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="email@organization.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alternate Contact 2 Phone
                </label>
                <input
                  type="tel"
                  name="alternateContact2Phone"
                  value={formData.alternateContact2Phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Helper function to render additional building forms
  const renderAdditionalBuilding = (buildingNumber, showState, setShowState, handleShow) => {
    const buildingPrefix = `building${buildingNumber}`;
    const buildingName = formData[`${buildingPrefix}Name`];
    const buildingType = formData[`${buildingPrefix}Type`];
    const buildingFloors = formData[`${buildingPrefix}Floors`];
    const buildingAge = formData[`${buildingPrefix}Age`];
    const buildingSquareFootage = formData[`${buildingPrefix}SquareFootage`];
    
    return (
      <div key={buildingNumber}>
        {!showState && (
          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-md font-medium text-gray-900">Additional Building {buildingNumber}</h4>
                <p className="text-sm text-gray-600">Add information about your {buildingNumber === 2 ? 'second' : buildingNumber === 3 ? 'third' : buildingNumber === 4 ? 'fourth' : 'fifth'} building</p>
              </div>
              <button
                type="button"
                onClick={handleShow}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Add Building {buildingNumber}
              </button>
            </div>
          </div>
        )}

        {showState && (
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-medium text-gray-900">Additional Building {buildingNumber}</h4>
              <button
                type="button"
                onClick={() => setShowState(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="sr-only">Hide building {buildingNumber} information</span>
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Building Name
                </label>
                <input
                  type="text"
                  name={`${buildingPrefix}Name`}
                  value={buildingName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`Building ${buildingNumber} name`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Building Type
                </label>
                <select
                  name={`${buildingPrefix}Type`}
                  value={buildingType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select building type</option>
                  <option value="SingleStory">Single Story</option>
                  <option value="MultiStory">Multi-Story</option>
                  <option value="HighRise">High-Rise</option>
                  <option value="Campus">Campus</option>
                  <option value="Industrial">Industrial</option>
                  <option value="Warehouse">Warehouse</option>
                  <option value="Retail">Retail</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Educational">Educational</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Floors
                  </label>
                  <input
                    type="number"
                    name={`${buildingPrefix}Floors`}
                    value={buildingFloors}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 5"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Building Age (years)
                  </label>
                  <input
                    type="number"
                    name={`${buildingPrefix}Age`}
                    value={buildingAge}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 25"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Square Footage
                  </label>
                  <input
                    type="number"
                    name={`${buildingPrefix}SquareFootage`}
                    value={buildingSquareFootage}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 50000"
                    min="1"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Location Information</h3>
        <p className="text-gray-600 mb-6">What is the primary operational location</p>
      </div>
      
      {/* Address Mode Toggle */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-md font-medium text-gray-900">Address Mode</h4>
            <p className="text-sm text-gray-600">
              Choose how detailed your location information should be
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`text-sm font-medium ${useCityOnly ? 'text-blue-600' : 'text-gray-500'}`}>
              City Only
            </span>
            <button
              type="button"
              onClick={handleToggleCityOnly}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                useCityOnly ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  useCityOnly ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${!useCityOnly ? 'text-blue-600' : 'text-gray-500'}`}>
              Complete Address
            </span>
          </div>
        </div>
        
        {useCityOnly && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>City Only Mode:</strong> You'll only need to provide city and country. 
              This may impact the accuracy of emergency planning but allows for faster setup.
            </p>
          </div>
        )}
        
        {!useCityOnly && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-800">
              Providing a complete address allows the system to generate a more accurate emergency plan.
            </p>
          </div>
        )}
      </div>
      
      {/* Location Fields */}
      <div className="space-y-4">
        {/* Primary Address - Only show in Complete Address mode */}
        {!useCityOnly && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Address *
            </label>
            <AddressAutocomplete
              value={formData.primaryAddress}
              onChange={handleInputChange}
              placeholder="Enter specific street address"
            />
            <p className="mt-1 text-sm text-gray-500">
              Enter a specific street address for autocomplete
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City *
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="City"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Province/State {!useCityOnly ? '*' : '(Optional)'}
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Province/State"
              disabled={useCityOnly}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {usesZipCode(formData.country) ? 'Zip Code' : 'Postal Code'} {!useCityOnly ? '*' : '(Optional)'}
            </label>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={getPostalCodePlaceholder(formData.country)}
              disabled={useCityOnly}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country *
            </label>
            <select
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select country</option>
              {COUNTRIES.map((country) => (
                <option key={country.code} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Building Information Subsection */}
      {!showBuildingInfo && (
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-md font-medium text-gray-900">Building Information</h4>
              <p className="text-sm text-gray-600">Tell us about your building structure and characteristics</p>
            </div>
            <button
              type="button"
              onClick={handleShowBuildingInfo}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add Building Info
            </button>
          </div>
        </div>
      )}

      {showBuildingInfo && (
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-medium text-gray-900">Building Information</h4>
            <button
              type="button"
              onClick={() => setShowBuildingInfo(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <span className="sr-only">Hide building information</span>
              ✕
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Building Name
              </label>
              <input
                type="text"
                name="buildingName"
                value={formData.buildingName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Building name (e.g., Main Office Building)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Building Type
              </label>
              <select
                name="buildingType"
                value={formData.buildingType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select building type</option>
                <option value="SingleStory">Single Story</option>
                <option value="MultiStory">Multi-Story</option>
                <option value="HighRise">High-Rise</option>
                <option value="Campus">Campus</option>
                <option value="Industrial">Industrial</option>
                <option value="Warehouse">Warehouse</option>
                <option value="Retail">Retail</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Educational">Educational</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Floors
                </label>
                <input
                  type="number"
                  name="numberOfFloors"
                  value={formData.numberOfFloors}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 5"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Building Age (years)
                </label>
                <input
                  type="number"
                  name="buildingAge"
                  value={formData.buildingAge}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 25"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Square Footage
                </label>
                <input
                  type="number"
                  name="totalSquareFootage"
                  value={formData.totalSquareFootage || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 50000"
                  min="1"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Additional Buildings - Progressive Display */}
      {showBuildingInfo && (
        <>
          {/* Show Building 2 if primary building has some data */}
          {(formData.buildingType || formData.numberOfFloors || formData.buildingAge || formData.totalSquareFootage) && 
            renderAdditionalBuilding(2, showBuilding2, setShowBuilding2, handleShowBuilding2)
          }
          
          {/* Show Building 3 if Building 2 has some data */}
          {((formData.building2Name || formData.building2Type || formData.building2Floors || formData.building2Age || formData.building2SquareFootage) || showBuilding2) && 
            renderAdditionalBuilding(3, showBuilding3, setShowBuilding3, handleShowBuilding3)
          }
          
          {/* Show Building 4 if Building 3 has some data */}
          {((formData.building3Name || formData.building3Type || formData.building3Floors || formData.building3Age || formData.building3SquareFootage) || showBuilding3) && 
            renderAdditionalBuilding(4, showBuilding4, setShowBuilding4, handleShowBuilding4)
          }
          
          {/* Show Building 5 if Building 4 has some data */}
          {((formData.building4Name || formData.building4Type || formData.building4Floors || formData.building4Age || formData.building4SquareFootage) || showBuilding4) && 
            renderAdditionalBuilding(5, showBuilding5, setShowBuilding5, handleShowBuilding5)
          }
        </>
      )}

      {/* Occupancy & Accessibility Subsection */}
      {!showOccupancyAccessibility && (
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-md font-medium text-gray-900">Occupancy & Accessibility</h4>
              <p className="text-sm text-gray-600">Critical information for emergency planning and evacuation</p>
            </div>
            <button
              type="button"
              onClick={handleShowOccupancyAccessibility}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Add Occupancy Info
            </button>
          </div>
        </div>
      )}

      {showOccupancyAccessibility && (
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-medium text-gray-900">Occupancy & Accessibility</h4>
            <button
              type="button"
              onClick={() => setShowOccupancyAccessibility(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <span className="sr-only">Hide occupancy information</span>
              ✕
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Occupancy Information */}
            <div>
              <h5 className="text-sm font-medium text-gray-900 mb-3">Occupancy Information</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Occupancy *
                  </label>
                  <input
                    type="number"
                    name="maximumOccupancy"
                    value={formData.maximumOccupancy}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Legal capacity"
                    min="1"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">As determined by local fire code</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Average Occupancy (Workday)
                  </label>
                  <input
                    type="number"
                    name="averageOccupancyWorkday"
                    value={formData.averageOccupancyWorkday}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Typical workday"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Average Occupancy (Off-hours)
                  </label>
                  <input
                    type="number"
                    name="averageOccupancyOffHours"
                    value={formData.averageOccupancyOffHours}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Evenings/weekends"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Accessibility Information */}
            <div>
              <h5 className="text-sm font-medium text-gray-900 mb-3">Accessibility & Special Needs</h5>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Privacy Notice</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>This information is confidential and will be handled with extreme care to maintain privacy. It is critical for emergency planning and evacuation assistance.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  People with Disabilities or Special Needs
                </label>
                <textarea
                  name="peopleWithDisabilities"
                  value={formData.peopleWithDisabilities}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe any individuals who may need assistance during evacuation (e.g., wheelchair users, hearing impaired, elderly, etc.). This information is confidential."
                />
                <p className="mt-1 text-xs text-gray-500">Include type of assistance needed, location, and any specific requirements</p>
              </div>
            </div>

            {/* Evacuation Information */}
            <div>
              <h5 className="text-sm font-medium text-gray-900 mb-3">Evacuation Planning</h5>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Designated Evacuation Routes
                  </label>
                  <textarea
                    name="evacuationRoutes"
                    value={formData.evacuationRoutes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe primary and secondary evacuation routes, or reference floor plan locations"
                  />
                  <p className="mt-1 text-xs text-gray-500">Include primary and secondary routes, accessible routes, and any special considerations</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assembly Areas
                  </label>
                  <textarea
                    name="assemblyAreas"
                    value={formData.assemblyAreas}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe designated outdoor meeting spots for headcount and emergency coordination"
                  />
                  <p className="mt-1 text-xs text-gray-500">Include primary and secondary assembly points, accessible areas, and distance from building</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Services</h3>
        <p className="text-gray-600 mb-6">Information about nearby emergency services for coordination during incidents.</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nearest Hospital
          </label>
          <input
            type="text"
            name="nearestHospital"
            value={formData.nearestHospital}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Hospital name and address"
          />
          <p className="mt-1 text-sm text-gray-500">Include name, address, and contact information if available</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nearest Fire Station
          </label>
          <input
            type="text"
            name="nearestFireStation"
            value={formData.nearestFireStation}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Fire station name and address"
          />
          <p className="mt-1 text-sm text-gray-500">Include name, address, and contact information if available</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nearest Police Station
          </label>
          <input
            type="text"
            name="nearestPoliceStation"
            value={formData.nearestPoliceStation}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Police station name and address"
          />
          <p className="mt-1 text-sm text-gray-500">Include name, address, and contact information if available</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Other Emergency Services (Optional)
          </label>
          <textarea
            name="otherEmergencyServices"
            value={formData.otherEmergencyServices}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Any other emergency services, specialized medical facilities, or emergency contacts relevant to your organization"
          />
          <p className="mt-1 text-sm text-gray-500">Examples: specialized medical centers, emergency shelters, utility emergency contacts, etc.</p>
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
        <p className="text-gray-600 mb-6">Help us understand your organization better for emergency planning.</p>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Special Considerations
          </label>
          <textarea
            name="specialConsiderations"
            value={formData.specialConsiderations}
            onChange={handleInputChange}
            rows={6}
            maxLength={1000}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Any special considerations for emergency planning (e.g., hazardous materials, unique building features, accessibility needs, special populations, operating hours, etc.)"
          />
          <div className="mt-2 flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Include any information that would be important for emergency responders to know about your organization.
            </p>
            <span className="text-sm text-gray-500">
              {formData.specialConsiderations?.length || 0}/1000 characters
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Your Organization Profile</h3>
        <p className="text-gray-600 mb-6">Please review all the information below before creating your profile. You can go back to any step to make changes.</p>
        
        {/* Debug Information */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">Debug Information</h4>
          <div className="text-xs text-yellow-700 space-y-1">
            <div>Current Step: {currentStep} of {totalSteps}</div>
            <div>Organization Name: {formData.organizationName || 'Not set'}</div>
            <div>Organization Type: {formData.organizationType || 'Not set'}</div>
            <div>Primary Contact: {formData.primaryContactName || 'Not set'}</div>
            <div>Primary Email: {formData.primaryContactEmail || 'Not set'}</div>
            <div>City: {formData.city || 'Not set'}</div>
            <div>Loading State: {loading ? 'Yes' : 'No'}</div>
          </div>
        </div>
      </div>
      
      <div className="space-y-8">
        {/* Step 1: Basic Organization Information */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full mr-3">1</span>
            Basic Organization Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-500">Organization Name:</span>
              <p className="text-gray-900">{formData.organizationName || 'Not provided'}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Organization Type:</span>
              <p className="text-gray-900">
                {formData.organizationType === 'Other' && formData.customOrganizationType 
                  ? formData.customOrganizationType 
                  : formData.organizationType || 'Not provided'}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Industry:</span>
              <p className="text-gray-900">
                {formData.industry === 'Other' && formData.customIndustry 
                  ? formData.customIndustry 
                  : formData.industry || 'Not provided'}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">NAICS Code:</span>
              <p className="text-gray-900">{formData.naicsCode || 'Not provided'}</p>
            </div>
          </div>
        </div>

        {/* Step 2: Primary Contact Information */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full mr-3">2</span>
            Primary Contact Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-500">Primary Contact Name:</span>
              <p className="text-gray-900">{formData.primaryContactName || 'Not provided'}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Primary Contact Email:</span>
              <p className="text-gray-900">{formData.primaryContactEmail || 'Not provided'}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Primary Contact Phone:</span>
              <p className="text-gray-900">{formData.primaryContactPhone || 'Not provided'}</p>
            </div>
          </div>
          
          {/* Alternate Contacts */}
          {(formData.alternateContact1Name || formData.alternateContact1Email || formData.alternateContact1Phone) && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Alternate Contact 1:</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Name:</span>
                  <p className="text-gray-900">{formData.alternateContact1Name || 'Not provided'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Email:</span>
                  <p className="text-gray-900">{formData.alternateContact1Email || 'Not provided'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Phone:</span>
                  <p className="text-gray-900">{formData.alternateContact1Phone || 'Not provided'}</p>
                </div>
              </div>
            </div>
          )}
          
          {(formData.alternateContact2Name || formData.alternateContact2Email || formData.alternateContact2Phone) && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Alternate Contact 2:</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Name:</span>
                  <p className="text-gray-900">{formData.alternateContact2Name || 'Not provided'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Email:</span>
                  <p className="text-gray-900">{formData.alternateContact2Email || 'Not provided'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Phone:</span>
                  <p className="text-gray-900">{formData.alternateContact2Phone || 'Not provided'}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Step 3: Location Information */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full mr-3">3</span>
            Location Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-500">Primary Address:</span>
              <p className="text-gray-900">{formData.primaryAddress || 'Not provided'}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">City:</span>
              <p className="text-gray-900">{formData.city || 'Not provided'}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">State/Province:</span>
              <p className="text-gray-900">{formData.state || 'Not provided'}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Postal Code:</span>
              <p className="text-gray-900">{formData.zipCode || 'Not provided'}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Country:</span>
              <p className="text-gray-900">{formData.country || 'Not provided'}</p>
            </div>
          </div>
          
          {/* Building Information */}
          {(formData.buildingName || formData.buildingType || formData.numberOfFloors || formData.buildingAge || formData.totalSquareFootage) && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Building Information:</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Building Name:</span>
                  <p className="text-gray-900">{formData.buildingName || 'Not provided'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Building Type:</span>
                  <p className="text-gray-900">{formData.buildingType || 'Not provided'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Number of Floors:</span>
                  <p className="text-gray-900">{formData.numberOfFloors || 'Not provided'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Building Age:</span>
                  <p className="text-gray-900">{formData.buildingAge || 'Not provided'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Total Square Footage:</span>
                  <p className="text-gray-900">{formData.totalSquareFootage || 'Not provided'}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Occupancy & Accessibility */}
          {(formData.maximumOccupancy || formData.averageOccupancyWorkday || formData.averageOccupancyOffHours || formData.peopleWithDisabilities || formData.evacuationRoutes || formData.assemblyAreas) && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Occupancy & Accessibility:</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Maximum Occupancy:</span>
                  <p className="text-gray-900">{formData.maximumOccupancy || 'Not provided'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Average Occupancy (Workday):</span>
                  <p className="text-gray-900">{formData.averageOccupancyWorkday || 'Not provided'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Average Occupancy (Off-hours):</span>
                  <p className="text-gray-900">{formData.averageOccupancyOffHours || 'Not provided'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">People with Disabilities:</span>
                  <p className="text-gray-900">{formData.peopleWithDisabilities || 'Not provided'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Evacuation Routes:</span>
                  <p className="text-gray-900">{formData.evacuationRoutes || 'Not provided'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Assembly Areas:</span>
                  <p className="text-gray-900">{formData.assemblyAreas || 'Not provided'}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Step 4: Emergency Services */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full mr-3">4</span>
            Emergency Services
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-500">Nearest Hospital:</span>
              <p className="text-gray-900">{formData.nearestHospital || 'Not provided'}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Nearest Fire Station:</span>
              <p className="text-gray-900">{formData.nearestFireStation || 'Not provided'}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Nearest Police Station:</span>
              <p className="text-gray-900">{formData.nearestPoliceStation || 'Not provided'}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Other Emergency Services:</span>
              <p className="text-gray-900">{formData.otherEmergencyServices || 'Not provided'}</p>
            </div>
          </div>
        </div>

        {/* Step 5: Additional Information */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full mr-3">5</span>
            Additional Information
          </h4>
          <div>
            <span className="text-sm font-medium text-gray-500">Special Considerations:</span>
            <p className="text-gray-900 mt-1">{formData.specialConsiderations || 'Not provided'}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      case 6:
        return renderStep6();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header with Sign Out - Only show if not hidden */}
      {!hideHeader && (
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <img className="h-8 w-auto" src={logo} alt="EPOS Logo" />
              <h1 className="text-xl font-semibold text-gray-900">EPOS</h1>
            </div>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full space-y-8">
          {/* Welcome Header */}
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Welcome, {user?.attributes?.given_name || 'User'}!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Let's set up your organization profile to get started with emergency planning
            </p>
          </div>

          {/* Progress Bar */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Step {currentStep} of {totalSteps}
                </span>
                <span className="text-sm text-gray-500">
                  {Math.round((currentStep / totalSteps) * 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Step Content */}
            <div className="mb-6">
              {renderStepContent()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Previous
              </button>

              <div className="flex space-x-3">
                {/* Skip Button - Only show on steps 1-5, not on review step */}
                {currentStep < 6 && (
                  <button
                    type="button"
                    onClick={handleSkip}
                    className="px-6 py-3 rounded-lg font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-200"
                  >
                    Skip for Now
                  </button>
                )}

                {currentStep === 5 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!isStepValid(currentStep)}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                      isStepValid(currentStep)
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Review & Create Profile
                  </button>
                ) : currentStep === 6 ? (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                      loading
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700'
                    }`}
                  >
                    {loading ? 'Creating Profile...' : 'Create Profile'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!isStepValid(currentStep)}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                      isStepValid(currentStep)
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Next
                  </button>
                )}
              </div>
            </div>

            {/* Progress Tracker - Moved from footer */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-center items-center space-x-4 text-sm text-gray-600">
                <span>Step {currentStep} of {totalSteps}</span>
                <span>•</span>
                <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}

export default Onboarding; 