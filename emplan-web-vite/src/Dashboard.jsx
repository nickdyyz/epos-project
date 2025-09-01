import React, { useState, useEffect, useRef } from 'react';
import { updateUserAttributes } from 'aws-amplify/auth';
import logo from './epos-logo.png';
import EnhancedPlanForm from './EnhancedPlanForm';
import ProfileEditor from './ProfileEditor';
import PlanViewer from './PlanViewer';
import UserProfile from './UserProfile';
import Onboarding from './Onboarding';

import { useOrganizationProfileUnified } from './hooks/useOrganizationProfileUnified';

function Dashboard({ user, plans = [], signOut }) {
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard, create-plan, view-plans, view-plan, update-profile, user-profile, onboarding, debug
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [plansSectionCollapsed, setPlansSectionCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  
  // Personal information editing state
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [personalInfoSaving, setPersonalInfoSaving] = useState(false);
  const [personalInfoMessage, setPersonalInfoMessage] = useState('');
  const [personalInfoError, setPersonalInfoError] = useState('');
  
  // Organization profile hook
    const {
    profile, 
    loading: profileLoading, 
    error: profileError, 
    fetchProfile, 
    testBackendConnection, 
    createProfile,
    
    updateProfile,
    backendStatus,
    isOnboardingComplete
  } = useOrganizationProfileUnified();
  
  // Track if profile has been fetched to prevent unnecessary re-fetches
  const hasFetchedProfileRef = useRef(false);
  
  // Load personal information when component mounts
  useEffect(() => {
    if (user?.attributes) {
      setPersonalInfo({
        firstName: user.attributes.given_name || '',
        lastName: user.attributes.family_name || '',
        email: user.attributes.email || ''
      });
    }
  }, [user]);

  // Fetch profile only once when component mounts
  useEffect(() => {
    if (!hasFetchedProfileRef.current) {
      console.log('Dashboard: Scheduling profile fetch on mount...');
      const timer = setTimeout(async () => {
        console.log('Dashboard: Fetching profile after delay...');
        try {
          // Add timeout to fetchProfile call
          const fetchProfileWithTimeout = Promise.race([
            fetchProfile(),
            new Promise((_, reject) => {
              setTimeout(() => {
                console.log('⏰ DASHBOARD TIMEOUT: fetchProfile timed out after 30 seconds');
                reject(new Error('Dashboard fetchProfile timeout after 30 seconds'));
              }, 30000);
            })
          ]);
          
          await fetchProfileWithTimeout;
          hasFetchedProfileRef.current = true;
          console.log('Dashboard: Profile fetch completed successfully');
        } catch (error) {
          console.error('Dashboard: Profile fetch failed:', error);
          hasFetchedProfileRef.current = true; // Mark as attempted to prevent infinite retries
        }
      }, 1000); // 1 second delay to ensure auth state is established
      
      return () => clearTimeout(timer);
    }
  }, []); // Empty dependency array - only run on mount
  
  const [userPlans, setUserPlans] = useState([
    // Mock data for demonstration
    {
      id: 1,
      title: 'ACME Inc. Emergency Plan',
      organizationType: 'Corporate Office',
      status: 'published',
      createdAt: new Date('2024-01-15'),
      hazards: ['Fire', 'Power Outage', 'Severe Weather'],
      data: {
        location: 'San Francisco, CA',
        special_considerations: ['High-rise building', 'Financial district']
      },
      generatedPlan: {
        content: `# ACME Inc. Emergency Plan

## Executive Summary

This comprehensive emergency plan has been developed for ACME Inc. to ensure the safety and well-being of all employees, visitors, and stakeholders in the event of various emergency situations.

## 1. Emergency Contact Information

### Primary Contacts
- **Emergency Coordinator:** John Smith (555-0123)
- **Safety Manager:** Sarah Johnson (555-0124)
- **Facility Manager:** Mike Davis (555-0125)

### Emergency Services
- **Fire Department:** 911
- **Police Department:** 911
- **Medical Emergency:** 911

## 2. Hazard-Specific Procedures

### Fire Emergency
1. **Immediate Actions:**
   - Activate nearest fire alarm
   - Call 911 immediately
   - Evacuate building using designated routes
   - Do not use elevators

2. **Evacuation Routes:**
   - Primary: Main stairwell to ground floor
   - Secondary: Emergency stairwell to ground floor
   - Assembly point: Across the street at City Park

### Power Outage
1. **Immediate Actions:**
   - Secure any critical equipment
   - Use emergency lighting
   - Contact facility manager
   - Monitor backup systems

2. **Extended Outage Procedures:**
   - Implement work-from-home protocols
   - Activate backup power systems
   - Communicate with clients and stakeholders

### Severe Weather
1. **Tornado Warning:**
   - Move to designated shelter areas
   - Stay away from windows
   - Monitor weather updates

2. **Flood Warning:**
   - Secure important documents
   - Move to higher floors if necessary
   - Follow evacuation orders

## 3. Communication Protocols

### Internal Communication
- Emergency notification system
- Designated floor wardens
- Regular safety meetings

### External Communication
- Media relations contact
- Client notification procedures
- Stakeholder updates

## 4. Recovery Procedures

### Business Continuity
- Data backup and recovery
- Alternative work locations
- Client service continuity

### Employee Support
- Counseling services
- Insurance information
- Return-to-work procedures

## 5. Training and Drills

### Regular Training
- Quarterly emergency drills
- Annual safety training
- New employee orientation

### Documentation
- Incident reports
- Drill evaluations
- Plan updates

This plan should be reviewed and updated annually or whenever significant changes occur in the organization or facility.`,
        generated_at: new Date('2024-01-15')
      }
    },
    {
      id: 2,
      title: 'TechCorp Office Building Plan',
      organizationType: 'Corporate Office',
      status: 'draft',
      createdAt: new Date('2024-01-10'),
      hazards: ['Earthquake', 'Cyberattack'],
      data: {
        location: 'Seattle, WA',
        special_considerations: ['Tech company', 'Data center']
      },
      generatedPlan: {
        content: `# TechCorp Office Building Emergency Plan

## Executive Summary

This emergency plan addresses the specific needs of TechCorp's technology-focused operations, including data protection and business continuity requirements.

## 1. Critical Systems Protection

### Data Center Security
- Backup power systems
- Data redundancy procedures
- Cybersecurity protocols

### Network Security
- Incident response team
- Data breach procedures
- System recovery protocols

## 2. Earthquake Procedures

### Immediate Response
- Drop, Cover, and Hold On
- Evacuate after shaking stops
- Check for injuries and damage

### Post-Earthquake Actions
- Assess building integrity
- Check critical systems
- Implement business continuity plan

## 3. Cybersecurity Incidents

### Detection and Response
- Immediate system isolation
- Incident response team activation
- Client notification procedures

### Recovery Procedures
- System restoration
- Data integrity verification
- Security audit implementation

This plan is currently in draft status and requires final review and approval.`,
        generated_at: new Date('2024-01-10')
      }
    }
  ]);
  
  // Chatbot feature commented out for version 1
  // const [chatMessages, setChatMessages] = useState([
  //   {
  //     id: 1,
  //     type: 'bot',
  //     message: 'Hello! I\'m your Emergency Plan Assistant. I can help you create emergency plans using natural language. Just tell me about your organization and what kind of emergency plan you need.',
  //     timestamp: new Date()
  //   }
  // ]);
  // const [chatInput, setChatInput] = useState('');
  // const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  const handleSignOut = () => {
    if (signOut) {
      signOut();
    } else {
      window.location.reload();
    }
  };



  const handleEditProfile = () => {
    setShowProfileEditor(true);
  };

  const handleProfileSave = (updatedProfile) => {
    console.log('Profile updated successfully:', updatedProfile);
    setShowProfileEditor(false);
    // Refresh the profile to show updated data
    fetchProfile();
    // Navigate back to dashboard to show the updated profile
    setCurrentView('dashboard');
    alert('✅ Organization profile updated successfully!');
  };

  const handleProfileCancel = () => {
    setShowProfileEditor(false);
  };

  // Personal information handlers
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({ ...prev, [name]: value }));
    setPersonalInfoMessage('');
    setPersonalInfoError('');
  };

  const handleEditPersonalInfo = () => {
    setIsEditingPersonal(true);
    setPersonalInfoMessage('');
    setPersonalInfoError('');
  };

  const handleCancelPersonalInfo = () => {
    setIsEditingPersonal(false);
    // Reset to original values
    setPersonalInfo({
      firstName: user?.attributes?.given_name || '',
      lastName: user?.attributes?.family_name || '',
      email: user?.attributes?.email || ''
    });
    setPersonalInfoMessage('');
    setPersonalInfoError('');
  };

  const handleSavePersonalInfo = async () => {
    setPersonalInfoSaving(true);
    setPersonalInfoMessage('');
    setPersonalInfoError('');

    try {
      const updates = {};
      if (personalInfo.firstName !== (user?.attributes?.given_name || '')) {
        updates.given_name = personalInfo.firstName;
      }
      if (personalInfo.lastName !== (user?.attributes?.family_name || '')) {
        updates.family_name = personalInfo.lastName;
      }

      if (Object.keys(updates).length > 0) {
        await updateUserAttributes(updates);
        setPersonalInfoMessage('Personal information updated successfully!');
        setIsEditingPersonal(false);
        
        // Update the user object to reflect changes
        if (user) {
          user.attributes = {
            ...user.attributes,
            ...updates
          };
        }
      } else {
        setPersonalInfoMessage('No changes to save');
        setIsEditingPersonal(false);
      }
    } catch (error) {
      console.error('Error updating personal information:', error);
      setPersonalInfoError(`Update failed: ${error.message}`);
    } finally {
      setPersonalInfoSaving(false);
    }
  };





  const handlePlanSubmit = (planData) => {
    const newPlan = {
      id: Date.now(),
      title: `${planData.organization_name} Emergency Plan`,
      organizationType: planData.organization_type,
      status: 'published',
      createdAt: new Date(),
      hazards: planData.primary_hazards,
      data: planData,
      generatedPlan: planData.generatedPlan // Store the generated plan content
    };
    setUserPlans(prev => [newPlan, ...prev]);
    // Set the selected plan and navigate to view-plan to show the generated plan
    setSelectedPlan(newPlan);
    setCurrentView('view-plan');
  };

  // Chatbot functionality commented out for version 1
  // const handleChatSubmit = (e) => {
  //   e.preventDefault();
  //   if (!chatInput.trim()) return;

  //   const userMessage = {
  //     id: Date.now(),
  //     type: 'user',
  //     message: chatInput,
  //     timestamp: new Date()
  //   };

  //   setChatMessages(prev => [...prev, userMessage]);
  //   setChatInput('');
  //   setIsGeneratingPlan(true);

  //   // Simulate bot response
  //   setTimeout(() => {
  //     const botResponse = {
  //       id: Date.now() + 1,
  //       type: 'bot',
  //       message: 'I understand you want to create an emergency plan. I\'m processing your request and will generate a comprehensive plan based on your requirements. This feature is coming soon!',
  //       timestamp: new Date()
  //     };
  //     setChatMessages(prev => [...prev, botResponse]);
  //     setIsGeneratingPlan(false);
  //   }, 2000);
  // };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  const getUserDisplayName = (user) => {
    console.log('Getting display name for user:', user);
    console.log('User attributes:', user?.attributes);
    
    // Try custom attributes first (if they exist)
    if (user?.attributes?.['custom:FirstName'] && user?.attributes?.['custom:LastName']) {
      return `${user.attributes['custom:FirstName']} ${user.attributes['custom:LastName']}`;
    } else if (user?.attributes?.['custom:FirstName']) {
      return user.attributes['custom:FirstName'];
    }
    
    // Try standard Cognito attributes
    if (user?.attributes?.given_name && user?.attributes?.family_name) {
      return `${user.attributes.given_name} ${user.attributes.family_name}`;
    } else if (user?.attributes?.given_name) {
      return user.attributes.given_name;
    } else if (user?.attributes?.family_name) {
      return user.attributes.family_name;
    }
    
    // Try name attribute
    if (user?.attributes?.name) {
      return user.attributes.name;
    }
    
    // Fall back to email
    if (user?.attributes?.email) {
      // Extract name from email (e.g., "john.doe@example.com" -> "john.doe")
      const emailName = user.attributes.email.split('@')[0];
      // Convert to title case and replace dots/underscores with spaces
      return emailName
        .replace(/[._]/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
    }
    
    // Fall back to username
    if (user?.username) {
      return user.username;
    }
    
    return 'User';
  };

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">Welcome to the Emergency Plan Operating System</h2>
        <p className="text-blue-200 mt-2">
          Create, manage, and maintain comprehensive emergency plans and related documentation for your organization
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Plans</p>
              <p className="text-2xl font-bold text-gray-900">{userPlans.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Published</p>
              <p className="text-2xl font-bold text-gray-900">
                {userPlans.filter(plan => plan.status === 'published').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Drafts</p>
              <p className="text-2xl font-bold text-gray-900">
                {userPlans.filter(plan => plan.status === 'draft').length}
              </p>
            </div>
          </div>
        </div>
      </div>



      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => setCurrentView('create-plan')}
              className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02]"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create New Plan
            </button>
            <button
              onClick={() => setCurrentView('update-profile')}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Update Organizational Profile
            </button>

            

            
            {/* Chatbot feature commented out for version 1 */}
            {/* <button
              onClick={() => setCurrentView('chat')}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Chat with AI Assistant
            </button> */}
            
            <button
              onClick={() => setCurrentView('view-plans')}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              View All Plans
            </button>
          </div>
        </div>

        {/* Organization Profile Summary */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Organization Profile</h3>
            <button
              onClick={() => setCurrentView('update-profile')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
            >
              Edit Profile →
            </button>
          </div>
          
          {profileLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading profile...</span>
            </div>
          ) : profile ? (
            <div className="space-y-4">

              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                  <p className="text-lg font-semibold text-gray-900">{profile.organizationName || 'Not specified'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organization Type</label>
                  <p className="text-lg font-semibold text-gray-900">{profile.organizationType || 'Not specified'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primary Contact</label>
                  <p className="text-gray-900">{profile.primaryContactName || 'Not specified'}</p>
                  <p className="text-sm text-gray-600">{profile.primaryContactEmail || 'No email provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <p className="text-gray-900">{profile.city && profile.state ? `${profile.city}, ${profile.state}` : 'Not specified'}</p>
                  <p className="text-sm text-gray-600">{profile.primaryAddress || 'No address provided'}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Last updated: {profile.lastUpdated ? new Date(profile.lastUpdated).toLocaleDateString() : 'Never'}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No organization profile</h3>
              <p className="mt-1 text-sm text-gray-500">Complete your organization profile to get started.</p>
              <button
                onClick={() => setCurrentView('update-profile')}
                className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Create Profile
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Emergency Plans</h3>
            <button
              onClick={() => setPlansSectionCollapsed(!plansSectionCollapsed)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg 
                className={`w-5 h-5 transform transition-transform ${plansSectionCollapsed ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          
          {!plansSectionCollapsed && (
            <>
              {userPlans.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No plans yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by creating your first emergency plan.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {userPlans.slice(0, 3).map((plan) => (
                    <div
                      key={plan.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md cursor-pointer transition-all duration-200"
                      onClick={() => setCurrentView('view-plans')}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{plan.title}</h4>
                          <p className="text-sm text-gray-500">{plan.organizationType}</p>
                        </div>
                        <div className="text-sm text-gray-400">{formatDate(plan.createdAt)}</div>
                      </div>
                      <div className="mt-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          plan.status === 'published' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {plan.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );

  const renderCreatePlan = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Create Emergency Plan</h2>
        <button
          onClick={() => setCurrentView('dashboard')}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          ← Back to Dashboard
        </button>
      </div>
      <EnhancedPlanForm 
        onSubmit={handlePlanSubmit} 
        onCancel={() => setCurrentView('dashboard')} 
        user={user}
      />
    </div>
  );

  const renderViewPlans = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">All Emergency Plans</h2>
        <button
          onClick={() => setCurrentView('dashboard')}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          ← Back to Dashboard
        </button>
      </div>
      
      {userPlans.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No plans found</h3>
          <p className="mt-2 text-gray-500">Create your first emergency plan to get started.</p>
          <button
            onClick={() => setCurrentView('create-plan')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Plan
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userPlans.map((plan) => (
            <div key={plan.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{plan.title}</h3>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  plan.status === 'published' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {plan.status}
                </span>
              </div>
              <p className="text-gray-600 mb-3">{plan.organizationType}</p>
              <p className="text-sm text-gray-500 mb-4">Created: {formatDate(plan.createdAt)}</p>
              {plan.hazards && plan.hazards.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Hazard Identification:</p>
                  <div className="flex flex-wrap gap-1">
                    {plan.hazards.slice(0, 3).map((hazard, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {hazard}
                      </span>
                    ))}
                    {plan.hazards.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        +{plan.hazards.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
              <div className="flex space-x-2">
                <button 
                  onClick={() => {
                    setSelectedPlan(plan);
                    setCurrentView('view-plan');
                  }}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Plan
                </button>
                <button className="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Chatbot feature commented out for version 1
  // const renderChat = () => (
  //   <div className="space-y-6">
  //     <div className="flex items-center justify-between">
  //       <h2 className="text-2xl font-bold text-gray-900">AI Emergency Assistant</h2>
  //       <button
  //         onClick={() => setCurrentView('dashboard')}
  //         className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
  //       >
  //         ← Back to Dashboard
  //       </button>
  //     </div>
  //     
  //     <div className="bg-white rounded-xl shadow-lg border border-gray-100 h-96 flex flex-col">
  //       {/* Chat Messages */}
  //       <div className="flex-1 p-6 overflow-y-auto space-y-4">
  //         {chatMessages.map((message) => (
  //           <div
  //             key={message.id}
  //             className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
  //           >
  //             <div
  //               className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
  //                 message.type === 'user'
  //                   ? 'bg-blue-600 text-white'
  //                   : 'bg-gray-100 text-gray-900'
  //               }`}
  //             >
  //               <p className="text-sm">{message.message}</p>
  //               <p className={`text-xs mt-1 ${
  //                 message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
  //               }`}>
  //                 {message.timestamp.toLocaleTimeString()}
  //               </p>
  //             </div>
  //           </div>
  //         ))}
  //         {isGeneratingPlan && (
  //           <div className="flex justify-start">
  //             <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
  //               <div className="flex items-center space-x-2">
  //                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
  //                 <span className="text-sm">Generating plan...</span>
  //               </div>
  //             </div>
  //           </div>
  //         )}
  //       </div>
  //       
  //       {/* Chat Input */}
  //       <div className="border-t border-gray-200 p-4">
  //         <form onSubmit={handleChatSubmit} className="flex space-x-2">
  //           <input
  //             type="text"
  //             value={chatInput}
  //             onChange={(e) => setChatInput(e.target.value)}
  //             placeholder="Describe your organization and emergency plan needs..."
  //             className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //             disabled={isGeneratingPlan}
  //           />
  //           <button
  //             type="submit"
  //             disabled={!chatInput.trim() || isGeneratingPlan}
  //             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
  //           >
  //             Send
  //           </button>
  //         </form>
  //       </div>
  //     </div>
  //     
  //     <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
  //       <h3 className="text-sm font-medium text-blue-800 mb-2">💡 Chat Tips</h3>
  //       <ul className="text-sm text-blue-700 space-y-1">
  //         <li>• "I need an emergency plan for a 50-person office building in downtown Seattle"</li>
  //         <li>• "Create a plan for a hospital with earthquake and fire hazards"</li>
  //         <li>• "Help me plan for a school with 200 students and staff"</li>
  //       </ul>
  //     </div>
  //   </div>
  // );

  const renderUpdateProfile = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Profile Management</h2>
        <button
          onClick={() => setCurrentView('dashboard')}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          ← Back to Dashboard
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Profile */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
            {!isEditingPersonal ? (
              <button
                onClick={handleEditPersonalInfo}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
              >
                Edit →
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleCancelPersonalInfo}
                  className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePersonalInfo}
                  disabled={personalInfoSaving}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {personalInfoSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            )}
          </div>
          
          {/* Success/Error Messages */}
          {personalInfoMessage && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              {personalInfoMessage}
            </div>
          )}
          {personalInfoError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {personalInfoError}
            </div>
          )}
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={isEditingPersonal ? personalInfo.firstName : (user?.attributes?.given_name || '')}
                  onChange={handlePersonalInfoChange}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isEditingPersonal ? '' : 'bg-gray-50'
                  }`}
                  placeholder="First Name"
                  readOnly={!isEditingPersonal}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={isEditingPersonal ? personalInfo.lastName : (user?.attributes?.family_name || '')}
                  onChange={handlePersonalInfoChange}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isEditingPersonal ? '' : 'bg-gray-50'
                  }`}
                  placeholder="Last Name"
                  readOnly={!isEditingPersonal}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={user?.attributes?.email || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                placeholder="Email"
                readOnly
              />
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">💡 Personal Information</h4>
              <p className="text-sm text-blue-700">
                You can update your first and last name here. Your email address is managed through your AWS Cognito account and cannot be changed from this interface.
              </p>
            </div>
          </div>
        </div>

        {/* Organizational Profile */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Organizational Profile</h3>
          <div className="space-y-4">
            {profileLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading organization profile...</span>
              </div>
            ) : profile ? (
              <div className="space-y-4">
                {console.log('=== DASHBOARD PROFILE DEBUG ===')}
                {console.log('Profile object:', profile)}
                {console.log('Profile keys:', Object.keys(profile))}
                {console.log('Organization name:', profile.organizationName)}
                {console.log('Organization type:', profile.organizationType)}
                {console.log('Primary contact name:', profile.primaryContactName)}
                {console.log('Primary contact email:', profile.primaryContactEmail)}
                {console.log('=== END DEBUG ===')}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name</label>
                    <input
                      type="text"
                      value={profile.organizationName || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Organization Name"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Organization Type</label>
                    <input
                      type="text"
                      value={profile.organizationType || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Organization Type"
                      readOnly
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Contact</label>
                  <input
                    type="text"
                    value={`${profile.primaryContactName || ''} ${profile.primaryContactEmail ? `(${profile.primaryContactEmail})` : ''}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Primary Contact"
                    readOnly
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={`${profile.primaryAddress || ''}, ${profile.city || ''}, ${profile.state || ''} ${profile.zipCode || ''}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Location"
                    readOnly
                  />
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-green-800 mb-2">✅ Profile Complete</h4>
                  <p className="text-sm text-green-700">
                    Your organization profile is complete and ready for emergency plan generation.
                  </p>
                </div>
                
                {/* Debug: Show all profile data */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-800 mb-2">🔍 Profile Data Debug</h4>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div><strong>ID:</strong> {profile.id || 'N/A'}</div>
                    <div><strong>Organization Name:</strong> {profile.organizationName || 'N/A'}</div>
                    <div><strong>Organization Type:</strong> {profile.organizationType || 'N/A'}</div>
                    <div><strong>Industry:</strong> {profile.industry || 'N/A'}</div>
                    <div><strong>Primary Contact:</strong> {profile.primaryContactName || 'N/A'} ({profile.primaryContactEmail || 'N/A'})</div>
                    <div><strong>Address:</strong> {profile.primaryAddress || 'N/A'}, {profile.city || 'N/A'}, {profile.state || 'N/A'}</div>
                    <div><strong>Onboarding Complete:</strong> {profile.isOnboardingComplete ? 'Yes' : 'No'}</div>
                    <div><strong>Last Updated:</strong> {profile.lastUpdated || 'N/A'}</div>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setCurrentView('dashboard')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Back to Dashboard
                  </button>
                  <button
                    onClick={handleEditProfile}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Edit Profile
                  </button>

                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-500 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Organization Profile</h3>
                <p className="text-gray-600 mb-4">
                  You haven't completed your organization profile yet. This is required for emergency plan generation.
                </p>
                <button
                  onClick={() => {
                    // Navigate to onboarding for organization profile completion
                    setCurrentView('onboarding');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Complete Profile Setup
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSupport = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Support & Help</h2>
        <button
          onClick={() => setCurrentView('dashboard')}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          ← Back to Dashboard
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Support</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700">Email Support</p>
              <a href="mailto:training@lesconsulting.org" className="text-blue-600 hover:text-blue-800">
                training@lesconsulting.org
              </a>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Response Time</p>
              <p className="text-gray-600">Within 24-48 hours during business days</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Help Resources</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-gray-700">User Guide & Documentation</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span className="text-gray-700">Video Tutorials</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-700">FAQ & Troubleshooting</span>
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700 mr-2">Backend Status:</span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              backendStatus === 'available' ? 'bg-green-100 text-green-800' :
              backendStatus === 'unavailable' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {backendStatus === 'available' ? '✅ Available' :
               backendStatus === 'unavailable' ? '❌ Unavailable' :
               '⏳ Checking...'}
            </span>
          </div>

          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700 mr-2">Profile Status:</span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              profile ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {profile ? '✅ Loaded' : '❌ Not Found'}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-800 mb-2">💡 Need Immediate Help?</h3>
        <p className="text-sm text-blue-700">
          For urgent technical issues or questions about emergency plan generation, please contact our support team at training@lesconsulting.org. 
          We're here to help you create comprehensive and effective emergency plans for your organization.
        </p>
      </div>
    </div>
  );

  const renderOnboarding = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Complete Organization Profile</h2>
        <button
          onClick={() => setCurrentView('dashboard')}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          ← Back to Dashboard
        </button>
      </div>
      <Onboarding 
        onComplete={() => {
          setCurrentView('dashboard');
          // Refresh the profile data
          window.location.reload();
        }}
        onSignOut={handleSignOut}
        hideHeader={true}
      />
    </div>
  );

  const renderLegal = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Legal & Privacy</h2>
        <button
          onClick={() => setCurrentView('dashboard')}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          ← Back to Dashboard
        </button>
      </div>
      
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Terms and Conditions</h3>
          <div className="prose prose-sm max-w-none text-gray-700">
            <p className="mb-4">
              <strong>Acceptance of Terms:</strong> By using EPOS (Emergency Plan Operating System), you agree to these terms and conditions.
            </p>
            <p className="mb-4">
              <strong>Limited Liability:</strong> L.E.S. Consulting provides EPOS as a tool to assist in emergency plan creation. 
              We assume no liability for the results, accuracy, or effectiveness of any plans generated using this system.
            </p>
            <p className="mb-4">
              <strong>AI-Generated Content:</strong> EPOS leverages artificial intelligence which may contain errors or inaccuracies. 
              Users are responsible for verifying all outputs for veracity and correctness before implementation.
            </p>
            <p className="mb-4">
              <strong>Release of Liability:</strong> Use of EPOS releases L.E.S. Consulting from any liability should harm result from 
              the use of generated plans or system outputs.
            </p>
            <p className="mb-4">
              <strong>User Responsibility:</strong> Users must review, validate, and customize all generated content to ensure it meets 
              their specific organizational requirements and complies with applicable regulations.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Privacy Policy</h3>
          <div className="prose prose-sm max-w-none text-gray-700">
            <p className="mb-4">
              <strong>Data Collection:</strong> EPOS collects only the information necessary to generate emergency plans, including 
              organization details and hazard assessments.
            </p>
            <p className="mb-4">
              <strong>Data Usage:</strong> Your data is used solely for plan generation and is not shared with third parties without 
              your explicit consent.
            </p>
            <p className="mb-4">
              <strong>Data Security:</strong> We implement appropriate security measures to protect your information, but no system 
              is completely secure.
            </p>
            <p className="mb-4">
              <strong>Data Retention:</strong> Generated plans and associated data are retained for the duration of your account 
              and may be deleted upon request.
            </p>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">⚠️ Important Disclaimer</h3>
          <p className="text-sm text-yellow-700">
            EPOS is a tool designed to assist in emergency planning. It is not a substitute for professional emergency management 
            consultation. Always consult with qualified emergency management professionals and local authorities when implementing 
            emergency plans.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Only show when not in user-profile view */}
      {currentView !== 'user-profile' && (
        <header className="bg-white shadow-lg border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              {/* Menu Button and Logo - Left */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <img src={logo} alt="EPOS Logo" className="h-24 w-auto object-contain" />
              </div>
              
              {/* User Info and Actions - Right */}
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Welcome, {getUserDisplayName(user)}
                </span>
                <button 
                  onClick={() => setCurrentView('user-profile')}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
                >
                  Update Profile
                </button>
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
      )}

      {/* Sidebar Menu - Only show when not in user-profile view */}
      {currentView !== 'user-profile' && (
        <>
          <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="p-6">
              <div className="space-y-2">
                <button
                  onClick={() => { setCurrentView('dashboard'); setSidebarOpen(false); }}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    currentView === 'dashboard' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  </svg>
                  Dashboard
                </button>
                <button
                  onClick={() => { setCurrentView('create-plan'); setSidebarOpen(false); }}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    currentView === 'create-plan' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create New Plan
                </button>
                <button
                  onClick={() => { setCurrentView('view-plans'); setSidebarOpen(false); }}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    currentView === 'view-plans' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  View All Plans
                </button>
                <button
                  onClick={() => { setCurrentView('update-profile'); setSidebarOpen(false); }}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    currentView === 'update-profile' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Organizational Profile
                </button>
                <button
                  onClick={() => { setCurrentView('support'); setSidebarOpen(false); }}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    currentView === 'support' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Support & Help
                </button>
                <button
                  onClick={() => { setCurrentView('legal'); setSidebarOpen(false); }}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    currentView === 'legal' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Legal & Privacy
                </button>
                <button
                  onClick={() => { setCurrentView('debug'); setSidebarOpen(false); }}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    currentView === 'debug' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Debug
                </button>
              </div>
            </nav>
          </div>

          {/* Overlay for sidebar */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 z-40 bg-black bg-opacity-50"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </>
      )}

      {/* Main Content */}
      {showProfileEditor ? (
        <ProfileEditor 
          onSave={handleProfileSave}
          onCancel={handleProfileCancel}
        />
      ) : currentView === 'user-profile' ? (
        // UserProfile component handles its own layout
        <UserProfile 
          onBack={() => setCurrentView('dashboard')}
          onSignOut={handleSignOut}
        />
      ) : (
        // Standard layout for other views
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {currentView === 'dashboard' && renderDashboard()}
            {currentView === 'create-plan' && renderCreatePlan()}
            {currentView === 'view-plans' && renderViewPlans()}
            {currentView === 'view-plan' && selectedPlan && (
              <PlanViewer 
                plan={selectedPlan}
                onBack={() => setCurrentView('view-plans')}
              />
            )}
            {currentView === 'update-profile' && renderUpdateProfile()}
            {currentView === 'onboarding' && renderOnboarding()}
            {currentView === 'support' && renderSupport()}
            {currentView === 'legal' && renderLegal()}
    
            {/* Chatbot feature commented out for version 1 */}
            {/* {currentView === 'chat' && renderChat()} */}
          </div>
        </main>
      )}

      {/* Footer - Only show when not in user-profile view */}
      {currentView !== 'user-profile' && (
        <footer className="bg-gray-800 text-white py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">EPOS</h3>
                <p className="text-gray-300 text-sm">
                  Emergency Plan Operating System - Powered by AI to help organizations create comprehensive emergency plans.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Support</h3>
                <p className="text-gray-300 text-sm mb-2">
                  Need help? Contact us at:
                </p>
                <a href="mailto:training@lesconsulting.org" className="text-blue-400 hover:text-blue-300 text-sm">
                  training@lesconsulting.org
                </a>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Legal</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setCurrentView('legal')}
                    className="block text-gray-300 hover:text-white text-sm"
                  >
                    Terms & Conditions
                  </button>
                  <button
                    onClick={() => setCurrentView('legal')}
                    className="block text-gray-300 hover:text-white text-sm"
                  >
                    Privacy Policy
                  </button>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-8 text-center">
              <p className="text-gray-400 text-sm">
                © 2024 L.E.S. Consulting. All rights reserved. EPOS is a tool designed to assist in emergency planning and is not a substitute for professional consultation.
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default Dashboard; 