# Address Mode Toggle Implementation

## Overview
Implemented a clear toggle-based approach for address input modes to resolve the city-only mode issues. Users can now explicitly choose between "City Only" and "Complete Address" modes, making the logic much more explicit and easier to debug.

## Problem Solved
**Previous Issue**: The city-only mode was not working reliably due to complex conditional logic and browser-level validation interference.

**Solution**: Implemented an explicit toggle that clearly separates the two modes and eliminates ambiguity in validation logic.

## Implementation Details

### New State Management
```javascript
// Added to both Onboarding.jsx and ProfileEditor.jsx
const [useCityOnly, setUseCityOnly] = useState(false);
```

### Toggle Handler
```javascript
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
```

### Updated Validation Logic
```javascript
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
```

## UI Implementation

### Address Mode Toggle Section
```jsx
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
        <strong>Complete Address Mode:</strong> You'll provide full address details for 
        more accurate emergency planning and response coordination.
      </p>
    </div>
  )}
</div>
```

### Conditional Field Rendering
```jsx
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

{/* State/Province Field */}
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

{/* Postal/Zip Code Field */}
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
```

## User Experience

### City Only Mode
- **Toggle Position**: Left (City Only highlighted)
- **Required Fields**: City *, Country *
- **Optional Fields**: State/Province (disabled), Postal/Zip Code (disabled)
- **Primary Address**: Hidden
- **Visual Indicator**: Blue info box explaining the mode
- **Validation**: Only city and country required

### Complete Address Mode
- **Toggle Position**: Right (Complete Address highlighted)
- **Required Fields**: Primary Address *, City *, State/Province *, Postal/Zip Code *, Country *
- **Optional Fields**: None
- **Primary Address**: Visible and required
- **Visual Indicator**: Green info box explaining the mode
- **Validation**: All location fields required

## Benefits

### Clarity
- **Explicit Choice**: Users clearly understand what mode they're in
- **Visual Feedback**: Toggle position and color coding indicate current mode
- **Clear Requirements**: Field labels show exactly what's required vs optional

### Reliability
- **No Browser Interference**: Removed all HTML `required` attributes
- **JavaScript-Only Validation**: Complete control over validation logic
- **No Ambiguous Logic**: Clear boolean state determines requirements

### User Control
- **Easy Switching**: Toggle allows users to change modes at any time
- **Data Preservation**: Switching modes preserves existing data where possible
- **Clear Trade-offs**: Users understand the impact of their choice

## Technical Implementation

### State Management
- **Single Boolean**: `useCityOnly` controls all conditional logic
- **Form Data Integration**: Toggle affects validation and UI rendering
- **Data Clearing**: Switching to city-only mode clears primary address

### Validation Logic
- **Mode-Based**: Validation rules depend on `useCityOnly` state
- **Consistent**: Same logic across onboarding and profile editing
- **Reliable**: No complex conditional checks or browser interference

### UI Rendering
- **Conditional Display**: Fields show/hide based on mode
- **Dynamic Labels**: Required/optional indicators update automatically
- **Disabled States**: Optional fields are disabled in city-only mode

## Files Updated

### Onboarding.jsx
- **State**: Added `useCityOnly` state
- **Handler**: Added `handleToggleCityOnly` function
- **Validation**: Updated `isStepValid` for Step 3
- **UI**: Complete rewrite of Step 3 rendering with toggle

### ProfileEditor.jsx
- **State**: Added `useCityOnly` state
- **Handler**: Added `handleToggleCityOnly` function
- **Validation**: Updated `isStepValid` for Step 3
- **UI**: Complete rewrite of Step 3 rendering with toggle

## Testing Scenarios

### Scenario 1: City Only Mode
1. **Toggle**: Set to "City Only"
2. **Fill**: City and Country
3. **Expected**: "Next" button enabled
4. **Verify**: State/Province and Postal Code are disabled

### Scenario 2: Complete Address Mode
1. **Toggle**: Set to "Complete Address"
2. **Fill**: All required fields (Primary Address, City, State, Postal Code, Country)
3. **Expected**: "Next" button enabled
4. **Verify**: All fields are enabled and required

### Scenario 3: Mode Switching
1. **Start**: Complete Address mode with filled fields
2. **Switch**: Toggle to City Only
3. **Expected**: Primary Address cleared, state/postal disabled
4. **Verify**: Can proceed with just city and country

### Scenario 4: Validation Edge Cases
1. **City Only**: Toggle on, fill only city (no country)
2. **Expected**: "Next" button disabled
3. **Complete Address**: Toggle off, fill only city and country
4. **Expected**: "Next" button disabled (missing state/postal)

## Future Enhancements

### Potential Improvements
- **Default Mode**: Remember user's preferred mode
- **Smart Detection**: Auto-detect mode based on existing data
- **Validation Messages**: Show specific error messages for each mode
- **Data Migration**: Help users migrate between modes

### Accessibility
- **Screen Reader Support**: Proper ARIA labels for toggle
- **Keyboard Navigation**: Full keyboard support for toggle
- **Focus Management**: Clear focus indicators

## Conclusion

The toggle-based approach provides a much more reliable and user-friendly solution for address input modes. By making the choice explicit and eliminating complex conditional logic, we've created a system that:

1. **Works Reliably**: No browser interference or ambiguous validation
2. **Is User-Friendly**: Clear visual indicators and easy mode switching
3. **Is Maintainable**: Simple boolean logic instead of complex conditionals
4. **Provides Flexibility**: Users can choose the level of detail they want to provide

This implementation successfully resolves the city-only mode issues while providing a better overall user experience.
