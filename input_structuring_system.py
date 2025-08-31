#!/usr/bin/env python3
"""
input_structuring_system.py - Enhanced Input Structuring System for EPOS

This system provides structured input mapping, taxonomy, and glossary to ensure
user inputs are properly mapped to emergency plan elements for improved accuracy
with the small language model.
"""

import json
from pathlib import Path
from typing import Dict, List, Optional, Any
from datetime import datetime
import re

# ============================================================================
# EMERGENCY PLANNING TAXONOMY
# ============================================================================

EMERGENCY_PLANNING_TAXONOMY = {
    "organization_types": {
        "educational": {
            "primary": ["Educational Institution", "School", "University", "College", "Campus"],
            "subtypes": {
                "k12": ["Elementary School", "Middle School", "High School", "K-12"],
                "post_secondary": ["University", "College", "Community College", "Technical Institute"],
                "specialized": ["Vocational School", "Trade School", "Special Education School"]
            },
            "characteristics": ["student_population", "faculty_staff", "campus_security", "transportation_services"],
            "regulations": ["education_ministry", "student_safety", "campus_security_standards"]
        },
        "healthcare": {
            "primary": ["Healthcare Facility", "Hospital", "Medical Center", "Clinic", "Nursing Home"],
            "subtypes": {
                "acute_care": ["Hospital", "Medical Center", "Emergency Department"],
                "long_term_care": ["Nursing Home", "Assisted Living", "Rehabilitation Center"],
                "outpatient": ["Clinic", "Medical Office", "Urgent Care", "Diagnostic Center"]
            },
            "characteristics": ["patient_population", "medical_staff", "critical_equipment", "infection_control"],
            "regulations": ["health_authority", "patient_safety", "medical_licensing"]
        },
        "corporate": {
            "primary": ["Corporate Office", "Business", "Company", "Office Building", "Headquarters"],
            "subtypes": {
                "office": ["Corporate Office", "Business Office", "Administrative Center"],
                "professional": ["Law Firm", "Accounting Firm", "Consulting Office"],
                "technology": ["Tech Company", "Software Company", "IT Office"]
            },
            "characteristics": ["employee_population", "business_operations", "data_systems", "client_services"],
            "regulations": ["occupational_safety", "business_licensing", "data_protection"]
        },
        "manufacturing": {
            "primary": ["Manufacturing Plant", "Factory", "Production Facility", "Industrial Plant"],
            "subtypes": {
                "heavy_industry": ["Steel Plant", "Chemical Plant", "Automotive Factory"],
                "light_industry": ["Electronics Factory", "Textile Mill", "Food Processing"],
                "assembly": ["Assembly Plant", "Manufacturing Line", "Production Facility"]
            },
            "characteristics": ["production_processes", "hazardous_materials", "heavy_equipment", "shift_operations"],
            "regulations": ["industrial_safety", "environmental_protection", "worker_safety"]
        },
        "retail": {
            "primary": ["Retail Store", "Shopping Center", "Mall", "Commercial Space"],
            "subtypes": {
                "department_store": ["Department Store", "Big Box Store", "Supermarket"],
                "specialty_retail": ["Boutique", "Specialty Shop", "Convenience Store"],
                "shopping_center": ["Mall", "Shopping Center", "Retail Complex"]
            },
            "characteristics": ["customer_traffic", "inventory_management", "point_of_sale", "public_access"],
            "regulations": ["retail_licensing", "public_safety", "consumer_protection"]
        },
        "government": {
            "primary": ["Government Agency", "Municipal Office", "Federal Building", "Public Service"],
            "subtypes": {
                "municipal": ["City Hall", "Municipal Office", "Local Government"],
                "provincial": ["Provincial Office", "State Government", "Regional Authority"],
                "federal": ["Federal Building", "Government Agency", "Public Service"]
            },
            "characteristics": ["public_services", "government_operations", "public_access", "official_records"],
            "regulations": ["government_standards", "public_safety", "official_procedures"]
        },
        "non_profit": {
            "primary": ["Non-Profit Organization", "Charity", "Community Organization", "Volunteer Group"],
            "subtypes": {
                "social_services": ["Social Service Agency", "Community Center", "Support Organization"],
                "charitable": ["Charity", "Foundation", "Relief Organization"],
                "advocacy": ["Advocacy Group", "Non-Profit Association", "Community Group"]
            },
            "characteristics": ["volunteer_staff", "community_services", "donor_relations", "limited_resources"],
            "regulations": ["non_profit_standards", "charitable_licensing", "volunteer_safety"]
        }
    },
    
    "hazards": {
        "natural_disasters": {
            "earthquake": {
                "primary": ["Earthquake", "Seismic Event", "Tremor"],
                "risk_factors": ["seismic_zone", "building_age", "soil_conditions"],
                "response_priorities": ["structural_assessment", "evacuation", "search_rescue"]
            },
            "flood": {
                "primary": ["Flood", "Flooding", "Water Damage", "Flash Flood"],
                "risk_factors": ["flood_plain", "drainage_systems", "weather_conditions"],
                "response_priorities": ["evacuation", "water_removal", "electrical_safety"]
            },
            "severe_weather": {
                "primary": ["Severe Weather", "Storm", "Hurricane", "Tornado", "Blizzard"],
                "risk_factors": ["geographic_location", "season", "weather_forecasts"],
                "response_priorities": ["shelter_in_place", "evacuation", "communication"]
            },
            "wildland_fire": {
                "primary": ["Wildland Fire", "Wildfire", "Forest Fire", "Brush Fire"],
                "risk_factors": ["proximity_to_vegetation", "drought_conditions", "wind_patterns"],
                "response_priorities": ["evacuation", "air_quality", "asset_protection"]
            }
        },
        "technological_hazards": {
            "power_outage": {
                "primary": ["Power Outage", "Electrical Failure", "Blackout", "Brownout"],
                "risk_factors": ["electrical_infrastructure", "backup_systems", "critical_equipment"],
                "response_priorities": ["backup_power", "equipment_shutdown", "communication"]
            },
            "chemical_spill": {
                "primary": ["Chemical Spill", "Hazardous Material Release", "Chemical Leak"],
                "risk_factors": ["chemical_storage", "handling_procedures", "containment_systems"],
                "response_priorities": ["containment", "evacuation", "decontamination"]
            },
            "equipment_failure": {
                "primary": ["Equipment Failure", "Mechanical Failure", "System Malfunction"],
                "risk_factors": ["equipment_age", "maintenance_schedule", "operational_stress"],
                "response_priorities": ["equipment_shutdown", "safety_assessment", "repair_coordination"]
            },
            "cyber_attack": {
                "primary": ["Cyber Attack", "Digital Threat", "Computer Security Breach"],
                "risk_factors": ["digital_infrastructure", "security_protocols", "data_sensitivity"],
                "response_priorities": ["system_isolation", "data_protection", "incident_response"]
            }
        },
        "human_caused": {
            "workplace_violence": {
                "primary": ["Workplace Violence", "Active Shooter", "Security Threat", "Violent Incident"],
                "risk_factors": ["public_access", "security_measures", "employee_screening"],
                "response_priorities": ["lockdown", "law_enforcement", "victim_assistance"]
            },
            "medical_emergency": {
                "primary": ["Medical Emergency", "Health Emergency", "Injury", "Illness"],
                "risk_factors": ["population_health", "medical_staff", "first_aid_equipment"],
                "response_priorities": ["medical_response", "emergency_services", "family_notification"]
            },
            "transportation_accident": {
                "primary": ["Transportation Accident", "Vehicle Accident", "Traffic Incident"],
                "risk_factors": ["transportation_routes", "vehicle_operations", "traffic_conditions"],
                "response_priorities": ["scene_management", "medical_response", "traffic_control"]
            },
            "infectious_disease": {
                "primary": ["Infectious Disease", "Pandemic", "Outbreak", "Contagious Illness"],
                "risk_factors": ["population_density", "hygiene_practices", "health_conditions"],
                "response_priorities": ["infection_control", "isolation", "health_monitoring"]
            }
        }
    },
    
    "procedures": {
        "evacuation": {
            "primary": ["Evacuation", "Evacuate", "Exit", "Egress"],
            "components": ["evacuation_routes", "assembly_areas", "accountability_systems"],
            "special_needs": ["mobility_assistance", "medical_equipment", "language_barriers"]
        },
        "communication": {
            "primary": ["Communication", "Notification", "Alert", "Emergency Contact"],
            "components": ["notification_systems", "contact_lists", "message_templates"],
            "channels": ["pa_system", "email", "text_sms", "phone_tree"]
        },
        "security": {
            "primary": ["Security", "Lockdown", "Access Control", "Perimeter Security"],
            "components": ["access_control", "surveillance", "security_personnel"],
            "procedures": ["lockdown_protocols", "visitor_management", "incident_response"]
        },
        "medical_response": {
            "primary": ["Medical Response", "First Aid", "Emergency Medical", "Medical Care"],
            "components": ["first_aid_supplies", "medical_staff", "emergency_services"],
            "procedures": ["triage", "medical_treatment", "hospital_transport"]
        }
    },
    
    "resources": {
        "emergency_equipment": {
            "safety_equipment": ["Fire Extinguishers", "First Aid Kits", "AED/Defibrillator", "Emergency Lighting"],
            "communication_equipment": ["PA System", "Emergency Radios", "Backup Phones", "Alert Systems"],
            "medical_equipment": ["First Aid Supplies", "Medical Kits", "Emergency Medical Equipment"],
            "evacuation_equipment": ["Evacuation Chairs", "Emergency Exits", "Emergency Lighting", "Exit Signs"]
        },
        "personnel": {
            "emergency_coordinators": ["Emergency Coordinator", "Safety Officer", "Emergency Manager"],
            "medical_personnel": ["Medical Staff", "First Aid Responders", "Emergency Medical Technicians"],
            "security_personnel": ["Security Staff", "Security Officers", "Access Control Personnel"],
            "support_personnel": ["Administrative Staff", "Maintenance Staff", "Volunteer Responders"]
        }
    }
}

# ============================================================================
# EMERGENCY PLANNING GLOSSARY
# ============================================================================

EMERGENCY_PLANNING_GLOSSARY = {
    "core_terms": {
        "emergency_plan": "A comprehensive document outlining procedures for responding to various emergency situations",
        "emergency_response": "Immediate actions taken to address an emergency situation",
        "evacuation": "The process of moving people from a dangerous area to a safe location",
        "lockdown": "A security procedure that restricts movement within a facility during a threat",
        "incident_command": "A standardized approach to emergency management and response",
        "emergency_coordinator": "The designated person responsible for managing emergency response",
        "assembly_area": "A designated safe location where people gather after evacuation",
        "accountability": "The process of ensuring all personnel are accounted for during an emergency"
    },
    
    "hazard_terms": {
        "natural_disaster": "Events caused by natural forces such as weather, geology, or environmental factors",
        "technological_hazard": "Events caused by human-made systems, equipment, or infrastructure failures",
        "human_caused_hazard": "Events intentionally or unintentionally caused by human actions",
        "risk_assessment": "The process of identifying and evaluating potential hazards and their likelihood",
        "vulnerability": "The degree to which a system or population is susceptible to harm from hazards"
    },
    
    "response_terms": {
        "mitigation": "Actions taken to reduce or eliminate the risk of hazards",
        "preparedness": "Activities undertaken to build capabilities for effective emergency response",
        "response": "Immediate actions taken to address an emergency situation",
        "recovery": "Activities undertaken to restore normal operations after an emergency",
        "triage": "The process of prioritizing medical treatment based on severity of injury or illness",
        "decontamination": "The process of removing or neutralizing hazardous substances"
    },
    
    "organizational_terms": {
        "chain_of_command": "The hierarchical structure of authority and responsibility",
        "emergency_organization": "The structure and roles for managing emergency response",
        "emergency_warden": "A designated person responsible for emergency response in a specific area",
        "backup_personnel": "Designated individuals who can assume key roles if primary personnel are unavailable",
        "mutual_aid": "Agreements between organizations to provide assistance during emergencies"
    }
}

# ============================================================================
# INPUT STRUCTURING SYSTEM
# ============================================================================

class InputStructuringSystem:
    def __init__(self):
        """Initialize the Input Structuring System."""
        self.taxonomy = EMERGENCY_PLANNING_TAXONOMY
        self.glossary = EMERGENCY_PLANNING_GLOSSARY
        
    def structure_user_inputs(self, raw_inputs: Dict) -> Dict:
        """Structure and validate user inputs according to the taxonomy."""
        structured_inputs = {
            "organization_profile": self._structure_organization_profile(raw_inputs),
            "hazard_assessment": self._structure_hazard_assessment(raw_inputs),
            "resource_inventory": self._structure_resource_inventory(raw_inputs),
            "procedural_requirements": self._structure_procedural_requirements(raw_inputs),
            "operational_context": self._structure_operational_context(raw_inputs)
        }
        
        # Add validation and enrichment
        structured_inputs["validation"] = self._validate_inputs(structured_inputs)
        structured_inputs["enrichment"] = self._enrich_inputs(structured_inputs)
        
        return structured_inputs
    
    def _structure_organization_profile(self, inputs: Dict) -> Dict:
        """Structure organization profile information."""
        org_type = inputs.get('organization_type', '')
        mapped_type = self._map_organization_type(org_type)
        
        return {
            "basic_info": {
                "name": inputs.get('organization_name', ''),
                "location": inputs.get('location', ''),
                "type": mapped_type,
                "subtype": self._identify_organization_subtype(org_type, mapped_type),
                "size": self._map_building_size(inputs.get('building_size', ''))
            },
            "characteristics": self._identify_organization_characteristics(mapped_type),
            "regulatory_context": self._identify_regulatory_requirements(mapped_type),
            "operational_hours": self._determine_operational_hours(inputs),
            "population_profile": self._estimate_population_profile(mapped_type, inputs.get('building_size', ''))
        }
    
    def _structure_hazard_assessment(self, inputs: Dict) -> Dict:
        """Structure hazard assessment information."""
        primary_hazards = inputs.get('primary_hazards', [])
        special_considerations = inputs.get('special_considerations', [])
        
        structured_hazards = {
            "primary_hazards": [],
            "secondary_hazards": [],
            "risk_factors": {},
            "response_priorities": {},
            "special_considerations": self._map_special_considerations(special_considerations)
        }
        
        for hazard in primary_hazards:
            mapped_hazard = self._map_hazard(hazard)
            if mapped_hazard:
                structured_hazards["primary_hazards"].append(mapped_hazard)
                structured_hazards["risk_factors"][mapped_hazard] = self._identify_risk_factors(mapped_hazard)
                structured_hazards["response_priorities"][mapped_hazard] = self._identify_response_priorities(mapped_hazard)
        
        return structured_hazards
    
    def _structure_resource_inventory(self, inputs: Dict) -> Dict:
        """Structure resource inventory information."""
        return {
            "personnel": {
                "security_staff": inputs.get('has_security', False),
                "medical_staff": inputs.get('has_medical_staff', False),
                "emergency_coordinators": True,  # Always needed
                "backup_personnel": True  # Always needed
            },
            "equipment": {
                "safety_equipment": self._map_equipment_category(inputs.get('emergency_equipment', []), 'safety_equipment'),
                "communication_equipment": self._map_equipment_category(inputs.get('emergency_equipment', []), 'communication_equipment'),
                "medical_equipment": self._map_equipment_category(inputs.get('emergency_equipment', []), 'medical_equipment'),
                "evacuation_equipment": self._map_equipment_category(inputs.get('emergency_equipment', []), 'evacuation_equipment')
            },
            "communication_systems": self._map_communication_methods(inputs.get('communication_methods', [])),
            "external_resources": self._identify_external_resources(inputs)
        }
    
    def _structure_procedural_requirements(self, inputs: Dict) -> Dict:
        """Structure procedural requirements."""
        plan_scope = inputs.get('plan_scope', 'Comprehensive (All Hazards)')
        
        return {
            "plan_scope": self._map_plan_scope(plan_scope),
            "required_procedures": self._identify_required_procedures(inputs),
            "special_procedures": self._identify_special_procedures(inputs),
            "training_requirements": self._identify_training_requirements(inputs),
            "maintenance_requirements": self._identify_maintenance_requirements(inputs)
        }
    
    def _structure_operational_context(self, inputs: Dict) -> Dict:
        """Structure operational context information."""
        return {
            "physical_environment": self._assess_physical_environment(inputs),
            "operational_constraints": self._identify_operational_constraints(inputs),
            "stakeholder_requirements": self._identify_stakeholder_requirements(inputs),
            "compliance_requirements": self._identify_compliance_requirements(inputs)
        }
    
    def _map_organization_type(self, org_type: str) -> str:
        """Map user input to standardized organization type."""
        org_type_lower = org_type.lower()
        
        for category, details in self.taxonomy["organization_types"].items():
            if any(term.lower() in org_type_lower for term in details["primary"]):
                return category
        
        return "corporate"  # Default fallback
    
    def _identify_organization_characteristics(self, mapped_type: str) -> List[str]:
        """Identify organization characteristics."""
        if mapped_type in self.taxonomy["organization_types"]:
            return self.taxonomy["organization_types"][mapped_type]["characteristics"]
        return []
    
    def _identify_regulatory_requirements(self, mapped_type: str) -> List[str]:
        """Identify regulatory requirements."""
        if mapped_type in self.taxonomy["organization_types"]:
            return self.taxonomy["organization_types"][mapped_type]["regulations"]
        return []
    
    def _determine_operational_hours(self, inputs: Dict) -> str:
        """Determine operational hours."""
        # This would be enhanced with actual input fields
        return "standard_business_hours"  # Default
    
    def _estimate_population_profile(self, mapped_type: str, building_size: str) -> Dict:
        """Estimate population profile."""
        # This would be enhanced with actual input fields
        return {"type": "mixed", "size": building_size}
    
    def _identify_external_resources(self, inputs: Dict) -> List[str]:
        """Identify external resources."""
        # This would be enhanced with actual input fields
        return ["emergency_services", "local_authorities"]
    
    def _identify_required_procedures(self, inputs: Dict) -> List[str]:
        """Identify required procedures."""
        # This would be enhanced with actual input fields
        return ["evacuation", "communication", "emergency_organization"]
    
    def _identify_special_procedures(self, inputs: Dict) -> List[str]:
        """Identify special procedures."""
        # This would be enhanced with actual input fields
        return []
    
    def _identify_training_requirements(self, inputs: Dict) -> List[str]:
        """Identify training requirements."""
        # This would be enhanced with actual input fields
        return ["emergency_response", "first_aid", "evacuation_procedures"]
    
    def _identify_maintenance_requirements(self, inputs: Dict) -> List[str]:
        """Identify maintenance requirements."""
        # This would be enhanced with actual input fields
        return ["plan_review", "equipment_maintenance", "training_updates"]
    
    def _assess_physical_environment(self, inputs: Dict) -> Dict:
        """Assess physical environment."""
        # This would be enhanced with actual input fields
        return {"building_type": "standard", "accessibility": "basic"}
    
    def _identify_operational_constraints(self, inputs: Dict) -> List[str]:
        """Identify operational constraints."""
        # This would be enhanced with actual input fields
        return ["budget_limitations", "staffing_constraints"]
    
    def _identify_stakeholder_requirements(self, inputs: Dict) -> List[str]:
        """Identify stakeholder requirements."""
        # This would be enhanced with actual input fields
        return ["employee_safety", "regulatory_compliance"]
    
    def _identify_compliance_requirements(self, inputs: Dict) -> List[str]:
        """Identify compliance requirements."""
        org_type = inputs.get('organization_type', '')
        mapped_type = self._map_organization_type(org_type)
        
        compliance_requirements = []
        
        if mapped_type == "healthcare":
            compliance_requirements.extend(["Patient Safety Standards", "Medical Emergency Protocols"])
        elif mapped_type == "manufacturing":
            compliance_requirements.extend(["Industrial Safety Standards", "Environmental Protection"])
        elif mapped_type == "educational":
            compliance_requirements.extend(["Student Safety Standards", "Campus Security Requirements"])
        else:
            compliance_requirements.extend(["Occupational Safety", "Emergency Management"])
        
        return compliance_requirements
    
    def _identify_backup_communication_methods(self, methods: List[str]) -> List[str]:
        """Identify backup communication methods."""
        # This would be enhanced with actual input fields
        return ["phone_tree", "radio_system"]
    
    def _identify_emergency_contact_requirements(self, methods: List[str]) -> List[str]:
        """Identify emergency contact requirements."""
        # This would be enhanced with actual input fields
        return ["emergency_services", "management_contacts"]
    
    def _identify_organization_subtype(self, org_type: str, mapped_type: str) -> str:
        """Identify organization subtype."""
        org_type_lower = org_type.lower()
        
        if mapped_type in self.taxonomy["organization_types"]:
            subtypes = self.taxonomy["organization_types"][mapped_type]["subtypes"]
            for subtype, terms in subtypes.items():
                if any(term.lower() in org_type_lower for term in terms):
                    return subtype
        
        return "general"
    
    def _map_building_size(self, size: str) -> Dict:
        """Map building size to structured format."""
        size_lower = size.lower()
        
        if "small" in size_lower or "< 50" in size_lower:
            return {"category": "small", "max_occupancy": 50, "evacuation_time": "2-3 minutes"}
        elif "medium" in size_lower or "50-200" in size_lower:
            return {"category": "medium", "max_occupancy": 200, "evacuation_time": "3-5 minutes"}
        elif "large" in size_lower or "200-500" in size_lower:
            return {"category": "large", "max_occupancy": 500, "evacuation_time": "5-8 minutes"}
        elif "very large" in size_lower or "500+" in size_lower:
            return {"category": "very_large", "max_occupancy": 1000, "evacuation_time": "8-12 minutes"}
        else:
            return {"category": "medium", "max_occupancy": 200, "evacuation_time": "3-5 minutes"}
    
    def _map_hazard(self, hazard: str) -> str:
        """Map user hazard input to standardized hazard type."""
        hazard_lower = hazard.lower()
        
        for category, hazards in self.taxonomy["hazards"].items():
            for hazard_type, details in hazards.items():
                if any(term in hazard_lower for term in details["primary"]):
                    return hazard_type
        
        return hazard_lower.replace(" ", "_")
    
    def _identify_risk_factors(self, hazard: str) -> List[str]:
        """Identify risk factors for a specific hazard."""
        for category, hazards in self.taxonomy["hazards"].items():
            for hazard_type, details in hazards.items():
                if hazard_type == hazard:
                    return details.get("risk_factors", [])
        return []
    
    def _identify_response_priorities(self, hazard: str) -> List[str]:
        """Identify response priorities for a specific hazard."""
        for category, hazards in self.taxonomy["hazards"].items():
            for hazard_type, details in hazards.items():
                if hazard_type == hazard:
                    return details.get("response_priorities", [])
        return []
    
    def _map_special_considerations(self, considerations: List[str]) -> Dict:
        """Map special considerations to structured format."""
        mapped = {
            "accessibility": [],
            "infrastructure": [],
            "operational": [],
            "regulatory": []
        }
        
        for consideration in considerations:
            consideration_lower = consideration.lower()
            
            if any(term in consideration_lower for term in ["disability", "accessibility", "special needs"]):
                mapped["accessibility"].append(consideration)
            elif any(term in consideration_lower for term in ["multi-story", "building", "infrastructure"]):
                mapped["infrastructure"].append(consideration)
            elif any(term in consideration_lower for term in ["24/7", "operations", "critical"]):
                mapped["operational"].append(consideration)
            elif any(term in consideration_lower for term in ["hazardous", "materials", "regulatory"]):
                mapped["regulatory"].append(consideration)
        
        return mapped
    
    def _map_equipment_category(self, equipment: List[str], category: str) -> List[str]:
        """Map equipment to specific categories."""
        if category in self.taxonomy["resources"]["emergency_equipment"]:
            category_equipment = self.taxonomy["resources"]["emergency_equipment"][category]
            return [item for item in equipment if any(term.lower() in item.lower() for term in category_equipment)]
        return []
    
    def _map_communication_methods(self, methods: List[str]) -> Dict:
        """Map communication methods to structured format."""
        return {
            "primary_methods": methods,
            "backup_methods": self._identify_backup_communication_methods(methods),
            "emergency_contacts": self._identify_emergency_contact_requirements(methods)
        }
    
    def _map_plan_scope(self, scope: str) -> Dict:
        """Map plan scope to structured format."""
        scope_lower = scope.lower()
        
        if "basic" in scope_lower:
            return {"level": "basic", "comprehensiveness": "essential_procedures_only", "detail_level": "minimal"}
        elif "standard" in scope_lower:
            return {"level": "standard", "comprehensiveness": "common_hazards", "detail_level": "moderate"}
        elif "comprehensive" in scope_lower:
            return {"level": "comprehensive", "comprehensiveness": "all_hazards", "detail_level": "detailed"}
        elif "advanced" in scope_lower:
            return {"level": "advanced", "comprehensiveness": "industry_specific", "detail_level": "comprehensive"}
        else:
            return {"level": "comprehensive", "comprehensiveness": "all_hazards", "detail_level": "detailed"}
    
    def _validate_inputs(self, structured_inputs: Dict) -> Dict:
        """Validate structured inputs and identify issues."""
        validation = {
            "is_valid": True,
            "warnings": [],
            "errors": [],
            "recommendations": []
        }
        
        # Validate organization profile
        org_profile = structured_inputs["organization_profile"]
        if not org_profile["basic_info"]["name"]:
            validation["errors"].append("Organization name is required")
            validation["is_valid"] = False
        
        if not org_profile["basic_info"]["location"]:
            validation["warnings"].append("Location information is recommended for accurate planning")
        
        # Validate hazard assessment
        hazard_assessment = structured_inputs["hazard_assessment"]
        if not hazard_assessment["primary_hazards"]:
            validation["errors"].append("At least one primary hazard must be identified")
            validation["is_valid"] = False
        
        # Validate resource inventory
        resource_inventory = structured_inputs["resource_inventory"]
        if not resource_inventory["personnel"]["security_staff"]:
            validation["recommendations"].append("Consider adding security staff for enhanced safety")
        
        if not resource_inventory["personnel"]["medical_staff"]:
            validation["recommendations"].append("Consider adding medical staff for health emergencies")
        
        return validation
    
    def _enrich_inputs(self, structured_inputs: Dict) -> Dict:
        """Enrich inputs with additional context and recommendations."""
        enrichment = {
            "additional_hazards": self._suggest_additional_hazards(structured_inputs),
            "missing_procedures": self._identify_missing_procedures(structured_inputs),
            "resource_recommendations": self._suggest_additional_resources(structured_inputs),
            "compliance_notes": self._identify_compliance_requirements(structured_inputs)
        }
        
        return enrichment
    
    def _suggest_additional_hazards(self, structured_inputs: Dict) -> List[str]:
        """Suggest additional hazards based on organization type and location."""
        org_type = structured_inputs["organization_profile"]["basic_info"]["type"]
        location = structured_inputs["organization_profile"]["basic_info"]["location"]
        
        suggestions = []
        
        # Location-based suggestions
        if location:
            location_lower = location.lower()
            if any(region in location_lower for region in ["california", "alaska", "japan", "chile"]):
                suggestions.append("earthquake")
            if any(region in location_lower for region in ["florida", "louisiana", "texas", "caribbean"]):
                suggestions.append("hurricane")
            if any(region in location_lower for region in ["tornado", "midwest", "plains"]):
                suggestions.append("tornado")
        
        # Organization-based suggestions
        if org_type == "healthcare":
            suggestions.extend(["infectious_disease", "medical_emergency"])
        elif org_type == "manufacturing":
            suggestions.extend(["chemical_spill", "equipment_failure"])
        elif org_type == "educational":
            suggestions.extend(["workplace_violence", "medical_emergency"])
        
        return list(set(suggestions))
    
    def _identify_missing_procedures(self, structured_inputs: Dict) -> List[str]:
        """Identify potentially missing procedures."""
        missing = []
        
        # Always needed procedures
        required_procedures = ["evacuation", "communication", "emergency_organization"]
        
        for procedure in required_procedures:
            if procedure not in structured_inputs.get("procedural_requirements", {}).get("required_procedures", []):
                missing.append(procedure)
        
        return missing
    
    def _suggest_additional_resources(self, structured_inputs: Dict) -> Dict:
        """Suggest additional resources based on organization type and hazards."""
        suggestions = {
            "equipment": [],
            "personnel": [],
            "training": []
        }
        
        org_type = structured_inputs["organization_profile"]["basic_info"]["type"]
        hazards = structured_inputs["hazard_assessment"]["primary_hazards"]
        
        # Equipment suggestions
        if "medical_emergency" in hazards:
            suggestions["equipment"].append("AED/Defibrillator")
        if "chemical_spill" in hazards:
            suggestions["equipment"].append("Spill Kits")
        if "workplace_violence" in hazards:
            suggestions["equipment"].append("Emergency Communication System")
        
        # Personnel suggestions
        if org_type == "healthcare":
            suggestions["personnel"].append("Medical Emergency Response Team")
        if org_type == "manufacturing":
            suggestions["personnel"].append("Hazardous Materials Response Team")
        
        return suggestions
    

    
    def create_structured_prompt(self, structured_inputs: Dict) -> str:
        """Create a structured prompt for the language model."""
        prompt_parts = []
        
        # Organization Profile
        org_profile = structured_inputs["organization_profile"]
        prompt_parts.append(f"""
ORGANIZATION PROFILE:
- Name: {org_profile['basic_info']['name']}
- Type: {org_profile['basic_info']['type']} ({org_profile['basic_info']['subtype']})
- Location: {org_profile['basic_info']['location']}
- Size: {org_profile['basic_info']['size']['category']} ({org_profile['basic_info']['size']['max_occupancy']} people max)
- Characteristics: {', '.join(org_profile['characteristics'])}
- Regulatory Context: {', '.join(org_profile['regulatory_context'])}
""")
        
        # Hazard Assessment
        hazard_assessment = structured_inputs["hazard_assessment"]
        prompt_parts.append(f"""
HAZARD ASSESSMENT:
- Primary Hazards: {', '.join(hazard_assessment['primary_hazards'])}
- Risk Factors: {self._format_risk_factors(hazard_assessment['risk_factors'])}
- Response Priorities: {self._format_response_priorities(hazard_assessment['response_priorities'])}
- Special Considerations: {self._format_special_considerations(hazard_assessment['special_considerations'])}
""")
        
        # Resource Inventory
        resource_inventory = structured_inputs["resource_inventory"]
        prompt_parts.append(f"""
RESOURCE INVENTORY:
- Personnel: {self._format_personnel(resource_inventory['personnel'])}
- Equipment: {self._format_equipment(resource_inventory['equipment'])}
- Communication Systems: {', '.join(resource_inventory['communication_systems']['primary_methods'])}
""")
        
        # Procedural Requirements
        procedural_requirements = structured_inputs["procedural_requirements"]
        prompt_parts.append(f"""
PROCEDURAL REQUIREMENTS:
- Plan Scope: {procedural_requirements['plan_scope']['level']} ({procedural_requirements['plan_scope']['comprehensiveness']})
- Required Procedures: {', '.join(procedural_requirements.get('required_procedures', []))}
- Training Requirements: {', '.join(procedural_requirements.get('training_requirements', []))}
""")
        
        # Validation and Enrichment
        validation = structured_inputs["validation"]
        enrichment = structured_inputs["enrichment"]
        
        if validation["warnings"] or validation["recommendations"]:
            prompt_parts.append(f"""
VALIDATION NOTES:
- Warnings: {', '.join(validation['warnings'])}
- Recommendations: {', '.join(validation['recommendations'])}
- Additional Hazards to Consider: {', '.join(enrichment['additional_hazards'])}
- Resource Recommendations: {self._format_resource_recommendations(enrichment['resource_recommendations'])}
""")
        
        return "\n".join(prompt_parts)
    
    def _format_risk_factors(self, risk_factors: Dict) -> str:
        """Format risk factors for prompt."""
        formatted = []
        for hazard, factors in risk_factors.items():
            if factors:
                formatted.append(f"{hazard}: {', '.join(factors)}")
        return "; ".join(formatted) if formatted else "None identified"
    
    def _format_response_priorities(self, response_priorities: Dict) -> str:
        """Format response priorities for prompt."""
        formatted = []
        for hazard, priorities in response_priorities.items():
            if priorities:
                formatted.append(f"{hazard}: {', '.join(priorities)}")
        return "; ".join(formatted) if formatted else "Standard response procedures"
    
    def _format_special_considerations(self, special_considerations: Dict) -> str:
        """Format special considerations for prompt."""
        formatted = []
        for category, considerations in special_considerations.items():
            if considerations:
                formatted.append(f"{category}: {', '.join(considerations)}")
        return "; ".join(formatted) if formatted else "None"
    
    def _format_personnel(self, personnel: Dict) -> str:
        """Format personnel information for prompt."""
        available_roles = []
        for role, is_available in personnel.items():
            if is_available:
                available_roles.append(role.replace("_", " "))
        return ", ".join(available_roles) if available_roles else "Emergency coordinator only"
    
    def _format_equipment(self, equipment: Dict) -> str:
        """Format equipment information for prompt."""
        all_equipment = []
        for category, items in equipment.items():
            all_equipment.extend(items)
        return ", ".join(all_equipment) if all_equipment else "Basic emergency supplies"
    
    def _format_resource_recommendations(self, recommendations: Dict) -> str:
        """Format resource recommendations for prompt."""
        formatted = []
        for category, items in recommendations.items():
            if items:
                formatted.append(f"{category}: {', '.join(items)}")
        return "; ".join(formatted) if formatted else "None"
    
    def save_structured_inputs(self, structured_inputs: Dict, filename: str = None) -> str:
        """Save structured inputs to JSON file."""
        if not filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"structured_inputs_{timestamp}.json"
        
        filepath = Path("structured_inputs") / filename
        filepath.parent.mkdir(exist_ok=True)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(structured_inputs, f, indent=2, default=str)
        
        return str(filepath)
    
    def load_structured_inputs(self, filepath: str) -> Dict:
        """Load structured inputs from JSON file."""
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)


def main():
    """Test the Input Structuring System."""
    # Create test inputs
    test_inputs = {
        'organization_name': 'Vancouver General Hospital',
        'organization_type': 'Healthcare Facility',
        'location': 'Vancouver, BC',
        'building_size': 'Large (200-500 people)',
        'primary_hazards': ['Medical Emergency', 'Chemical Spill', 'Power Outage'],
        'special_considerations': ['Persons with Disabilities', 'Multi-story Building', '24/7 Operations'],
        'has_security': True,
        'has_medical_staff': True,
        'emergency_equipment': ['Fire Extinguishers', 'First Aid Kits', 'AED/Defibrillator', 'Emergency Lighting'],
        'communication_methods': ['PA System', 'Email Alerts', 'Text/SMS'],
        'plan_scope': 'Comprehensive (All Hazards)',
        'additional_requirements': 'Must comply with healthcare regulations'
    }
    
    # Initialize system
    system = InputStructuringSystem()
    
    # Structure inputs
    structured_inputs = system.structure_user_inputs(test_inputs)
    
    # Create structured prompt
    prompt = system.create_structured_prompt(structured_inputs)
    
    # Save structured inputs
    filepath = system.save_structured_inputs(structured_inputs)
    
    print("🔧 INPUT STRUCTURING SYSTEM TEST")
    print("=" * 50)
    print("\n📋 STRUCTURED INPUTS:")
    print(json.dumps(structured_inputs, indent=2, default=str))
    
    print("\n📝 STRUCTURED PROMPT:")
    print(prompt)
    
    print(f"\n💾 Saved to: {filepath}")
    print("\n✅ Input structuring system test completed successfully!")


if __name__ == "__main__":
    main()
