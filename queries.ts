/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getOrganizationProfile = /* GraphQL */ `query GetOrganizationProfile($id: ID!) {
  getOrganizationProfile(id: $id) {
    accessibilityFeatures
    buildingAge
    buildingType
    city
    country
    createdAt
    emergencyContactEmail
    emergencyContactName
    emergencyContactPhone
    id
    industry
    isOnboardingComplete
    lastUpdated
    nearestFireStation
    nearestHospital
    nearestPoliceStation
    numberOfFloors
    operatingHours
    organizationName
    organizationType
    owner
    primaryAddress
    primaryContactEmail
    primaryContactName
    primaryContactPhone
    primaryHazards
    secondaryContactEmail
    secondaryContactName
    secondaryContactPhone
    secondaryHazards
    specialConsiderations
    specialPopulations
    state
    totalOccupancy
    updatedAt
    userId
    zipCode
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetOrganizationProfileQueryVariables,
  APITypes.GetOrganizationProfileQuery
>;
export const listOrganizationProfiles = /* GraphQL */ `query ListOrganizationProfiles(
  $filter: ModelOrganizationProfileFilterInput
  $limit: Int
  $nextToken: String
) {
  listOrganizationProfiles(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      accessibilityFeatures
      buildingAge
      buildingType
      city
      country
      createdAt
      emergencyContactEmail
      emergencyContactName
      emergencyContactPhone
      id
      industry
      isOnboardingComplete
      lastUpdated
      nearestFireStation
      nearestHospital
      nearestPoliceStation
      numberOfFloors
      operatingHours
      organizationName
      organizationType
      owner
      primaryAddress
      primaryContactEmail
      primaryContactName
      primaryContactPhone
      primaryHazards
      secondaryContactEmail
      secondaryContactName
      secondaryContactPhone
      secondaryHazards
      specialConsiderations
      specialPopulations
      state
      totalOccupancy
      updatedAt
      userId
      zipCode
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListOrganizationProfilesQueryVariables,
  APITypes.ListOrganizationProfilesQuery
>;
