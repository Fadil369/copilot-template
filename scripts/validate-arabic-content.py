#!/usr/bin/env python3
"""
Arabic Content Validation Script for BrainSAIT
Validates Arabic text content for proper RTL support and encoding
"""

import os
import re
import sys
from pathlib import Path

class ArabicContentValidator:
    def __init__(self):
        self.arabic_pattern = re.compile(r'[\u0600-\u06FF]+')
        self.errors = []
        self.warnings = []
        
    def validate_file(self, file_path):
        """Validate a single file for Arabic content issues"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # Check for Arabic content
            if self.arabic_pattern.search(content):
                self.validate_arabic_content(file_path, content)
                
        except UnicodeDecodeError:
            self.errors.append(f"Encoding error in {file_path}: File not UTF-8 encoded")
        except Exception as e:
            self.errors.append(f"Error reading {file_path}: {str(e)}")
            
    def validate_arabic_content(self, file_path, content):
        """Validate Arabic-specific content requirements"""
        
        # Check for RTL markers in HTML/markdown
        if file_path.suffix in ['.html', '.md', '.markdown']:
            if 'dir="rtl"' not in content and 'direction: rtl' not in content:
                self.warnings.append(f"{file_path}: Arabic content without RTL direction marker")
                
        # Check for mixed LTR/RTL issues
        lines = content.split('\n')
        for i, line in enumerate(lines, 1):
            if self.arabic_pattern.search(line):
                # Check for common RTL formatting issues
                if re.search(r'[a-zA-Z]+[\u0600-\u06FF]+[a-zA-Z]+', line):
                    self.warnings.append(f"{file_path}:{i}: Mixed Arabic/Latin text may cause RTL issues")
                    
        # Check for Arabic diacritics handling
        diacritics = re.compile(r'[\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED]')
        if diacritics.search(content):
            self.warnings.append(f"{file_path}: Contains Arabic diacritics - ensure proper rendering")
            
    def validate_directory(self, directory):
        """Validate all text files in a directory"""
        text_extensions = {'.md', '.txt', '.html', '.js', '.jsx', '.ts', '.tsx', '.py', '.json', '.yml', '.yaml'}
        
        for file_path in Path(directory).rglob('*'):
            if file_path.is_file() and file_path.suffix in text_extensions:
                # Skip node_modules, .git, and other common ignore patterns
                if any(part.startswith('.') or part == 'node_modules' for part in file_path.parts):
                    continue
                self.validate_file(file_path)
                
    def report_results(self):
        """Print validation results"""
        print("Arabic Content Validation Results:")
        print("=" * 40)
        
        if self.errors:
            print(f"\n❌ ERRORS ({len(self.errors)}):")
            for error in self.errors:
                print(f"  {error}")
                
        if self.warnings:
            print(f"\n⚠️  WARNINGS ({len(self.warnings)}):")
            for warning in self.warnings:
                print(f"  {warning}")
                
        if not self.errors and not self.warnings:
            print("✅ No Arabic content issues found!")
            
        return len(self.errors) == 0

def main():
    validator = ArabicContentValidator()
    
    # Get directory to validate (default to current directory)
    directory = sys.argv[1] if len(sys.argv) > 1 else '.'
    
    print(f"Validating Arabic content in: {os.path.abspath(directory)}")
    validator.validate_directory(directory)
    
    success = validator.report_results()
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()