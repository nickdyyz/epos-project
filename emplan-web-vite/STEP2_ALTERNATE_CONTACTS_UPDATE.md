# Step 2 - Alternate Contacts Update

## 🎯 **OVERVIEW**

This document summarizes the comprehensive update to Step 2 of the organizational profile workflow: "Primary Contact Information". The update transforms the static secondary contact fields into an interactive system that allows users to add up to two additional alternate contacts on-demand.

## 🔧 **KEY CHANGES IMPLEMENTED**

### **1. Backend Schema Updates**

**File:** `amplify/data/resource.ts`

**Replaced:**
```typescript
// Contact Information
primaryContactName: a.string(),
primaryContactEmail: a.string(),
primaryContactPhone: a.string(),
secondaryContactName: a.string(),
secondaryContactEmail: a.string(),
secondaryContactPhone: a.string(),
```

**With:**
```typescript
// Contact Information
primaryContactName: a.string(),
primaryContactEmail: a.string(),
primaryContactPhone: a.string(),
alternateContact1Name: a.string(),
alternateContact1Email: a.string(),
alternateContact1Phone: a.string(),
alternateContact2Name: a.string(),
alternateContact2Email: a.string(),
alternateContact2Phone: a.string(),
```

### **2. Unified Hook Updates**

**File:** `emplan-web-vite/src/hooks/useOrganizationProfileUnified.js`

**Updated GraphQL Queries:**
- **Create Profile Query:** Updated to include new alternate contact fields
- **Update Profile Query:** Updated to include new alternate contact fields
- **Fetch Profile Query:** Updated to include new alternate contact fields

**Field Mapping:**
- `secondaryContactName` → `alternateContact1Name`
- `secondaryContactEmail` → `alternateContact1Email`
- `secondaryContactPhone` → `alternateContact1Phone`
- Added: `alternateContact2Name`, `alternateContact2Email`, `alternateContact2Phone`

### **3. Frontend Component Updates**

#### **Onboarding Component (`emplan-web-vite/src/Onboarding.jsx`)**

**New State Management:**
```javascript
const [showAlternateContact1, setShowAlternateContact1] = useState(false);
const [showAlternateContact2, setShowAlternateContact2] = useState(false);
```

**New Event Handlers:**
```javascript
const handleAddAlternateContact1 = () => {
  setShowAlternateContact1(true);
};

const handleAddAlternateContact2 = () => {
  setShowAlternateContact2(true);
};

const handleRemoveAlternateContact1 = () => {
  setShowAlternateContact1(false);
  setFormData(prev => ({
    ...prev,
    alternateContact1Name: '',
    alternateContact1Email: '',
    alternateContact1Phone: ''
  }));
};

const handleRemoveAlternateContact2 = () => {
  setShowAlternateContact2(false);
  setFormData(prev => ({
    ...prev,
    alternateContact2Name: '',
    alternateContact2Email: '',
    alternateContact2Phone: ''
  }));
};
```

**Updated Form Data Structure:**
```javascript
// Contact Information
primaryContactName: '',
primaryContactEmail: '',
primaryContactPhone: '',
alternateContact1Name: '',
alternateContact1Email: '',
alternateContact1Phone: '',
alternateContact2Name: '',
alternateContact2Email: '',
alternateContact2Phone: '',
```

#### **ProfileEditor Component (`emplan-web-vite/src/ProfileEditor.jsx`)**

**Enhanced Profile Loading:**
```javascript
// Set visibility states based on existing data
setShowAlternateContact1(!!(profile.alternateContact1Name || profile.alternateContact1Email || profile.alternateContact1Phone));
setShowAlternateContact2(!!(profile.alternateContact2Name || profile.alternateContact2Email || profile.alternateContact2Phone));
```

**Same Event Handlers and State Management as Onboarding**

## ✅ **USER EXPERIENCE FLOW**

### **Initial State**
```
Primary Contact Information
├── Primary Contact Name *
├── Primary Contact Email *
├── Primary Contact Phone
└── [Add an additional contact] ← Interactive button
```

### **After Adding First Alternate Contact**
```
Primary Contact Information
├── Primary Contact Name *
├── Primary Contact Email *
├── Primary Contact Phone
└── Alternate Contact 1
    ├── Alternate Contact 1 Name
    ├── Alternate Contact 1 Email
    ├── Alternate Contact 1 Phone
    └── [Remove] ← Remove button
    └── [Add another contact] ← Interactive button
```

### **After Adding Second Alternate Contact**
```
Primary Contact Information
├── Primary Contact Name *
├── Primary Contact Email *
├── Primary Contact Phone
├── Alternate Contact 1
│   ├── Alternate Contact 1 Name
│   ├── Alternate Contact 1 Email
│   ├── Alternate Contact 1 Phone
│   └── [Remove] ← Remove button
└── Alternate Contact 2
    ├── Alternate Contact 2 Name
    ├── Alternate Contact 2 Email
    ├── Alternate Contact 2 Phone
    └── [Remove] ← Remove button
```

## 🎨 **UI/UX ENHANCEMENTS**

### **Interactive Button Design**
- **Icon:** Plus symbol (+)
- **Text:** "Add an additional contact" / "Add another contact"
- **Styling:** Gray border, white background, hover effects
- **Positioning:** Centered below primary contact fields

### **Remove Button Design**
- **Text:** "Remove"
- **Styling:** Red text, hover effects
- **Positioning:** Top-right corner of each alternate contact section

### **Conditional Rendering Logic**
- **Button Visibility:** Only show "Add" button when no alternate contacts are visible
- **Second Button:** Only show "Add another contact" when first alternate contact is visible
- **Maximum Limit:** Maximum of 2 alternate contacts allowed

### **Visual Hierarchy**
- **Primary Contact:** Always visible, required fields marked with *
- **Alternate Contacts:** Optional, clearly separated with borders
- **Section Headers:** "Alternate Contact 1" and "Alternate Contact 2"

## 📊 **DATA STRUCTURE EXAMPLES**

### **Example 1: Primary Contact Only**
```json
{
  "primaryContactName": "John Smith",
  "primaryContactEmail": "john.smith@organization.com",
  "primaryContactPhone": "(555) 123-4567",
  "alternateContact1Name": "",
  "alternateContact1Email": "",
  "alternateContact1Phone": "",
  "alternateContact2Name": "",
  "alternateContact2Email": "",
  "alternateContact2Phone": ""
}
```

### **Example 2: Primary + One Alternate Contact**
```json
{
  "primaryContactName": "John Smith",
  "primaryContactEmail": "john.smith@organization.com",
  "primaryContactPhone": "(555) 123-4567",
  "alternateContact1Name": "Jane Doe",
  "alternateContact1Email": "jane.doe@organization.com",
  "alternateContact1Phone": "(555) 987-6543",
  "alternateContact2Name": "",
  "alternateContact2Email": "",
  "alternateContact2Phone": ""
}
```

### **Example 3: Primary + Two Alternate Contacts**
```json
{
  "primaryContactName": "John Smith",
  "primaryContactEmail": "john.smith@organization.com",
  "primaryContactPhone": "(555) 123-4567",
  "alternateContact1Name": "Jane Doe",
  "alternateContact1Email": "jane.doe@organization.com",
  "alternateContact1Phone": "(555) 987-6543",
  "alternateContact2Name": "Bob Johnson",
  "alternateContact2Email": "bob.johnson@organization.com",
  "alternateContact2Phone": "(555) 456-7890"
}
```

## 🔄 **VALIDATION RULES**

### **Step 2 Validation (Contact Information)**
- **Required:** Primary Contact Name and Email
- **Optional:** Primary Contact Phone
- **Optional:** All alternate contact fields
- **No Cross-Dependencies:** Alternate contacts don't affect primary contact validation

### **Alternate Contact Rules**
- **Maximum:** 2 alternate contacts allowed
- **Independent:** Each alternate contact can be added/removed independently
- **Optional Fields:** All alternate contact fields are optional
- **Data Persistence:** Removing an alternate contact clears all its data

## 🚀 **DEPLOYMENT STATUS**

### **✅ Completed**
- [x] Backend schema updated with new alternate contact fields
- [x] Unified hook updated with new GraphQL queries
- [x] Onboarding component updated with interactive UI
- [x] ProfileEditor component updated with interactive UI
- [x] State management for alternate contact visibility
- [x] Event handlers for add/remove functionality
- [x] Conditional rendering logic implemented
- [x] Data persistence and clearing functionality
- [x] Testing completed

### **🌐 Live Status**
- **Development Server:** Running on http://localhost:5173/
- **Hot Module Replacement:** Active
- **Step 2 Updates:** ✅ Deployed
- **Interactive Alternate Contacts:** ✅ Working
- **No Compilation Errors:** Clean build

## 📈 **BENEFITS ACHIEVED**

### **For Users**
- **Cleaner Interface** - No overwhelming form fields initially
- **Progressive Disclosure** - Add contacts as needed
- **Flexible Configuration** - Up to 2 additional contacts
- **Easy Management** - Add/remove contacts with simple buttons
- **Better Terminology** - "Alternate" instead of "Secondary"

### **For System**
- **Improved UX** - Less cognitive load on initial form
- **Scalable Design** - Easy to extend to more contacts if needed
- **Data Integrity** - Proper field mapping and validation
- **Consistent Behavior** - Same functionality in onboarding and editing

### **For Development**
- **Maintainable Code** - Clear separation of concerns
- **Reusable Components** - Similar patterns in both components
- **Future-Proof** - Easy to add more features or contacts
- **Type Safety** - Proper field mapping throughout

## 🔮 **FUTURE ENHANCEMENTS**

### **Potential Improvements**
1. **Contact Validation** - Email format validation for alternate contacts
2. **Contact Roles** - Allow users to specify roles (e.g., "Backup", "Emergency")
3. **Contact Priority** - Allow reordering of alternate contacts
4. **Bulk Operations** - Add/remove multiple contacts at once
5. **Contact Templates** - Pre-fill common contact patterns

### **Monitoring**
- **User Behavior** - Track how many users add alternate contacts
- **Contact Usage** - Monitor which alternate contacts are most commonly used
- **User Feedback** - Gather feedback on the interactive interface
- **Performance** - Ensure the dynamic UI doesn't impact performance

---

**Implementation Date:** August 11, 2025  
**Status:** ✅ Complete and Deployed  
**Step 2 Enhancement:** ✅ Interactive alternate contacts implemented  
**Next Review:** After user testing and feedback
