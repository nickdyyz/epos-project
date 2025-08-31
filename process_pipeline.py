#!/usr/bin/env python3
"""
process_pipeline.py - Complete pipeline for PDF processing and anonymization.

This script orchestrates the complete workflow:
1. Extract text from PDFs
2. Anonymize sensitive information
3. Generate reports

Usage:
    python process_pipeline.py [--config <config_file>]

Directory structure expected:
    - Raw PDFs in: training_materials/raw/pdf/
    - Extracted text saved to: training_materials/processed/pdf/raw_text/
    - Anonymized text saved to: training_materials/processed/pdf/anonymized/
"""

import os
import sys
import subprocess
import argparse
from pathlib import Path
import logging

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


class EPOSPipeline:
    def __init__(self, project_root: str = None):
        """Initialize the EPOS processing pipeline."""
        self.project_root = Path(project_root) if project_root else Path(__file__).parent
        
        # Define paths
        self.raw_pdf_dir = self.project_root / "training_materials" / "raw" / "pdf"
        self.raw_word_dir = self.project_root / "training_materials" / "raw" / "word"
        self.raw_text_dir = self.project_root / "training_materials" / "processed" / "all_text" / "raw_text"
        self.anonymized_dir = self.project_root / "training_materials" / "processed" / "all_text" / "anonymized"
        self.scripts_dir = self.project_root / "data_cleaning_scripts"
        
        # Script paths
        self.extract_pdf_script = self.scripts_dir / "extract_pdf_text.py"
        self.extract_word_script = self.scripts_dir / "extract_word_text.py"
        self.anonymize_script = self.scripts_dir / "anonymize_advanced.py"
        
        logger.info(f"Pipeline initialized with project root: {self.project_root}")
    
    def check_prerequisites(self) -> bool:
        """Check if all required components are available."""
        issues = []
        
        # Check directories
        if not self.raw_pdf_dir.exists():
            issues.append(f"PDF directory not found: {self.raw_pdf_dir}")
        if not self.raw_word_dir.exists():
            issues.append(f"Word directory not found: {self.raw_word_dir}")
        
        # Check scripts
        if not self.extract_pdf_script.exists():
            issues.append(f"PDF extract script not found: {self.extract_pdf_script}")
        if not self.extract_word_script.exists():
            issues.append(f"Word extract script not found: {self.extract_word_script}")
        if not self.anonymize_script.exists():
            issues.append(f"Anonymize script not found: {self.anonymize_script}")
        
        # Check for files to process
        pdf_files = list(self.raw_pdf_dir.glob("*.pdf"))
        word_files = list(self.raw_word_dir.glob("*.docx"))
        
        total_files = len(pdf_files) + len(word_files)
        if total_files == 0:
            issues.append(f"No files found to process (PDFs or Word docs)")
        else:
            logger.info(f"Found {len(pdf_files)} PDF files and {len(word_files)} Word files to process")
        
        # Check for pdftotext if we have PDFs
        if pdf_files:
            try:
                subprocess.run(["pdftotext", "-v"], capture_output=True, check=True)
            except (subprocess.CalledProcessError, FileNotFoundError):
                issues.append("pdftotext command not available (install poppler utilities)")
        
        if issues:
            logger.error("Prerequisites check failed:")
            for issue in issues:
                logger.error(f"  - {issue}")
            return False
        
        logger.info("All prerequisites satisfied")
        return True
    
    def extract_text_from_pdfs(self) -> bool:
        """Extract text from all PDF files."""
        pdf_files = list(self.raw_pdf_dir.glob("*.pdf"))
        if not pdf_files:
            logger.info("No PDF files found, skipping PDF extraction")
            return True
            
        logger.info(f"Step 1a: Extracting text from {len(pdf_files)} PDFs...")
        
        try:
            cmd = [
                "python3", str(self.extract_pdf_script),
                "--input", str(self.raw_pdf_dir),
                "--output", str(self.raw_text_dir),
                "--log-level", "INFO"
            ]
            
            result = subprocess.run(cmd, check=True, capture_output=True, text=True)
            
            if result.returncode == 0:
                logger.info("✅ PDF text extraction completed successfully")
                return True
            else:
                logger.error("❌ PDF text extraction failed")
                logger.error(result.stderr)
                return False
                
        except subprocess.CalledProcessError as e:
            logger.error(f"❌ PDF extraction failed: {e}")
            logger.error(e.stderr if e.stderr else "No error details available")
            return False
        except Exception as e:
            logger.error(f"❌ Unexpected error during PDF extraction: {e}")
            return False
    
    def extract_text_from_word_docs(self) -> bool:
        """Extract text from all Word documents."""
        word_files = list(self.raw_word_dir.glob("*.docx"))
        if not word_files:
            logger.info("No Word documents found, skipping Word extraction")
            return True
            
        logger.info(f"Step 1b: Extracting text from {len(word_files)} Word documents...")
        
        try:
            cmd = [
                "python3", str(self.extract_word_script),
                "--input", str(self.raw_word_dir),
                "--output", str(self.raw_text_dir),
                "--log-level", "INFO"
            ]
            
            result = subprocess.run(cmd, check=True, capture_output=True, text=True)
            
            if result.returncode == 0:
                logger.info("✅ Word text extraction completed successfully")
                return True
            else:
                logger.error("❌ Word text extraction failed")
                logger.error(result.stderr)
                return False
                
        except subprocess.CalledProcessError as e:
            logger.error(f"❌ Word extraction failed: {e}")
            logger.error(e.stderr if e.stderr else "No error details available")
            return False
        except Exception as e:
            logger.error(f"❌ Unexpected error during Word extraction: {e}")
            return False
    
    def anonymize_text(self, config_file: str = None) -> bool:
        """Anonymize extracted text files."""
        logger.info("Step 2: Anonymizing sensitive information...")
        
        # Check if raw text files exist
        txt_files = list(self.raw_text_dir.glob("*.txt"))
        if not txt_files:
            logger.error(f"No text files found in {self.raw_text_dir}")
            return False
        
        try:
            cmd = [
                "python3", str(self.anonymize_script),
                "--input", str(self.raw_text_dir),
                "--output", str(self.anonymized_dir)
            ]
            
            if config_file:
                cmd.extend(["--config", config_file])
            
            result = subprocess.run(cmd, check=True, capture_output=True, text=True)
            
            if result.returncode == 0:
                logger.info("✅ Text anonymization completed successfully")
                return True
            else:
                logger.error("❌ Text anonymization failed")
                logger.error(result.stderr)
                return False
                
        except subprocess.CalledProcessError as e:
            logger.error(f"❌ Anonymization failed: {e}")
            logger.error(e.stderr if e.stderr else "No error details available")
            return False
        except Exception as e:
            logger.error(f"❌ Unexpected error during anonymization: {e}")
            return False
    
    def generate_summary_report(self) -> None:
        """Generate a pipeline summary report."""
        report_path = self.project_root / "pipeline_summary.txt"
        
        with open(report_path, 'w') as f:
            f.write("EPOS PIPELINE SUMMARY\n")
            f.write("=" * 50 + "\n\n")
            
            # Count files in each directory
            pdf_count = len(list(self.raw_pdf_dir.glob("*.pdf")))
            word_count = len(list(self.raw_word_dir.glob("*.docx")))
            raw_txt_count = len(list(self.raw_text_dir.glob("*.txt"))) if self.raw_text_dir.exists() else 0
            anon_txt_count = len(list(self.anonymized_dir.glob("*.txt"))) if self.anonymized_dir.exists() else 0
            
            f.write(f"Input files processed:\n")
            f.write(f"  PDF files: {pdf_count}\n")
            f.write(f"  Word files: {word_count}\n")
            f.write(f"  Total input files: {pdf_count + word_count}\n\n")
            
            f.write(f"Output files created:\n")
            f.write(f"  Raw text files: {raw_txt_count}\n")
            f.write(f"  Anonymized text files: {anon_txt_count}\n\n")
            
            f.write("Directory structure:\n")
            f.write(f"  Raw PDFs: {self.raw_pdf_dir}\n")
            f.write(f"  Raw Word docs: {self.raw_word_dir}\n")
            f.write(f"  Raw text: {self.raw_text_dir}\n")
            f.write(f"  Anonymized: {self.anonymized_dir}\n\n")
            
            # Check for anonymization report
            anon_report = self.anonymized_dir / "anonymization_summary.txt"
            if anon_report.exists():
                f.write("Anonymization details:\n")
                f.write(f"  See: {anon_report}\n")
        
        logger.info(f"Pipeline summary saved to: {report_path}")
    
    def run_pipeline(self, config_file: str = None) -> bool:
        """Run the complete processing pipeline."""
        logger.info("🚀 Starting EPOS processing pipeline...")
        
        # Step 0: Check prerequisites
        if not self.check_prerequisites():
            return False
        
        # Step 1a: Extract text from PDFs
        if not self.extract_text_from_pdfs():
            return False
        
        # Step 1b: Extract text from Word documents
        if not self.extract_text_from_word_docs():
            return False
        
        # Step 2: Anonymize text
        if not self.anonymize_text(config_file):
            return False
        
        # Step 3: Generate summary
        self.generate_summary_report()
        
        logger.info("🎉 Pipeline completed successfully!")
        logger.info(f"Anonymized text files are ready in: {self.anonymized_dir}")
        
        return True


def main():
    parser = argparse.ArgumentParser(description="EPOS PDF processing and anonymization pipeline")
    parser.add_argument("--config", "-c", help="Configuration file for anonymization")
    parser.add_argument("--project-root", help="Project root directory (default: script directory)")
    
    args = parser.parse_args()
    
    pipeline = EPOSPipeline(args.project_root)
    
    success = pipeline.run_pipeline(args.config)
    
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
