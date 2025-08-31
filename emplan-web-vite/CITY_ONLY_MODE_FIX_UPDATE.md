# City-Only Mode Validation Fix

## Issue
After implementing the dynamic subsections for Step 3, there was a regression where state/province and postal code fields were still being treated as mandatory even when the user wanted to enter city-only information.

## Root Cause
The validation logic was checking for `formData.primaryAddress` but not properly handling the case where `primaryAddress` might be an empty string or contain only whitespace. This caused the validation to treat these fields as required even when they should be optional.

## Solution

### 1. Updated Validation Logic
**Before:**
```javascript
if (formData.primaryAddress) {
  const hasRequiredLocationFields = formData.state && formData.zipCode && formData.country;
  if (!hasRequiredLocationFields) return false;
}
```

**After:**
```javascript
if (formData.primaryAddress && formData.primaryAddress.trim() !== '') {
  const hasRequiredLocationFields = formData.state && formData.zipCode && formData.country;
  if (!hasRequiredLocationFields) return false;
}
```

### 2. Updated UI Logic
**Before:**
```javascript
required={!!formData.primaryAddress}
```

**After:**
```javascript
required={!!(formData.primaryAddress && formData.primaryAddress.trim() !== '')}
```

### 3. Updated Field Labels
**Before:**
```javascript
Province/State {formData.primaryAddress ? '*' : '(Optional)'}
```

**After:**
```javascript
Province/State {(formData.primaryAddress && formData.primaryAddress.trim() !== '') ? '*' : '(Optional)'}
```

## Files Updated
- `emplan-web-vite/src/Onboarding.jsx`
- `emplan-web-vite/src/ProfileEditor.jsx`

## Changes Made

### Validation Logic
- Added proper string trimming and empty string checking
- Ensures fields are only required when primary address has actual content
- Maintains city-only mode functionality

### UI Components
- Updated all field labels to show correct required/optional status
- Updated `required` attributes to match validation logic
- Applied consistent logic across all location fields (state, postal code, country)

## User Experience
- **City-Only Mode**: Users can now proceed with just city information
- **Full Address Mode**: When primary address is provided, all fields become required
- **Clear Indication**: Field labels properly show required vs optional status
- **Consistent Behavior**: Same logic applied across onboarding and profile editing

## Testing
- ✅ City-only input allows progression to next step
- ✅ Full address input requires all fields
- ✅ Field labels update dynamically based on primary address content
- ✅ Validation works correctly in both Onboarding and ProfileEditor components

## Result
Users can now successfully use city-only mode without being blocked by validation errors on optional fields.
