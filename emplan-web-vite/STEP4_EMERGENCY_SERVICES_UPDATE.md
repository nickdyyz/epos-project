# Step 4 Emergency Services Update

## Overview
Updated Step 4 of the organizational profile workflow to focus specifically on emergency services information, removing redundant contact fields and adding a new optional field for additional emergency services.

## Changes Made

### 1. Section Rename
- **Before**: "Emergency Contact Information"
- **After**: "Emergency Services"
- **Rationale**: More accurately reflects the content and purpose of the step

### 2. Removed Redundant Fields
Removed the following fields since they are already collected in Step 2 (Primary Contact Information):
- Emergency Contact Name
- Emergency Contact Phone  
- Emergency Contact Email

**Rationale**: Avoids duplication and confusion. The primary contact information from Step 2 serves as the main emergency contact.

### 3. Kept Essential Emergency Service Fields
Maintained the following fields for emergency service coordination:
- **Nearest Hospital**: Name, address, and contact information
- **Nearest Fire Station**: Name, address, and contact information  
- **Nearest Police Station**: Name, address, and contact information

### 4. Added New Optional Field
- **Other Emergency Services**: Free text field for additional emergency services
  - **Type**: Textarea (3 rows)
  - **Required**: No (optional)
  - **Purpose**: Capture specialized medical facilities, emergency shelters, utility emergency contacts, etc.

## Implementation Details

### Form Data Updates
```javascript
// Added to both Onboarding.jsx and ProfileEditor.jsx
const [formData, setFormData] = useState({
  // ... existing fields ...
  otherEmergencyServices: '',
  // ... existing fields ...
});
```

### Validation Logic Updates
```javascript
// Updated in both Onboarding.jsx and ProfileEditor.jsx
case 4: // Onboarding.jsx
case 5: // ProfileEditor.jsx (different step numbering)
  return true; // All fields are optional in Emergency Services step
```

### UI Updates

#### Onboarding.jsx Step 4
```jsx
const renderStep4 = () => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Services</h3>
      <p className="text-gray-600 mb-6">Information about nearby emergency services for coordination during incidents.</p>
    </div>
    
    <div className="space-y-4">
      {/* Nearest Hospital */}
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

      {/* Nearest Fire Station */}
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

      {/* Nearest Police Station */}
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

      {/* Other Emergency Services */}
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
```

#### ProfileEditor.jsx Step 5
Similar structure to Onboarding.jsx but in Step 5 (different step numbering in ProfileEditor).

### Backend Schema Updates

#### GraphQL Schema (amplify/data/resource.ts)
```typescript
// Added new field to OrganizationProfile model
otherEmergencyServices: a.string(),
```

#### GraphQL Operations (useOrganizationProfileUnified.js)
Updated all GraphQL operations to include the new field:
- **List Query**: Added `otherEmergencyServices` to field selection
- **Create Mutation**: Added `otherEmergencyServices` to field selection  
- **Update Mutation**: Added `otherEmergencyServices` to field selection

## User Experience Improvements

### 1. Clearer Purpose
- **Section Title**: "Emergency Services" clearly indicates the focus
- **Description**: Explains the purpose for coordination during incidents
- **Helper Text**: Provides guidance on what information to include

### 2. Reduced Redundancy
- **No Duplicate Contacts**: Eliminates confusion about which contact information to use
- **Streamlined Flow**: Users focus on service locations rather than contact details

### 3. Enhanced Flexibility
- **Optional Fields**: All fields are optional, allowing for partial completion
- **Free Text Option**: "Other Emergency Services" allows for organization-specific needs
- **Comprehensive Coverage**: Covers the three main emergency services plus additional options

### 4. Better Guidance
- **Placeholder Text**: Clear examples of what to include
- **Helper Text**: Explains the importance of including address and contact information
- **Examples**: Provides specific examples for the "Other" field

## Data Structure

### New Field
```javascript
otherEmergencyServices: string // Optional free text field
```

### Complete Emergency Services Data
```javascript
{
  nearestHospital: string,        // Hospital name and address
  nearestFireStation: string,     // Fire station name and address  
  nearestPoliceStation: string,   // Police station name and address
  otherEmergencyServices: string  // Additional emergency services (optional)
}
```

## Validation Rules

### Step 4/5 Validation
- **All Fields Optional**: Users can proceed without filling any emergency service fields
- **No Required Validation**: Allows for organizations that may not have this information readily available
- **Flexible Completion**: Supports partial completion and later updates

## Benefits

### 1. Improved Workflow
- **Reduced Confusion**: No duplicate contact information fields
- **Clear Focus**: Step specifically addresses emergency service coordination
- **Logical Flow**: Builds on primary contact information from Step 2

### 2. Enhanced Emergency Planning
- **Service Locations**: Critical for emergency response coordination
- **Contact Information**: Enables direct communication with emergency services
- **Comprehensive Coverage**: Includes standard services plus organization-specific needs

### 3. Better User Experience
- **Optional Fields**: Reduces friction for organizations without complete information
- **Clear Guidance**: Helper text and examples guide users on what to include
- **Flexible Input**: Supports various levels of detail and organization types

### 4. Data Quality
- **Structured Information**: Clear fields for each type of emergency service
- **Free Text Option**: Captures unique or specialized emergency services
- **Consistent Format**: Encourages complete information (name, address, contact)

## Files Updated

### Frontend Components
- ✅ **Onboarding.jsx**: Updated Step 4 rendering, form data, and validation
- ✅ **ProfileEditor.jsx**: Updated Step 5 rendering, form data, and validation

### Backend Schema
- ✅ **amplify/data/resource.ts**: Added `otherEmergencyServices` field to GraphQL schema

### Data Layer
- ✅ **useOrganizationProfileUnified.js**: Updated all GraphQL operations to include new field

## Testing Scenarios

### Scenario 1: Complete Information
1. **Fill**: All emergency service fields with complete information
2. **Expected**: All data saved correctly
3. **Verify**: Information appears in profile and can be edited

### Scenario 2: Partial Information
1. **Fill**: Only some emergency service fields
2. **Expected**: Can proceed to next step
3. **Verify**: Partial data saved correctly

### Scenario 3: No Information
1. **Leave**: All fields empty
2. **Expected**: Can proceed to next step
3. **Verify**: Step validation passes

### Scenario 4: Other Emergency Services
1. **Fill**: "Other Emergency Services" with specialized information
2. **Expected**: Free text saved correctly
3. **Verify**: Information appears in profile

## Future Enhancements

### Potential Improvements
- **Address Autocomplete**: Integrate with mapping services for address validation
- **Service Verification**: Validate emergency service information against databases
- **Distance Calculation**: Automatically calculate distances to emergency services
- **Contact Integration**: Pre-populate contact information from public databases

### Accessibility
- **Screen Reader Support**: Proper ARIA labels for all fields
- **Keyboard Navigation**: Full keyboard support for form completion
- **Error Messages**: Clear error messages for validation issues

## Conclusion

The Step 4 Emergency Services update successfully:

1. **Eliminates Redundancy**: Removes duplicate contact information fields
2. **Improves Focus**: Concentrates on emergency service coordination
3. **Enhances Flexibility**: Provides optional fields with clear guidance
4. **Maintains Data Quality**: Structured fields with free text options
5. **Streamlines Workflow**: Clear, logical progression through the form

This update creates a more focused and user-friendly emergency services information collection process while maintaining the flexibility needed for different organization types and information availability levels.
