import React, { useState, useEffect } from 'react';
import { useOrganizationProfileUnified } from './hooks/useOrganizationProfileUnified';
import { useHazardIntelligence } from './hooks/useHazardIntelligence';

// Tag Component for displaying selected items
// Secure Password Input Component
const SecurePasswordInput = ({ value, onChange, onBlur, error, placeholder, label, required = false }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: [] });

  const validatePassword = (password) => {
    const feedback = [];
    let score = 0;

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('At least 8 characters');
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('At least one lowercase letter');
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('At least one uppercase letter');
    }

    if (/[0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push('At least one number');
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push('At least one special character');
    }

    return { score, feedback };
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    onChange(e);
    
    if (newPassword) {
      const strength = validatePassword(newPassword);
      setPasswordStrength(strength);
    } else {
      setPasswordStrength({ score: 0, feedback: [] });
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength.score <= 2) return 'bg-red-500';
    if (passwordStrength.score <= 3) return 'bg-yellow-500';
    if (passwordStrength.score <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (passwordStrength.score <= 2) return 'Weak';
    if (passwordStrength.score <= 3) return 'Fair';
    if (passwordStrength.score <= 4) return 'Good';
    return 'Strong';
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={handlePasswordChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            error ? 'border-red-300' : 'border-gray-300'
          }`}
          autoComplete="new-password"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
        >
          {showPassword ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      </div>
      
      {value && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
                style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
              ></div>
            </div>
            <span className={`text-sm font-medium ${
              passwordStrength.score <= 2 ? 'text-red-600' :
              passwordStrength.score <= 3 ? 'text-yellow-600' :
              passwordStrength.score <= 4 ? 'text-blue-600' : 'text-green-600'
            }`}>
              {getStrengthText()}
            </span>
          </div>
          {passwordStrength.feedback.length > 0 && (
            <div className="text-sm text-gray-600">
              <p className="font-medium">Requirements:</p>
              <ul className="list-disc list-inside space-y-1">
                {passwordStrength.feedback.map((item, index) => (
                  <li key={index} className="text-red-600">{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

const Tag = ({ label, onRemove, onClick, className = '' }) => (
  <span 
    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200 ${className}`}
    onClick={onClick}
  >
    {label}
    {onRemove && (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-600 hover:bg-blue-200 hover:text-blue-800 transition-colors"
      >
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    )}
  </span>
);

const ORG_TYPES = [
  'Educational Institution', 'Healthcare Facility', 'Corporate Office',
  'Manufacturing Plant', 'Retail Store', 'Government Agency', 'Non-Profit', 'Other'
];

const SCOPE_OPTIONS = [
  'Municipality', 'Campus', 'Building', 'Part of a Building', 'Distributed Operations', 'Other'
];

const HAZARD_CATEGORIES = [
  {
    name: 'Natural Hazards',
    hazards: [
      'Avalanche', 'Drought', 'Earthquake', 'Epidemic/Pandemic', 'Flooding', 'Tsunami',
      'Tropical Cyclone', 'Tornado', 'Waterspout', 'Hailstorm', 'Lightning', 'Wildfire',
      'Extreme Heat', 'Extreme Cold', 'Volcanic Eruption', 'Landslide', 'Sinkhole',
      'Erosion', 'Geomagnetic Storm'
    ],
  },
  {
    name: 'Technological Hazards',
    hazards: [
      'Hazardous Chemical Release (Fixed Site)', 'Hazardous Chemical Release (Transportation)', 'Radiation/Nuclear Release', 'Dam/Levee Failure',
      'Power/Utilities Outage', 'Transportation Accident', 'Urban Conflagration',
      'Industrial Explosion', 'Infrastructure Collapse', 'Urban flooding'
    ],
  },
  {
    name: 'Human-caused Hazards',
    hazards: [
      'Civil Unrest', 'Terrorist Attack', 'Cyberattack', 'Mass Violence',
      'Sabotage/Vandalism', 'Armed Conflict', 'Active Aggressor', 'Anonymous Threats'
    ],
  },
];

// Hazard microcontent definitions
const HAZARD_DESCRIPTIONS = {
  // Natural Hazards
  'Avalanche': 'Rapid flow of snow down a slope, often triggered by weather, earthquakes, or human activity. Can bury structures and block access routes.',
  'Drought': 'Extended period of below-average precipitation leading to water shortages, crop failures, and increased wildfire risk.',
  'Earthquake': 'Sudden shaking of the ground caused by seismic waves. Can cause structural damage, fires, and secondary hazards like tsunamis.',
  'Epidemic/Pandemic': 'Widespread outbreak of infectious disease affecting large populations. Can disrupt operations and require social distancing measures.',
  'Flooding': 'Overflow of water that submerges normally dry land. Can be caused by heavy rainfall, snowmelt, or dam failures.',
  'Tsunami': 'Series of ocean waves caused by underwater earthquakes, volcanic eruptions, or landslides. Can cause devastating coastal flooding.',
  'Tropical Cyclone': 'Intense circular storm system with strong winds and heavy rainfall. Includes hurricanes, typhoons, and cyclones.',
  'Tornado': 'Violently rotating column of air extending from thunderstorms to the ground. Can cause severe structural damage in narrow paths.',
  'Waterspout': 'Tornado that forms over water. Can move ashore and cause damage similar to land-based tornadoes.',
  'Hailstorm': 'Precipitation of ice balls or irregular lumps. Can damage vehicles, buildings, and crops.',
  'Lightning': 'Electrical discharge between clouds or between clouds and ground. Can cause fires, power outages, and injuries.',
  'Wildfire': 'Uncontrolled fire in vegetation areas. Can spread rapidly and threaten structures, especially in dry conditions.',
  'Extreme Heat': 'Prolonged period of abnormally high temperatures. Can cause heat-related illnesses and strain cooling systems.',
  'Extreme Cold': 'Prolonged period of abnormally low temperatures. Can cause hypothermia, frozen pipes, and transportation disruptions.',
  'Volcanic Eruption': 'Explosion or ejection of lava, gas, and ash from a volcano. Can cause widespread damage and air quality issues.',
  'Landslide': 'Downward movement of rock, soil, and debris on slopes. Can be triggered by heavy rainfall, earthquakes, or human activity.',
  'Sinkhole': 'Depression or hole in the ground caused by collapse of surface layer. Can damage structures and infrastructure.',
  'Erosion': 'Gradual wearing away of soil and rock by water, wind, or ice. Can undermine structures and cause land loss.',
  'Geomagnetic Storm': 'Disturbance in Earth\'s magnetic field caused by solar activity. Can disrupt power grids and communication systems.',
  
  // Technological Hazards
  'Hazardous Chemical Release (Fixed Site)': 'Accidental or intentional release of toxic chemicals from a stationary facility, plant, or industrial site. Can cause immediate health effects and environmental contamination in the surrounding area.',
  'Hazardous Chemical Release (Transportation)': 'Accidental release of toxic chemicals during transport via road, rail, or other transportation methods. Can cause immediate health effects and environmental contamination along transportation routes.',
  'Radiation/Nuclear Release': 'Release of radioactive materials from nuclear facilities or accidents. Can cause long-term health effects and contamination.',
  'Dam/Levee Failure': 'Structural failure of water containment systems. Can cause catastrophic flooding downstream.',
  'Power/Utilities Outage': 'Loss of electrical power or other utility services. Can disrupt operations and affect safety systems.',
  'Transportation Accident': 'Major accident involving vehicles, aircraft, or other transportation systems. Can cause casualties and block access routes.',
  'Urban Conflagration': 'Large-scale fire that spreads rapidly through urban areas. Can destroy multiple structures and overwhelm firefighting resources.',
  'Industrial Explosion': 'Explosion in industrial facilities or chemical plants. Can cause structural damage, fires, and chemical releases.',
  'Infrastructure Collapse': 'Failure of critical infrastructure like bridges, buildings, or tunnels. Can block transportation and cause casualties.',
  'Urban flooding': 'Flooding in urban areas due to overwhelmed drainage systems. Can cause property damage and transportation disruptions.',
  
  // Human-caused Hazards
  'Civil Unrest': 'Public disorder, protests, or riots that can disrupt operations and threaten safety. May require shelter-in-place procedures.',
  'Terrorist Attack': 'Violent attack intended to cause fear and harm. Can include bombings, shootings, or other violent acts.',
  'Cyberattack': 'Malicious attempt to damage or gain unauthorized access to computer systems. Can disrupt operations and compromise data.',
  'Mass Violence': 'Violent incident involving multiple victims, such as active shooter situations. Requires immediate response and evacuation procedures.',
  'Sabotage/Vandalism': 'Intentional damage to property or systems. Can disrupt operations and cause safety hazards.',
  'Armed Conflict': 'Violent confrontation between armed groups. Can cause widespread damage and require evacuation or shelter-in-place procedures.',
  'Active Aggressor': 'An active aggressor is someone actively harming or attempting to harm people in a populated area, often using firearms, knives, or other weapons.',
  'Anonymous Threats': 'Anonymous threats are communications intended to intimidate, harm, or cause chaos without revealing the sender\'s identity, delivered through various means like electronic communication or false emergency calls.'
};

const SPECIALS = [
  'Multi-story Building', 'Hazardous Materials On-site', 'Public Access Areas',
  'Remote/Isolated Location', '24/7 Operations', 'Rural area', 'Urban area',
  'Suburban area', 'Proximity to major roadway', 'Proximity to commercial rail'
];

const FORM_STEPS = [
  {
    id: 'organization',
    title: 'Organization Details',
    description: 'Basic information about your organization',
    fields: ['organization_name', 'organization_type', 'location']
  },
  {
    id: 'scope',
    title: 'Scope & Coverage',
    description: 'Define the scope of your emergency plan',
    fields: ['scope', 'scope_other']
  },
  {
    id: 'hazards',
    title: 'Hazard Identification',
    description: 'Identify potential hazards and risks',
    fields: ['primary_hazards']
  },
  {
    id: 'considerations',
    title: 'Special Considerations',
    description: 'Additional factors that may affect your plan',
    fields: ['special_considerations', 'additional_requirements']
  },
  {
    id: 'review',
    title: 'Review & Generate',
    description: 'Review your information and set PDF password for your emergency plan',
    fields: ['pdf_password']
  }
];

const TOOLTIPS = {
  organization_name: 'Enter the name of your organization as you want it to appear in the plan.',
  organization_type: 'Select the category that best describes your organization type.',
  location: 'Enter the primary address or location of your organization.',
  scope: 'Define the geographical or operational scope that your emergency plan will cover.',
  scope_other: 'If "Other" is selected, please specify the scope details.',
  primary_hazards: 'Select the hazards that could potentially affect your organization, typically based on a Hazard Identification and Risk Assessment (HIRA).',
  special_considerations: 'Select any special circumstances that may require additional planning considerations.',
  additional_requirements: 'Any specific requirements, regulations, or considerations that should be included in your emergency plan.'
};

function EnhancedPlanForm({ onSubmit, onCancel, user }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState({
    organization_name: '',
    organization_type: ORG_TYPES[0],
    location: '',
    scope: [],
    scope_other: '',
    primary_hazards: [],
    special_considerations: [],
    additional_requirements: '',
    pdf_password: '',
  });

  // Organization profile synchronization
  const { profile, loading: profileLoading, fetchProfile, backendStatus } = useOrganizationProfileUnified();
  const [useProfileData, setUseProfileData] = useState(false);
  const [profileSynced, setProfileSynced] = useState(false);

  // Hazard Intelligence
  const { 
    suggestedHazards, 
    reasoning, 
    getHazardReason, 
    getSuggestedHazardsByCategory, 
    isIntelligentSuggestion,
    currentSeason,
    region
  } = useHazardIntelligence(profile, form.location);

  // Helper functions for profile synchronization
  const mapProfileOrgTypeToForm = (profileOrgType) => {
    if (!profileOrgType) return null;
    
    const typeMapping = {
      'CorporateOffice': 'Corporate Office',
      'HealthcareFacility': 'Healthcare Facility',
      'EducationalInstitution': 'Educational Institution',
      'GovernmentBuilding': 'Government Agency',
      'RetailCommercial': 'Retail Store',
      'Manufacturing': 'Manufacturing Plant',
      'Other': 'Other'
    };
    
    return typeMapping[profileOrgType] || 'Other';
  };

  const formatLocationFromProfile = (profile) => {
    if (!profile) return null;
    
    const parts = [
      profile.primaryAddress,
      profile.city,
      profile.state,
      profile.zipCode
    ].filter(Boolean);
    
    return parts.length > 0 ? parts.join(', ') : null;
  };

  // Helper functions for tag management
  const addTag = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: [...prev[field], value]
    }));
  };

  const removeTag = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].filter(item => item !== value)
    }));
  };

  const getScopeDisplayValue = () => {
    if (form.scope.length === 0) return null;
    return form.scope;
  };
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [hazardSearch, setHazardSearch] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({
    'Natural Hazards': true,
    'Technological Hazards': false,
    'Human-caused Hazards': false,
  });
  const [tooltip, setTooltip] = useState({ show: false, content: '', title: '' });
  const [scrollY, setScrollY] = useState(0);

  const [lastSaved, setLastSaved] = useState(null);

  // Fetch organization profile on component mount
  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user, fetchProfile]);

  // Sync form with profile data when profile is loaded and user chooses to use it
  useEffect(() => {
    if (profile && useProfileData && !profileSynced) {
      const syncedForm = {
        ...form,
        organization_name: profile.organizationName || form.organization_name,
        organization_type: mapProfileOrgTypeToForm(profile.organizationType) || form.organization_type,
        location: formatLocationFromProfile(profile) || form.location,
      };
      setForm(syncedForm);
      setProfileSynced(true);
    }
  }, [profile, useProfileData, profileSynced]);

  // Auto-save functionality
  useEffect(() => {
    const saveForm = () => {
      if (user) {
        // Create a copy of form data without the password for security
        const { pdf_password, ...formDataWithoutPassword } = form;
        const formData = {
          ...formDataWithoutPassword,
          lastSaved: new Date().toISOString(),
          userId: user.username,
          useProfileData: useProfileData
        };
        localStorage.setItem(`planForm_${user.username}`, JSON.stringify(formData));
        setLastSaved(new Date());
      }
    };

    const debounceTimer = setTimeout(saveForm, 1000);
    return () => clearTimeout(debounceTimer);
  }, [form, user, useProfileData]);

  // Load saved form data
  useEffect(() => {
    if (user) {
      const savedForm = localStorage.getItem(`planForm_${user.username}`);
      if (savedForm) {
        try {
          const parsedForm = JSON.parse(savedForm);
          // Check if saved form is less than 24 hours old
          const savedTime = new Date(parsedForm.lastSaved);
          const now = new Date();
          const hoursDiff = (now - savedTime) / (1000 * 60 * 60);
          
          if (hoursDiff < 24) {
            setForm(parsedForm);
            setLastSaved(savedTime);
            // Restore profile sync preference if it was saved
            if (parsedForm.useProfileData) {
              setUseProfileData(true);
            }
            // Calculate current step based on filled fields
            const currentStepIndex = FORM_STEPS.findIndex(step => 
              step.fields.some(field => !parsedForm[field] || 
                (Array.isArray(parsedForm[field]) && parsedForm[field].length === 0))
            );
            if (currentStepIndex !== -1) {
              setCurrentStep(currentStepIndex);
            }
          }
        } catch (error) {
          console.error('Error loading saved form:', error);
        }
      }
    }
  }, [user]);

  // Track scroll position for tooltip positioning
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const validateStep = (stepIndex) => {
    const step = FORM_STEPS[stepIndex];
    const newErrors = {};

    // Special validation for review step (includes password validation)
    if (step.id === 'review') {
      // Validate password on review step
      if (!form.pdf_password || !form.pdf_password.trim()) {
        newErrors.pdf_password = 'PDF password is required';
      } else if (form.pdf_password.length < 8) {
        newErrors.pdf_password = 'Password must be at least 8 characters long';
      } else if (!/[a-z]/.test(form.pdf_password)) {
        newErrors.pdf_password = 'Password must contain at least one lowercase letter';
      } else if (!/[A-Z]/.test(form.pdf_password)) {
        newErrors.pdf_password = 'Password must contain at least one uppercase letter';
      } else if (!/[0-9]/.test(form.pdf_password)) {
        newErrors.pdf_password = 'Password must contain at least one number';
      } else if (!/[^A-Za-z0-9]/.test(form.pdf_password)) {
        newErrors.pdf_password = 'Password must contain at least one special character';
      }
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }

    // Regular validation for other steps
    step.fields.forEach(field => {
      if (field === 'organization_name' && !form[field].trim()) {
        newErrors[field] = 'Organization name is required';
      }
      if (field === 'location' && !form[field].trim()) {
        newErrors[field] = 'Location is required';
      }
      if (field === 'scope' && form[field].length === 0) {
        newErrors[field] = 'Please select at least one scope';
      }
      if (field === 'scope_other' && form.scope.includes('Other') && !form.scope_other.trim()) {
        newErrors[field] = 'Please specify the scope';
      }
      if (field === 'primary_hazards' && form[field].length === 0) {
        newErrors[field] = 'Please select at least one hazard';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, FORM_STEPS.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Debug password field changes
    if (name === 'pdf_password') {
      console.log('Password field change:', {
        name,
        value,
        type,
        oldValue: form.pdf_password,
        newValue: value
      });
    }
    
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (checked 
            ? [...prev[name], value]
            : prev[name].filter(v => v !== value)
          )
        : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Only allow form submission on the review step
    if (currentStep !== FORM_STEPS.length - 1) {
      console.log('Form submission prevented - not on review step');
      return;
    }
    
    if (!validateStep(currentStep)) return;

    setSubmitting(true);
    setError('');
    
    try {
      // Call the plan generation API
      const response = await fetch('http://localhost:5002/api/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate plan');
      }

      // Call the original onSubmit with the generated plan data (excluding password for security)
      const { pdf_password, ...formDataWithoutPassword } = form;
      await onSubmit({
        ...formDataWithoutPassword,
        generatedPlan: result.plan
      });
      
      // Clear saved form data on successful submission
      if (user) {
        localStorage.removeItem(`planForm_${user.username}`);
      }
    } catch (error) {
      console.error('Error generating plan:', error);
      setError(error.message || 'Failed to generate emergency plan. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGeneratePlan = async () => {
    // Explicit function for generating the plan
    if (currentStep !== FORM_STEPS.length - 1) {
      console.log('Plan generation prevented - not on review step');
      return;
    }
    
    if (!validateStep(currentStep)) return;

    setSubmitting(true);
    setError('');
    
    try {
      // Call the plan generation API
      const response = await fetch('http://localhost:5002/api/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate plan');
      }

      // Call the original onSubmit with the generated plan data (excluding password for security)
      const { pdf_password, ...formDataWithoutPassword } = form;
      await onSubmit({
        ...formDataWithoutPassword,
        generatedPlan: result.plan
      });
      
      // Clear saved form data on successful submission
      if (user) {
        localStorage.removeItem(`planForm_${user.username}`);
      }
    } catch (error) {
      console.error('Error generating plan:', error);
      setError(error.message || 'Failed to generate emergency plan. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getProgressPercentage = () => {
    const totalFields = FORM_STEPS.reduce((acc, step) => acc + step.fields.length, 0);
    const filledFields = FORM_STEPS.reduce((acc, step) => {
      return acc + step.fields.filter(field => {
        const value = form[field];
        return value && (
          typeof value === 'string' ? value.trim() !== '' :
          Array.isArray(value) ? value.length > 0 : true
        );
      }).length;
    }, 0);
    return Math.round((filledFields / totalFields) * 100);
  };

  // Check if password is valid for plan generation
  const isPasswordValid = () => {
    const password = form.pdf_password;
    console.log('Password validation check:', {
      password: password,
      hasPassword: !!password,
      trimmed: password ? password.trim() : '',
      length: password ? password.length : 0,
      hasLowercase: password ? /[a-z]/.test(password) : false,
      hasUppercase: password ? /[A-Z]/.test(password) : false,
      hasNumber: password ? /[0-9]/.test(password) : false,
      hasSpecial: password ? /[^A-Za-z0-9]/.test(password) : false
    });
    
    if (!password || !password.trim()) {
      console.log('Password validation failed: No password or empty');
      return false;
    }
    if (password.length < 8) {
      console.log('Password validation failed: Too short');
      return false;
    }
    if (!/[a-z]/.test(password)) {
      console.log('Password validation failed: No lowercase');
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      console.log('Password validation failed: No uppercase');
      return false;
    }
    if (!/[0-9]/.test(password)) {
      console.log('Password validation failed: No number');
      return false;
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      console.log('Password validation failed: No special character');
      return false;
    }
    console.log('Password validation passed');
    return true;
  };

  const showTooltip = (title, content) => {
    setTooltip({ show: true, title, content });
  };

  const hideTooltip = () => {
    setTooltip({ show: false, content: '', title: '' });
  };

  const renderTooltip = () => {
    if (!tooltip.show) return null;
    
    const tooltipTop = Math.max(20, scrollY + 20);
    
    return (
      <div className="fixed z-[9999] bg-gray-900 text-white text-sm rounded-lg p-3 max-w-xs shadow-lg border border-gray-700 pointer-events-none" style={{ top: `${tooltipTop}px`, left: '20px' }}>
        {tooltip.title && (
          <div className="font-medium mb-2 text-blue-300">{tooltip.title}</div>
        )}
        <div className="text-gray-300 text-xs leading-relaxed">{tooltip.content}</div>
      </div>
    );
  };



  const renderStep = () => {
    const step = FORM_STEPS[currentStep];
    
    switch (step.id) {
      case 'organization':
        return (
          <div className="space-y-6">
            {/* Profile Synchronization Section */}
            {profileLoading && !profile && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <span className="text-sm text-gray-600">Loading organization profile...</span>
                </div>
              </div>
            )}
            {profile && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-blue-900">
                        Organization Profile Found
                      </h3>
                      <p className="text-sm text-blue-700">
                        We found your organization profile: <strong>{profile.organizationName}</strong>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={useProfileData}
                        onChange={(e) => {
                          setUseProfileData(e.target.checked);
                          if (!e.target.checked) {
                            setProfileSynced(false);
                          }
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-blue-900">Use profile data</span>
                    </label>
                  </div>
                </div>
                {useProfileData && (
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <p className="text-xs text-blue-600">
                      ✓ Organization name, type, and location will be pre-filled from your profile
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organization Name
                {useProfileData && profile && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    From Profile
                  </span>
                )}
                <div className="relative inline-block">
                                  <button
                  type="button"
                  className="ml-2 text-blue-500 hover:text-blue-700"
                                    onMouseEnter={() => showTooltip('', TOOLTIPS.organization_name)}
                  onMouseLeave={hideTooltip}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </button>
                </div>
              </label>
              <input
                type="text"
                name="organization_name"
                value={form.organization_name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.organization_name ? 'border-red-500' : 'border-gray-300'
                } ${useProfileData && profile ? 'bg-blue-50 border-blue-300' : ''}`}
                placeholder="Enter organization name"
              />
              {errors.organization_name && (
                <p className="text-red-500 text-sm mt-1">{errors.organization_name}</p>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organization Type
                {useProfileData && profile && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    From Profile
                  </span>
                )}
                <button
                  type="button"
                  className="ml-2 text-blue-500 hover:text-blue-700"
                  onMouseEnter={() => showTooltip('', TOOLTIPS.organization_type)}
                  onMouseLeave={hideTooltip}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </button>
              </label>
              
              <select
                name="organization_type"
                value={form.organization_type}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  useProfileData && profile ? 'bg-blue-50 border-blue-300' : 'border-gray-300'
                }`}
              >
                {ORG_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
                {useProfileData && profile && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    From Profile
                  </span>
                )}
                <button
                  type="button"
                  className="ml-2 text-blue-500 hover:text-blue-700"
                  onMouseEnter={() => showTooltip('', TOOLTIPS.location)}
                  onMouseLeave={hideTooltip}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </button>
              </label>
              
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.location ? 'border-red-500' : 'border-gray-300'
                } ${useProfileData && profile ? 'bg-blue-50 border-blue-300' : ''}`}
                placeholder="Enter organization address"
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location}</p>
              )}
            </div>
          </div>
        );

      case 'scope':
        return (
          <div className="space-y-6">
            {/* Selected Scope Tags */}
            {form.scope.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-3">Selected Scope:</h4>
                <div className="flex flex-wrap gap-2">
                  {form.scope.map(scope => (
                    <Tag
                      key={scope}
                      label={scope === 'Other' && form.scope_other ? form.scope_other : scope}
                      onRemove={() => {
                        setForm(prev => ({
                          ...prev,
                          scope: prev.scope.filter(s => s !== scope),
                          scope_other: scope === 'Other' ? '' : prev.scope_other
                        }));
                      }}
                      className="bg-blue-100 text-blue-800 border-blue-300"
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Scope & Coverage
                <button
                  type="button"
                  className="ml-2 text-blue-500 hover:text-blue-700"
                  onMouseEnter={() => showTooltip('', TOOLTIPS.scope)}
                  onMouseLeave={hideTooltip}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </button>
              </label>
              
              
              {/* Multi-select chips for scope options */}
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {SCOPE_OPTIONS.map(scope => (
                    <button
                      key={scope}
                      type="button"
                      onClick={() => {
                        if (form.scope.includes(scope)) {
                          removeTag('scope', scope);
                        } else {
                          addTag('scope', scope);
                        }
                      }}
                      className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${
                        form.scope.includes(scope)
                          ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      {scope}
                    </button>
                  ))}
                </div>
                
                {errors.scope && (
                  <p className="text-red-500 text-sm mt-1">{errors.scope}</p>
                )}
              </div>
            </div>

            {form.scope.includes('Other') && (
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specify Scope
                  <button
                    type="button"
                    className="ml-2 text-blue-500 hover:text-blue-700"
                                      onMouseEnter={() => showTooltip('', TOOLTIPS.scope_other)}
                  onMouseLeave={hideTooltip}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </button>
                </label>

                <input
                  type="text"
                  name="scope_other"
                  value={form.scope_other}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.scope_other ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Please specify the scope"
                />
                {errors.scope_other && (
                  <p className="text-red-500 text-sm mt-1">{errors.scope_other}</p>
                )}
              </div>
            )}
          </div>
        );

      case 'hazards':
        return (
          <div className="space-y-6">
            {/* Selected Hazards Tags */}
            {form.primary_hazards.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-green-900 mb-3">Selected Hazards:</h4>
                <div className="flex flex-wrap gap-2">
                  {form.primary_hazards.map(hazard => (
                    <Tag
                      key={hazard}
                      label={hazard}
                      onRemove={() => removeTag('primary_hazards', hazard)}
                      className={`${isIntelligentSuggestion(hazard) ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-green-100 text-green-800 border-green-300'}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Intelligent Hazard Suggestions */}
            {suggestedHazards.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-blue-900">
                    🧠 Intelligent Suggestions ({suggestedHazards.length})
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      const newHazards = [...new Set([...form.primary_hazards, ...suggestedHazards])];
                      setForm(prev => ({ ...prev, primary_hazards: newHazards }));
                    }}
                    className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                  >
                    Apply All
                  </button>
                </div>
                <div className="text-sm text-blue-700 mb-3">
                  <p className="mb-1">
                    Based on your location and organization profile, we suggest these relevant hazards:
                  </p>
                  {region && currentSeason && (
                    <p className="text-xs text-blue-600 italic">
                      📍 {region} • 🌤️ {currentSeason.charAt(0).toUpperCase() + currentSeason.slice(1)} season
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {suggestedHazards.map(hazard => (
                    <div key={hazard} className="relative group">
                      <Tag
                        label={hazard}
                        onRemove={() => {
                          if (form.primary_hazards.includes(hazard)) {
                            removeTag('primary_hazards', hazard);
                          }
                        }}
                        className={`${form.primary_hazards.includes(hazard) 
                          ? 'bg-blue-100 text-blue-800 border-blue-300' 
                          : 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 cursor-pointer'
                        }`}
                        onClick={() => {
                          if (!form.primary_hazards.includes(hazard)) {
                            addTag('primary_hazards', hazard);
                          }
                        }}
                      />
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                        {getHazardReason(hazard)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hazard Identification
                <button
                  type="button"
                  className="ml-2 text-blue-500 hover:text-blue-700"
                  onMouseEnter={() => showTooltip('', TOOLTIPS.primary_hazards)}
                  onMouseLeave={hideTooltip}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </button>
              </label>
              
              
              <input
                type="text"
                placeholder="Search hazards for identification..."
                value={hazardSearch}
                onChange={(e) => setHazardSearch(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 mb-4"
              />

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {HAZARD_CATEGORIES.map(category => (
                  <div key={category.name} className="border border-gray-200 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setExpandedCategories(prev => ({
                        ...prev,
                        [category.name]: !prev[category.name]
                      }))}
                      className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex justify-between items-center"
                    >
                      <span className="font-medium text-gray-700">{category.name}</span>
                      <svg
                        className={`w-5 h-5 transform transition-transform duration-200 ${
                          expandedCategories[category.name] ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {expandedCategories[category.name] && (
                      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                        {category.hazards
                          .filter(hazard => hazard.toLowerCase().includes(hazardSearch.toLowerCase()))
                          .map(hazard => (
                            <label key={hazard} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                              <input
                                type="checkbox"
                                name="primary_hazards"
                                value={hazard}
                                checked={form.primary_hazards.includes(hazard)}
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700 flex-1">{hazard}</span>
                              <button
                                type="button"
                                className="text-gray-400 hover:text-blue-500 transition-colors duration-200 relative"
                                onMouseEnter={() => showTooltip(hazard, HAZARD_DESCRIPTIONS[hazard])}
                                onMouseLeave={hideTooltip}
                                onClick={(e) => e.preventDefault()}
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </label>
                          ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {errors.primary_hazards && (
                <p className="text-red-500 text-sm mt-1">{errors.primary_hazards}</p>
              )}
            </div>
            

          </div>
        );

      case 'considerations':
        return (
          <div className="space-y-6">
            {/* Selected Special Considerations Tags */}
            {form.special_considerations.length > 0 && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-purple-900 mb-3">Selected Special Considerations:</h4>
                <div className="flex flex-wrap gap-2">
                  {form.special_considerations.map(consideration => (
                    <Tag
                      key={consideration}
                      label={consideration}
                      onRemove={() => removeTag('special_considerations', consideration)}
                      className="bg-purple-100 text-purple-800 border-purple-300"
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Considerations
                <button
                  type="button"
                  className="ml-2 text-blue-500 hover:text-blue-700"
                  onMouseEnter={() => showTooltip('', TOOLTIPS.special_considerations)}
                  onMouseLeave={hideTooltip}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </button>
              </label>
              
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {SPECIALS.map(special => (
                  <label key={special} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="checkbox"
                      name="special_considerations"
                      value={special}
                      checked={form.special_considerations.includes(special)}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{special}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Requirements
                <button
                  type="button"
                  className="ml-2 text-blue-500 hover:text-blue-700"
                  onMouseEnter={() => showTooltip('', TOOLTIPS.additional_requirements)}
                  onMouseLeave={hideTooltip}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </button>
              </label>
              
              <textarea
                name="additional_requirements"
                value={form.additional_requirements}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Any additional requirements, regulations, or considerations..."
              />
            </div>
          </div>
        );

      case 'review':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Review Your Information</h3>
              <p className="text-blue-700 mb-4">
                Please review all the information below before generating your emergency plan. 
                You can go back to any previous step to make changes if needed.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Organization Details */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">Organization Details</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Name:</span> {form.organization_name || 'Not specified'}</div>
                  <div><span className="font-medium">Type:</span> {form.organization_type}</div>
                  <div><span className="font-medium">Location:</span> {form.location || 'Not specified'}</div>
                </div>
              </div>

              {/* Scope & Coverage */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">Scope & Coverage</h4>
                <div className="space-y-2 text-sm">
                  {form.scope.length > 0 ? (
                    <div>
                      <span className="font-medium">Selected Scope:</span>
                      <div className="mt-2">
                        {form.scope.map(scope => (
                          <Tag
                            key={scope}
                            label={scope === 'Other' && form.scope_other ? form.scope_other : scope}
                            onRemove={() => {
                              setForm(prev => ({
                                ...prev,
                                scope: prev.scope.filter(s => s !== scope),
                                scope_other: scope === 'Other' ? '' : prev.scope_other
                              }));
                            }}
                            className="bg-blue-100 text-blue-800 border-blue-300"
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-500">No scope selected</div>
                  )}
                </div>
              </div>

              {/* Hazard Identification */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">Hazard Identification</h4>
                <div className="space-y-2 text-sm">
                  {form.primary_hazards.length > 0 ? (
                    <div>
                      <span className="font-medium">Selected Hazards:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {form.primary_hazards.map(hazard => (
                          <Tag
                            key={hazard}
                            label={hazard}
                            onRemove={() => {}}
                            className="bg-green-100 text-green-800 border-green-300"
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-500">No hazards selected</div>
                  )}
                </div>
              </div>

              {/* Special Considerations */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">Special Considerations</h4>
                <div className="space-y-2 text-sm">
                  {form.special_considerations.length > 0 ? (
                    <div>
                      <span className="font-medium">Selected Considerations:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {form.special_considerations.map(consideration => (
                          <Tag
                            key={consideration}
                            label={consideration}
                            onRemove={() => {}}
                            className="bg-purple-100 text-purple-800 border-purple-300"
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-500">No special considerations selected</div>
                  )}
                  {form.additional_requirements && (
                    <div className="mt-3">
                      <span className="font-medium">Additional Requirements:</span>
                      <p className="mt-1 text-gray-700">{form.additional_requirements}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* PDF Password Section */}
            <div className={`border rounded-lg p-6 ${isPasswordValid() ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">PDF Security</h3>
                {isPasswordValid() ? (
                  <div className="flex items-center text-green-700">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Password Set
                  </div>
                ) : (
                  <div className="flex items-center text-yellow-700">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    Password Required
                  </div>
                )}
              </div>
              
              <p className={`mb-4 ${isPasswordValid() ? 'text-green-700' : 'text-yellow-700'}`}>
                Your emergency plan will be generated as a password-protected PDF for security. 
                Please set a strong password that you will remember. This password will be required to open the PDF file.
              </p>
              
              <div className="max-w-md">
                <SecurePasswordInput
                  label="PDF Password"
                  name="pdf_password"
                  value={form.pdf_password}
                  onChange={handleChange}
                  onBlur={() => {}}
                  placeholder="Enter a strong password for your PDF"
                  error={errors.pdf_password}
                  required={true}
                />
              </div>
              
              <div className={`mt-4 p-4 rounded-lg ${isPasswordValid() ? 'bg-green-100' : 'bg-yellow-100'}`}>
                <h4 className={`font-semibold mb-2 ${isPasswordValid() ? 'text-green-800' : 'text-yellow-800'}`}>
                  {isPasswordValid() ? 'Security Status:' : 'Security Reminders:'}
                </h4>
                {isPasswordValid() ? (
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• ✅ Password meets all security requirements</li>
                    <li>• ✅ Your plan will be protected with this password</li>
                    <li>• ✅ You can now generate your emergency plan</li>
                  </ul>
                ) : (
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Keep your password secure and do not share it with unauthorized individuals</li>
                    <li>• Store your password in a secure password manager</li>
                    <li>• The password cannot be recovered if lost - you will need to regenerate the plan</li>
                    <li>• This password will be used to protect sensitive emergency planning information</li>
                  </ul>
                )}
              </div>
            </div>

            <div className={`border rounded-lg p-6 ${isPasswordValid() ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <h3 className={`text-lg font-semibold mb-2 ${isPasswordValid() ? 'text-green-900' : 'text-gray-700'}`}>
                {isPasswordValid() ? 'Ready to Generate Plan' : 'Plan Generation Pending'}
              </h3>
              <p className={isPasswordValid() ? 'text-green-700' : 'text-gray-600'}>
                {isPasswordValid() 
                  ? 'All information has been collected and your password is set. Click the "Generate Emergency Plan" button below to create your comprehensive emergency plan.'
                  : 'All information has been collected. Please set a strong password above to enable plan generation.'
                }
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">



      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
        <div className="w-full max-w-4xl">
          {/* Progress Bar */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div></div>
              <div className="text-sm text-gray-600">
                {lastSaved && `Last saved: ${lastSaved.toLocaleTimeString()}`}
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress: {getProgressPercentage()}%</span>
                <span>Step {currentStep + 1} of {FORM_STEPS.length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
            </div>

            {/* Step Navigation */}
            <div className="flex space-x-2 mb-6">
              {FORM_STEPS.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(index)}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                    index === currentStep
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : index < currentStep
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {step.title}
                </button>
              ))}
            </div>

            {/* Current Step Info */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {FORM_STEPS[currentStep].title}
              </h3>
              <p className="text-gray-600">{FORM_STEPS[currentStep].description}</p>
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {renderStep()}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Previous
                </button>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
                  >
                    Cancel
                  </button>

                  {currentStep < FORM_STEPS.length - 2 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                    >
                      Next
                    </button>
                  ) : currentStep === FORM_STEPS.length - 2 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                    >
                      Review & Generate
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleGeneratePlan}
                      disabled={submitting || !isPasswordValid()}
                      className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {(() => {
                        const passwordValid = isPasswordValid();
                        console.log('Button render state:', {
                          submitting,
                          passwordValid,
                          formPassword: form.pdf_password,
                          currentStep,
                          totalSteps: FORM_STEPS.length
                        });
                        
                        if (submitting) {
                          return (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Generating Plan...
                            </div>
                          );
                        } else if (!passwordValid) {
                          return (
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                              Set Password First
                            </div>
                          );
                        } else {
                          return 'Generate Emergency Plan';
                        }
                      })()}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Global Tooltip */}
      {renderTooltip()}
    </div>
  );
}

export default EnhancedPlanForm; 