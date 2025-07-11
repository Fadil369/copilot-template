SECURITY POLICY

Reporting Vulnerabilities

If you discover a security vulnerability in this repository, please report it to us as soon as possible.

Email: security@brainsait.io
GitHub Issues: Please do not publicly disclose vulnerabilities via GitHub Issues. Use email for sensitive reports.
Response Time: We aim to respond to security reports within 48 hours and resolve critical issues within 7 days.
Supported Versions

We actively maintain and support the following branches:

Version / Branch	Supported	Notes
main	Yes	Production releases
Other branches	No	Development only
Security Updates

We release patches for critical vulnerabilities as soon as possible. Please keep your dependencies up to date and monitor this repository for security-related releases.

Best Practices

Never hardcode secrets: Use .env files and environment variables.
Validate all inputs: Use type hints and schema validation (FastAPI recommended).
Keep dependencies updated: Check for known vulnerabilities using Dependabot and other tools.
Use HTTPS: Always secure communications.
Disclosure Policy

We appreciate responsible disclosure and will credit security researchers in our release notes.
Please avoid running automated scanners without prior notification.
Additional Resources

GitHub Security Advisories
BrainSAIT Coding Standards
Contact Us
