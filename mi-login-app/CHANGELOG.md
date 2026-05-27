# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.1] - 2026-05-26

### Added
- **Auth API**: Created the initial POST endpoint for user authentication (`app/api/auth/login/route.ts`) to receive and process JSON payloads.
- **Home Page**: Created a clean and responsive entry point view (`app/page.tsx`) using Tailwind CSS for the login project landing.
- **Client Tooling**: Configured Thunder Client extension within Visual Studio Code to validate backend API methods and request/response life cycles.
- **Database Connection**: Integrated Mongoose and established a global caching connection singleton (`lib/db.ts`) to connect Next.js with MongoDB Atlas.
- **User Architecture**: Created the strict database schema for user credentials (`models/User.ts`) enforcing lowercase, unique emails, and automatic timestamps.
- **Cryptographic Security**: Integrated `bcryptjs` for secure asynchronous password hashing and verification workflows.
- **Session Tokenization**: Implemented `jsonwebtoken` (JWT) generation to issue secure, signed state-verification passes upon successful login.
### Added
- **Progressive Security Middleware**: Implemented an automated perimeter security layer that triggers Turnstile/Captcha requirements after 3 failed login attempts.
- **Account Lockout & IP Logging**: Added a strict 15-minute brute-force mitigation system that restricts account access on the 5th consecutive authentication failure using dynamic `lockUntil` validation, while capturing and displaying the client's remote IP address in the security response.

### Fixed
- **Environment Rules**: Documented the execution policy override needed for PowerShell script execution blocks and standardized terminal execution inside Node/Command Prompt environment.
- **Database Connection String**: Corrected the interpolation constraints and credentials syntax inside `.env.local` to successfully establish the handshaking with MongoDB Atlas Cluster.