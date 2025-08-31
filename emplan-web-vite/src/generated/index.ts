import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";
import { initSchema } from "@aws-amplify/datastore";

import { schema } from "./schema";

export enum OrganizationProfileOrganizationType {
  CORPORATE_OFFICE = "CorporateOffice",
  HEALTHCARE_FACILITY = "HealthcareFacility",
  EDUCATIONAL_INSTITUTION = "EducationalInstitution",
  GOVERNMENT_BUILDING = "GovernmentBuilding",
  RETAIL_COMMERCIAL = "RetailCommercial",
  MANUFACTURING = "Manufacturing",
  OTHER = "Other"
}

export enum OrganizationProfileBuildingType {
  SINGLE_STORY = "SingleStory",
  MULTI_STORY = "MultiStory",
  HIGH_RISE = "HighRise",
  CAMPUS = "Campus",
  INDUSTRIAL = "Industrial",
  OTHER = "Other"
}

type EagerOrganizationProfileModel = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<OrganizationProfile, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly organizationName: string;
  readonly organizationType?: OrganizationProfileOrganizationType | keyof typeof OrganizationProfileOrganizationType | null;
  readonly industry?: string | null;
  readonly primaryContactName?: string | null;
  readonly primaryContactEmail?: string | null;
  readonly primaryContactPhone?: string | null;
  readonly secondaryContactName?: string | null;
  readonly secondaryContactEmail?: string | null;
  readonly secondaryContactPhone?: string | null;
  readonly primaryAddress?: string | null;
  readonly city?: string | null;
  readonly state?: string | null;
  readonly zipCode?: string | null;
  readonly country?: string | null;
  readonly buildingType?: OrganizationProfileBuildingType | keyof typeof OrganizationProfileBuildingType | null;
  readonly numberOfFloors?: number | null;
  readonly totalOccupancy?: number | null;
  readonly buildingAge?: number | null;
  readonly emergencyContactName?: string | null;
  readonly emergencyContactPhone?: string | null;
  readonly emergencyContactEmail?: string | null;
  readonly nearestHospital?: string | null;
  readonly nearestFireStation?: string | null;
  readonly nearestPoliceStation?: string | null;
  readonly primaryHazards?: string | null;
  readonly secondaryHazards?: string | null;
  readonly specialConsiderations?: string | null;
  readonly operatingHours?: string | null;
  readonly specialPopulations?: string | null;
  readonly accessibilityFeatures?: string | null;
  readonly isOnboardingComplete?: boolean | null;
  readonly lastUpdated?: string | null;
  readonly userId: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyOrganizationProfileModel = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<OrganizationProfile, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly organizationName: string;
  readonly organizationType?: OrganizationProfileOrganizationType | keyof typeof OrganizationProfileOrganizationType | null;
  readonly industry?: string | null;
  readonly primaryContactName?: string | null;
  readonly primaryContactEmail?: string | null;
  readonly primaryContactPhone?: string | null;
  readonly secondaryContactName?: string | null;
  readonly secondaryContactEmail?: string | null;
  readonly secondaryContactPhone?: string | null;
  readonly primaryAddress?: string | null;
  readonly city?: string | null;
  readonly state?: string | null;
  readonly zipCode?: string | null;
  readonly country?: string | null;
  readonly buildingType?: OrganizationProfileBuildingType | keyof typeof OrganizationProfileBuildingType | null;
  readonly numberOfFloors?: number | null;
  readonly totalOccupancy?: number | null;
  readonly buildingAge?: number | null;
  readonly emergencyContactName?: string | null;
  readonly emergencyContactPhone?: string | null;
  readonly emergencyContactEmail?: string | null;
  readonly nearestHospital?: string | null;
  readonly nearestFireStation?: string | null;
  readonly nearestPoliceStation?: string | null;
  readonly primaryHazards?: string | null;
  readonly secondaryHazards?: string | null;
  readonly specialConsiderations?: string | null;
  readonly operatingHours?: string | null;
  readonly specialPopulations?: string | null;
  readonly accessibilityFeatures?: string | null;
  readonly isOnboardingComplete?: boolean | null;
  readonly lastUpdated?: string | null;
  readonly userId: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type OrganizationProfileModel = LazyLoading extends LazyLoadingDisabled ? EagerOrganizationProfileModel : LazyOrganizationProfileModel

export declare const OrganizationProfileModel: (new (init: ModelInit<OrganizationProfileModel>) => OrganizationProfileModel) & {
  copyOf(source: OrganizationProfileModel, mutator: (draft: MutableModel<OrganizationProfileModel>) => MutableModel<OrganizationProfileModel> | void): OrganizationProfileModel;
}



const { OrganizationProfile } = initSchema(schema) as {
  OrganizationProfile: PersistentModelConstructor<OrganizationProfileModel>;
};

export {
  OrganizationProfile
};