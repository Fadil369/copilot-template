#!/usr/bin/env python3
"""
HIPAA Compliance Check Script for BrainSAIT
Validates code for HIPAA compliance requirements
"""

import os
import re
import sys
from pathlib import Path

class HIPAAComplianceChecker:
    def __init__(self):
        self.violations = []
        self.warnings = []
        
        # Patterns that may indicate HIPAA violations
        self.phi_patterns = [
            (r'\bssn\b|\bsocial.security\b', 'Social Security Number reference'),
            (r'\bpatient.?id\b(?!.*hash)', 'Patient ID without proper hashing'),
            (r'\bemail\b.*\bpatient\b', 'Patient email handling'),
            (r'\bphone\b.*\bpatient\b', 'Patient phone number handling'),
            (r'\baddress\b.*\bpatient\b', 'Patient address handling'),
            (r'console\.log\(.*patient', 'Patient data in console logs'),
            (r'print\(.*patient', 'Patient data in print statements'),
        ]
        
        # Security patterns
        self.security_patterns = [
            (r'password\s*=\s*["\'][^"\']+["\']', 'Hardcoded password'),
            (r'api_key\s*=\s*["\'][^"\']+["\']', 'Hardcoded API key'),
            (r'secret\s*=\s*["\'][^"\']+["\']', 'Hardcoded secret'),
            (r'token\s*=\s*["\'][^"\']+["\']', 'Hardcoded token'),
            (r'http://', 'Unencrypted HTTP connection'),
        ]
        
    def check_file(self, file_path):
        """Check a single file for HIPAA compliance issues"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            self.check_phi_handling(file_path, content)
            self.check_security_issues(file_path, content)
            self.check_encryption_requirements(file_path, content)
            
        except Exception as e:
            self.warnings.append(f"Error reading {file_path}: {str(e)}")
            
    def check_phi_handling(self, file_path, content):
        """Check for Protected Health Information handling issues"""
        lines = content.split('\n')
        
        for pattern, description in self.phi_patterns:
            for i, line in enumerate(lines, 1):
                if re.search(pattern, line, re.IGNORECASE):
                    self.violations.append(f"{file_path}:{i}: {description}")
                    
    def check_security_issues(self, file_path, content):
        """Check for security-related HIPAA violations"""
        lines = content.split('\n')
        
        for pattern, description in self.security_patterns:
            for i, line in enumerate(lines, 1):
                if re.search(pattern, line, re.IGNORECASE):
                    self.violations.append(f"{file_path}:{i}: {description}")
                    
    def check_encryption_requirements(self, file_path, content):
        """Check for proper encryption implementation"""
        
        # Check for database connections without encryption
        if re.search(r'mysql://|postgres://|mongodb://', content):
            self.warnings.append(f"{file_path}: Database connection may lack encryption")
            
        # Check for data transmission without HTTPS
        if re.search(r'fetch\s*\(\s*["\']http://', content):
            self.violations.append(f"{file_path}: HTTP requests should use HTTPS for HIPAA compliance")
            
        # Check for file storage without encryption
        if re.search(r'fs\.writeFile|File\(|open\(.*["\']w', content):
            if not re.search(r'encrypt|cipher|aes', content, re.IGNORECASE):
                self.warnings.append(f"{file_path}: File operations may need encryption for PHI")
                
    def check_directory(self, directory):
        """Check all relevant files in a directory"""
        code_extensions = {'.py', '.js', '.jsx', '.ts', '.tsx', '.java', '.cs', '.php', '.rb'}
        
        for file_path in Path(directory).rglob('*'):
            if file_path.is_file() and file_path.suffix in code_extensions:
                # Skip common ignore patterns
                if any(part.startswith('.') or part == 'node_modules' for part in file_path.parts):
                    continue
                self.check_file(file_path)
                
    def report_results(self):
        """Print compliance check results"""
        print("HIPAA Compliance Check Results:")
        print("=" * 40)
        
        if self.violations:
            print(f"\n❌ VIOLATIONS ({len(self.violations)}):")
            for violation in self.violations:
                print(f"  {violation}")
                
        if self.warnings:
            print(f"\n⚠️  WARNINGS ({len(self.warnings)}):")
            for warning in self.warnings:
                print(f"  {warning}")
                
        if not self.violations and not self.warnings:
            print("✅ No HIPAA compliance issues found!")
            
        print("\nHIPAA Compliance Recommendations:")
        print("- Encrypt all PHI at rest and in transit")
        print("- Use HTTPS for all API communications")
        print("- Hash patient identifiers")
        print("- Implement proper access controls")
        print("- Enable audit logging")
        print("- Regular security assessments")
            
        return len(self.violations) == 0

def main():
    checker = HIPAAComplianceChecker()
    
    # Get directory to check (default to current directory)
    directory = sys.argv[1] if len(sys.argv) > 1 else '.'
    
    print(f"Checking HIPAA compliance in: {os.path.abspath(directory)}")
    checker.check_directory(directory)
    
    success = checker.report_results()
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()