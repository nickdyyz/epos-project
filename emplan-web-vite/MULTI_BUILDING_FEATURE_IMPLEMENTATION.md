# Multi-Building Feature Implementation

## Overview
Implemented a comprehensive multi-building system that allows organizations to manage up to 5 buildings within their profile, similar to the alternate contacts functionality. Each building has its own set of characteristics including name, type, floors, age, and square footage.

## Architecture

### Data Structure
**Primary Building**: The main building information (existing fields)
**Additional Buildings**: Up to 4 additional buildings (Buildings 2-5)

### Schema Updates
```typescript
// Primary Building Information (existing)
buildingType: a.enum(['SingleStory', 'MultiStory', 'HighRise', 'Campus', 'Industrial', 'Warehouse', 'Retail', 'Healthcare', 'Educational', 'Other']),
numberOfFloors: a.integer(),
totalOccupancy: a.integer(),
buildingAge: a.integer(),
totalSquareFootage: a.integer(),

// Additional Buildings (new)
building2Name: a.string(),
building2Type: a.enum(['SingleStory', 'MultiStory', 'HighRise', 'Campus', 'Industrial', 'Warehouse', 'Retail', 'Healthcare', 'Educational', 'Other']),
building2Floors: a.integer(),
building2Age: a.integer(),
building2SquareFootage: a.integer(),

// ... repeated for buildings 3, 4, and 5
```

## UI/UX Implementation

### Progressive Disclosure Pattern
- **Collapsed State**: Shows section title, description, and "Add Building X" button
- **Expanded State**: Shows complete form with close button
- **Conditional Display**: Additional buildings only appear when primary building section is expanded

### Building Information Fields
Each additional building includes:
- **Building Name**: Custom name for identification
- **Building Type**: Dropdown with all building type options
- **Number of Floors**: Numeric input with minimum value of 1
- **Building Age**: Numeric input with minimum value of 0
- **Square Footage**: Numeric input with minimum value of 1

### Visual Hierarchy
- **Primary Building**: Main building information section
- **Additional Buildings**: Sequentially numbered (Building 2, Building 3, etc.)
- **Consistent Styling**: Same visual treatment as other dynamic sections

## Technical Implementation

### State Management
```javascript
// Additional buildings states
const [showBuilding2, setShowBuilding2] = useState(false);
const [showBuilding3, setShowBuilding3] = useState(false);
const [showBuilding4, setShowBuilding4] = useState(false);
const [showBuilding5, setShowBuilding5] = useState(false);
```

### Handler Functions
```javascript
// Additional buildings handlers
const handleShowBuilding2 = () => setShowBuilding2(true);
const handleShowBuilding3 = () => setShowBuilding3(true);
const handleShowBuilding4 = () => setShowBuilding4(true);
const handleShowBuilding5 = () => setShowBuilding5(true);
```

### Helper Function
```javascript
const renderAdditionalBuilding = (buildingNumber, showState, setShowState, handleShow) => {
  // Dynamically generates building forms with consistent structure
  // Handles field naming, state management, and UI rendering
};
```

### Form Data Structure
```javascript
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

// ... repeated for buildings 4 and 5
```

## User Experience Flow

### Step 3 Workflow
1. **Primary Location**: User enters basic address information
2. **Building Information** (Optional):
   - Click "Add Building Info" to expand primary building section
   - Enter primary building characteristics
3. **Additional Buildings** (Optional):
   - Additional building sections appear when primary building is expanded
   - Click "Add Building X" to expand each additional building
   - Enter building-specific information
   - Can collapse individual buildings or entire building section
4. **Occupancy & Accessibility** (Optional):
   - Remains unchanged from previous implementation

### Interaction Patterns
- **Progressive Disclosure**: Reduces cognitive load by showing only relevant sections
- **Flexible Input**: Users can add as many buildings as needed (up to 5 total)
- **Consistent Interface**: Same interaction patterns as alternate contacts
- **Clear Navigation**: Easy to add, edit, and remove building information

## Validation & Data Handling

### Field Validation
- **Building Name**: Optional text field
- **Building Type**: Optional dropdown selection
- **Number of Floors**: Optional numeric field (min: 1)
- **Building Age**: Optional numeric field (min: 0)
- **Square Footage**: Optional numeric field (min: 1)

### Data Persistence
- **GraphQL Integration**: All new fields included in queries and mutations
- **Backward Compatibility**: Existing profiles work without modification
- **Fallback Handling**: Proper handling of missing building data
- **Local Storage**: Backup storage for offline functionality

## Files Updated

### Backend
- `amplify/data/resource.ts`: Updated GraphQL schema with new building fields

### Frontend Components
- `emplan-web-vite/src/Onboarding.jsx`: Enhanced Step 3 with multi-building support
- `emplan-web-vite/src/ProfileEditor.jsx`: Mirrored changes for profile editing
- `emplan-web-vite/src/hooks/useOrganizationProfileUnified.js`: Updated GraphQL operations

### Key Changes
1. **Schema Expansion**: Added 20 new fields for additional buildings
2. **State Management**: Added 4 new state variables for building visibility
3. **UI Components**: Created reusable building form component
4. **Data Integration**: Updated all GraphQL operations to include new fields

## Benefits

### For Organizations
- **Comprehensive Building Management**: Track multiple buildings in one profile
- **Flexible Data Entry**: Add buildings as needed without overwhelming interface
- **Consistent Information**: Standardized data structure across all buildings
- **Emergency Planning**: Better support for multi-building emergency response

### For Users
- **Intuitive Interface**: Familiar interaction patterns from alternate contacts
- **Progressive Disclosure**: Manage complexity through step-by-step revelation
- **Flexible Workflow**: Add buildings incrementally without losing progress
- **Clear Organization**: Easy to distinguish between primary and additional buildings

### For Emergency Planning
- **Multi-Building Support**: Comprehensive coverage for campus-style organizations
- **Building-Specific Data**: Individual characteristics for each building
- **Scalable Architecture**: Easy to extend for more buildings if needed
- **Consistent Data Model**: Standardized information across all buildings

## Future Enhancements

### Potential Improvements
- **Building-Specific Occupancy**: Individual occupancy data per building
- **Building Relationships**: Define relationships between buildings (connected, separate, etc.)
- **Floor Plan Integration**: Link floor plans to specific buildings
- **Building-Specific Hazards**: Individual hazard assessments per building
- **Building Coordinates**: GPS coordinates for each building location

### Scalability Considerations
- **Dynamic Building Count**: Allow more than 5 buildings if needed
- **Building Categories**: Group buildings by type or location
- **Bulk Operations**: Add multiple buildings with similar characteristics
- **Import/Export**: Bulk data import for large organizations

## Testing Considerations

### User Scenarios
- **Single Building**: Organization with only one building
- **Multiple Buildings**: Campus-style organization with 3-5 buildings
- **Progressive Addition**: Adding buildings one at a time
- **Data Persistence**: Saving and loading multi-building profiles

### Edge Cases
- **Empty Buildings**: Buildings with minimal information
- **Maximum Buildings**: Organizations using all 5 building slots
- **Partial Data**: Buildings with some fields filled, others empty
- **Data Migration**: Existing profiles with building information

## Conclusion

The multi-building feature successfully extends the organizational profile system to support complex organizations with multiple buildings. The implementation follows established patterns from the alternate contacts feature, ensuring consistency and familiarity for users. The progressive disclosure approach maintains a clean interface while providing comprehensive data collection capabilities.

The feature is production-ready and provides a solid foundation for future enhancements in building management and emergency planning.
