/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateOrganizationProfile = /* GraphQL */ `subscription OnCreateOrganizationProfile(
  $filter: ModelSubscriptionOrganizationProfileFilterInput
  $owner: String
) {
  onCreateOrganizationProfile(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateOrganizationProfileSubscriptionVariables,
  APITypes.OnCreateOrganizationProfileSubscription
>;
export const onDeleteOrganizationProfile = /* GraphQL */ `subscription OnDeleteOrganizationProfile(
  $filter: ModelSubscriptionOrganizationProfileFilterInput
  $owner: String
) {
  onDeleteOrganizationProfile(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteOrganizationProfileSubscriptionVariables,
  APITypes.OnDeleteOrganizationProfileSubscription
>;
export const onUpdateOrganizationProfile = /* GraphQL */ `subscription OnUpdateOrganizationProfile(
  $filter: ModelSubscriptionOrganizationProfileFilterInput
  $owner: String
) {
  onUpdateOrganizationProfile(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateOrganizationProfileSubscriptionVariables,
  APITypes.OnUpdateOrganizationProfileSubscription
>;
