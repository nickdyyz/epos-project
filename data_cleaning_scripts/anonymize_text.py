#!/usr/bin/env python3
"""
anonymize_text.py - Anonymize sensitive information in text files.

This script processes text files and replaces sensitive information with placeholders.

Usage:
    python anonymize_text.py --input <input_dir> --output <output_dir>

Sensitive information includes:
- Company/organization names
- Person names
- Email addresses
- Phone numbers
- Addresses
- URLs/domains
- Financial information

Placeholders used:
- [COMPANY_NAME]
- [PERSON_NAME]
- [EMAIL]
- [PHONE]
- [ADDRESS]
- [URL]
- [CODE]
- [FINANCIAL_INFO]

Requirements:
    - Python 3.6+
    - regex module
"""

import re
import os
import argparse
from pathlib import Path
from typing import List


# Regular expressions for sensitive information patterns
patterns = {
    "EMAIL": r'[\w\.-]+@[\w\.-]+',
    "PHONE": r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b',
    "URL": r'https?://(?:www\.)?\S+',
    "ADDRESS": r'\b(?:\d+\s+)?(?:[A-Za-z]+\.?\s*)+(?:St|Street|Ave|Avenue|Rd|Road|Blvd|Boulevard)\b',
    "COMPANY_NAME": r'\b[A-Za-z]+(?:\s+[A-Za-z]+)*\s+Inc\.?|Corp\.?|Ltd\.?|LLC\b',
    "PERSON_NAME": r'\b[A-Z][a-z]+\s[A-Z][a-z]+\b',
    "CODE": r'\b[A-Z]{2,5}-\d{2,5}\b',
    "FINANCIAL_INFO": r'\$\d+(?:,\d{3})*(?:.\d{2})?'
}

# Placeholder formats
placeholders = {
    "EMAIL": "[EMAIL]",
    "PHONE": "[PHONE]",
    "URL": "[URL]",
    "ADDRESS": "[ADDRESS]",
    "COMPANY_NAME": "[COMPANY_NAME]",
    "PERSON_NAME": "[PERSON_NAME]",
    "CODE": "[CODE]",
    "FINANCIAL_INFO": "[FINANCIAL_INFO]"
}


def anonymize_text(content: str) -> str:
    """Replace sensitive information in text with placeholders."""
    for key, pattern in patterns.items():
        content = re.sub(pattern, placeholders[key], content)
    return content


def anonymize_files(input_dir: str, output_dir: str) -> None:
    """Anonymize text in all files from the input directory and save to output directory."""
    input_path = Path(input_dir)
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    for file_path in input_path.glob("*.txt"):
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        anonymized_content = anonymize_text(content)
        output_file_path = output_path / file_path.name
        with open(output_file_path, "w", encoding="utf-8") as f:
            f.write(anonymized_content)

        print(f"Anonymized: {file_path} -> {output_file_path}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Anonymize sensitive information in text files.")
    parser.add_argument("--input", "-i", required=True, help="Input directory for text files")
    parser.add_argument("--output", "-o", required=True, help="Output directory for anonymized text files")
    args = parser.parse_args()

    print(f"Anonymizing files in: {args.input}")
    print(f"Saving anonymized files to: {args.output}")
    anonymize_files(args.input, args.output)


if __name__ == "__main__":
    main()
