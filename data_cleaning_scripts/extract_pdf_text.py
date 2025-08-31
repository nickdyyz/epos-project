#!/usr/bin/env python3
"""
extract_pdf_text.py - Extract text from PDF files using pdftotext (poppler)

This script processes PDF files from an input directory and extracts
their text content using the pdftotext tool from poppler. The extracted
text is saved to an output directory with the same filename but with
a .txt extension.

Usage:
    python extract_pdf_text.py --input <input_dir> --output <output_dir>

Requirements:
    - poppler utilities (pdftotext) installed on the system
    - Python 3.6+
"""

import argparse
import logging
import os
import subprocess
import sys
from pathlib import Path
from typing import List, Optional, Tuple


def setup_logging(log_level: str = "INFO") -> None:
    """Set up logging configuration.

    Args:
        log_level: The logging level (default: INFO)
    """
    numeric_level = getattr(logging, log_level.upper(), None)
    if not isinstance(numeric_level, int):
        raise ValueError(f"Invalid log level: {log_level}")

    logging.basicConfig(
        level=numeric_level,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        handlers=[
            logging.StreamHandler(),
            logging.FileHandler(os.path.join(os.path.dirname(__file__), "pdf_extraction.log"))
        ]
    )


def get_pdf_files(input_dir: str) -> List[Path]:
    """Get all PDF files from the input directory.

    Args:
        input_dir: Path to the directory containing PDF files

    Returns:
        List of Path objects for each PDF file
    """
    input_path = Path(input_dir)
    if not input_path.is_dir():
        raise ValueError(f"Input directory does not exist: {input_dir}")

    pdf_files = list(input_path.glob("*.pdf"))
    logging.info(f"Found {len(pdf_files)} PDF files in {input_dir}")
    return pdf_files


def extract_text_from_pdf(pdf_path: Path, output_dir: Path) -> Tuple[bool, Optional[str]]:
    """Extract text from a PDF file using pdftotext.

    Args:
        pdf_path: Path to the PDF file
        output_dir: Directory where the text file will be saved

    Returns:
        Tuple containing success status (bool) and error message (str) if any
    """
    output_file = output_dir / f"{pdf_path.stem}.txt"
    
    try:
        # Ensure output directory exists
        output_dir.mkdir(parents=True, exist_ok=True)
        
        # Run pdftotext command
        cmd = ["pdftotext", "-layout", str(pdf_path), str(output_file)]
        logging.debug(f"Running command: {' '.join(cmd)}")
        
        result = subprocess.run(
            cmd, 
            check=True, 
            capture_output=True, 
            text=True
        )
        
        if output_file.exists():
            logging.info(f"Successfully extracted text from {pdf_path.name} to {output_file}")
            return True, None
        else:
            return False, "Output file was not created"
            
    except subprocess.CalledProcessError as e:
        error_msg = f"Error running pdftotext: {e.stderr}"
        logging.error(error_msg)
        return False, error_msg
    except Exception as e:
        error_msg = f"Unexpected error: {str(e)}"
        logging.error(error_msg)
        return False, error_msg


def process_pdf_files(input_dir: str, output_dir: str) -> Tuple[int, int]:
    """Process all PDF files in the input directory.

    Args:
        input_dir: Directory containing PDF files
        output_dir: Directory where text files will be saved

    Returns:
        Tuple containing count of successful and failed extractions
    """
    pdf_files = get_pdf_files(input_dir)
    output_path = Path(output_dir)
    
    successful = 0
    failed = 0
    
    for pdf_file in pdf_files:
        logging.info(f"Processing {pdf_file.name}")
        success, error = extract_text_from_pdf(pdf_file, output_path)
        
        if success:
            successful += 1
        else:
            failed += 1
            logging.error(f"Failed to extract text from {pdf_file.name}: {error}")
    
    return successful, failed


def parse_arguments() -> argparse.Namespace:
    """Parse command line arguments.

    Returns:
        Parsed arguments namespace
    """
    parser = argparse.ArgumentParser(
        description="Extract text from PDF files using pdftotext"
    )
    parser.add_argument(
        "--input",
        "-i",
        required=True,
        help="Directory containing PDF files"
    )
    parser.add_argument(
        "--output",
        "-o",
        required=True,
        help="Directory where text files will be saved"
    )
    parser.add_argument(
        "--log-level",
        choices=["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"],
        default="INFO",
        help="Set the logging level"
    )
    
    return parser.parse_args()


def main() -> int:
    """Main function to orchestrate the PDF text extraction process.

    Returns:
        Exit code (0 for success, 1 for failure)
    """
    args = parse_arguments()
    setup_logging(args.log_level)
    
    logging.info(f"Starting PDF text extraction")
    logging.info(f"Input directory: {args.input}")
    logging.info(f"Output directory: {args.output}")
    
    try:
        successful, failed = process_pdf_files(args.input, args.output)
        
        logging.info(f"PDF extraction complete")
        logging.info(f"Successfully processed: {successful}")
        logging.info(f"Failed to process: {failed}")
        
        if failed > 0:
            logging.warning(f"Some PDF files could not be processed. Check the log for details.")
            return 1
        return 0
        
    except Exception as e:
        logging.critical(f"Fatal error: {str(e)}")
        return 1


if __name__ == "__main__":
    sys.exit(main())

