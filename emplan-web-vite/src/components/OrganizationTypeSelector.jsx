import React, { useState, useEffect, useCallback } from 'react';
import { 
  INDUSTRY_CLASSIFICATIONS, 
  getIndustryOptions, 
  getSubcategoryOptions, 
  getNAICSDescription,
  searchIndustryCategories,
  searchSubcategories
} from '../data/industryClassifications';

const OrganizationTypeSelector = ({ 
  value, 
  onChange, 
  onIndustryChange, 
  onSubcategoryChange,
  onCustomOrganizationType,
  onCustomIndustry,
  industryValue = '',
  subcategoryValue = '',
  customOrganizationType = '',
  customIndustry = '',
  required = false,
  disabled = false,
  className = ''
}) => {
  const [selectedIndustry, setSelectedIndustry] = useState(industryValue);
  const [selectedSubcategory, setSelectedSubcategory] = useState(subcategoryValue);
  const [industryOptions, setIndustryOptions] = useState([]);
  const [subcategoryOptions, setSubcategoryOptions] = useState([]);
  const [industrySearchTerm, setIndustrySearchTerm] = useState('');
  const [subcategorySearchTerm, setSubcategorySearchTerm] = useState('');
  const [filteredIndustryOptions, setFilteredIndustryOptions] = useState([]);
  const [filteredSubcategoryOptions, setFilteredSubcategoryOptions] = useState([]);
  const [showIndustrySearch, setShowIndustrySearch] = useState(false);
  const [showSubcategorySearch, setShowSubcategorySearch] = useState(false);

  // Memoize callback functions to prevent unnecessary re-renders
  const handleIndustryChangeCallback = useCallback((newValue) => {
    onIndustryChange?.(newValue);
  }, [onIndustryChange]);

  const handleSubcategoryChangeCallback = useCallback((newValue) => {
    onSubcategoryChange?.(newValue);
  }, [onSubcategoryChange]);

  // Sync component state with props
  useEffect(() => {
    setSelectedIndustry(industryValue);
    setSelectedSubcategory(subcategoryValue);
  }, [industryValue, subcategoryValue]);

  // Update industry options when organization type changes
  useEffect(() => {
    if (value) {
      const options = getIndustryOptions(value);
      setIndustryOptions(options);
      setFilteredIndustryOptions(options);
      
      // Only clear selections if the organization type actually changed
      // and we don't have existing values that match the new options
      if (!industryValue || !options.find(opt => opt.code === industryValue)) {
        setSelectedIndustry('');
        setSelectedSubcategory('');
        setSubcategoryOptions([]);
        setFilteredSubcategoryOptions([]);
        setIndustrySearchTerm('');
        setSubcategorySearchTerm('');
        
        // Clear previous selections
        handleIndustryChangeCallback('');
        handleSubcategoryChangeCallback('');
      }
    } else {
      setIndustryOptions([]);
      setSubcategoryOptions([]);
      setFilteredIndustryOptions([]);
      setFilteredSubcategoryOptions([]);
    }
  }, [value, industryValue, handleIndustryChangeCallback, handleSubcategoryChangeCallback]);

  // Update filtered industry options when search term changes
  useEffect(() => {
    if (value && industrySearchTerm) {
      const filtered = searchIndustryCategories(value, industrySearchTerm);
      setFilteredIndustryOptions(filtered);
    } else if (value && industryOptions.length > 0) {
      setFilteredIndustryOptions(industryOptions);
    }
  }, [value, industrySearchTerm, industryOptions]);

  // Update filtered subcategory options when search term changes
  useEffect(() => {
    if (value && selectedIndustry && subcategorySearchTerm) {
      const filtered = searchSubcategories(value, selectedIndustry, subcategorySearchTerm);
      setFilteredSubcategoryOptions(filtered);
    } else if (value && selectedIndustry && subcategoryOptions.length > 0) {
      setFilteredSubcategoryOptions(subcategoryOptions);
    }
  }, [value, selectedIndustry, subcategorySearchTerm, subcategoryOptions]);

  // Update subcategory options when industry changes
  useEffect(() => {
    if (value && selectedIndustry) {
      const options = getSubcategoryOptions(value, selectedIndustry);
      setSubcategoryOptions(options);
      setFilteredSubcategoryOptions(options);
      
      // Only clear subcategory if we don't have an existing value that matches the new options
      if (!subcategoryValue || !options.find(opt => opt.code === subcategoryValue)) {
        setSelectedSubcategory('');
        setSubcategorySearchTerm('');
        handleSubcategoryChangeCallback('');
      }
    } else {
      setSubcategoryOptions([]);
      setFilteredSubcategoryOptions([]);
    }
  }, [value, selectedIndustry, subcategoryValue, handleSubcategoryChangeCallback]);

  const handleOrganizationTypeChange = (e) => {
    const newValue = e.target.value;
    onChange(e);
  };

  const handleIndustryChange = (e) => {
    const newValue = e.target.value;
    setSelectedIndustry(newValue);
    handleIndustryChangeCallback(newValue);
  };

  const handleSubcategoryChange = (e) => {
    const newValue = e.target.value;
    setSelectedSubcategory(newValue);
    handleSubcategoryChangeCallback(newValue);
  };

  const handleIndustrySearchChange = (e) => {
    const searchTerm = e.target.value;
    setIndustrySearchTerm(searchTerm);
    setShowIndustrySearch(searchTerm.length > 0);
  };

  const handleSubcategorySearchChange = (e) => {
    const searchTerm = e.target.value;
    setSubcategorySearchTerm(searchTerm);
    setShowSubcategorySearch(searchTerm.length > 0);
  };

  const handleCustomOrganizationTypeChange = (e) => {
    onCustomOrganizationType?.(e.target.value);
  };

  const handleCustomIndustryChange = (e) => {
    onCustomIndustry?.(e.target.value);
  };

  const getOrganizationTypeDescription = (type) => {
    return INDUSTRY_CLASSIFICATIONS[type]?.description || '';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Organization Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Organization Type {required && <span className="text-red-500">*</span>}
        </label>
        <select
          value={value}
          onChange={handleOrganizationTypeChange}
          disabled={disabled}
          required={required}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">Select Organization Type</option>
          <option value="ForProfit">For-Profit</option>
          <option value="NonProfit">Non-Profit</option>
          <option value="Government">Government</option>
          <option value="Educational">Educational</option>
          <option value="Other">Other</option>
        </select>
        
        {value && value !== 'Other' && (
          <p className="mt-1 text-sm text-gray-600">
            {getOrganizationTypeDescription(value)}
          </p>
        )}

        {/* Custom Organization Type Input */}
        {value === 'Other' && (
          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specify Organization Type (Optional)
            </label>
            <input
              type="text"
              value={customOrganizationType}
              onChange={handleCustomOrganizationTypeChange}
              disabled={disabled}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="e.g., Cooperative, Foundation, Association"
            />
          </div>
        )}
      </div>

      {/* Industry Selection (Cascading Dropdown with Search) */}
      {value && industryOptions.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Industry Classification {required && value !== 'Other' && <span className="text-red-500">*</span>}
            {value === 'Other' && <span className="text-gray-500 text-xs ml-2">(Optional)</span>}
          </label>
          
          {/* Industry Search Input */}
          <div className="relative">
            <input
              type="text"
              value={industrySearchTerm}
              onChange={handleIndustrySearchChange}
              disabled={disabled}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Search industries"
            />
            {showIndustrySearch && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {filteredIndustryOptions.map((industry) => (
                  <button
                    key={industry.code}
                    type="button"
                    onClick={() => {
                      setSelectedIndustry(industry.code);
                      setIndustrySearchTerm(`${industry.code} - ${industry.description}`);
                      setShowIndustrySearch(false);
                      handleIndustryChangeCallback(industry.code);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                  >
                    <div className="font-medium">{industry.code} - {industry.description}</div>
                  </button>
                ))}
                {filteredIndustryOptions.length === 0 && (
                  <div className="px-3 py-2 text-gray-500">No matches found</div>
                )}
              </div>
            )}
          </div>

          {/* Industry Dropdown (fallback) */}
          <select
            value={selectedIndustry}
            onChange={handleIndustryChange}
            disabled={disabled}
            required={required}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed mt-2"
          >
            <option value="">{value === 'Other' ? 'Select Industry (Optional)' : 'Select Industry'}</option>
            {industryOptions.map((industry) => (
              <option key={industry.code} value={industry.code}>
                {industry.code} - {industry.description}
              </option>
            ))}
          </select>
          
          {selectedIndustry && (
            <p className="mt-1 text-sm text-gray-600">
              NAICS Code: {selectedIndustry}
            </p>
          )}

          {/* Custom Industry Input */}
          {selectedIndustry === 'OTHER' && (
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specify Industry (Optional)
              </label>
              <input
                type="text"
                value={customIndustry}
                onChange={handleCustomIndustryChange}
                disabled={disabled}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="e.g., Blockchain Technology, Renewable Energy"
              />
            </div>
          )}
        </div>
      )}

      {/* Subcategory Selection (Cascading Dropdown with Search) */}
      {value && selectedIndustry && subcategoryOptions.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Specific Category
          </label>
          
          {/* Subcategory Search Input */}
          <div className="relative">
            <input
              type="text"
              value={subcategorySearchTerm}
              onChange={handleSubcategorySearchChange}
              disabled={disabled}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Search categories"
            />
            {showSubcategorySearch && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {filteredSubcategoryOptions.map((subcategory) => (
                  <button
                    key={subcategory.code}
                    type="button"
                    onClick={() => {
                      setSelectedSubcategory(subcategory.code);
                      setSubcategorySearchTerm(`${subcategory.code} - ${subcategory.description}`);
                      setShowSubcategorySearch(false);
                      handleSubcategoryChangeCallback(subcategory.code);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                  >
                    <div className="font-medium">{subcategory.code} - {subcategory.description}</div>
                  </button>
                ))}
                {filteredSubcategoryOptions.length === 0 && (
                  <div className="px-3 py-2 text-gray-500">No matches found</div>
                )}
              </div>
            )}
          </div>

          {/* Subcategory Dropdown (fallback) */}
          <select
            value={selectedSubcategory}
            onChange={handleSubcategoryChange}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed mt-2"
          >
            <option value="">Select Specific Category (Optional)</option>
            {subcategoryOptions.map((subcategory) => (
              <option key={subcategory.code} value={subcategory.code}>
                {subcategory.code} - {subcategory.description}
              </option>
            ))}
          </select>
          
          {selectedSubcategory && (
            <p className="mt-1 text-sm text-gray-600">
              NAICS Code: {selectedSubcategory}
            </p>
          )}
        </div>
      )}

      {/* Summary Display */}
      {value && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Selected Classification:</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <p><strong>Organization Type:</strong> {value === 'Other' ? `Other${customOrganizationType ? ` - ${customOrganizationType}` : ''}` : INDUSTRY_CLASSIFICATIONS[value]?.label}</p>
            {selectedIndustry && selectedIndustry !== 'OTHER' && (
              <>
                <p><strong>Industry:</strong> {getNAICSDescription(value, selectedIndustry)}</p>
                {selectedSubcategory && (
                  <p><strong>Category:</strong> {getNAICSDescription(value, selectedIndustry, selectedSubcategory)}</p>
                )}
                <p><strong>NAICS Code:</strong> {selectedSubcategory || selectedIndustry}</p>
              </>
            )}
            {selectedIndustry === 'OTHER' && (
              <p><strong>Industry:</strong> Other{customIndustry ? ` - ${customIndustry}` : ''}</p>
            )}
            {value === 'Other' && !selectedIndustry && (
              <p><strong>Custom Type:</strong> {customOrganizationType || 'Not specified'}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationTypeSelector;
