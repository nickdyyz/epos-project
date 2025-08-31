import { Schema } from "@aws-amplify/datastore";

export const schema: Schema = {
    "models": {
        "OrganizationProfile": {
            "name": "OrganizationProfile",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "organizationName": {
                    "name": "organizationName",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "organizationType": {
                    "name": "organizationType",
                    "isArray": false,
                    "type": {
                        "enum": "OrganizationProfileOrganizationType"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "industry": {
                    "name": "industry",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "primaryContactName": {
                    "name": "primaryContactName",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "primaryContactEmail": {
                    "name": "primaryContactEmail",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "primaryContactPhone": {
                    "name": "primaryContactPhone",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "secondaryContactName": {
                    "name": "secondaryContactName",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "secondaryContactEmail": {
                    "name": "secondaryContactEmail",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "secondaryContactPhone": {
                    "name": "secondaryContactPhone",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "primaryAddress": {
                    "name": "primaryAddress",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "city": {
                    "name": "city",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "state": {
                    "name": "state",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "zipCode": {
                    "name": "zipCode",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "country": {
                    "name": "country",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "buildingType": {
                    "name": "buildingType",
                    "isArray": false,
                    "type": {
                        "enum": "OrganizationProfileBuildingType"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "numberOfFloors": {
                    "name": "numberOfFloors",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "totalOccupancy": {
                    "name": "totalOccupancy",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "buildingAge": {
                    "name": "buildingAge",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "emergencyContactName": {
                    "name": "emergencyContactName",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "emergencyContactPhone": {
                    "name": "emergencyContactPhone",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "emergencyContactEmail": {
                    "name": "emergencyContactEmail",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "nearestHospital": {
                    "name": "nearestHospital",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "nearestFireStation": {
                    "name": "nearestFireStation",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "nearestPoliceStation": {
                    "name": "nearestPoliceStation",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "primaryHazards": {
                    "name": "primaryHazards",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "secondaryHazards": {
                    "name": "secondaryHazards",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "specialConsiderations": {
                    "name": "specialConsiderations",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "operatingHours": {
                    "name": "operatingHours",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "specialPopulations": {
                    "name": "specialPopulations",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "accessibilityFeatures": {
                    "name": "accessibilityFeatures",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "isOnboardingComplete": {
                    "name": "isOnboardingComplete",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "lastUpdated": {
                    "name": "lastUpdated",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": []
                },
                "userId": {
                    "name": "userId",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "OrganizationProfiles",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "auth",
                    "properties": {
                        "rules": [
                            {
                                "provider": "userPools",
                                "ownerField": "owner",
                                "allow": "owner",
                                "identityClaim": "cognito:username",
                                "operations": [
                                    "create",
                                    "update",
                                    "delete",
                                    "read"
                                ]
                            }
                        ]
                    }
                }
            ]
        }
    },
    "enums": {
        "OrganizationProfileOrganizationType": {
            "name": "OrganizationProfileOrganizationType",
            "values": [
                "CorporateOffice",
                "HealthcareFacility",
                "EducationalInstitution",
                "GovernmentBuilding",
                "RetailCommercial",
                "Manufacturing",
                "Other"
            ]
        },
        "OrganizationProfileBuildingType": {
            "name": "OrganizationProfileBuildingType",
            "values": [
                "SingleStory",
                "MultiStory",
                "HighRise",
                "Campus",
                "Industrial",
                "Other"
            ]
        }
    },
    "nonModels": {},
    "codegenVersion": "3.4.4",
    "version": "f22b66659f11459befb406ec832c073f"
};