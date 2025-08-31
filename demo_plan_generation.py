#!/usr/bin/env python3
"""
demo_plan_generation.py - Quick demo of emergency plan generation

This script demonstrates the emergency plan generator with sample inputs
for testing purposes.
"""

from emergency_plan_generator import EmergencyPlanGenerator
import json

def demo_plan_generation():
    """Demonstrate plan generation with sample inputs."""
    
    print("🚨 EPOS EMERGENCY PLAN GENERATOR DEMO 🚨")
    print("=" * 50)
    
    # Sample organization inputs
    sample_inputs = {
        'organization_name': 'TechCorp Office Building',
        'organization_type': 'Corporate Office',
        'location': 'Toronto, Ontario',
        'building_size': 'Medium (50-200 people)',
        'primary_hazards': ['Fire', 'Power Outage', 'Medical Emergency', 'Severe Weather'],
        'special_considerations': ['Multi-story Building', 'Public Access Areas'],
        'has_security': True,
        'has_medical_staff': False,
        'emergency_equipment': ['Fire Extinguishers', 'First Aid Kits', 'Emergency Lighting', 'Emergency Communication System'],
        'communication_methods': ['PA System', 'Email Alerts', 'Text/SMS'],
        'plan_scope': 'Comprehensive (All Hazards)',
        'additional_requirements': 'Need to consider remote workers and visitors'
    }
    
    print("Sample Organization Profile:")
    print(f"- Name: {sample_inputs['organization_name']}")
    print(f"- Type: {sample_inputs['organization_type']}")
    print(f"- Location: {sample_inputs['location']}")
    print(f"- Primary Hazards: {', '.join(sample_inputs['primary_hazards'])}")
    print(f"- Building Size: {sample_inputs['building_size']}")
    
    proceed = input("\nGenerate emergency plan for this sample organization? (yes/no): ").strip().lower()
    
    if proceed != 'yes':
        print("Demo cancelled.")
        return
    
    # Initialize generator
    generator = EmergencyPlanGenerator()
    
    # Generate plan
    plan_content = generator.generate_plan(sample_inputs)
    
    # Save plan
    filepath = generator.save_plan(plan_content, sample_inputs)
    
    print(f"\n✅ Demo emergency plan generated!")
    print(f"📄 Saved to: {filepath}")
    
    # Show preview
    print("\n" + "="*70)
    print("GENERATED EMERGENCY PLAN PREVIEW")
    print("="*70)
    preview_length = min(2000, len(plan_content))
    print(plan_content[:preview_length])
    if len(plan_content) > preview_length:
        print("\n... [Preview truncated, see full plan in saved file] ...")
    print("="*70)

if __name__ == "__main__":
    demo_plan_generation()
