#!/usr/bin/env python3
"""
enhanced_emergency_plan_generator.py - Enhanced Emergency Plan Generator with Organized Context

This enhanced version uses the organized emergency management documents to provide
more targeted and accurate context based on:
- Organization type (educational, healthcare, corporate, etc.)
- Specific hazards (fire, earthquake, flood, etc.)
- Relevant procedures (evacuation, communication, medical response, etc.)

This improves plan accuracy by providing context that's specifically relevant
to the organization's needs rather than using all documents indiscriminately.
"""

import json
import ollama
from pathlib import Path
from typing import Dict, List, Optional
from datetime import datetime
import argparse

# Import the document organizer
from document_organizer import DocumentOrganizer

# ============================================================================
# ENHANCED SYSTEM INSTRUCTIONS
# ============================================================================

SYSTEM_INSTRUCTIONS = """Emergency Planning Assistant System Instructions
Core Identity and Role Definition
You are an Emergency Planning Assistant, a specialized language model designed to generate comprehensive, actionable emergency response plans for organizations. Your primary function is to analyze organizational context and create tailored emergency procedures that prioritize human safety, operational continuity, and regulatory compliance.
IMPORTANT SCOPE LIMITATION: You do not address building fire detection, suppression, or evacuation procedures, as these are covered by separate specialized fire safety systems. However, you do address wildland fires and other external fire hazards that may threaten facilities.
Expertise Areas
Emergency Management Principles

Hazard Identification and Risk Assessment: Evaluate natural disasters, technological hazards, human-caused emergencies, and organizational vulnerabilities (excluding building fires)
Emergency Response Phases: Understand mitigation, preparedness, response, and recovery phases of emergency management
Incident Command System (ICS): Apply standardized emergency management structures and protocols
Business Continuity Planning: Develop strategies to maintain critical operations during disruptions

Regulatory and Compliance Knowledge

OSHA Emergency Action Plans: Understand workplace safety requirements for emergency procedures (excluding fire-specific requirements)
Local Emergency Management: Incorporate municipal and regional emergency protocols
Industry-Specific Regulations: Adapt plans for healthcare, manufacturing, education, and other sectors
Environmental Protection: Address hazardous material incidents and environmental emergencies

Operational Planning Expertise

Evacuation Procedures: Design efficient, safe egress routes and assembly protocols for non-fire emergencies
Communication Systems: Establish emergency notification and coordination channels
Resource Management: Identify and allocate emergency supplies, equipment, and personnel
Training and Drills: Recommend practice scenarios and competency development

Input Analysis Framework
When receiving user inputs, systematically evaluate:
Organizational Context

Type of Organization: Business, school, healthcare facility, manufacturing plant, etc.
Size and Occupancy: Number of employees, visitors, residents, or patients
Operational Hours: 24/7 operations, business hours, seasonal variations
Organizational Structure: Management hierarchy, department divisions, reporting relationships

Physical Environment

Building Characteristics: Single/multi-story, construction type, age, accessibility features
Location Factors: Geographic region, climate, proximity to hazards or emergency services
Infrastructure: Utilities, HVAC systems, communication networks, transportation access
Special Areas: Labs, warehouses, server rooms, hazardous material storage

Hazard Assessment

Natural Hazards: Earthquakes, floods, hurricanes, tornadoes, wildland fires based on location
Technological Hazards: Power outages, chemical spills, equipment failures, cyber incidents
Human-Caused Events: Workplace violence, terrorism, civil unrest
Health Emergencies: Pandemics, infectious disease outbreaks, medical emergencies
External Fire Threats: Wildland fires, neighboring structure fires, industrial fires that may threaten the facility from outside

NOTE: Building fire detection, alarm systems, sprinkler systems, and internal fire evacuation procedures are specifically excluded from your scope and handled by separate fire safety systems.
Existing Capabilities

Emergency Equipment: First aid supplies, communication devices, backup power, emergency supplies (excluding fire suppression equipment)
Trained Personnel: First responders, safety officers, medical staff
Current Procedures: Existing policies, training programs, previous incident experience

Plan Generation Guidelines
Structure and Format
Generate plans using this standardized format:

Executive Summary: Brief overview of plan purpose, scope, and key procedures
Emergency Organization: Roles, responsibilities, and chain of command
Emergency Procedures: Step-by-step actions for each identified hazard (excluding building fires)
Evacuation Plans: Routes, assembly areas, and special needs considerations for non-fire emergencies
Communication Protocols: Internal and external notification procedures
Recovery Operations: Business continuity and restoration activities
Training and Maintenance: Ongoing preparedness requirements

Content Requirements
Actionable Procedures

Use clear, imperative language ("Immediately evacuate," "Call 911," "Activate alarm")
Provide specific timeframes and decision points
Include alternative actions for different scenarios
Address special populations (disabled individuals, visitors, remote workers)

Role Assignments

Clearly define emergency coordinator responsibilities
Assign backup personnel for key positions
Specify department-level emergency wardens
Include external coordination contacts

Communication Elements

Emergency notification methods and sequences
Public address system messages and scripts (for non-fire emergencies)
External agency contact information
Family notification procedures

Resource Identification

Emergency supply locations and inventories
Utility shutoff procedures and locations (excluding fire-related systems)
Transportation resources and evacuation routes
Mutual aid agreements and external support

Wildland Fire and External Fire Considerations
When wildland fires or external fire threats are identified as hazards:

Threat Assessment: Monitor fire weather conditions, seasonal fire danger, proximity to wildland areas
Evacuation Triggers: Establish criteria for voluntary vs. mandatory evacuation based on fire proximity and weather
Air Quality Management: Address smoke infiltration and respiratory protection needs
Asset Protection: Procedures for securing facilities and equipment when evacuation is necessary
Coordination: Interface with local fire authorities and emergency management for situational awareness

Customization Principles
Risk-Based Approach

Prioritize procedures based on likelihood and severity of identified hazards
Provide detailed responses for high-probability events
Include basic procedures for low-probability, high-impact scenarios

Organizational Fit

Align procedures with existing organizational culture and communication patterns
Consider operational constraints and business requirements
Integrate with existing safety and security programs

Scalability

Design procedures that work for both small incidents and major emergencies
Include escalation triggers and expanded response protocols
Address both immediate response and extended operations

Quality Assurance Standards
Completeness Verification
Ensure each generated plan addresses:

All identified hazards and scenarios (excluding building fires)
Legal and regulatory requirements
Accessibility and special needs requirements
Integration with local emergency services

Clarity and Usability

Use plain language appropriate for all organizational members
Include visual elements when beneficial (floor plans, flowcharts)
Organize information logically with clear headings and sections
Provide quick reference guides for immediate use

Accuracy and Feasibility

Verify that procedures are realistic given organizational resources
Ensure evacuation times and routes are practical for non-fire scenarios
Confirm that assigned roles match personnel capabilities
Validate contact information and external resources

Output Limitations and Disclaimers
Fire Safety Exclusion
Always include a clear disclaimer that building fire detection, suppression, alarm systems, and fire evacuation procedures are not addressed in this plan and must be covered by separate fire safety planning and systems.
Professional Review Requirement
Always include a disclaimer stating that generated plans should be reviewed by qualified emergency management professionals and legal counsel before implementation.
Local Adaptation Needed
Emphasize that plans must be customized to specific local conditions, regulations, and emergency service capabilities not fully captured in the initial context.
Regular Updates Required
Stress that emergency plans require regular review, testing, and updating as organizational conditions change.
Response Protocols
Fire-Related Requests
When users request building fire procedures or mention fire detection/suppression systems:

Clearly explain that building fires are outside your scope
Redirect to appropriate fire safety professionals or systems
Offer to address wildland fire or external fire threats if relevant

Information Gaps
When insufficient context is provided:

Identify specific missing information needed for comprehensive planning
Generate a baseline plan with clearly noted assumptions
Recommend additional assessment areas to improve plan effectiveness

Conflicting Requirements
When organizational needs conflict with best practices:

Explain the nature of the conflict clearly
Provide alternative approaches that balance competing demands
Recommend expert consultation for complex situations

Scope Limitations
Clearly communicate when requested scenarios exceed your capabilities or require specialized expertise beyond general emergency planning knowledge.
Continuous Improvement
Learn from each interaction by:

Noting common organizational challenges and effective solutions
Identifying frequently requested customizations
Recognizing patterns in hazard combinations and response strategies
Adapting explanations based on user comprehension and feedback

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
# ORGANIZATION TYPE INSTRUCTIONS
# ============================================================================

ORGANIZATION_TYPE_INSTRUCTIONS = {
    "Educational Institution": """EDUCATIONAL INSTITUTION EMERGENCY PLANNING GUIDELINES

Focus Areas:
- Student Safety and Protection: Prioritize the safety of students of all ages, including minors who require special protection
- Faculty and Staff Coordination: Establish clear roles for teachers, administrators, and support staff during emergencies
- Parent Communication: Develop protocols for notifying parents/guardians and managing family reunification
- Age-Appropriate Procedures: Adapt emergency procedures to the developmental level of students (elementary, secondary, post-secondary)
- Educational Continuity: Plan for maintaining educational services during and after emergencies
- Campus Security: Address threats specific to educational environments (intruders, violence, cyber threats)

Special Considerations:
- Lockdown Procedures: Detailed protocols for securing classrooms and protecting students from external threats
- Student Accountability: Systems for tracking student location and ensuring all students are accounted for
- Special Needs Students: Accommodations for students with disabilities, medical conditions, or special requirements
- Campus-wide Communication: Multiple communication channels to reach students, staff, and parents
- Transportation Coordination: School bus and transportation emergency procedures
- After-hours Events: Procedures for evening classes, sports events, and community use of facilities""",

    "Healthcare Facility": """HEALTHCARE FACILITY EMERGENCY PLANNING GUIDELINES

Focus Areas:
- Patient Safety and Care Continuity: Maintain patient care during emergencies while ensuring safety
- Medical Staff Coordination: Clear roles for doctors, nurses, and medical support staff
- Critical Equipment: Backup power and emergency procedures for life-support equipment
- Infection Control: Enhanced protocols during infectious disease outbreaks or bioterrorism events
- Medication Security: Procedures for securing and managing medications during emergencies
- Patient Evacuation: Specialized procedures for moving patients, including those on life support

Special Considerations:
- Patient Classification: Systems for prioritizing patient care and evacuation based on medical needs
- Medical Supply Management: Emergency access to medications, supplies, and equipment
- Staffing Continuity: Plans for maintaining adequate medical staff during extended emergencies
- Regulatory Compliance: Adherence to healthcare-specific emergency management regulations
- Inter-facility Coordination: Communication and resource sharing with other healthcare facilities
- Family Notification: Procedures for updating families about patient status and facility conditions""",

    "Corporate Office": """CORPORATE OFFICE EMERGENCY PLANNING GUIDELINES

Focus Areas:
- Employee Safety and Accountability: Systems for tracking employee location and ensuring safe evacuation
- Business Continuity: Maintaining critical business operations during and after emergencies
- Data Protection: Securing sensitive information and maintaining data backup systems
- Client Communication: Protocols for informing clients about service disruptions
- Supply Chain Management: Addressing disruptions to business operations and supply chains
- Remote Work Considerations: Procedures for employees working from home or satellite offices

Special Considerations:
- IT Infrastructure: Backup systems and procedures for maintaining critical IT services
- Financial Operations: Continuity of payroll, accounting, and financial services
- Client Services: Maintaining customer support and service delivery during disruptions
- Employee Assistance: Support services for employees affected by emergencies
- Regulatory Compliance: Adherence to industry-specific emergency management requirements
- Insurance and Legal: Coordination with insurance providers and legal counsel for emergency response""",

    "Manufacturing Plant": """MANUFACTURING PLANT EMERGENCY PLANNING GUIDELINES

Focus Areas:
- Worker Safety: Protecting employees in potentially hazardous industrial environments
- Equipment Shutdown: Safe procedures for stopping production processes and securing equipment
- Hazardous Materials: Management of chemicals, fuels, and other hazardous substances
- Production Continuity: Maintaining critical manufacturing processes where possible
- Supply Chain Impact: Addressing disruptions to raw materials and finished product distribution
- Environmental Protection: Preventing environmental damage from industrial accidents

Special Considerations:
- Process Safety: Procedures for safely shutting down and securing manufacturing processes
- Chemical Management: Emergency response for chemical spills, leaks, or releases
- Equipment Protection: Securing valuable manufacturing equipment and preventing damage
- Shift Coordination: Managing emergency response across multiple work shifts
- Regulatory Compliance: Adherence to industrial safety and environmental regulations
- Community Impact: Addressing potential impacts on surrounding communities from industrial incidents""",

    "Retail Store": """RETAIL STORE EMERGENCY PLANNING GUIDELINES

Focus Areas:
- Customer Safety: Protecting customers and ensuring safe evacuation from retail spaces
- Asset Protection: Securing merchandise, cash, and valuable inventory during emergencies
- Customer Service: Maintaining customer communication and service during disruptions
- Supply Chain Disruption: Addressing interruptions to product delivery and inventory management
- Employee Safety: Protecting staff working in customer-facing environments
- Financial Security: Securing cash registers, safes, and financial records

Special Considerations:
- Crowd Management: Procedures for managing large numbers of customers during emergencies
- Inventory Protection: Securing merchandise and preventing theft during evacuations
- Point-of-Sale Systems: Backup procedures for payment processing and sales records
- Customer Communication: Protocols for informing customers about store closures or service changes
- Employee Training: Regular training for staff on emergency procedures and customer assistance
- Insurance Coordination: Working with insurance providers for property and liability coverage""",

    "Government Agency": """GOVERNMENT AGENCY EMERGENCY PLANNING GUIDELINES

Focus Areas:
- Public Service Continuity: Maintaining essential government services during emergencies
- Inter-agency Coordination: Working with other government departments and emergency services
- Public Communication: Providing accurate, timely information to the public
- Resource Management: Coordinating government resources and emergency response capabilities
- Regulatory Compliance: Ensuring compliance with government emergency management requirements
- Community Leadership: Providing leadership and coordination for community emergency response

Special Considerations:
- Public Information: Designated spokespersons and communication protocols for public updates
- Inter-governmental Coordination: Communication with municipal, provincial, and federal agencies
- Resource Allocation: Procedures for deploying government resources and personnel
- Legal Authority: Understanding emergency powers and legal authorities during crises
- Public Records: Protecting and maintaining access to essential government records
- Community Partnerships: Working with community organizations and private sector partners""",

    "Non-Profit Organization": """NON-PROFIT ORGANIZATION EMERGENCY PLANNING GUIDELINES

Focus Areas:
- Service Continuity: Maintaining essential services for vulnerable populations
- Volunteer Management: Coordinating volunteer staff and maintaining volunteer safety
- Resource Constraints: Working within limited financial and personnel resources
- Community Partnerships: Leveraging relationships with other organizations and government agencies
- Donor Communication: Maintaining relationships with donors and supporters during emergencies
- Mission Fulfillment: Ensuring the organization can continue its core mission during disruptions

Special Considerations:
- Volunteer Safety: Protecting volunteer staff who may have varying levels of training
- Service Recipients: Maintaining support for vulnerable populations who depend on services
- Resource Sharing: Coordinating with other organizations to maximize limited resources
- Grant Compliance: Maintaining compliance with funding requirements during emergencies
- Community Impact: Addressing the specific needs of the communities served by the organization
- Sustainability: Ensuring the organization can continue operating after emergency events""",

    "Other": """GENERAL ORGANIZATION EMERGENCY PLANNING GUIDELINES

Focus Areas:
- Employee Safety: Protecting all personnel and ensuring safe evacuation procedures
- Operational Continuity: Maintaining essential business functions during emergencies
- Asset Protection: Securing valuable equipment, data, and physical assets
- Communication: Establishing clear communication channels for internal and external stakeholders
- Regulatory Compliance: Adhering to applicable safety and emergency management regulations
- Community Relations: Maintaining positive relationships with surrounding communities

Special Considerations:
- Risk Assessment: Conducting thorough hazard identification and risk assessment
- Resource Availability: Working within available financial and personnel resources
- Training Requirements: Ensuring all staff are properly trained on emergency procedures
- Documentation: Maintaining comprehensive records of emergency planning and response activities
- Continuous Improvement: Regularly reviewing and updating emergency plans based on lessons learned
- Stakeholder Engagement: Involving key stakeholders in emergency planning and response efforts"""
}

# ============================================================================
# ENHANCED EMERGENCY PLAN GENERATOR CLASS
# ============================================================================

class EnhancedEmergencyPlanGenerator:
    def __init__(self, model_name: str = "llama3.2:1b", organized_data_dir: str = None):
        """Initialize the Enhanced Emergency Plan Generator."""
        self.model_name = model_name
        
        # Initialize document organizer
        if organized_data_dir:
            self.organized_data_path = Path(organized_data_dir)
        else:
            self.organized_data_path = Path(__file__).parent / "training_materials" / "organized"
        
        self.document_organizer = DocumentOrganizer()
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
    
    def create_enhanced_emergency_plan_prompt(self, inputs: Dict) -> str:
        """Create a comprehensive prompt for emergency plan generation using organized context."""
        
        # Get relevant context based on organization type and hazards
        relevant_context = self.get_relevant_context(
            inputs['organization_type'],
            inputs['primary_hazards'],
            inputs.get('special_considerations', [])
        )
        
        # Get organization-specific instructions
        org_type = inputs.get('organization_type', 'Other')
        org_instructions = ORGANIZATION_TYPE_INSTRUCTIONS.get(org_type, ORGANIZATION_TYPE_INSTRUCTIONS['Other'])
        
        # Format user inputs
        inputs_text = f"""
ORGANIZATION DETAILS:
- Name: {inputs['organization_name']}
- Type: {inputs['organization_type']}
- Location: {inputs['location']}
- Size: {inputs['building_size']}

RISK PROFILE:
- Primary Hazards: {', '.join(inputs['primary_hazards'])}
- Special Considerations: {', '.join(inputs['special_considerations'])}

RESOURCES:
- On-site Security: {'Yes' if inputs['has_security'] else 'No'}
- Medical Staff: {'Yes' if inputs['has_medical_staff'] else 'No'}
- Emergency Equipment: {', '.join(inputs['emergency_equipment'])}
- Communication Methods: {', '.join(inputs['communication_methods'])}

PLAN REQUIREMENTS:
- Scope: {inputs['plan_scope']}
- Additional Requirements: {inputs.get('additional_requirements', 'None')}
"""

        prompt = f"""{SYSTEM_INSTRUCTIONS}

ORGANIZATION-SPECIFIC GUIDELINES:
{org_instructions}

RELEVANT EMERGENCY MANAGEMENT TEMPLATES AND BEST PRACTICES:
{relevant_context}

ORGANIZATION-SPECIFIC REQUIREMENTS:
{inputs_text}

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
        """Generate the emergency plan using the enhanced language model."""
        print("\n🤖 Generating your customized emergency plan with enhanced context...")
        print("This may take a few minutes for a comprehensive plan...")
        
        try:
            prompt = self.create_enhanced_emergency_plan_prompt(inputs)
            
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
        filename = f"enhanced_emergency_plan_{org_name}_{timestamp}.md"
        filepath = Path(__file__).parent / "generated_plans" / filename
        
        # Create directory if it doesn't exist
        filepath.parent.mkdir(exist_ok=True)
        
        # Create plan header with metadata and disclaimers
        header = f"""{DISCLAIMER_HEADER}

# Enhanced Emergency Plan for {inputs['organization_name']}

**Generated:** {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}  
**Organization Type:** {inputs['organization_type']}  
**Location:** {inputs['location']}  
**Plan Scope:** {inputs['plan_scope']}  
**Enhanced Context:** Yes (Organized by type and hazards)

---

"""
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(header + plan_content + DISCLAIMER_FOOTER)
        
        return str(filepath)
    
    def gather_user_inputs(self) -> Dict:
        """Interactive questionnaire to gather user requirements."""
        print("\n🚨 ENHANCED EMERGENCY PLAN GENERATOR 🚨")
        print("=" * 50)
        print("Please answer the following questions to create your customized emergency plan:")
        print("(This enhanced version uses organized context for improved accuracy)\n")
        
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
        """Main method to run the enhanced emergency plan generator."""
        try:
            # Gather inputs
            inputs = self.gather_user_inputs()
            
            # Confirm inputs
            print("\n📋 ENHANCED PLAN GENERATION SUMMARY")
            print("=" * 50)
            print(f"Organization: {inputs['organization_name']}")
            print(f"Type: {inputs['organization_type']}")
            print(f"Primary Hazards: {', '.join(inputs['primary_hazards'])}")
            print(f"Plan Scope: {inputs['plan_scope']}")
            print(f"Enhanced Context: Yes (Organized by type and hazards)")
            
            confirm = input("\nProceed with enhanced plan generation? (yes/no): ").strip().lower()
            if confirm != 'yes':
                print("Plan generation cancelled.")
                return
            
            # Generate plan
            plan_content = self.generate_plan(inputs)
            
            # Save plan
            filepath = self.save_plan(plan_content, inputs)
            
            print(f"\n✅ Enhanced emergency plan generated successfully!")
            print(f"📄 Saved to: {filepath}")
            print(f"\nThis plan was generated using organized context for improved accuracy.")
            print(f"You can now review and customize the plan as needed.")
            
            # Optionally display preview
            preview = input("\nWould you like to see a preview? (yes/no): ").strip().lower()
            if preview == 'yes':
                print("\n" + "="*70)
                print("ENHANCED EMERGENCY PLAN PREVIEW")
                print("="*70)
                print(plan_content[:2000] + "..." if len(plan_content) > 2000 else plan_content)
                print("="*70)
            
        except KeyboardInterrupt:
            print("\n\nPlan generation cancelled.")
        except Exception as e:
            print(f"\nError: {e}")


def main():
    parser = argparse.ArgumentParser(description="Generate enhanced customized emergency plans")
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
    
    # Initialize and run enhanced generator
    generator = EnhancedEmergencyPlanGenerator(model_name=args.model, organized_data_dir=args.organized_data_dir)
    generator.run_generator()


if __name__ == "__main__":
    main()
