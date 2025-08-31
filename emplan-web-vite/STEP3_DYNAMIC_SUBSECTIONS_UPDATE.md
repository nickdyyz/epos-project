# Step 3 Dynamic Subsections Enhancement

## Overview
Enhanced Step 3 "Location Information" with dynamic subsections and comprehensive building information collection for emergency planning.

## Changes Made

### 1. Dynamic Subsection Architecture
- **Primary Location Information**: Core address and location fields
- **Building Information**: Optional subsection for building characteristics
- **Occupancy & Accessibility**: Critical subsection for emergency planning

### 2. New State Variables
```javascript
// Dynamic subsection states for Step 3
const [showBuildingInfo, setShowBuildingInfo] = useState(false);
const [showOccupancyAccessibility, setShowOccupancyAccessibility] = useState(false);
```

### 3. Enhanced Building Information
**New Fields Added:**
- `totalSquareFootage`: Building size in square feet
- Enhanced building type options:
  - Single Story, Multi-Story, High-Rise, Campus, Industrial
  - **New**: Warehouse, Retail, Healthcare, Educational, Other

**Existing Fields:**
- `buildingType`: Enhanced dropdown with more options
- `numberOfFloors`: Number of building floors
- `buildingAge`: Building age in years

### 4. Occupancy & Accessibility Information
**Critical Emergency Planning Fields:**

#### Occupancy Information
- `maximumOccupancy`: Legal capacity (required when section is shown)
- `averageOccupancyWorkday`: Typical workday occupancy
- `averageOccupancyOffHours`: Evening/weekend occupancy

#### Accessibility & Special Needs
- `peopleWithDisabilities`: Confidential information about individuals needing assistance
- Privacy notice with warning about sensitive data handling
- Detailed placeholder text for guidance

#### Evacuation Planning
- `evacuationRoutes`: Primary and secondary evacuation routes
- `assemblyAreas`: Designated outdoor meeting spots for headcount

### 5. UI/UX Enhancements

#### Progressive Disclosure
- **Collapsed State**: Shows section title, description, and "Add" button
- **Expanded State**: Shows all fields with close button
- **Visual Hierarchy**: Clear section separation with borders

#### Privacy Protection
- **Warning Notice**: Yellow alert box for sensitive information
- **Confidential Labeling**: Clear indication of privacy requirements
- **Secure Handling**: Emphasis on data protection

#### Validation Logic
```javascript
case 3:
  // City is always required
  if (!formData.city) return false;
  
  // If primary address is provided, then state, zip/postal code, and country are required
  if (formData.primaryAddress) {
    const hasRequiredLocationFields = formData.state && formData.zipCode && formData.country;
    if (!hasRequiredLocationFields) return false;
  }
  
  // If occupancy & accessibility section is shown, maximum occupancy is required
  if (showOccupancyAccessibility && !formData.maximumOccupancy) {
    return false;
  }
  
  // If no primary address, only city is required (city-only mode)
  return true;
```

### 6. GraphQL Schema Updates
**New Fields Added to `OrganizationProfile` Model:**
```typescript
// Building Information
buildingType: a.enum(['SingleStory', 'MultiStory', 'HighRise', 'Campus', 'Industrial', 'Warehouse', 'Retail', 'Healthcare', 'Educational', 'Other']),
totalSquareFootage: a.integer(),

// Occupancy & Accessibility Information
maximumOccupancy: a.integer(),
averageOccupancyWorkday: a.integer(),
averageOccupancyOffHours: a.integer(),
peopleWithDisabilities: a.string(),
evacuationRoutes: a.string(),
assemblyAreas: a.string(),
```

### 7. Hook Updates
**Updated `useOrganizationProfileUnified.js`:**
- Added new fields to all GraphQL queries and mutations
- Maintains backward compatibility with existing profiles
- Proper fallback handling for new fields

## User Experience Flow

### Step 3 Workflow
1. **Primary Location**: User enters basic address information
2. **Building Information** (Optional):
   - Click "Add Building Info" to expand
   - Enter building type, floors, age, square footage
   - Can collapse section if not needed
3. **Occupancy & Accessibility** (Optional):
   - Click "Add Occupancy Info" to expand
   - Enter occupancy numbers and accessibility information
   - Privacy notice displayed for sensitive data
   - Can collapse section if not needed

### Validation Behavior
- **City**: Always required
- **Full Address**: If primary address provided, state/zip/country required
- **Maximum Occupancy**: Required only if occupancy section is expanded
- **Progressive Validation**: Each subsection validates independently

## Security & Privacy Considerations

### Sensitive Data Handling
- **Confidential Information**: People with disabilities data marked as sensitive
- **Privacy Notice**: Clear warning about data handling
- **Secure Storage**: Data stored with proper access controls
- **Optional Fields**: Users can choose not to provide sensitive information

### Data Protection
- **Access Control**: Owner-based authorization
- **Encryption**: Data encrypted in transit and at rest
- **Audit Trail**: Creation and update timestamps maintained

## Technical Implementation

### Component Updates
- **Onboarding.jsx**: Enhanced Step 3 with dynamic subsections
- **ProfileEditor.jsx**: Mirrored changes for profile editing
- **useOrganizationProfileUnified.js**: Updated GraphQL operations

### State Management
- **Local State**: Dynamic subsection visibility
- **Form Data**: All new fields integrated into existing structure
- **Validation**: Conditional validation based on section visibility

### Responsive Design
- **Mobile Friendly**: Grid layouts adapt to screen size
- **Accessibility**: Proper labels and screen reader support
- **Progressive Enhancement**: Works without JavaScript for basic functionality

## Benefits

### Emergency Planning
- **Comprehensive Data**: All critical information for emergency response
- **Accessibility Support**: Special needs accommodation planning
- **Evacuation Planning**: Route and assembly area documentation

### User Experience
- **Progressive Disclosure**: Reduces cognitive load
- **Flexible Input**: Users can provide as much or little information as needed
- **Clear Guidance**: Helpful placeholders and descriptions

### Data Quality
- **Structured Information**: Consistent data format
- **Validation**: Ensures required information is provided
- **Completeness**: Comprehensive coverage of building characteristics

## Future Enhancements
- **Floor Plan Integration**: Link to uploaded floor plans
- **Accessibility Mapping**: Visual representation of accessible routes
- **Emergency Contact Integration**: Connect with emergency services
- **Real-time Updates**: Live occupancy tracking
- **Compliance Reporting**: Automated regulatory compliance checks
