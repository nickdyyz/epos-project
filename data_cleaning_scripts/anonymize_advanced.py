#!/usr/bin/env python3
"""
anonymize_advanced.py - Advanced anonymization with custom terms and reporting.

This script provides advanced anonymization features including:
- Custom terms list for specific organizations/names
- Detailed reporting of anonymized content
- Configuration file support
- Case-insensitive matching

Usage:
    python anonymize_advanced.py --input <input_dir> --output <output_dir> [--config <config_file>]

Requirements:
    - Python 3.6+
"""

import re
import os
import json
import argparse
import logging
from pathlib import Path
from typing import Dict, List, Tuple, Set
from collections import defaultdict

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


class TextAnonymizer:
    def __init__(self, config_file: str = None):
        """Initialize the anonymizer with default or custom configuration."""
        self.stats = defaultdict(int)
        self.custom_terms = set()
        
        # Default patterns
        self.patterns = {
            "EMAIL": r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
            "PHONE_US": r'\b(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})\b',
            "PHONE_INTL": r'\+[1-9]\d{1,14}\b',
            "URL": r'https?://(?:[-\w.])+(?:[:\d]+)?(?:/(?:[\w/_.])*(?:\?(?:[\w&=%.])*)?(?:\#(?:[\w.])*)?)?',
            "SSN": r'\b\d{3}-?\d{2}-?\d{4}\b',
            "CREDIT_CARD": r'\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b',
            "IP_ADDRESS": r'\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b',
            "FINANCIAL": r'\$\s*\d{1,3}(?:,\d{3})*(?:\.\d{2})?|\b\d{1,3}(?:,\d{3})*(?:\.\d{2})?\s*(?:USD|dollars?|EUR|euros?)\b',
            "DATE": r'\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4}\b',
            "PERSON_NAME": r'\b[A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?\b',
            "COMPANY_SUFFIX": r'\b\w+(?:\s+\w+)*\s+(?:Inc\.?|Corp\.?|Corporation|Ltd\.?|Limited|LLC|Co\.?|Company|Partners?|Group|Holdings?)\b',
            "ADDRESS": r'\b\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Court|Ct|Place|Pl)\b',
            "POSTAL_CODE": r'\b\d{5}(?:-\d{4})?\b',
            "REFERENCE_CODE": r'\b[A-Z]{2,5}-\d{2,8}\b|\b[A-Z]{3,}\d{3,}\b'
        }
        
        # Placeholders
        self.placeholders = {
            "EMAIL": "[EMAIL]",
            "PHONE_US": "[PHONE]",
            "PHONE_INTL": "[PHONE_INTL]",
            "URL": "[URL]",
            "SSN": "[SSN]",
            "CREDIT_CARD": "[CREDIT_CARD]",
            "IP_ADDRESS": "[IP_ADDRESS]",
            "FINANCIAL": "[FINANCIAL_INFO]",
            "DATE": "[DATE]",
            "PERSON_NAME": "[PERSON_NAME]",
            "COMPANY_SUFFIX": "[COMPANY_NAME]",
            "ADDRESS": "[ADDRESS]",
            "POSTAL_CODE": "[POSTAL_CODE]",
            "REFERENCE_CODE": "[REFERENCE_CODE]"
        }
        
        if config_file and os.path.exists(config_file):
            self.load_config(config_file)
    
    def load_config(self, config_file: str) -> None:
        """Load configuration from JSON file."""
        try:
            with open(config_file, 'r', encoding='utf-8') as f:
                config = json.load(f)
            
            # Load custom terms
            if 'custom_terms' in config:
                self.custom_terms.update(config['custom_terms'])
            
            # Update patterns if provided
            if 'patterns' in config:
                self.patterns.update(config['patterns'])
            
            # Update placeholders if provided
            if 'placeholders' in config:
                self.placeholders.update(config['placeholders'])
                
            logger.info(f"Loaded configuration from {config_file}")
            logger.info(f"Custom terms loaded: {len(self.custom_terms)}")
            
        except Exception as e:
            logger.error(f"Error loading config file: {e}")
    
    def anonymize_custom_terms(self, text: str) -> str:
        """Replace custom terms (case-insensitive)."""
        for term in self.custom_terms:
            # Use word boundaries and case-insensitive matching
            pattern = r'\b' + re.escape(term) + r'\b'
            matches = len(re.findall(pattern, text, re.IGNORECASE))
            if matches > 0:
                text = re.sub(pattern, '[CUSTOM_TERM]', text, flags=re.IGNORECASE)
                self.stats['CUSTOM_TERMS'] += matches
        return text
    
    def anonymize_patterns(self, text: str) -> str:
        """Replace sensitive patterns with placeholders."""
        for pattern_name, pattern in self.patterns.items():
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                text = re.sub(pattern, self.placeholders[pattern_name], text, flags=re.IGNORECASE)
                self.stats[pattern_name] += len(matches)
        return text
    
    def anonymize_text(self, text: str) -> str:
        """Main anonymization function."""
        # First, handle custom terms
        text = self.anonymize_custom_terms(text)
        
        # Then handle pattern-based replacements
        text = self.anonymize_patterns(text)
        
        return text
    
    def process_files(self, input_dir: str, output_dir: str) -> None:
        """Process all text files in the input directory."""
        input_path = Path(input_dir)
        output_path = Path(output_dir)
        output_path.mkdir(parents=True, exist_ok=True)
        
        txt_files = list(input_path.glob("*.txt"))
        if not txt_files:
            logger.warning(f"No .txt files found in {input_dir}")
            return
        
        logger.info(f"Processing {len(txt_files)} files...")
        
        for file_path in txt_files:
            try:
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                
                anonymized_content = self.anonymize_text(content)
                
                output_file = output_path / file_path.name
                with open(output_file, 'w', encoding='utf-8') as f:
                    f.write(anonymized_content)
                
                logger.info(f"Processed: {file_path.name}")
                
            except Exception as e:
                logger.error(f"Error processing {file_path}: {e}")
    
    def generate_report(self, output_dir: str) -> None:
        """Generate anonymization report."""
        report_path = Path(output_dir) / "anonymization_report.json"
        
        report = {
            "timestamp": str(Path().resolve()),
            "statistics": dict(self.stats),
            "total_replacements": sum(self.stats.values()),
            "patterns_used": list(self.patterns.keys()),
            "custom_terms_count": len(self.custom_terms)
        }
        
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2)
        
        # Also create a human-readable summary
        summary_path = Path(output_dir) / "anonymization_summary.txt"
        with open(summary_path, 'w', encoding='utf-8') as f:
            f.write("ANONYMIZATION SUMMARY\n")
            f.write("=" * 50 + "\n\n")
            f.write(f"Total replacements made: {sum(self.stats.values())}\n\n")
            
            if self.stats:
                f.write("Breakdown by category:\n")
                for category, count in sorted(self.stats.items()):
                    f.write(f"  {category}: {count}\n")
            else:
                f.write("No sensitive information detected.\n")
        
        logger.info(f"Report saved to: {report_path}")
        logger.info(f"Summary saved to: {summary_path}")


def create_sample_config() -> None:
    """Create a sample configuration file."""
    sample_config = {
        "custom_terms": [
            "Acme Corporation",
            "John Smith",
            "Jane Doe",
            "Confidential Inc"
        ],
        "patterns": {
            "CUSTOM_ID": r"\bID-\d{6}\b"
        },
        "placeholders": {
            "CUSTOM_ID": "[INTERNAL_ID]"
        }
    }
    
    with open("anonymize_config.json", 'w', encoding='utf-8') as f:
        json.dump(sample_config, f, indent=2)
    
    print("Sample configuration file created: anonymize_config.json")
    print("Edit this file to add your specific terms and patterns.")


def main():
    parser = argparse.ArgumentParser(description="Advanced text anonymization with reporting")
    parser.add_argument("--input", "-i", required=True, help="Input directory containing text files")
    parser.add_argument("--output", "-o", required=True, help="Output directory for anonymized files")
    parser.add_argument("--config", "-c", help="Configuration file with custom terms and patterns")
    parser.add_argument("--create-config", action="store_true", help="Create a sample configuration file")
    
    args = parser.parse_args()
    
    if args.create_config:
        create_sample_config()
        return
    
    anonymizer = TextAnonymizer(args.config)
    
    logger.info(f"Starting anonymization process...")
    logger.info(f"Input directory: {args.input}")
    logger.info(f"Output directory: {args.output}")
    
    anonymizer.process_files(args.input, args.output)
    anonymizer.generate_report(args.output)
    
    logger.info("Anonymization complete!")


if __name__ == "__main__":
    main()
