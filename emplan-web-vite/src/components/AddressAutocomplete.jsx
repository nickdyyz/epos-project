import React, { useState, useEffect, useRef } from 'react';

const AddressAutocomplete = ({ 
  value, 
  onChange, 
  placeholder = "Enter address",
  className = "",
  disabled = false,
  required = false
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const wrapperRef = useRef(null);

  // Common address patterns for autocomplete suggestions
  const commonAddresses = [
    "123 Main Street",
    "456 Oak Avenue",
    "789 Pine Road",
    "321 Elm Street",
    "654 Maple Drive",
    "987 Cedar Lane",
    "147 Birch Boulevard",
    "258 Spruce Court",
    "369 Willow Way",
    "741 Aspen Circle"
  ];

  // Filter suggestions based on input
  const getSuggestions = (input) => {
    if (!input || input.length < 2) return [];
    
    const inputLower = input.toLowerCase();
    return commonAddresses.filter(address => 
      address.toLowerCase().includes(inputLower)
    ).slice(0, 5); // Limit to 5 suggestions
  };

  // Handle input change
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Update parent component
    onChange(e);
    
    // Show/hide suggestions
    if (newValue.length >= 2) {
      const newSuggestions = getSuggestions(newValue);
      setSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setShowSuggestions(false);
    setSuggestions([]);
    
    // Create a synthetic event to update parent
    const syntheticEvent = {
      target: {
        name: 'primaryAddress',
        value: suggestion
      }
    };
    onChange(syntheticEvent);
  };

  // Handle focus
  const handleFocus = () => {
    if (inputValue.length >= 2) {
      const newSuggestions = getSuggestions(inputValue);
      setSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0);
    }
  };

  // Handle blur
  const handleBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Sync with external value changes
  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        name="primaryAddress"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        required={required}
        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
        placeholder={placeholder}
      />
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none border-b border-gray-100 last:border-b-0"
            >
              <div className="font-medium text-gray-900">{suggestion}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressAutocomplete;
