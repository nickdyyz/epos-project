import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  OrganizationProfile: a
    .model({
      // Basic Organization Information
      organizationName: a.string().required(),
      organizationType: a.enum(['ForProfit', 'NonProfit', 'Government', 'Educational', 'Other']),
      industry: a.string(),
      naicsCode: a.string(),
      naicsDescription: a.string(),
      customOrganizationType: a.string(),
      customIndustry: a.string(),
      
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
      
      // Location Information
      primaryAddress: a.string(),
      city: a.string(),
      state: a.string(),
      zipCode: a.string(),
      country: a.string().default('Canada'),
      
      // Primary Building Information
      buildingName: a.string(),
      buildingType: a.enum(['SingleStory', 'MultiStory', 'HighRise', 'Campus', 'Industrial', 'Warehouse', 'Retail', 'Healthcare', 'Educational', 'Other']),
      numberOfFloors: a.integer(),
      totalOccupancy: a.integer(),
      buildingAge: a.integer(),
      totalSquareFootage: a.integer(),
      
      // Additional Buildings (up to 5)
      building2Name: a.string(),
      building2Type: a.enum(['SingleStory', 'MultiStory', 'HighRise', 'Campus', 'Industrial', 'Warehouse', 'Retail', 'Healthcare', 'Educational', 'Other']),
      building2Floors: a.integer(),
      building2Age: a.integer(),
      building2SquareFootage: a.integer(),
      
      building3Name: a.string(),
      building3Type: a.enum(['SingleStory', 'MultiStory', 'HighRise', 'Campus', 'Industrial', 'Warehouse', 'Retail', 'Healthcare', 'Educational', 'Other']),
      building3Floors: a.integer(),
      building3Age: a.integer(),
      building3SquareFootage: a.integer(),
      
      building4Name: a.string(),
      building4Type: a.enum(['SingleStory', 'MultiStory', 'HighRise', 'Campus', 'Industrial', 'Warehouse', 'Retail', 'Healthcare', 'Educational', 'Other']),
      building4Floors: a.integer(),
      building4Age: a.integer(),
      building4SquareFootage: a.integer(),
      
      building5Name: a.string(),
      building5Type: a.enum(['SingleStory', 'MultiStory', 'HighRise', 'Campus', 'Industrial', 'Warehouse', 'Retail', 'Healthcare', 'Educational', 'Other']),
      building5Floors: a.integer(),
      building5Age: a.integer(),
      building5SquareFootage: a.integer(),
      
      // Occupancy & Accessibility Information
      maximumOccupancy: a.integer(),
      averageOccupancyWorkday: a.integer(),
      averageOccupancyOffHours: a.integer(),
      peopleWithDisabilities: a.string(),
      evacuationRoutes: a.string(),
      assemblyAreas: a.string(),
      
      // Emergency Information
          emergencyContactName: a.string(),
    emergencyContactPhone: a.string(),
    emergencyContactEmail: a.string(),
    otherEmergencyServices: a.string(),
      nearestHospital: a.string(),
      nearestFireStation: a.string(),
      nearestPoliceStation: a.string(),
      
      // Additional Information
      specialConsiderations: a.string(),
      
      // Metadata
      isOnboardingComplete: a.boolean().default(false),
      lastUpdated: a.datetime(),
      
      // Note: Removed userId field - allow.owner() automatically handles user association
    })
    .authorization((allow) => [
      // Users can only access their own organization profile
      allow.owner(),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
