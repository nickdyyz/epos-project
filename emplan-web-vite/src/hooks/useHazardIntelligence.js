import { useState, useEffect, useMemo } from 'react';

// Geographic hazard risk data with seasonal considerations
const GEOGRAPHIC_HAZARD_RISKS = {
  // US Regions
  'California': {
    high: ['Earthquake', 'Wildfire', 'Drought'],
    medium: ['Flooding', 'Tsunami', 'Volcanic Eruption', 'Landslide'],
    low: ['Tornado', 'Hailstorm'],
    seasonal: {
      summer: ['Extreme Heat', 'Wildfire', 'Drought'],
      winter: ['Flooding', 'Landslide'],
      spring: ['Flooding', 'Landslide'],
      fall: ['Wildfire', 'Extreme Heat']
    }
  },
  'Florida': {
    high: ['Tropical Cyclone', 'Flooding', 'Lightning'],
    medium: ['Tornado', 'Waterspout', 'Drought'],
    low: ['Earthquake', 'Wildfire'],
    seasonal: {
      summer: ['Extreme Heat', 'Tropical Cyclone', 'Lightning', 'Flooding'],
      winter: ['Extreme Cold', 'Tornado'],
      spring: ['Tornado', 'Flooding', 'Lightning'],
      fall: ['Tropical Cyclone', 'Flooding']
    }
  },
  'Texas': {
    high: ['Tornado', 'Flooding', 'Drought'],
    medium: ['Tropical Cyclone', 'Hailstorm', 'Lightning'],
    low: ['Earthquake', 'Tsunami', 'Volcanic Eruption'],
    seasonal: {
      summer: ['Extreme Heat', 'Drought', 'Tropical Cyclone', 'Lightning'],
      winter: ['Extreme Cold', 'Tornado', 'Ice Storm'],
      spring: ['Tornado', 'Flooding', 'Hailstorm'],
      fall: ['Tropical Cyclone', 'Flooding']
    }
  },
  'Alaska': {
    high: ['Earthquake', 'Tsunami', 'Avalanche'],
    medium: ['Volcanic Eruption', 'Wildfire', 'Flooding'],
    low: ['Tornado', 'Tropical Cyclone'],
    seasonal: {
      summer: ['Wildfire', 'Flooding', 'Extreme Heat'],
      winter: ['Extreme Cold', 'Avalanche', 'Blizzard'],
      spring: ['Avalanche', 'Flooding'],
      fall: ['Extreme Cold', 'Avalanche']
    }
  },
  'Hawaii': {
    high: ['Volcanic Eruption', 'Tsunami', 'Tropical Cyclone'],
    medium: ['Earthquake', 'Lightning', 'Flooding'],
    low: ['Tornado', 'Avalanche'],
    seasonal: {
      summer: ['Extreme Heat', 'Tropical Cyclone', 'Lightning'],
      winter: ['Flooding', 'Tsunami'],
      spring: ['Flooding', 'Lightning'],
      fall: ['Tropical Cyclone', 'Flooding']
    }
  },
  'Arizona': {
    high: ['Extreme Heat', 'Drought', 'Wildfire'],
    medium: ['Flooding', 'Lightning'],
    low: ['Tornado', 'Earthquake'],
    seasonal: {
      summer: ['Extreme Heat', 'Wildfire', 'Lightning', 'Drought'],
      winter: ['Extreme Cold', 'Flooding'],
      spring: ['Wildfire', 'Flooding'],
      fall: ['Extreme Heat', 'Wildfire']
    }
  },
  'Colorado': {
    high: ['Wildfire', 'Avalanche', 'Drought'],
    medium: ['Flooding', 'Lightning', 'Hailstorm'],
    low: ['Tornado', 'Tsunami'],
    seasonal: {
      summer: ['Wildfire', 'Lightning', 'Hailstorm', 'Extreme Heat'],
      winter: ['Extreme Cold', 'Avalanche', 'Blizzard'],
      spring: ['Avalanche', 'Flooding'],
      fall: ['Wildfire', 'Extreme Cold']
    }
  },
  'New York': {
    high: ['Flooding', 'Blizzard'],
    medium: ['Tornado', 'Lightning', 'Extreme Heat'],
    low: ['Earthquake', 'Tsunami'],
    seasonal: {
      summer: ['Extreme Heat', 'Lightning', 'Flooding'],
      winter: ['Extreme Cold', 'Blizzard', 'Ice Storm'],
      spring: ['Flooding', 'Tornado'],
      fall: ['Extreme Cold', 'Flooding']
    }
  },
  'Michigan': {
    high: ['Extreme Cold', 'Blizzard'],
    medium: ['Tornado', 'Lightning', 'Flooding'],
    low: ['Earthquake', 'Tsunami'],
    seasonal: {
      summer: ['Extreme Heat', 'Lightning', 'Tornado'],
      winter: ['Extreme Cold', 'Blizzard', 'Ice Storm'],
      spring: ['Flooding', 'Tornado'],
      fall: ['Extreme Cold', 'Flooding']
    }
  },
  // Canadian Provinces
  'Ontario': {
    high: ['Extreme Cold', 'Ice Storm'],
    medium: ['Tornado', 'Lightning', 'Flooding'],
    low: ['Earthquake', 'Tsunami', 'Volcanic Eruption'],
    seasonal: {
      summer: ['Extreme Heat', 'Lightning', 'Tornado', 'Flooding'],
      winter: ['Extreme Cold', 'Blizzard', 'Ice Storm'],
      spring: ['Flooding', 'Tornado'],
      fall: ['Extreme Cold', 'Flooding']
    }
  },
  'British Columbia': {
    high: ['Earthquake', 'Landslide', 'Flooding'],
    medium: ['Avalanche', 'Tsunami', 'Wildfire'],
    low: ['Tornado', 'Tropical Cyclone'],
    seasonal: {
      summer: ['Wildfire', 'Extreme Heat', 'Flooding'],
      winter: ['Extreme Cold', 'Avalanche', 'Blizzard'],
      spring: ['Avalanche', 'Flooding'],
      fall: ['Extreme Cold', 'Avalanche']
    }
  },
  'Quebec': {
    high: ['Extreme Cold', 'Ice Storm'],
    medium: ['Tornado', 'Lightning', 'Flooding'],
    low: ['Earthquake', 'Tsunami', 'Volcanic Eruption'],
    seasonal: {
      summer: ['Extreme Heat', 'Lightning', 'Tornado'],
      winter: ['Extreme Cold', 'Blizzard', 'Ice Storm'],
      spring: ['Flooding', 'Tornado'],
      fall: ['Extreme Cold', 'Flooding']
    }
  },
  'Alberta': {
    high: ['Extreme Cold', 'Blizzard'],
    medium: ['Tornado', 'Wildfire', 'Flooding'],
    low: ['Earthquake', 'Tsunami'],
    seasonal: {
      summer: ['Wildfire', 'Extreme Heat', 'Tornado'],
      winter: ['Extreme Cold', 'Blizzard', 'Ice Storm'],
      spring: ['Flooding', 'Tornado'],
      fall: ['Extreme Cold', 'Wildfire']
    }
  }
};

// Organizational type hazard associations
const ORGANIZATION_HAZARD_RISKS = {
  'Healthcare Facility': {
    high: ['Epidemic/Pandemic', 'Power/Utilities Outage', 'Mass Violence'],
    medium: ['Hazardous Chemical Release', 'Cyberattack', 'Civil Unrest'],
    low: ['Industrial Explosion', 'Armed Conflict']
  },
  'Educational Institution': {
    high: ['Mass Violence', 'Power/Utilities Outage', 'Epidemic/Pandemic'],
    medium: ['Cyberattack', 'Civil Unrest', 'Tornado'],
    low: ['Industrial Explosion', 'Armed Conflict']
  },
  'Manufacturing Plant': {
    high: ['Industrial Explosion', 'Hazardous Chemical Release', 'Power/Utilities Outage'],
    medium: ['Infrastructure Collapse', 'Transportation Accident', 'Cyberattack'],
    low: ['Mass Violence', 'Civil Unrest']
  },
  'Corporate Office': {
    high: ['Cyberattack', 'Power/Utilities Outage', 'Mass Violence'],
    medium: ['Civil Unrest', 'Terrorist Attack', 'Infrastructure Collapse'],
    low: ['Industrial Explosion', 'Hazardous Chemical Release']
  },
  'Government Agency': {
    high: ['Terrorist Attack', 'Cyberattack', 'Civil Unrest'],
    medium: ['Mass Violence', 'Power/Utilities Outage', 'Infrastructure Collapse'],
    low: ['Industrial Explosion', 'Hazardous Chemical Release']
  },
  'Retail Store': {
    high: ['Mass Violence', 'Civil Unrest', 'Power/Utilities Outage'],
    medium: ['Cyberattack', 'Terrorist Attack', 'Transportation Accident'],
    low: ['Industrial Explosion', 'Hazardous Chemical Release']
  }
};

// Building characteristics hazard associations
const BUILDING_HAZARD_RISKS = {
  'Multi-story Building': {
    high: ['Infrastructure Collapse', 'Fire', 'Power/Utilities Outage'],
    medium: ['Earthquake', 'Tornado', 'Mass Violence'],
    low: ['Flooding', 'Landslide']
  },
  'Hazardous Materials On-site': {
    high: ['Hazardous Chemical Release', 'Industrial Explosion', 'Fire'],
    medium: ['Infrastructure Collapse', 'Transportation Accident'],
    low: ['Cyberattack', 'Mass Violence']
  },
  'Public Access Areas': {
    high: ['Mass Violence', 'Civil Unrest', 'Terrorist Attack'],
    medium: ['Epidemic/Pandemic', 'Fire', 'Infrastructure Collapse'],
    low: ['Industrial Explosion', 'Hazardous Chemical Release']
  },
  'Remote/Isolated Location': {
    high: ['Power/Utilities Outage', 'Transportation Accident', 'Wildfire'],
    medium: ['Infrastructure Collapse', 'Extreme Weather'],
    low: ['Mass Violence', 'Civil Unrest', 'Terrorist Attack']
  },
  '24/7 Operations': {
    high: ['Power/Utilities Outage', 'Cyberattack', 'Infrastructure Collapse'],
    medium: ['Mass Violence', 'Hazardous Chemical Release'],
    low: ['Civil Unrest', 'Terrorist Attack']
  }
};

// Helper function to extract location information
const extractLocationInfo = (location) => {
  if (!location) return null;
  
  // Simple parsing - in production, use a geocoding service
  const locationLower = location.toLowerCase();
  
  // Check for US states
  const usStates = {
    'california': 'California',
    'florida': 'Florida', 
    'texas': 'Texas',
    'alaska': 'Alaska',
    'hawaii': 'Hawaii',
    'arizona': 'Arizona',
    'colorado': 'Colorado',
    'new york': 'New York',
    'michigan': 'Michigan'
  };
  
  // Check for Canadian provinces
  const canadianProvinces = {
    'ontario': 'Ontario',
    'british columbia': 'British Columbia',
    'bc': 'British Columbia',
    'quebec': 'Quebec',
    'alberta': 'Alberta'
  };
  
  for (const [key, value] of Object.entries(usStates)) {
    if (locationLower.includes(key)) return value;
  }
  
  for (const [key, value] of Object.entries(canadianProvinces)) {
    if (locationLower.includes(key)) return value;
  }
  
  return null;
};

// Helper function to determine current season
const getCurrentSeason = () => {
  const month = new Date().getMonth();
  
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'fall';
  return 'winter';
};

// Helper function to get seasonal hazards for a region
const getSeasonalHazards = (region, season) => {
  if (!region || !GEOGRAPHIC_HAZARD_RISKS[region] || !GEOGRAPHIC_HAZARD_RISKS[region].seasonal) {
    return [];
  }
  
  return GEOGRAPHIC_HAZARD_RISKS[region].seasonal[season] || [];
};

// Helper function to get building characteristics from profile
const getBuildingCharacteristics = (profile) => {
  const characteristics = [];
  
  if (profile?.buildingType === 'MultiStory') {
    characteristics.push('Multi-story Building');
  }
  
  if (profile?.hasHazardousMaterials) {
    characteristics.push('Hazardous Materials On-site');
  }
  
  if (profile?.hasPublicAccess) {
    characteristics.push('Public Access Areas');
  }
  
  if (profile?.isRemoteLocation) {
    characteristics.push('Remote/Isolated Location');
  }
  
  if (profile?.has24HourOperations) {
    characteristics.push('24/7 Operations');
  }
  
  return characteristics;
};

export const useHazardIntelligence = (organizationProfile, location) => {
  const [suggestedHazards, setSuggestedHazards] = useState([]);
  const [reasoning, setReasoning] = useState({});

  const intelligentHazards = useMemo(() => {
    const suggestions = [];
    const reasons = {};

    // 1. Geographic-based suggestions with seasonal considerations
    const region = extractLocationInfo(location);
    const currentSeason = getCurrentSeason();
    
    if (region && GEOGRAPHIC_HAZARD_RISKS[region]) {
      const geoHazards = GEOGRAPHIC_HAZARD_RISKS[region];
      
      // Add high-risk geographic hazards
      geoHazards.high.forEach(hazard => {
        if (!suggestions.includes(hazard)) {
          suggestions.push(hazard);
          reasons[hazard] = `High geographic risk in ${region}`;
        }
      });
      
      // Add medium-risk geographic hazards
      geoHazards.medium.forEach(hazard => {
        if (!suggestions.includes(hazard)) {
          suggestions.push(hazard);
          reasons[hazard] = `Medium geographic risk in ${region}`;
        }
      });
      
      // Add seasonal hazards with higher priority
      const seasonalHazards = getSeasonalHazards(region, currentSeason);
      seasonalHazards.forEach(hazard => {
        if (!suggestions.includes(hazard)) {
          suggestions.push(hazard);
          reasons[hazard] = `Seasonal risk in ${region} (${currentSeason})`;
        } else {
          // Update reason to reflect seasonal priority
          reasons[hazard] = `High seasonal risk in ${region} (${currentSeason})`;
        }
      });
    }

    // 2. Organization type-based suggestions
    if (organizationProfile?.organizationType) {
      const orgType = organizationProfile.organizationType;
      const orgHazards = ORGANIZATION_HAZARD_RISKS[orgType];
      
      if (orgHazards) {
        orgHazards.high.forEach(hazard => {
          if (!suggestions.includes(hazard)) {
            suggestions.push(hazard);
            reasons[hazard] = `High risk for ${orgType} organizations`;
          }
        });
        
        orgHazards.medium.forEach(hazard => {
          if (!suggestions.includes(hazard)) {
            suggestions.push(hazard);
            reasons[hazard] = `Medium risk for ${orgType} organizations`;
          }
        });
      }
    }

    // 3. Building characteristics-based suggestions
    const buildingChars = getBuildingCharacteristics(organizationProfile);
    buildingChars.forEach(char => {
      const charHazards = BUILDING_HAZARD_RISKS[char];
      if (charHazards) {
        charHazards.high.forEach(hazard => {
          if (!suggestions.includes(hazard)) {
            suggestions.push(hazard);
            reasons[hazard] = `High risk due to ${char}`;
          }
        });
        
        charHazards.medium.forEach(hazard => {
          if (!suggestions.includes(hazard)) {
            suggestions.push(hazard);
            reasons[hazard] = `Medium risk due to ${char}`;
          }
        });
      }
    });

      // 4. Seasonal-specific hazards
  const seasonalSpecificHazards = [];
  
  if (currentSeason === 'winter') {
    seasonalSpecificHazards.push('Blizzard', 'Ice Storm');
  } else if (currentSeason === 'summer') {
    seasonalSpecificHazards.push('Heat Wave', 'Drought');
  }
  
  seasonalSpecificHazards.forEach(hazard => {
    if (!suggestions.includes(hazard)) {
      suggestions.push(hazard);
      reasons[hazard] = `Seasonal ${currentSeason} risk`;
    }
  });

  // 5. Universal hazards (always relevant)
  const universalHazards = ['Power/Utilities Outage', 'Cyberattack', 'Infrastructure Collapse'];
  universalHazards.forEach(hazard => {
    if (!suggestions.includes(hazard)) {
      suggestions.push(hazard);
      reasons[hazard] = 'Universal risk for all organizations';
    }
  });

    return { suggestions, reasons };
  }, [organizationProfile, location]);

  useEffect(() => {
    setSuggestedHazards(intelligentHazards.suggestions);
    setReasoning(intelligentHazards.reasons);
  }, [intelligentHazards]);

  const getHazardReason = (hazard) => {
    return reasoning[hazard] || 'User-selected hazard';
  };

  const getSuggestedHazardsByCategory = () => {
    const categorized = {
      'Natural Hazards': [],
      'Technological Hazards': [],
      'Human-caused Hazards': []
    };

    suggestedHazards.forEach(hazard => {
      if (['Avalanche', 'Drought', 'Earthquake', 'Epidemic/Pandemic', 'Flooding', 'Tsunami', 'Tropical Cyclone', 'Tornado', 'Waterspout', 'Hailstorm', 'Lightning', 'Wildfire', 'Extreme Heat', 'Extreme Cold', 'Volcanic Eruption', 'Landslide', 'Sinkhole', 'Erosion', 'Geomagnetic Storm', 'Blizzard', 'Ice Storm', 'Heat Wave'].includes(hazard)) {
        categorized['Natural Hazards'].push(hazard);
      } else if (['Hazardous Chemical Release', 'Radiation/Nuclear Release', 'Dam/Levee Failure', 'Power/Utilities Outage', 'Transportation Accident', 'Urban Conflagration', 'Industrial Explosion', 'Infrastructure Collapse', 'Urban flooding'].includes(hazard)) {
        categorized['Technological Hazards'].push(hazard);
      } else if (['Civil Unrest', 'Terrorist Attack', 'Cyberattack', 'Mass Violence', 'Sabotage/Vandalism', 'Armed Conflict'].includes(hazard)) {
        categorized['Human-caused Hazards'].push(hazard);
      }
    });

    return categorized;
  };

  return {
    suggestedHazards,
    reasoning,
    getHazardReason,
    getSuggestedHazardsByCategory,
    isIntelligentSuggestion: (hazard) => suggestedHazards.includes(hazard),
    currentSeason: getCurrentSeason(),
    region: extractLocationInfo(location)
  };
};
