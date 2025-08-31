#!/usr/bin/env python3
"""
emergency_plan_generator.py - Generate customized emergency plans based on user inputs

This script creates a framework for gathering user inputs and generating
contextual emergency plans using the processed emergency management documents.

Usage:
    python emergency_plan_generator.py
"""

import json
import ollama
from pathlib import Path
from typing import Dict, List, Optional
from datetime import datetime
import argparse

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
- Evacuation Routes: Age-appropriate evacuation procedures considering student mobility and supervision needs
- Medical Emergencies: Procedures for handling student medical incidents, including medication administration and first aid
- Transportation: School bus safety, field trip emergency procedures, and transportation coordination
- Technology Dependencies: Backup plans for power outages affecting online learning and communication systems
- Mental Health Support: Procedures for addressing psychological impacts on students and staff

Regulatory Compliance:
- FERPA considerations for student privacy during emergency communications
- State education department requirements for emergency planning
- Local school district policies and procedures
- Child protection and supervision requirements""",

    "Healthcare Facility": """HEALTHCARE FACILITY EMERGENCY PLANNING GUIDELINES

Focus Areas:
- Patient Care Continuity: Maintain critical patient care services during emergencies
- Medical Staff Coordination: Establish clear roles for physicians, nurses, and healthcare professionals
- Patient Safety: Protect vulnerable patients who cannot evacuate or care for themselves
- Medical Equipment: Ensure backup power and emergency procedures for life-support equipment
- Infection Control: Maintain infection prevention protocols during emergency situations
- Pharmaceutical Security: Protect controlled substances and maintain medication access

Special Considerations:
- Patient Evacuation: Procedures for moving patients who are bedridden, on life support, or in critical condition
- Medical Supply Management: Emergency access to medications, medical supplies, and equipment
- Staffing Continuity: Plans for extended emergency operations and staff relief
- Communication with Families: Protocols for patient family notification and updates
- Emergency Medical Services: Coordination with paramedics, ambulances, and receiving hospitals
- Laboratory Services: Protection of specimens and maintenance of critical testing capabilities

Regulatory Compliance:
- Joint Commission emergency management standards
- OSHA healthcare facility requirements
- HIPAA compliance during emergency communications
- State health department regulations
- CMS emergency preparedness requirements""",

    "Corporate Office": """CORPORATE OFFICE EMERGENCY PLANNING GUIDELINES

Focus Areas:
- Business Continuity: Maintain critical business operations and data access during emergencies
- Employee Safety: Protect staff while ensuring essential functions continue
- Data Security: Protect sensitive information and maintain IT system integrity
- Remote Work Capabilities: Enable work-from-home arrangements during facility disruptions
- Client Service Continuity: Maintain customer service and client communications
- Supply Chain Protection: Ensure critical business supplies and services remain available

Special Considerations:
- IT Infrastructure: Backup systems, data recovery, and cybersecurity incident response
- Communication Systems: Multiple channels for employee notification and coordination
- Flexible Work Arrangements: Procedures for remote work, alternative work sites, and flexible scheduling
- Financial Operations: Protection of financial data and continuity of essential financial services
- Client Relations: Maintaining client communications and service delivery during disruptions
- Vendor Management: Coordination with critical vendors and service providers

Regulatory Compliance:
- Industry-specific regulations (financial services, technology, etc.)
- Data protection and privacy laws
- Occupational safety requirements
- Business continuity standards
- Cybersecurity regulations""",

    "Manufacturing Plant": """MANUFACTURING PLANT EMERGENCY PLANNING GUIDELINES

Focus Areas:
- Industrial Safety: Protect workers from machinery, equipment, and process hazards
- Hazardous Materials: Manage chemical spills, gas leaks, and material containment
- Production Continuity: Maintain critical manufacturing processes and supply chain operations
- Equipment Protection: Safeguard expensive machinery and prevent production losses
- Environmental Protection: Prevent environmental contamination and comply with environmental regulations
- Worker Safety: Protect employees from industrial accidents and occupational hazards

Special Considerations:
- Process Safety Management: Emergency shutdown procedures for manufacturing processes
- Chemical Storage: Spill response, containment, and cleanup procedures
- Equipment Isolation: Procedures for safely shutting down and isolating equipment
- Waste Management: Emergency handling of manufacturing waste and byproducts
- Utility Dependencies: Backup power, compressed air, and other utility requirements
- Quality Control: Maintaining product quality and safety during emergency operations

Regulatory Compliance:
- OSHA process safety management standards
- EPA environmental protection requirements
- State environmental regulations
- Industry-specific safety standards
- Hazardous materials transportation regulations""",

    "Retail Store": """RETAIL STORE EMERGENCY PLANNING GUIDELINES

Focus Areas:
- Customer Safety: Protect customers and visitors during emergencies
- Asset Protection: Secure merchandise, cash, and valuable inventory
- Staff Coordination: Establish clear roles for managers, employees, and security personnel
- Customer Service: Maintain customer communications and service during disruptions
- Inventory Management: Protect and secure merchandise during emergency situations
- Cash Handling: Secure cash registers and financial assets during emergencies

Special Considerations:
- Crowd Management: Procedures for managing customer flow during evacuations or lockdowns
- Cash Security: Protection of cash registers, safes, and financial transactions
- Inventory Protection: Securing merchandise and preventing theft during emergencies
- Customer Communication: Keeping customers informed about store status and operations
- Point-of-Sale Systems: Backup procedures for payment processing and sales systems
- Delivery and Receiving: Managing incoming shipments and outgoing deliveries during disruptions

Regulatory Compliance:
- Occupational safety requirements for retail environments
- Consumer protection regulations
- Financial transaction security requirements
- Local business licensing and safety codes
- Employment law considerations for staff management""",

    "Government Agency": """GOVERNMENT AGENCY EMERGENCY PLANNING GUIDELINES

Focus Areas:
- Public Service Continuity: Maintain essential government services during emergencies
- Inter-Agency Coordination: Coordinate with other government departments and agencies
- Public Communication: Provide accurate information to the public and media
- Critical Infrastructure: Protect and maintain essential government systems and facilities
- Emergency Response Leadership: Provide leadership and coordination for community emergency response
- Regulatory Compliance: Ensure all emergency procedures comply with government regulations and policies

Special Considerations:
- Public Information: Official communications, press releases, and public announcements
- Inter-Agency Cooperation: Coordination with law enforcement, emergency services, and other agencies
- Continuity of Government: Maintaining essential government functions and leadership
- Public Records: Protection and accessibility of government records during emergencies
- Budget and Resource Management: Emergency funding and resource allocation procedures
- Legislative Requirements: Compliance with laws, regulations, and policy requirements

Regulatory Compliance:
- Government emergency management standards
- Public records and transparency requirements
- Civil service and employment regulations
- Budget and procurement regulations
- Inter-governmental coordination requirements""",

    "Non-Profit": """NON-PROFIT ORGANIZATION EMERGENCY PLANNING GUIDELINES

Focus Areas:
- Mission Continuity: Maintain essential services and programs during emergencies
- Client Safety: Protect vulnerable populations served by the organization
- Volunteer Management: Coordinate volunteers and maintain volunteer safety
- Resource Conservation: Protect limited resources and maintain financial stability
- Community Service: Continue serving community needs during emergency situations
- Donor Relations: Maintain donor communications and protect donor information

Special Considerations:
- Client Populations: Special needs of vulnerable populations (homeless, elderly, disabled, etc.)
- Volunteer Coordination: Managing volunteers during emergencies and maintaining volunteer safety
- Resource Limitations: Working with limited budgets and resources during emergency response
- Community Partnerships: Leveraging partnerships with other organizations and government agencies
- Service Delivery: Maintaining essential services to clients during disruptions
- Fundraising Continuity: Protecting donor relationships and maintaining fundraising capabilities

Regulatory Compliance:
- Non-profit governance and compliance requirements
- Grant and funding source requirements
- Volunteer protection and liability considerations
- Tax-exempt organization regulations
- Charitable solicitation laws""",

    "Other": """GENERAL ORGANIZATION EMERGENCY PLANNING GUIDELINES

Focus Areas:
- Risk Assessment: Comprehensive evaluation of organization-specific hazards and vulnerabilities
- Operational Continuity: Maintaining essential business functions during emergencies
- Stakeholder Protection: Protecting employees, customers, clients, and other stakeholders
- Asset Protection: Securing physical assets, data, and intellectual property
- Communication Management: Maintaining internal and external communications during emergencies
- Resource Optimization: Efficient use of available resources for emergency response and recovery

Special Considerations:
- Industry-Specific Hazards: Address hazards unique to the organization's industry or operations
- Stakeholder Needs: Consider the specific needs of all stakeholders (employees, customers, suppliers, etc.)
- Operational Dependencies: Identify critical dependencies and develop contingency plans
- Technology Integration: Leverage technology for emergency communication and response
- Community Impact: Consider the organization's role in the broader community during emergencies
- Regulatory Environment: Comply with all applicable regulations and industry standards

Regulatory Compliance:
- Industry-specific regulations and standards
- Occupational safety and health requirements
- Environmental protection regulations
- Data protection and privacy laws
- Local, state, and federal compliance requirements"""
}

# ============================================================================
# EMERGENCY PLAN GENERATOR CLASS
# ============================================================================

class EmergencyPlanGenerator:
    def __init__(self, model_name: str = "llama3.2:1b", data_dir: str = None):
        """Initialize the Emergency Plan Generator."""
        self.model_name = model_name
        self.data_dir = Path(data_dir) if data_dir else Path(__file__).parent / "training_materials/processed/all_text/anonymized"
        self.context_documents = []
        self.user_inputs = {}
        self.load_context()
    
    def load_context(self) -> None:
        """Load the anonymized emergency management documents as templates."""
        if not self.data_dir.exists():
            print(f"Warning: Data directory not found: {self.data_dir}")
            return
            
        txt_files = list(self.data_dir.glob("*.txt"))
        txt_files = [f for f in txt_files if not f.name.startswith("anonymization_")]
        
        print(f"Loading {len(txt_files)} emergency management templates...")
        
        for file_path in txt_files:
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                self.context_documents.append({
                    'filename': file_path.name,
                    'content': content[:4000]  # Use more context for plan generation
                })
                
            except Exception as e:
                print(f"  ✗ Error loading {file_path.name}: {e}")
        
        print(f"Successfully loaded {len(self.context_documents)} template documents")
    
    def gather_user_inputs(self) -> Dict:
        """Interactive questionnaire to gather user requirements."""
        print("\n🚨 EMERGENCY PLAN GENERATOR 🚨")
        print("=" * 50)
        print("Please answer the following questions to create your customized emergency plan:\n")
        
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
        
        # Plan Focus
        print("\n🎯 PLAN FOCUS")
        print("-" * 30)
        inputs['plan_scope'] = self.get_choice(
            "Plan Scope",
            ["Comprehensive (All Hazards)", "Specific Hazard Focus", 
             "Basic Preparedness", "Advanced Response Procedures"]
        )
        
        inputs['additional_requirements'] = input("\nAny additional specific requirements or concerns? (optional): ").strip()
        
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
    
    def create_emergency_plan_prompt(self, inputs: Dict) -> str:
        """Create a comprehensive prompt for emergency plan generation."""
        
        # Prepare context from templates
        context_text = "\n\n".join([
            f"=== TEMPLATE: {doc['filename']} ===\n{doc['content']}"
            for doc in self.context_documents
        ])
        
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

EMERGENCY MANAGEMENT TEMPLATES AND BEST PRACTICES:
{context_text}

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

Make the plan specific to the organization's characteristics, hazards, and resources. Use professional emergency management terminology and follow established best practices from the template documents. The plan should be immediately actionable and practical for implementation.

Format the plan with clear headings, bullet points, and actionable steps. Make it comprehensive but readable."""

        return prompt
    
    def generate_plan(self, inputs: Dict) -> str:
        """Generate the emergency plan using the language model."""
        print("\n🤖 Generating your customized emergency plan...")
        print("This may take a few minutes for a comprehensive plan...")
        
        try:
            prompt = self.create_emergency_plan_prompt(inputs)
            
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
        filename = f"emergency_plan_{org_name}_{timestamp}.md"
        filepath = Path(__file__).parent / "generated_plans" / filename
        
        # Create directory if it doesn't exist
        filepath.parent.mkdir(exist_ok=True)
        
        # Create plan header with metadata and disclaimers
        header = f"""{DISCLAIMER_HEADER}

# Emergency Plan for {inputs['organization_name']}

**Generated:** {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}  
**Organization Type:** {inputs['organization_type']}  
**Location:** {inputs['location']}  
**Plan Scope:** {inputs['plan_scope']}  

---

"""
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(header + plan_content + DISCLAIMER_FOOTER)
        
        return str(filepath)
    
    def run_generator(self) -> None:
        """Main method to run the emergency plan generator."""
        try:
            # Gather inputs
            inputs = self.gather_user_inputs()
            
            # Confirm inputs
            print("\n📋 PLAN GENERATION SUMMARY")
            print("=" * 50)
            print(f"Organization: {inputs['organization_name']}")
            print(f"Type: {inputs['organization_type']}")
            print(f"Primary Hazards: {', '.join(inputs['primary_hazards'])}")
            print(f"Plan Scope: {inputs['plan_scope']}")
            
            confirm = input("\nProceed with plan generation? (yes/no): ").strip().lower()
            if confirm != 'yes':
                print("Plan generation cancelled.")
                return
            
            # Generate plan
            plan_content = self.generate_plan(inputs)
            
            # Save plan
            filepath = self.save_plan(plan_content, inputs)
            
            print(f"\n✅ Emergency plan generated successfully!")
            print(f"📄 Saved to: {filepath}")
            print(f"\nYou can now review and customize the plan as needed.")
            
            # Optionally display preview
            preview = input("\nWould you like to see a preview? (yes/no): ").strip().lower()
            if preview == 'yes':
                print("\n" + "="*70)
                print("EMERGENCY PLAN PREVIEW")
                print("="*70)
                print(plan_content[:2000] + "..." if len(plan_content) > 2000 else plan_content)
                print("="*70)
            
        except KeyboardInterrupt:
            print("\n\nPlan generation cancelled.")
        except Exception as e:
            print(f"\nError: {e}")


def main():
    parser = argparse.ArgumentParser(description="Generate customized emergency plans")
    parser.add_argument("--model", default="llama3.2:1b", help="Ollama model name to use")
    parser.add_argument("--data-dir", help="Directory containing emergency management templates")
    
    args = parser.parse_args()
    
    # Check if Ollama is running
    try:
        ollama.list()
    except Exception as e:
        print(f"Error: Cannot connect to Ollama. Is it running?")
        print("Start it with: brew services start ollama")
        return
    
    # Initialize and run generator
    generator = EmergencyPlanGenerator(model_name=args.model, data_dir=args.data_dir)
    generator.run_generator()


if __name__ == "__main__":
    main()
