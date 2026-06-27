# Security Policy

## Supported Versions

The following table outlines the security support status for this project.

|     Version    | Supported |
| :------------: | :-------: |
|     Latest     |     ✅     |
| Older Releases |     ❌     |

---

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly instead of disclosing it publicly.

### How to Report

* Open a **private security advisory** if GitHub Security Advisories are enabled.
* Otherwise, contact the maintainer through GitHub or open a private communication channel if available.
* Include a detailed description of the issue, reproduction steps, affected components, and potential impact.

### What to Expect

After receiving a report, we will:

* Acknowledge receipt as soon as possible.
* Investigate and validate the reported issue.
* Assess the severity and affected versions.
* Develop and test an appropriate fix.
* Release a security update when necessary.
* Credit the reporter where appropriate (unless anonymity is requested).

---

## Security Best Practices

This project follows several security-oriented development practices, including:

* Client-side authentication state isolation.
* Input validation where applicable.
* Dependency management through npm.
* Regular dependency updates.
* Automated end-to-end testing with Playwright.
* Clean, maintainable, and modular code architecture.

As the project evolves with backend services, additional security measures such as secure authentication, authorization, encrypted communication, rate limiting, and server-side validation will be implemented.

---

## Disclosure Policy

Please **do not** publicly disclose security vulnerabilities until sufficient time has been provided for investigation and remediation.

Responsible disclosure helps protect users and maintain the integrity of the project.

---

## Scope

This policy applies to all code contained within this repository, including:

* Frontend application
* Authentication flow
* UI components
* Testing configuration
* Build configuration

Third-party dependencies are maintained by their respective authors and should be reported through their official security channels when appropriate.
