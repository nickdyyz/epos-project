#!/usr/bin/env python3
"""
document_organizer.py - Organize emergency management documents by type

This script categorizes the 14 emergency management documents into:
- Hazards (natural disasters, technological hazards, human-caused emergencies)
- Organization Types (educational, healthcare, corporate, government, etc.)
- Procedures (specific emergency response procedures and protocols)

This organization will improve the accuracy of plan outputs by providing
more targeted context based on the specific needs of each organization.
"""

import json
import re
from pathlib import Path
from typing import Dict, List, Set
from datetime import datetime

class DocumentOrganizer:
    def __init__(self, data_dir: str = None):
        """Initialize the Document Organizer."""
        self.data_dir = Path(data_dir) if data_dir else Path(__file__).parent / "training_materials/processed/all_text/raw_text"
        self.organized_docs = {
            'hazards': {},
            'organization_types': {},
            'procedures': {},
            'comprehensive_plans': {}
        }
        self.document_metadata = {}
        
    def categorize_documents(self) -> Dict:
        """Categorize all documents by type and content."""
        print("🔍 Analyzing and categorizing emergency management documents...")
        
        if not self.data_dir.exists():
            print(f"Error: Data directory not found: {self.data_dir}")
            return {}
            
        txt_files = list(self.data_dir.glob("*.txt"))
        txt_files = [f for f in txt_files if not f.name.startswith("anonymization_")]
        
        print(f"Found {len(txt_files)} documents to categorize...")
        
        for file_path in txt_files:
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Analyze and categorize the document
                categories = self.analyze_document(file_path.name, content)
                self.document_metadata[file_path.name] = categories
                
                # Store document in appropriate categories
                for category, subcategory in categories.items():
                    if category in self.organized_docs:
                        if isinstance(subcategory, list):
                            # Handle list of subcategories
                            for sub in subcategory:
                                if sub not in self.organized_docs[category]:
                                    self.organized_docs[category][sub] = []
                                self.organized_docs[category][sub].append({
                                    'filename': file_path.name,
                                    'content': content,
                                    'metadata': categories
                                })
                        else:
                            # Handle single subcategory
                            if subcategory not in self.organized_docs[category]:
                                self.organized_docs[category][subcategory] = []
                            self.organized_docs[category][subcategory].append({
                                'filename': file_path.name,
                                'content': content,
                                'metadata': categories
                            })
                
            except Exception as e:
                print(f"  ✗ Error processing {file_path.name}: {e}")
        
        return self.organized_docs
    
    def analyze_document(self, filename: str, content: str) -> Dict:
        """Analyze a document and determine its categories."""
        content_lower = content.lower()
        categories = {}
        
        # Determine if it's a comprehensive plan
        if self.is_comprehensive_plan(filename, content_lower):
            categories['comprehensive_plans'] = self.get_plan_type(filename, content_lower)
        
        # Identify hazards addressed
        hazards = self.identify_hazards(content_lower)
        if hazards:
            categories['hazards'] = hazards
        
        # Identify organization types
        org_types = self.identify_organization_types(filename, content_lower)
        if org_types:
            categories['organization_types'] = org_types
        
        # Identify procedures
        procedures = self.identify_procedures(filename, content_lower)
        if procedures:
            categories['procedures'] = procedures
        
        return categories
    
    def is_comprehensive_plan(self, filename: str, content_lower: str) -> bool:
        """Determine if document is a comprehensive emergency plan."""
        comprehensive_indicators = [
            'emergency plan', 'emergency response plan', 'emergency preparedness',
            'comprehensive emergency', 'emergency management plan',
            'disaster response plan', 'crisis management plan'
        ]
        
        filename_indicators = ['emergency plan', 'erp', 'emergency preparedness']
        
        # Check filename
        for indicator in filename_indicators:
            if indicator in filename.lower():
                return True
        
        # Check content
        for indicator in comprehensive_indicators:
            if indicator in content_lower:
                return True
        
        return False
    
    def get_plan_type(self, filename: str, content_lower: str) -> str:
        """Determine the type of comprehensive plan."""
        if 'university' in content_lower or 'ubc' in content_lower or 'college' in content_lower:
            return 'educational'
        elif 'healthcare' in content_lower or 'medical' in content_lower or 'hospital' in content_lower:
            return 'healthcare'
        elif 'government' in content_lower or 'city' in content_lower or 'municipal' in content_lower:
            return 'government'
        elif 'corporate' in content_lower or 'business' in content_lower or 'office' in content_lower:
            return 'corporate'
        elif 'manufacturing' in content_lower or 'industrial' in content_lower or 'plant' in content_lower:
            return 'industrial'
        else:
            return 'general'
    
    def identify_hazards(self, content_lower: str) -> List[str]:
        """Identify hazards addressed in the document."""
        hazards = []
        
        # Natural hazards
        if any(term in content_lower for term in ['earthquake', 'seismic', 'tremor']):
            hazards.append('earthquake')
        if any(term in content_lower for term in ['flood', 'flooding', 'water damage']):
            hazards.append('flood')
        if any(term in content_lower for term in ['fire', 'wildfire', 'wildland fire']):
            hazards.append('fire')
        if any(term in content_lower for term in ['storm', 'hurricane', 'tornado', 'severe weather']):
            hazards.append('severe_weather')
        if any(term in content_lower for term in ['power outage', 'electrical failure', 'blackout']):
            hazards.append('power_outage')
        
        # Technological hazards
        if any(term in content_lower for term in ['chemical spill', 'hazardous material', 'hazmat']):
            hazards.append('chemical_spill')
        if any(term in content_lower for term in ['cyber attack', 'digital threat', 'computer security']):
            hazards.append('cyber_attack')
        if any(term in content_lower for term in ['equipment failure', 'mechanical failure']):
            hazards.append('equipment_failure')
        
        # Human-caused hazards
        if any(term in content_lower for term in ['workplace violence', 'active shooter', 'security threat']):
            hazards.append('workplace_violence')
        if any(term in content_lower for term in ['medical emergency', 'health emergency', 'injury']):
            hazards.append('medical_emergency')
        if any(term in content_lower for term in ['transportation accident', 'vehicle accident']):
            hazards.append('transportation_accident')
        if any(term in content_lower for term in ['infectious disease', 'pandemic', 'outbreak']):
            hazards.append('infectious_disease')
        
        return hazards
    
    def identify_organization_types(self, filename: str, content_lower: str) -> List[str]:
        """Identify organization types addressed in the document."""
        org_types = []
        
        # Educational institutions
        if any(term in content_lower for term in ['university', 'college', 'school', 'campus', 'student', 'faculty']):
            org_types.append('educational')
        
        # Healthcare facilities
        if any(term in content_lower for term in ['hospital', 'healthcare', 'medical', 'patient', 'clinic']):
            org_types.append('healthcare')
        
        # Government agencies
        if any(term in content_lower for term in ['government', 'municipal', 'city', 'provincial', 'federal']):
            org_types.append('government')
        
        # Corporate offices
        if any(term in content_lower for term in ['corporate', 'business', 'office', 'company', 'workplace']):
            org_types.append('corporate')
        
        # Manufacturing/Industrial
        if any(term in content_lower for term in ['manufacturing', 'industrial', 'plant', 'factory', 'production']):
            org_types.append('industrial')
        
        # Retail/Commercial
        if any(term in content_lower for term in ['retail', 'store', 'commercial', 'shopping']):
            org_types.append('retail')
        
        # Non-profit
        if any(term in content_lower for term in ['non-profit', 'nonprofit', 'charity', 'volunteer']):
            org_types.append('non_profit')
        
        return org_types
    
    def identify_procedures(self, filename: str, content_lower: str) -> List[str]:
        """Identify specific procedures addressed in the document."""
        procedures = []
        
        # Evacuation procedures
        if any(term in content_lower for term in ['evacuation', 'evacuate', 'exit', 'egress']):
            procedures.append('evacuation')
        
        # Communication procedures
        if any(term in content_lower for term in ['communication', 'notification', 'alert', 'emergency contact']):
            procedures.append('communication')
        
        # Medical procedures
        if any(term in content_lower for term in ['first aid', 'medical response', 'emergency medical']):
            procedures.append('medical_response')
        
        # Security procedures
        if any(term in content_lower for term in ['security', 'lockdown', 'access control']):
            procedures.append('security')
        
        # Transportation procedures
        if any(term in content_lower for term in ['transportation', 'bussing', 'vehicle', 'transit']):
            procedures.append('transportation')
        
        # Working alone procedures
        if any(term in content_lower for term in ['working alone', 'lone worker', 'solo work']):
            procedures.append('working_alone')
        
        # Heat interruption procedures
        if any(term in content_lower for term in ['heat interruption', 'heating', 'temperature']):
            procedures.append('heat_interruption')
        
        # Hazardous materials procedures
        if any(term in content_lower for term in ['hazardous material', 'chemical spill', 'hazmat']):
            procedures.append('hazardous_materials')
        
        # Infectious disease procedures
        if any(term in content_lower for term in ['infectious disease', 'infection control', 'outbreak']):
            procedures.append('infectious_disease')
        
        return procedures
    
    def get_relevant_context(self, organization_type: str, hazards: List[str], procedures: List[str] = None) -> str:
        """Get relevant context documents based on organization type and hazards."""
        relevant_docs = []
        
        # Get comprehensive plans for the organization type
        if organization_type in self.organized_docs['comprehensive_plans']:
            relevant_docs.extend(self.organized_docs['comprehensive_plans'][organization_type])
        
        # Get hazard-specific documents
        for hazard in hazards:
            if hazard in self.organized_docs['hazards']:
                relevant_docs.extend(self.organized_docs['hazards'][hazard])
        
        # Get procedure-specific documents
        if procedures:
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
    
    def save_organization(self, output_dir: str = None) -> str:
        """Save the organized documents to JSON files."""
        if not output_dir:
            output_dir = Path(__file__).parent / "training_materials" / "organized"
        
        output_path = Path(output_dir)
        output_path.mkdir(parents=True, exist_ok=True)
        
        # Save organized documents
        organized_file = output_path / "organized_documents.json"
        with open(organized_file, 'w', encoding='utf-8') as f:
            json.dump(self.organized_docs, f, indent=2, default=str)
        
        # Save document metadata
        metadata_file = output_path / "document_metadata.json"
        with open(metadata_file, 'w', encoding='utf-8') as f:
            json.dump(self.document_metadata, f, indent=2, default=str)
        
        # Create summary report
        summary_file = output_path / "organization_summary.txt"
        with open(summary_file, 'w', encoding='utf-8') as f:
            f.write("EMERGENCY MANAGEMENT DOCUMENT ORGANIZATION SUMMARY\n")
            f.write("=" * 60 + "\n\n")
            f.write(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
            
            f.write("DOCUMENT CATEGORIES:\n")
            f.write("-" * 30 + "\n")
            
            for category, subcategories in self.organized_docs.items():
                f.write(f"\n{category.upper()}:\n")
                for subcategory, docs in subcategories.items():
                    f.write(f"  {subcategory}: {len(docs)} documents\n")
                    for doc in docs:
                        f.write(f"    - {doc['filename']}\n")
        
        print(f"✅ Organization saved to: {output_path}")
        return str(output_path)
    
    def print_summary(self):
        """Print a summary of the document organization."""
        print("\n📊 DOCUMENT ORGANIZATION SUMMARY")
        print("=" * 50)
        
        for category, subcategories in self.organized_docs.items():
            print(f"\n{category.upper()}:")
            for subcategory, docs in subcategories.items():
                print(f"  {subcategory}: {len(docs)} documents")
                for doc in docs:
                    print(f"    - {doc['filename']}")


def main():
    """Main function to organize documents."""
    organizer = DocumentOrganizer()
    
    # Categorize documents
    organized_docs = organizer.categorize_documents()
    
    # Print summary
    organizer.print_summary()
    
    # Save organization
    output_path = organizer.save_organization()
    
    print(f"\n✅ Document organization complete!")
    print(f"📁 Output saved to: {output_path}")


if __name__ == "__main__":
    main()
