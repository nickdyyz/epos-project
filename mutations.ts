/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createOrganizationProfile = /* GraphQL */ `mutation CreateOrganizationProfile(
  $condition: ModelOrganizationProfileConditionInput
  $input: CreateOrganizationProfileInput!
) {
  createOrganizationProfile(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateOrganizationProfileMutationVariables,
  APITypes.CreateOrganizationProfileMutation
>;
export const deleteOrganizationProfile = /* GraphQL */ `mutation DeleteOrganizationProfile(
  $condition: ModelOrganizationProfileConditionInput
  $input: DeleteOrganizationProfileInput!
) {
  deleteOrganizationProfile(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteOrganizationProfileMutationVariables,
  APITypes.DeleteOrganizationProfileMutation
>;
export const updateOrganizationProfile = /* GraphQL */ `mutation UpdateOrganizationProfile(
  $condition: ModelOrganizationProfileConditionInput
  $input: UpdateOrganizationProfileInput!
) {
  updateOrganizationProfile(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateOrganizationProfileMutationVariables,
  APITypes.UpdateOrganizationProfileMutation
>;
