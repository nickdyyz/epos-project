// Industry Classification System based on NAICS (North American Industry Classification System)
// Organized by organizational type for cascading dropdown functionality

export const INDUSTRY_CLASSIFICATIONS = {
  ForProfit: {
    label: "For-Profit Organizations",
    description: "Complete NAICS classification for for-profit entities",
    categories: [
      {
        code: "OTHER",
        description: "Other",
        subcategories: [
          { code: "OTHER", description: "Other For-Profit Industry" }
        ]
      },
      {
        code: "11",
        description: "Agriculture, Forestry, Fishing and Hunting",
        subcategories: [
          { code: "111", description: "Crop Production" },
          { code: "112", description: "Animal Production and Aquaculture" },
          { code: "113", description: "Forestry and Logging" },
          { code: "114", description: "Fishing, Hunting and Trapping" },
          { code: "115", description: "Support Activities for Agriculture and Forestry" }
        ]
      },
      {
        code: "21",
        description: "Mining, Quarrying, and Oil and Gas Extraction",
        subcategories: [
          { code: "211", description: "Oil and Gas Extraction" },
          { code: "212", description: "Mining (except Oil and Gas)" },
          { code: "213", description: "Support Activities for Mining" }
        ]
      },
      {
        code: "22",
        description: "Utilities",
        subcategories: [
          { code: "221", description: "Utilities" }
        ]
      },
      {
        code: "23",
        description: "Construction",
        subcategories: [
          { code: "236", description: "Construction of Buildings" },
          { code: "237", description: "Heavy and Civil Engineering Construction" },
          { code: "238", description: "Specialty Trade Contractors" }
        ]
      },
      {
        code: "31-33",
        description: "Manufacturing",
        subcategories: [
          { code: "311", description: "Food Manufacturing" },
          { code: "312", description: "Beverage and Tobacco Product Manufacturing" },
          { code: "313", description: "Textile Mills" },
          { code: "314", description: "Textile Product Mills" },
          { code: "315", description: "Apparel Manufacturing" },
          { code: "316", description: "Leather and Allied Product Manufacturing" },
          { code: "321", description: "Wood Product Manufacturing" },
          { code: "322", description: "Paper Manufacturing" },
          { code: "323", description: "Printing and Related Support Activities" },
          { code: "324", description: "Petroleum and Coal Products Manufacturing" },
          { code: "325", description: "Chemical Manufacturing" },
          { code: "326", description: "Plastics and Rubber Products Manufacturing" },
          { code: "327", description: "Nonmetallic Mineral Product Manufacturing" },
          { code: "331", description: "Primary Metal Manufacturing" },
          { code: "332", description: "Fabricated Metal Product Manufacturing" },
          { code: "333", description: "Machinery Manufacturing" },
          { code: "334", description: "Computer and Electronic Product Manufacturing" },
          { code: "335", description: "Electrical Equipment, Appliance, and Component Manufacturing" },
          { code: "336", description: "Transportation Equipment Manufacturing" },
          { code: "337", description: "Furniture and Related Product Manufacturing" },
          { code: "339", description: "Miscellaneous Manufacturing" }
        ]
      },
      {
        code: "42",
        description: "Wholesale Trade",
        subcategories: [
          { code: "423", description: "Merchant Wholesalers, Durable Goods" },
          { code: "424", description: "Merchant Wholesalers, Nondurable Goods" },
          { code: "425", description: "Wholesale Electronic Markets and Agents and Brokers" }
        ]
      },
      {
        code: "44-45",
        description: "Retail Trade",
        subcategories: [
          { code: "441", description: "Motor Vehicle and Parts Dealers" },
          { code: "442", description: "Furniture and Home Furnishings Stores" },
          { code: "443", description: "Electronics and Appliance Stores" },
          { code: "444", description: "Building Material and Garden Equipment and Supplies Dealers" },
          { code: "445", description: "Food and Beverage Stores" },
          { code: "446", description: "Health and Personal Care Stores" },
          { code: "447", description: "Gasoline Stations" },
          { code: "448", description: "Clothing and Clothing Accessories Stores" },
          { code: "451", description: "Sporting Goods, Hobby, Musical Instrument, and Book Stores" },
          { code: "452", description: "General Merchandise Stores" },
          { code: "453", description: "Miscellaneous Store Retailers" },
          { code: "454", description: "Nonstore Retailers" }
        ]
      },
      {
        code: "48-49",
        description: "Transportation and Warehousing",
        subcategories: [
          { code: "481", description: "Air Transportation" },
          { code: "482", description: "Rail Transportation" },
          { code: "483", description: "Water Transportation" },
          { code: "484", description: "Truck Transportation" },
          { code: "485", description: "Transit and Ground Passenger Transportation" },
          { code: "486", description: "Pipeline Transportation" },
          { code: "487", description: "Scenic and Sightseeing Transportation" },
          { code: "488", description: "Support Activities for Transportation" },
          { code: "491", description: "Postal Service" },
          { code: "492", description: "Couriers and Messengers" },
          { code: "493", description: "Warehousing and Storage" }
        ]
      },
      {
        code: "51",
        description: "Information",
        subcategories: [
          { code: "511", description: "Publishing Industries" },
          { code: "512", description: "Motion Picture and Sound Recording Industries" },
          { code: "515", description: "Broadcasting (except Internet)" },
          { code: "517", description: "Telecommunications" },
          { code: "518", description: "Data Processing, Hosting, and Related Services" },
          { code: "519", description: "Other Information Services" }
        ]
      },
      {
        code: "52",
        description: "Finance and Insurance",
        subcategories: [
          { code: "521", description: "Monetary Authorities-Central Bank" },
          { code: "522", description: "Credit Intermediation and Related Activities" },
          { code: "523", description: "Securities, Commodity Contracts, and Other Financial Investments and Related Activities" },
          { code: "524", description: "Insurance Carriers and Related Activities" },
          { code: "525", description: "Funds, Trusts, and Other Financial Vehicles" }
        ]
      },
      {
        code: "53",
        description: "Real Estate and Rental and Leasing",
        subcategories: [
          { code: "531", description: "Real Estate" },
          { code: "532", description: "Rental and Leasing Services" },
          { code: "533", description: "Lessors of Nonfinancial Intangible Assets (except Copyrighted Works)" }
        ]
      },
      {
        code: "54",
        description: "Professional, Scientific, and Technical Services",
        subcategories: [
          { code: "541", description: "Professional, Scientific, and Technical Services" }
        ]
      },
      {
        code: "55",
        description: "Management of Companies and Enterprises",
        subcategories: [
          { code: "551", description: "Management of Companies and Enterprises" }
        ]
      },
      {
        code: "56",
        description: "Administrative and Support and Waste Management and Remediation Services",
        subcategories: [
          { code: "561", description: "Administrative and Support Services" },
          { code: "562", description: "Waste Management and Remediation Services" }
        ]
      },
      {
        code: "62",
        description: "Health Care and Social Assistance",
        subcategories: [
          { code: "621", description: "Ambulatory Health Care Services" },
          { code: "622", description: "Hospitals" },
          { code: "623", description: "Nursing and Residential Care Facilities" },
          { code: "624", description: "Social Assistance" }
        ]
      },
      {
        code: "71",
        description: "Arts, Entertainment, and Recreation",
        subcategories: [
          { code: "711", description: "Performing Arts, Spectator Sports, and Related Industries" },
          { code: "712", description: "Museums, Historical Sites, and Similar Institutions" },
          { code: "713", description: "Amusement, Gambling, and Recreation Industries" }
        ]
      },
      {
        code: "72",
        description: "Accommodation and Food Services",
        subcategories: [
          { code: "721", description: "Accommodation" },
          { code: "722", description: "Food Services and Drinking Places" }
        ]
      },
      {
        code: "81",
        description: "Other Services (except Public Administration)",
        subcategories: [
          { code: "811", description: "Repair and Maintenance" },
          { code: "812", description: "Personal and Laundry Services" },
          { code: "813", description: "Religious, Grantmaking, Civic, Professional, and Similar Organizations" },
          { code: "814", description: "Private Households" }
        ]
      }
    ]
  },
  
  NonProfit: {
    label: "Non-Profit Organizations",
    description: "Curated NAICS categories relevant to non-profit organizations",
    categories: [
      {
        code: "OTHER",
        description: "Other",
        subcategories: [
          { code: "OTHER", description: "Other Non-Profit Industry" }
        ]
      },
      {
        code: "624",
        description: "Social Assistance",
        subcategories: [
          { code: "6241", description: "Individual and Family Services" },
          { code: "6242", description: "Community Food and Housing, and Emergency and Other Relief Services" },
          { code: "6243", description: "Vocational Rehabilitation Services" },
          { code: "6244", description: "Child Day Care Services" }
        ]
      },
      {
        code: "813",
        description: "Religious, Grantmaking, Civic, Professional, and Similar Organizations",
        subcategories: [
          { code: "8131", description: "Religious Organizations" },
          { code: "8132", description: "Grantmaking and Giving Services" },
          { code: "8133", description: "Social Advocacy Organizations" },
          { code: "8134", description: "Civic and Social Organizations" },
          { code: "8139", description: "Business, Professional, Labor, Political, and Similar Organizations" }
        ]
      },
      {
        code: "711",
        description: "Performing Arts, Spectator Sports, and Related Industries",
        subcategories: [
          { code: "7111", description: "Performing Arts Companies" },
          { code: "7112", description: "Spectator Sports" },
          { code: "7113", description: "Promoters of Performing Arts, Sports, and Similar Events" },
          { code: "7114", description: "Agents and Managers for Artists, Athletes, Entertainers, and Other Public Figures" },
          { code: "7115", description: "Independent Artists, Writers, and Performers" }
        ]
      },
      {
        code: "712",
        description: "Museums, Historical Sites, and Similar Institutions",
        subcategories: [
          { code: "7121", description: "Museums, Historical Sites, and Similar Institutions" }
        ]
      },
      {
        code: "621",
        description: "Ambulatory Health Care Services",
        subcategories: [
          { code: "6211", description: "Offices of Physicians" },
          { code: "6212", description: "Offices of Dentists" },
          { code: "6213", description: "Offices of Other Health Practitioners" },
          { code: "6214", description: "Outpatient Care Centers" },
          { code: "6215", description: "Medical and Diagnostic Laboratories" },
          { code: "6216", description: "Home Health Care Services" },
          { code: "6219", description: "Other Ambulatory Health Care Services" }
        ]
      },
      {
        code: "622",
        description: "Hospitals",
        subcategories: [
          { code: "6221", description: "General Medical and Surgical Hospitals" },
          { code: "6222", description: "Psychiatric and Substance Abuse Hospitals" },
          { code: "6223", description: "Specialty (except Psychiatric and Substance Abuse) Hospitals" }
        ]
      },
      {
        code: "623",
        description: "Nursing and Residential Care Facilities",
        subcategories: [
          { code: "6231", description: "Nursing Care Facilities (Skilled Nursing Facilities)" },
          { code: "6232", description: "Residential Intellectual and Developmental Disability, Mental Health, and Substance Abuse Facilities" },
          { code: "6233", description: "Continuing Care Retirement Communities and Assisted Living Facilities for the Elderly" },
          { code: "6239", description: "Other Residential Care Facilities" }
        ]
      },
      {
        code: "OTHER",
        description: "Other Non-Profit Activities",
        subcategories: [
          { code: "OTHER", description: "Other Non-Profit Organization" }
        ]
      }
    ]
  },
  
  Government: {
    label: "Government Organizations",
    description: "Government classification based on level and agency type",
    categories: [
      {
        code: "OTHER",
        description: "Other",
        subcategories: [
          { code: "OTHER", description: "Other Government Industry" }
        ]
      },
      {
        code: "92",
        description: "Public Administration",
        subcategories: [
          { code: "921", description: "Executive, Legislative, and Other General Government Support" },
          { code: "922", description: "Justice, Public Order, and Safety Activities" },
          { code: "923", description: "Administration of Human Resource Programs" },
          { code: "924", description: "Administration of Environmental Quality Programs" },
          { code: "925", description: "Administration of Housing Programs, Urban Planning, and Community Development" },
          { code: "926", description: "Administration of Economic Programs" },
          { code: "927", description: "Space Research and Technology" },
          { code: "928", description: "National Security and International Affairs" }
        ]
      },
      {
        code: "FEDERAL",
        description: "Federal Government",
        subcategories: [
          { code: "FED_DEFENSE", description: "Defense" },
          { code: "FED_HEALTH", description: "Public Health" },
          { code: "FED_POSTAL", description: "Postal Service" },
          { code: "FED_TRANSPORT", description: "Transportation" },
          { code: "FED_ENERGY", description: "Energy" },
          { code: "FED_EDUCATION", description: "Education" },
          { code: "FED_OTHER", description: "Other Federal Agency" }
        ]
      },
      {
        code: "STATE",
        description: "State Government",
        subcategories: [
          { code: "STATE_HEALTH", description: "State Health Department" },
          { code: "STATE_EDUCATION", description: "State Education Department" },
          { code: "STATE_TRANSPORT", description: "State Transportation Department" },
          { code: "STATE_PUBLIC_SAFETY", description: "State Public Safety" },
          { code: "STATE_OTHER", description: "Other State Agency" }
        ]
      },
      {
        code: "LOCAL",
        description: "Local Government",
        subcategories: [
          { code: "LOCAL_CITY", description: "City Government" },
          { code: "LOCAL_COUNTY", description: "County Government" },
          { code: "LOCAL_MUNICIPAL", description: "Municipal Government" },
          { code: "LOCAL_SCHOOL", description: "School District" },
          { code: "LOCAL_OTHER", description: "Other Local Government" }
        ]
      }
    ]
  },
  
  Educational: {
    label: "Educational Institutions",
    description: "Educational services classification",
    categories: [
      {
        code: "OTHER",
        description: "Other",
        subcategories: [
          { code: "OTHER", description: "Other Educational Industry" }
        ]
      },
      {
        code: "61",
        description: "Educational Services",
        subcategories: [
          { code: "6111", description: "Elementary and Secondary Schools" },
          { code: "6112", description: "Junior Colleges" },
          { code: "6113", description: "Colleges, Universities, and Professional Schools" },
          { code: "6114", description: "Business Schools and Computer and Management Training" },
          { code: "6115", description: "Technical and Trade Schools" },
          { code: "6116", description: "Other Schools and Instruction" },
          { code: "6117", description: "Educational Support Services" }
        ]
      },
      {
        code: "K12",
        description: "K-12 Education",
        subcategories: [
          { code: "K12_PUBLIC", description: "Public K-12 School" },
          { code: "K12_PRIVATE", description: "Private K-12 School" },
          { code: "K12_CHARTER", description: "Charter School" },
          { code: "K12_SPECIAL", description: "Special Education School" }
        ]
      },
      {
        code: "HIGHER_ED",
        description: "Higher Education",
        subcategories: [
          { code: "HIGHER_ED_PUBLIC", description: "Public University/College" },
          { code: "HIGHER_ED_PRIVATE", description: "Private University/College" },
          { code: "HIGHER_ED_COMMUNITY", description: "Community College" },
          { code: "HIGHER_ED_TECHNICAL", description: "Technical Institute" }
        ]
      },
      {
        code: "VOCATIONAL",
        description: "Vocational Education",
        subcategories: [
          { code: "VOC_TECHNICAL", description: "Technical School" },
          { code: "VOC_TRADE", description: "Trade School" },
          { code: "VOC_CAREER", description: "Career College" },
          { code: "VOC_APPRENTICESHIP", description: "Apprenticeship Program" }
        ]
      }
    ]
  },
  
  Other: {
    label: "Other Organizations",
    description: "Industry classifications for other organization types",
    categories: [
      {
        code: "OTHER",
        description: "Other",
        subcategories: [
          { code: "OTHER", description: "Other Industry" }
        ]
      },
      {
        code: "81",
        description: "Other Services (except Public Administration)",
        subcategories: [
          { code: "811", description: "Repair and Maintenance" },
          { code: "812", description: "Personal and Laundry Services" },
          { code: "813", description: "Religious, Grantmaking, Civic, Professional, and Similar Organizations" },
          { code: "814", description: "Private Households" }
        ]
      },
      {
        code: "92",
        description: "Public Administration",
        subcategories: [
          { code: "921", description: "Executive, Legislative, and Other General Government Support" },
          { code: "922", description: "Justice, Public Order, and Safety Activities" },
          { code: "923", description: "Administration of Human Resource Programs" },
          { code: "924", description: "Administration of Environmental Quality Programs" },
          { code: "925", description: "Administration of Housing Programs, Urban Planning, and Community Development" },
          { code: "926", description: "Administration of Economic Programs" },
          { code: "927", description: "Space Research and Technology" },
          { code: "928", description: "National Security and International Affairs" }
        ]
      },
      {
        code: "51",
        description: "Information",
        subcategories: [
          { code: "511", description: "Publishing Industries (except Internet)" },
          { code: "512", description: "Motion Picture and Sound Recording Industries" },
          { code: "515", description: "Broadcasting (except Internet)" },
          { code: "517", description: "Telecommunications" },
          { code: "518", description: "Data Processing, Hosting, and Related Services" },
          { code: "519", description: "Other Information Services" }
        ]
      },
      {
        code: "54",
        description: "Professional, Scientific, and Technical Services",
        subcategories: [
          { code: "541", description: "Professional, Scientific, and Technical Services" },
          { code: "5411", description: "Legal Services" },
          { code: "5412", description: "Accounting, Tax Preparation, Bookkeeping, and Payroll Services" },
          { code: "5413", description: "Architectural, Engineering, and Related Services" },
          { code: "5414", description: "Specialized Design Services" },
          { code: "5415", description: "Computer Systems Design and Related Services" },
          { code: "5416", description: "Management, Scientific, and Technical Consulting Services" },
          { code: "5417", description: "Scientific Research and Development Services" },
          { code: "5418", description: "Advertising, Public Relations, and Related Services" },
          { code: "5419", description: "Other Professional, Scientific, and Technical Services" }
        ]
      }
    ]
  }
};

// Helper function to get industry options based on organization type
export const getIndustryOptions = (organizationType) => {
  // If "Other" is selected, return ALL industry options from all organization types
  if (organizationType === 'Other') {
    const allIndustries = [];
    const seenCodes = new Set();
    
    // Collect all unique industries from all organization types
    Object.values(INDUSTRY_CLASSIFICATIONS).forEach(orgType => {
      orgType.categories.forEach(category => {
        if (!seenCodes.has(category.code)) {
          seenCodes.add(category.code);
          allIndustries.push(category);
        }
      });
    });
    
    return allIndustries;
  }
  
  // For specific organization types, return their specific industries
  return INDUSTRY_CLASSIFICATIONS[organizationType]?.categories || [];
};

// Helper function to get subcategory options based on organization type and industry
export const getSubcategoryOptions = (organizationType, industryCode) => {
  // If "Other" organization type is selected, search across all organization types
  if (organizationType === 'Other') {
    for (const orgType of Object.values(INDUSTRY_CLASSIFICATIONS)) {
      const category = orgType.categories.find(cat => cat.code === industryCode);
      if (category) {
        return category.subcategories || [];
      }
    }
    return [];
  }
  
  // For specific organization types, return their specific subcategories
  const categories = INDUSTRY_CLASSIFICATIONS[organizationType]?.categories || [];
  const category = categories.find(cat => cat.code === industryCode);
  return category?.subcategories || [];
};

// Helper function to get full description for a NAICS code
export const getNAICSDescription = (organizationType, industryCode, subcategoryCode) => {
  // If "Other" organization type is selected, search across all organization types
  if (organizationType === 'Other') {
    for (const orgType of Object.values(INDUSTRY_CLASSIFICATIONS)) {
      const category = orgType.categories.find(cat => cat.code === industryCode);
      if (category) {
        if (subcategoryCode) {
          const subcategory = category.subcategories?.find(sub => sub.code === subcategoryCode);
          return subcategory?.description || category.description || '';
        }
        return category.description || '';
      }
    }
    return '';
  }
  
  // For specific organization types, return their specific descriptions
  const categories = INDUSTRY_CLASSIFICATIONS[organizationType]?.categories || [];
  const category = categories.find(cat => cat.code === industryCode);
  
  if (subcategoryCode) {
    const subcategory = category?.subcategories?.find(sub => sub.code === subcategoryCode);
    return subcategory?.description || category?.description || '';
  }
  
  return category?.description || '';
};

// Validation function for NAICS codes
export const validateNAICSCode = (organizationType, industryCode, subcategoryCode) => {
  const categories = getIndustryOptions(organizationType);
  const category = categories.find(cat => cat.code === industryCode);
  
  if (!category) return false;
  
  if (subcategoryCode) {
    const subcategories = getSubcategoryOptions(organizationType, industryCode);
    return subcategories.some(sub => sub.code === subcategoryCode);
  }
  
  return true;
};

// Search function for industry categories
export const searchIndustryCategories = (organizationType, searchTerm) => {
  if (!searchTerm || searchTerm.trim() === '') {
    return getIndustryOptions(organizationType);
  }
  
  const categories = getIndustryOptions(organizationType);
  const searchLower = searchTerm.toLowerCase();
  
  return categories.filter(category => 
    category.code.toLowerCase().includes(searchLower) ||
    category.description.toLowerCase().includes(searchLower)
  );
};

// Search function for subcategories
export const searchSubcategories = (organizationType, industryCode, searchTerm) => {
  if (!searchTerm || searchTerm.trim() === '') {
    return getSubcategoryOptions(organizationType, industryCode);
  }
  
  const subcategories = getSubcategoryOptions(organizationType, industryCode);
  const searchLower = searchTerm.toLowerCase();
  
  return subcategories.filter(subcategory => 
    subcategory.code.toLowerCase().includes(searchLower) ||
    subcategory.description.toLowerCase().includes(searchLower)
  );
};
