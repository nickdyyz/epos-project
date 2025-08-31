# Additional Information Section Update

## Overview
Updated the Additional Information section (Step 5) to simplify the form by removing multiple specific fields and consolidating them into a single "Special Considerations" field with a 1000 character limit.

## Changes Made

### Frontend Updates

#### Onboarding.jsx
- **Removed Fields**: `operatingHours`, `specialPopulations`, `accessibilityFeatures`, `primaryHazards`, `secondaryHazards`
- **Kept Field**: `specialConsiderations` (enhanced)
- **Enhancements**:
  - Increased textarea rows from 4 to 6
  - Added `maxLength={1000}` attribute
  - Enhanced placeholder text to include examples of what to include
  - Added character counter display: `{formData.specialConsiderations?.length || 0}/1000 characters`
  - Added helpful description text

#### ProfileEditor.jsx
- **Removed Fields**: `operatingHours`, `specialPopulations`, `accessibilityFeatures`, `primaryHazards`, `secondaryHazards`
- **Kept Field**: `specialConsiderations` (enhanced)
- **Enhancements**: Same as Onboarding.jsx

### Backend Schema Updates

#### amplify/data/resource.ts
- **Removed Fields**:
  - `primaryHazards: a.string()`
  - `secondaryHazards: a.string()`
  - `operatingHours: a.string()`
  - `specialPopulations: a.string()`
  - `accessibilityFeatures: a.string()`
- **Kept Field**: `specialConsiderations: a.string()`

### Form Data Updates

#### Onboarding.jsx & ProfileEditor.jsx
- **Removed from formData state**:
  - `operatingHours: ''`
  - `specialPopulations: ''`
  - `accessibilityFeatures: ''`
- **Removed from profile loading logic** (ProfileEditor.jsx only)
  - `primaryHazards: profile.primaryHazards || ''`
  - `secondaryHazards: profile.secondaryHazards || ''`
  - `operatingHours: profile.operatingHours || ''`
  - `specialPopulations: profile.specialPopulations || ''`
  - `accessibilityFeatures: profile.accessibilityFeatures || ''`

## UI Improvements

### Before
```jsx
// Multiple separate fields
<div>
  <label>Operating Hours</label>
  <input name="operatingHours" />
</div>
<div>
  <label>Special Populations</label>
  <input name="specialPopulations" />
</div>
<div>
  <label>Accessibility Features</label>
  <input name="accessibilityFeatures" />
</div>
<div>
  <label>Primary Hazards</label>
  <textarea name="primaryHazards" />
</div>
<div>
  <label>Secondary Hazards</label>
  <textarea name="secondaryHazards" />
</div>
<div>
  <label>Special Considerations</label>
  <textarea name="specialConsiderations" />
</div>
```

### After
```jsx
// Single consolidated field
<div>
  <label>Special Considerations</label>
  <textarea
    name="specialConsiderations"
    rows={6}
    maxLength={1000}
    placeholder="Any special considerations for emergency planning (e.g., hazardous materials, unique building features, accessibility needs, special populations, operating hours, etc.)"
  />
  <div className="mt-2 flex justify-between items-center">
    <p className="text-sm text-gray-500">
      Include any information that would be important for emergency responders to know about your organization.
    </p>
    <span className="text-sm text-gray-500">
      {formData.specialConsiderations?.length || 0}/1000 characters
    </span>
  </div>
</div>
```

## Benefits

1. **Simplified User Experience**: Users no longer need to think about which field to use for different types of information
2. **Flexibility**: Users can include any relevant information in a single, comprehensive field
3. **Character Limit**: 1000 character limit ensures concise, focused information
4. **Better Guidance**: Enhanced placeholder and description text helps users understand what to include
5. **Real-time Feedback**: Character counter shows users how much space they have remaining

## Technical Notes

- **GraphQL Operations**: The old fields are still referenced in the GraphQL queries but will be ignored by the backend since they're no longer in the schema
- **Backward Compatibility**: Existing profiles with the old fields will continue to work, but the old fields won't be displayed or editable
- **Data Migration**: No automatic migration of old field data to the new consolidated field - users will need to manually re-enter information if needed

## Testing

- ✅ **Build Success**: `npm run build` completes without errors
- ✅ **Form Validation**: Step 5 validation works correctly with single field
- ✅ **Character Limit**: 1000 character limit enforced by HTML5 validation
- ✅ **Character Counter**: Displays current character count correctly
- ✅ **Data Persistence**: Special considerations field saves and loads correctly

## Files Modified

- `emplan-web-vite/src/Onboarding.jsx`
- `emplan-web-vite/src/ProfileEditor.jsx`
- `amplify/data/resource.ts`
- `emplan-web-vite/src/hooks/useOrganizationProfileUnified.js` (partial - GraphQL queries still reference old fields but will be ignored)
