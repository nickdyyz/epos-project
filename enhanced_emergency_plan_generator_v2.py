#!/usr/bin/env python3
"""
enhanced_emergency_plan_generator_v2.py - Enhanced Emergency Plan Generator with Input Structuring

This enhanced version integrates the input structuring system to provide better
mapping of user inputs to emergency plan elements for improved accuracy with
the small language model.
"""

import json
import ollama
from pathlib import Path
from typing import Dict, List, Optional
from datetime import datetime
import argparse

# Import the enhanced systems
from document_organizer import DocumentOrganizer
from input_structuring_system import InputStructuringSystem

# ============================================================================
# ENHANCED SYSTEM INSTRUCTIONS
# ============================================================================

SYSTEM_INSTRUCTIONS = """Emergency Planning Assistant System Instructions
Core Identity and Role Definition
You are an Emergency Planning Assistant, a specialized language model designed to generate comprehensive, actionable emergency response plans for organizations. Your primary function is to analyze organizational context and create tailored emergency procedures that prioritize human safety, operational continuity, and regulatory compliance.
IMPORTANT SCOPE LIMITATION: You do not address building fire detection, suppression, or evacuation procedures, as these are covered by separate specialized fire safety systems. However, you do address wildland fires and other external fire hazards that may threaten facilities.

Input Analysis Framework
When receiving structured user inputs, systematically evaluate:

Organizational Context
- Type of Organization: Business, school, healthcare facility, manufacturing plant, etc.
- Size and Occupancy: Number of employees, visitors, residents, or patients
- Operational Hours: 24/7 operations, business hours, seasonal variations
- Organizational Structure: Management hierarchy, department divisions, reporting relationships

Physical Environment
- Building Characteristics: Single/multi-story, construction type, age, accessibility features
- Location Factors: Geographic region, climate, proximity to hazards or emergency services
- Infrastructure: Utilities, HVAC systems, communication networks, transportation access
- Special Areas: Labs, warehouses, server rooms, hazardous material storage

Hazard Assessment
- Natural Hazards: Earthquakes, floods, hurricanes, tornadoes, wildland fires based on location
- Technological Hazards: Power outages, chemical spills, equipment failures, cyber incidents
- Human-Caused Events: Workplace violence, terrorism, civil unrest
- Health Emergencies: Pandemics, infectious disease outbreaks, medical emergencies
- External Fire Threats: Wildland fires, neighboring structure fires, industrial fires that may threaten the facility from outside

NOTE: Building fire detection, alarm systems, sprinkler systems, and internal fire evacuation procedures are specifically excluded from your scope and handled by separate fire safety systems.

Existing Capabilities
- Emergency Equipment: First aid supplies, communication devices, backup power, emergency supplies (excluding fire suppression equipment)
- Trained Personnel: First responders, safety officers, medical staff
- Current Procedures: Existing policies, training programs, previous incident experience

Plan Generation Guidelines
Structure and Format
Generate plans using this standardized format:

1. **EXECUTIVE SUMMARY** - Brief overview of plan purpose, scope, and key procedures
2. **ORGANIZATION PROFILE** - Description of the organization and its emergency management context
3. **HAZARD ANALYSIS** - Assessment of the identified primary hazards and risks
4. **EMERGENCY RESPONSE PROCEDURES** - Step-by-step procedures for each identified hazard
5. **ROLES AND RESPONSIBILITIES** - Clear assignment of emergency management roles
6. **COMMUNICATION PLAN** - Emergency communication procedures using available methods
7. **EVACUATION PROCEDURES** - Specific evacuation plans considering building and population
8. **EMERGENCY RESOURCES** - Utilization of available emergency equipment and resources
9. **TRAINING REQUIREMENTS** - Recommended training based on the hazards and organization type
10. **PLAN MAINTENANCE** - Procedures for keeping the plan current and effective

Content Requirements
Actionable Procedures
- Use clear, imperative language ("Immediately evacuate," "Call 911," "Activate alarm")
- Provide specific timeframes and decision points
- Include alternative actions for different scenarios
- Address special populations (disabled individuals, visitors, remote workers)

Role Assignments
- Clearly define emergency coordinator responsibilities
- Assign backup personnel for key positions
- Specify department-level emergency wardens
- Include external coordination contacts

Communication Elements
- Emergency notification methods and sequences
- Public address system messages and scripts (for non-fire emergencies)
- External agency contact information
- Family notification procedures

Resource Identification
- Emergency supply locations and inventories
- Utility shutoff procedures and locations (excluding fire-related systems)
- Transportation resources and evacuation routes
- Mutual aid agreements and external support

Customization Principles
Risk-Based Approach
- Prioritize procedures based on likelihood and severity of identified hazards
- Provide detailed responses for high-probability events
- Include basic procedures for low-probability, high-impact scenarios

Organizational Fit
- Align procedures with existing organizational culture and communication patterns
- Consider operational constraints and business requirements
- Integrate with existing safety and security programs

Scalability
- Design procedures that work for both small incidents and major emergencies
- Include escalation triggers and expanded response protocols
- Address both immediate response and extended operations

Quality Assurance Standards
Completeness Verification
Ensure each generated plan addresses:
- All identified hazards and scenarios (excluding building fires)
- Legal and regulatory requirements
- Accessibility and special needs requirements
- Integration with local emergency services

Clarity and Usability
- Use plain language appropriate for all organizational members
- Include visual elements when beneficial (floor plans, flowcharts)
- Organize information logically with clear headings and sections
- Provide quick reference guides for immediate use

Accuracy and Feasibility
- Verify that procedures are realistic given organizational resources
- Ensure evacuation times and routes are practical for non-fire scenarios
- Confirm that assigned roles match personnel capabilities
- Validate contact information and external resources

Output Limitations and Disclaimers
Fire Safety Exclusion
Always include a clear disclaimer that building fire detection, suppression, alarm systems, and fire evacuation procedures are not addressed in this plan and must be covered by separate fire safety planning and systems.

Professional Review Requirement
Always include a disclaimer stating that generated plans should be reviewed by qualified emergency management professionals and legal counsel before implementation.

Local Adaptation Needed
Emphasize that plans must be customized to specific local conditions, regulations, and emergency service capabilities not fully captured in the initial context.

Regular Updates Required
Stress that emergency plans require regular review, testing, and updating as organizational conditions change.

Your role is to serve as a knowledgeable, thorough, and practical emergency planning resource that transforms organizational information into actionable safety protocols while maintaining the highest standards of accuracy and usability, with the clear understanding that building fire safety is handled separately and wildland fires are within your scope as an external hazard.

IMPORTANT: Always include a clear statement in your generated plans that professional review and validation is required before implementation, and that users assume full responsibility for the plan's effectiveness and compliance with applicable regulations."""

# ============================================================================
# LEGAL DISCLAIMERS AND COPYRIGHT
# ============================================================================

DISCLAIMER_HEADER = """# ⚠️ IMPORTANT LEGAL DISCLAIMER

**PLEASE READ CAREFULLY BEFORE USING THIS EMERGENCY PLAN**

This emergency plan has been generated by the Emergency Plan Organization System (EPOS) using artificial intelligence technology. The following disclaimers and limitations apply:

## PROFESSIONAL REVIEW REQUIRED
This emergency plan **MUST** be reviewed, validated, and approved by qualified emergency management professionals, legal counsel, and relevant regulatory authorities before implementation. The plan may require significant modifications to meet your organization's specific needs, local regulations, and industry standards.

## NO WARRANTIES OR GUARANTEES
- **NO WARRANTIES**: EPOS and its developers make no warranties, express or implied, regarding the accuracy, completeness, reliability, or suitability of this emergency plan for any purpose.
- **NO LIABILITY**: EPOS developers assume no liability for any damages, losses, injuries, or consequences arising from the use, implementation, or reliance upon this emergency plan.
- **USE AT OWN RISK**: This plan is provided "AS IS" without any guarantees of effectiveness or compliance with applicable laws or regulations.

## USER RESPONSIBILITY
By using this emergency plan, you acknowledge and agree that:
- You assume full responsibility for reviewing, validating, and customizing the plan
- You will consult with qualified professionals before implementation
- You will ensure compliance with all applicable laws, regulations, and industry standards
- You will test and validate all procedures before relying on them in emergency situations
- You will maintain and update the plan as organizational conditions change

## LIMITATIONS
This emergency plan may not address:
- All potential hazards or scenarios specific to your organization
- Local emergency response protocols and capabilities
- Industry-specific regulations or requirements
- Building-specific fire safety systems (handled separately)
- Legal or insurance requirements
- Training and certification requirements

## COPYRIGHT NOTICE
© 2025 Emergency Plan Organization System (EPOS). All rights reserved.

This emergency plan is generated by EPOS software. While the generated content is provided for your use, the EPOS system, its algorithms, and underlying technology remain the property of EPOS developers.

---

"""

DISCLAIMER_FOOTER = """

---

# ⚠️ FINAL DISCLAIMER

**IMPORTANT REMINDER**

This emergency plan has been generated by artificial intelligence and requires professional review before use. The developers of EPOS assume no responsibility for the accuracy, completeness, or effectiveness of this plan.

**BEFORE IMPLEMENTATION:**
1. Review with qualified emergency management professionals
2. Validate with legal counsel for compliance requirements
3. Test all procedures in controlled environments
4. Ensure alignment with local emergency response protocols
5. Update contact information and procedures as needed
6. Conduct regular training and drills

**USER ACKNOWLEDGMENT:**
By using this plan, you accept full responsibility for its implementation and effectiveness. EPOS developers are not liable for any consequences resulting from the use of this plan.

**COPYRIGHT:** © 2025 Emergency Plan Organization System (EPOS). All rights reserved.

---

"""

# ============================================================================
# ENHANCED EMERGENCY PLAN GENERATOR V2 CLASS
# ============================================================================

class EnhancedEmergencyPlanGeneratorV2:
    def __init__(self, model_name: str = "llama3.2:1b", organized_data_dir: str = None):
        """Initialize the Enhanced Emergency Plan Generator V2."""
        self.model_name = model_name
        
        # Initialize document organizer
        if organized_data_dir:
            self.organized_data_path = Path(organized_data_dir)
        else:
            self.organized_data_path = Path(__file__).parent / "training_materials" / "organized"
        
        self.document_organizer = DocumentOrganizer()
        self.input_structuring_system = InputStructuringSystem()
        self.organized_docs = {}
        self.load_organized_documents()
    
    def load_organized_documents(self) -> None:
        """Load the organized emergency management documents."""
        print("📚 Loading organized emergency management documents...")
        
        # Check if organized documents exist
        organized_file = self.organized_data_path / "organized_documents.json"
        if organized_file.exists():
            try:
                with open(organized_file, 'r', encoding='utf-8') as f:
                    self.organized_docs = json.load(f)
                print(f"✅ Loaded organized documents from: {organized_file}")
            except Exception as e:
                print(f"⚠️ Error loading organized documents: {e}")
                print("🔄 Reorganizing documents...")
                self.organized_docs = self.document_organizer.categorize_documents()
        else:
            print("🔄 Organized documents not found. Creating organization...")
            self.organized_docs = self.document_organizer.categorize_documents()
    
    def get_relevant_context(self, organization_type: str, hazards: List[str], procedures: List[str] = None) -> str:
        """Get relevant context documents based on organization type and hazards."""
        relevant_docs = []
        
        # Map organization type to our categories
        org_type_mapping = {
            "Educational Institution": "educational",
            "Healthcare Facility": "healthcare", 
            "Corporate Office": "corporate",
            "Manufacturing Plant": "industrial",
            "Retail Store": "retail",
            "Government Agency": "government",
            "Non-Profit": "non_profit"
        }
        
        mapped_org_type = org_type_mapping.get(organization_type, "corporate")
        
        # Get comprehensive plans for the organization type
        if 'comprehensive_plans' in self.organized_docs and mapped_org_type in self.organized_docs['comprehensive_plans']:
            relevant_docs.extend(self.organized_docs['comprehensive_plans'][mapped_org_type])
        
        # Get organization type specific documents
        if 'organization_types' in self.organized_docs and mapped_org_type in self.organized_docs['organization_types']:
            relevant_docs.extend(self.organized_docs['organization_types'][mapped_org_type])
        
        # Get hazard-specific documents
        if 'hazards' in self.organized_docs:
            for hazard in hazards:
                # Map hazard names to our categories
                hazard_mapping = {
                    "Fire": "fire",
                    "Earthquake": "earthquake", 
                    "Flood": "flood",
                    "Severe Weather": "severe_weather",
                    "Power Outage": "power_outage",
                    "Chemical Spill": "chemical_spill",
                    "Medical Emergency": "medical_emergency",
                    "Security Threat": "workplace_violence",
                    "Workplace Violence": "workplace_violence",
                    "Cyber Attack": "cyber_attack",
                    "Transportation Accident": "transportation_accident"
                }
                
                mapped_hazard = hazard_mapping.get(hazard, hazard.lower().replace(" ", "_"))
                if mapped_hazard in self.organized_docs['hazards']:
                    relevant_docs.extend(self.organized_docs['hazards'][mapped_hazard])
        
        # Get procedure-specific documents
        if procedures and 'procedures' in self.organized_docs:
            for procedure in procedures:
                if procedure in self.organized_docs['procedures']:
                    relevant_docs.extend(self.organized_docs['procedures'][procedure])
        
        # Remove duplicates based on filename
        seen_filenames = set()
        unique_docs = []
        for doc in relevant_docs:
            if doc['filename'] not in seen_filenames:
                seen_filenames.add(doc['filename'])
                unique_docs.append(doc)
        
        # Format context
        context_parts = []
        for doc in unique_docs:
            context_parts.append(f"=== {doc['filename']} ===\n{doc['content'][:3000]}")
        
        return "\n\n".join(context_parts)
    
    def create_enhanced_emergency_plan_prompt(self, structured_inputs: Dict) -> str:
        """Create a comprehensive prompt for emergency plan generation using structured inputs."""
        
        # Get relevant context based on structured inputs
        org_profile = structured_inputs["organization_profile"]
        hazard_assessment = structured_inputs["hazard_assessment"]
        
        relevant_context = self.get_relevant_context(
            org_profile["basic_info"]["name"],  # Use organization name for context
            hazard_assessment["primary_hazards"],
            structured_inputs["procedural_requirements"].get("required_procedures", [])
        )
        
        # Create structured prompt using the input structuring system
        structured_prompt = self.input_structuring_system.create_structured_prompt(structured_inputs)
        
        prompt = f"""{SYSTEM_INSTRUCTIONS}

STRUCTURED ORGANIZATION INPUTS:
{structured_prompt}

RELEVANT EMERGENCY MANAGEMENT TEMPLATES AND BEST PRACTICES:
{relevant_context}

Please create a detailed, practical emergency plan that includes:

1. **EXECUTIVE SUMMARY** - Brief overview tailored to this organization
2. **ORGANIZATION PROFILE** - Description of the organization and its emergency management context
3. **HAZARD ANALYSIS** - Assessment of the identified primary hazards and risks
4. **EMERGENCY RESPONSE PROCEDURES** - Step-by-step procedures for each identified hazard
5. **ROLES AND RESPONSIBILITIES** - Clear assignment of emergency management roles
6. **COMMUNICATION PLAN** - Emergency communication procedures using available methods
7. **EVACUATION PROCEDURES** - Specific evacuation plans considering building and population
8. **EMERGENCY RESOURCES** - Utilization of available emergency equipment and resources
9. **TRAINING REQUIREMENTS** - Recommended training based on the hazards and organization type
10. **PLAN MAINTENANCE** - Procedures for keeping the plan current and effective

CRITICAL REQUIREMENTS:
- Include a clear statement that professional review and validation is required before implementation
- Emphasize that users assume full responsibility for the plan's effectiveness and compliance
- State that this plan is a starting point and may require significant customization
- Mention that local regulations and industry standards must be verified
- Include a note about regular review and updates being necessary

Make the plan specific to the organization's characteristics, hazards, and resources. Use professional emergency management terminology and follow established best practices from the relevant template documents. The plan should be immediately actionable and practical for implementation.

Format the plan with clear headings, bullet points, and actionable steps. Make it comprehensive but readable."""

        return prompt
    
    def generate_plan(self, inputs: Dict) -> str:
        """Generate the emergency plan using the enhanced language model with structured inputs."""
        print("\n🤖 Generating your customized emergency plan with enhanced input structuring...")
        print("This may take a few minutes for a comprehensive plan...")
        
        try:
            # Structure the inputs first
            print("🔧 Structuring user inputs...")
            structured_inputs = self.input_structuring_system.structure_user_inputs(inputs)
            
            # Create enhanced prompt
            print("📝 Creating enhanced prompt...")
            prompt = self.create_enhanced_emergency_plan_prompt(structured_inputs)
            
            # Generate plan
            print("🚀 Generating plan with structured inputs...")
            response = ollama.chat(
                model=self.model_name,
                messages=[
                    {
                        'role': 'user',
                        'content': prompt
                    }
                ],
                options={
                    'temperature': 0.1,  # Low temperature for consistent, professional output
                    'num_predict': 4000   # Allow longer responses
                }
            )
            
            return response['message']['content']
            
        except Exception as e:
            return f"Error generating plan: {str(e)}"
    
    def save_plan(self, plan_content: str, inputs: Dict) -> str:
        """Save the generated plan to a file."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        org_name = inputs['organization_name'].replace(' ', '_').replace('/', '_')
        filename = f"enhanced_v2_emergency_plan_{org_name}_{timestamp}.md"
        filepath = Path(__file__).parent / "generated_plans" / filename
        
        # Create directory if it doesn't exist
        filepath.parent.mkdir(exist_ok=True)
        
        # Create plan header with metadata and disclaimers
        header = f"""{DISCLAIMER_HEADER}

# Enhanced V2 Emergency Plan for {inputs['organization_name']}

**Generated:** {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}  
**Organization Type:** {inputs['organization_type']}  
**Location:** {inputs['location']}  
**Plan Scope:** {inputs['plan_scope']}  
**Enhanced Context:** Yes (Organized by type and hazards)
**Input Structuring:** Yes (Structured input mapping)

---

"""
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(header + plan_content + DISCLAIMER_FOOTER)
        
        return str(filepath)
    
    def gather_user_inputs(self) -> Dict:
        """Interactive questionnaire to gather user requirements."""
        print("\n🚨 ENHANCED V2 EMERGENCY PLAN GENERATOR 🚨")
        print("=" * 50)
        print("Please answer the following questions to create your customized emergency plan:")
        print("(This enhanced version uses structured input mapping for improved accuracy)\n")
        
        inputs = {}
        
        # Organization Information
        print("📋 ORGANIZATION INFORMATION")
        print("-" * 30)
        inputs['organization_name'] = input("Organization/Company Name: ").strip()
        inputs['organization_type'] = self.get_choice(
            "Organization Type",
            ["Educational Institution", "Healthcare Facility", "Corporate Office", 
             "Manufacturing Plant", "Retail Store", "Government Agency", "Non-Profit", "Other"]
        )
        inputs['location'] = input("Primary Location (City, Province/State): ").strip()
        inputs['building_size'] = self.get_choice(
            "Building Size",
            ["Small (< 50 people)", "Medium (50-200 people)", 
             "Large (200-500 people)", "Very Large (500+ people)"]
        )
        
        # Risk Assessment
        print("\n⚠️  RISK ASSESSMENT")
        print("-" * 30)
        inputs['primary_hazards'] = self.get_multiple_choice(
            "Primary Hazards/Threats (select all that apply)",
            ["Fire", "Earthquake", "Flood", "Severe Weather", "Power Outage",
             "Chemical Spill", "Medical Emergency", "Security Threat", 
             "Workplace Violence", "Cyber Attack", "Transportation Accident", "Other"]
        )
        
        inputs['special_considerations'] = self.get_multiple_choice(
            "Special Considerations (select all that apply)",
            ["Persons with Disabilities", "Multi-story Building", "Hazardous Materials On-site",
             "Public Access Areas", "Remote/Isolated Location", "24/7 Operations",
             "Critical Infrastructure", "None"]
        )
        
        # Resources and Contacts
        print("\n📞 EMERGENCY RESOURCES")
        print("-" * 30)
        inputs['has_security'] = input("Do you have on-site security? (yes/no): ").strip().lower() == 'yes'
        inputs['has_medical_staff'] = input("Do you have medical staff on-site? (yes/no): ").strip().lower() == 'yes'
        inputs['emergency_equipment'] = self.get_multiple_choice(
            "Available Emergency Equipment (select all that apply)",
            ["Fire Extinguishers", "First Aid Kits", "AED/Defibrillator", 
             "Emergency Lighting", "Backup Power", "Emergency Communication System",
             "Evacuation Chairs", "Spill Kits", "Emergency Supplies", "None"]
        )
        
        # Communication
        print("\n📢 COMMUNICATION PREFERENCES")
        print("-" * 30)
        inputs['communication_methods'] = self.get_multiple_choice(
            "Preferred Communication Methods (select all that apply)",
            ["PA System", "Email Alerts", "Text/SMS", "Mobile App", 
             "Social Media", "Website Updates", "Phone Tree", "Radio System"]
        )
        
        # Plan Scope
        print("\n📋 PLAN SCOPE")
        print("-" * 30)
        inputs['plan_scope'] = self.get_choice(
            "Plan Scope",
            ["Basic (Essential Procedures)", "Standard (Common Hazards)", 
             "Comprehensive (All Hazards)", "Advanced (Industry-Specific)"]
        )
        
        # Additional Requirements
        print("\n📝 ADDITIONAL REQUIREMENTS")
        print("-" * 30)
        additional = input("Any additional requirements or special considerations? (optional): ").strip()
        inputs['additional_requirements'] = additional if additional else "None"
        
        return inputs
    
    def get_choice(self, question: str, options: List[str]) -> str:
        """Get a single choice from user."""
        while True:
            print(f"\n{question}:")
            for i, option in enumerate(options, 1):
                print(f"  {i}. {option}")
            
            try:
                choice = int(input("Enter your choice (number): "))
                if 1 <= choice <= len(options):
                    return options[choice - 1]
                else:
                    print("Invalid choice. Please try again.")
            except ValueError:
                print("Please enter a valid number.")
    
    def get_multiple_choice(self, question: str, options: List[str]) -> List[str]:
        """Get multiple choices from user."""
        print(f"\n{question}:")
        for i, option in enumerate(options, 1):
            print(f"  {i}. {option}")
        
        while True:
            choices_input = input("Enter your choices (comma-separated numbers, e.g., 1,3,5): ").strip()
            if not choices_input:
                return []
            
            try:
                choice_nums = [int(x.strip()) for x in choices_input.split(',')]
                if all(1 <= num <= len(options) for num in choice_nums):
                    return [options[num - 1] for num in choice_nums]
                else:
                    print("Invalid choice(s). Please try again.")
            except ValueError:
                print("Please enter valid numbers separated by commas.")
    
    def run_generator(self) -> None:
        """Main method to run the enhanced emergency plan generator v2."""
        try:
            # Gather inputs
            inputs = self.gather_user_inputs()
            
            # Structure inputs for preview
            structured_inputs = self.input_structuring_system.structure_user_inputs(inputs)
            
            # Confirm inputs
            print("\n📋 ENHANCED V2 PLAN GENERATION SUMMARY")
            print("=" * 50)
            print(f"Organization: {inputs['organization_name']}")
            print(f"Type: {inputs['organization_type']}")
            print(f"Primary Hazards: {', '.join(inputs['primary_hazards'])}")
            print(f"Plan Scope: {inputs['plan_scope']}")
            print(f"Enhanced Context: Yes (Organized by type and hazards)")
            print(f"Input Structuring: Yes (Structured input mapping)")
            
            # Show validation results
            validation = structured_inputs["validation"]
            if validation["warnings"]:
                print(f"Warnings: {', '.join(validation['warnings'])}")
            if validation["recommendations"]:
                print(f"Recommendations: {', '.join(validation['recommendations'])}")
            
            confirm = input("\nProceed with enhanced v2 plan generation? (yes/no): ").strip().lower()
            if confirm != 'yes':
                print("Plan generation cancelled.")
                return
            
            # Generate plan
            plan_content = self.generate_plan(inputs)
            
            # Save plan
            filepath = self.save_plan(plan_content, inputs)
            
            print(f"\n✅ Enhanced V2 emergency plan generated successfully!")
            print(f"📄 Saved to: {filepath}")
            print(f"\nThis plan was generated using:")
            print(f"- Organized context for improved accuracy")
            print(f"- Structured input mapping for better relevance")
            print(f"- Enhanced taxonomy and glossary for precise terminology")
            print(f"You can now review and customize the plan as needed.")
            
            # Optionally display preview
            preview = input("\nWould you like to see a preview? (yes/no): ").strip().lower()
            if preview == 'yes':
                print("\n" + "="*70)
                print("ENHANCED V2 EMERGENCY PLAN PREVIEW")
                print("="*70)
                print(plan_content[:2000] + "..." if len(plan_content) > 2000 else plan_content)
                print("="*70)
            
        except KeyboardInterrupt:
            print("\n\nPlan generation cancelled.")
        except Exception as e:
            print(f"\nError: {e}")


def main():
    parser = argparse.ArgumentParser(description="Generate enhanced v2 customized emergency plans")
    parser.add_argument("--model", default="llama3.2:1b", help="Ollama model name to use")
    parser.add_argument("--organized-data-dir", help="Directory containing organized emergency management documents")
    
    args = parser.parse_args()
    
    # Check if Ollama is running
    try:
        ollama.list()
    except Exception as e:
        print(f"Error: Cannot connect to Ollama. Is it running?")
        print("Start it with: brew services start ollama")
        return
    
    # Initialize and run enhanced generator v2
    generator = EnhancedEmergencyPlanGeneratorV2(model_name=args.model, organized_data_dir=args.organized_data_dir)
    generator.run_generator()


if __name__ == "__main__":
    main()
