import React, { useState } from 'react';
import logo from './epos-logo.png';

function PlanViewer({ plan, onBack, onDownload }) {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Debug function to log password changes
  const handlePasswordChange = (e) => {
    console.log('Password change event:', e.target.value);
    setPassword(e.target.value);
  };
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const formatPlanContent = (content) => {
    if (!content) return '<p class="text-gray-500 italic">No plan content available</p>';
    
    // Convert markdown-like content to HTML for better display
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic text
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-900 mb-4">$1</h1>') // H1
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold text-gray-800 mb-3 mt-6">$1</h2>') // H2
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-medium text-gray-700 mb-2 mt-4">$1</h3>') // H3
      .replace(/^#### (.*$)/gim, '<h4 class="text-base font-medium text-gray-600 mb-2 mt-3">$1</h4>') // H4
      .replace(/^- (.*$)/gim, '<li class="ml-4 mb-1">$1</li>') // List items
      .replace(/\n\n/g, '</p><p class="mb-4">') // Paragraphs
      .replace(/^([^<].*)/gm, '<p class="mb-4">$1</p>'); // Regular text
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload(plan);
    } else {
      // Default download behavior - now downloads as PDF
      const element = document.createElement('a');
      const file = new Blob([plan.generatedPlan?.content || 'No content available'], { type: 'text/markdown' });
      element.href = URL.createObjectURL(file);
      element.download = `${plan.title.replace(/\s+/g, '_')}.md`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const handlePDFDownload = async () => {
    if (!password) {
      alert('Please set a password for the PDF');
      return;
    }

    if (!hasValidPlanData) {
      alert('No plan content available for PDF generation');
      return;
    }

    setIsGeneratingPDF(true);
    
    try {
      const response = await fetch('http://localhost:5002/api/download-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: planContent,
          password: password,
          planTitle: plan.title
        })
      });

      if (response.ok) {
        // Get the PDF blob
        const blob = await response.blob();
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${plan.title.replace(/\s+/g, '_')}_Emergency_Plan.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        alert(`PDF downloaded successfully! Password: ${password}`);
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate PDF');
      }
      
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert(`Failed to download PDF: ${error.message}. Please check that the API server is running.`);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let result = '';
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(result);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }

    setIsGeneratingPDF(true);
    
    try {
      // Call the backend API to send the email
      const response = await fetch('http://localhost:5002/api/send-plan-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          planId: plan.id,
          planTitle: plan.title
        })
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        setEmailSent(true);
        setTimeout(() => {
          setShowEmailModal(false);
          setEmailSent(false);
          setEmail('');
          setPassword('');
        }, 3000);
      } else {
        throw new Error(result.error || 'Failed to send email');
      }
      
    } catch (error) {
      console.error('Error sending email:', error);
      alert(`Failed to send email: ${error.message}. Please check that the API server is running.`);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Check if plan has the required data structure
  const hasValidPlanData = plan && plan.generatedPlan && plan.generatedPlan.content;
  const planContent = hasValidPlanData ? plan.generatedPlan.content : 'No plan content available';
  const generatedAt = plan?.generatedPlan?.generated_at || plan?.createdAt || new Date();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <img src={logo} alt="EPOS Logo" className="h-24 w-auto object-contain" />
              <h1 className="ml-4 text-2xl font-bold text-gray-900">Emergency Plan Viewer</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← Back to Plans
              </button>
              
              {/* Password Input for PDF Download */}
              <div className="flex items-center space-x-2">
                {/* Test input to debug */}
                <input
                  type="text"
                  placeholder="Test Input"
                  onChange={(e) => console.log('Test input:', e.target.value)}
                  className="px-3 py-2 border border-red-300 rounded-md text-sm"
                  style={{ width: '100px' }}
                />
                <input
                  type="text"
                  name="pdf_password"
                  value={password}
                  onChange={handlePasswordChange}
                  onFocus={() => console.log('Password input focused')}
                  onBlur={() => console.log('Password input blurred')}
                  onKeyDown={(e) => console.log('Password keydown:', e.key)}
                  placeholder="PDF Password"
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  autoComplete="off"
                  style={{ pointerEvents: 'auto', zIndex: 10 }}
                />
                <button
                  type="button"
                  onClick={generatePassword}
                  className="px-2 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-xs"
                >
                  Generate
                </button>
              </div>
              
              <button
                onClick={() => setShowEmailModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
              >
                📧 Email PDF
              </button>
              <button
                onClick={handlePDFDownload}
                disabled={isGeneratingPDF}
                className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGeneratingPDF ? '🔄 Generating...' : '📄 Download PDF'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Plan Content */}
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Plan Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-white">
            <h1 className="text-3xl font-bold mb-2">{plan?.title || 'Untitled Plan'}</h1>
            <p className="text-blue-100 text-lg">
              {plan?.organizationType || 'Organization Type Not Set'} • {plan?.data?.location || 'Location Not Set'}
            </p>
            <div className="flex items-center mt-4 text-blue-200">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Generated on {new Date(generatedAt).toLocaleDateString()}
            </div>
          </div>

          {/* Plan Summary */}
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Hazard Identification</h3>
                <div className="flex flex-wrap gap-2">
                  {plan?.hazards && plan.hazards.length > 0 ? (
                    plan.hazards.map((hazard, index) => (
                      <span key={index} className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                        {hazard}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">No hazards specified</span>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Special Considerations</h3>
                <div className="flex flex-wrap gap-2">
                  {plan?.data?.special_considerations && plan.data.special_considerations.length > 0 ? (
                    plan.data.special_considerations.map((consideration, index) => (
                      <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                        {consideration}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">None specified</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Plan Content */}
          <div className="px-8 py-6">
            {!hasValidPlanData && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Plan Content Not Available
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>This plan appears to be missing its generated content. This may be due to:</p>
                      <ul className="list-disc list-inside mt-1">
                        <li>The plan was created before content generation was implemented</li>
                        <li>There was an error during plan generation</li>
                        <li>The plan data is incomplete</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: formatPlanContent(planContent) 
              }}
            />
          </div>

          {/* Plan Footer */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
            <div className="text-center text-gray-600">
              <p className="text-sm">
                This emergency plan was generated by EPOS (Emergency Plan Optimization System) 
                using AI-powered analysis of emergency management best practices.
              </p>
              <p className="text-xs mt-2">
                Generated on {new Date(generatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Email PDF Copy</h3>
              <button
                onClick={() => setShowEmailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {emailSent ? (
              <div className="text-center py-6">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Email Sent Successfully!</h3>
                <p className="text-sm text-gray-600">
                  Your password-protected PDF has been sent to {email}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Password: {password}
                </p>
              </div>
            ) : (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => {
                      console.log('Email change event:', e.target.value);
                      setEmail(e.target.value);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    PDF Password
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      id="password"
                      name="pdf_password"
                      value={password}
                      onChange={handlePasswordChange}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter password for PDF"
                      required
                      autoComplete="off"
                    />
                    <button
                      type="button"
                      onClick={generatePassword}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      Generate
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    This password will protect your PDF file
                  </p>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEmailModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isGeneratingPDF}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isGeneratingPDF ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating PDF...
                      </span>
                    ) : (
                      'Send PDF'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PlanViewer; 