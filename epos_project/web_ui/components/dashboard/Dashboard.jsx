import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { 
  PlusIcon, 
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [user, loading, error] = useAuthState(auth);
  const [userProfile, setUserProfile] = useState(null);
  const [recentPlans, setRecentPlans] = useState([]);
  const [stats, setStats] = useState({
    totalPlans: 0,
    planLimit: 3,
    lastLogin: null
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadUserData();
      loadRecentPlans();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserProfile(userData.profile);
        setStats({
          totalPlans: userData.subscription.plansCreated || 0,
          planLimit: userData.subscription.planLimit || 3,
          lastLogin: userData.profile.createdAt
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadRecentPlans = async () => {
    try {
      const plansQuery = query(
        collection(db, 'users', user.uid, 'plans'),
        orderBy('createdAt', 'desc'),
        limit(5)
      );
      const querySnapshot = await getDocs(plansQuery);
      const plans = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRecentPlans(plans);
    } catch (error) {
      console.error('Error loading recent plans:', error);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Unknown';
    return new Date(date.toDate ? date.toDate() : date).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!user) {
    navigate('/signin');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back{userProfile?.fullName ? `, ${userProfile.fullName}` : ''}!
                </h1>
                <p className="text-gray-600">
                  {userProfile?.organizationName || 'Complete your profile to get started'}
                </p>
              </div>
              <button
                onClick={() => navigate('/create-plan')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                Create Plan
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DocumentTextIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Emergency Plans
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.totalPlans} of {stats.planLimit}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ClockIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Last Activity
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {formatDate(stats.lastLogin)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Account Status
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      Free Plan
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6 space-y-4">
              <button
                onClick={() => navigate('/create-plan')}
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                <PlusIcon className="-ml-1 mr-3 h-5 w-5" />
                Create New Emergency Plan
              </button>

              <button
                onClick={() => navigate('/chat')}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <ChatBubbleLeftRightIcon className="-ml-1 mr-3 h-5 w-5" />
                Chat with Emergency Assistant
              </button>

              <button
                onClick={() => navigate('/plans')}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <DocumentTextIcon className="-ml-1 mr-3 h-5 w-5" />
                View All Plans
              </button>
            </div>
          </div>

          {/* Recent Plans */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Recent Plans</h2>
            </div>
            <div className="p-6">
              {recentPlans.length === 0 ? (
                <div className="text-center py-8">
                  <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No plans yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by creating your first emergency plan.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={() => navigate('/create-plan')}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                    >
                      <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                      Create Plan
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md cursor-pointer"
                      onClick={() => navigate(`/plans/${plan.id}`)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            {plan.title || 'Untitled Plan'}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {plan.organizationType || 'Organization Type Not Set'}
                          </p>
                        </div>
                        <div className="text-sm text-gray-400">
                          {formatDate(plan.createdAt)}
                        </div>
                      </div>
                      {plan.status && (
                        <div className="mt-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            plan.status === 'published' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {plan.status}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Emergency Preparedness Tips
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc space-y-1 pl-5">
                  <li>Review and update your emergency plans quarterly</li>
                  <li>Conduct regular emergency drills with your team</li>
                  <li>Keep emergency contact information up to date</li>
                  <li>Ensure all team members know their roles during emergencies</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
