# Changelog

All notable changes to this project will be documented in this file.

---

## [1.3.0] - 2026-05-03

### ✨ Added

#### Attachment Upload
- Standalone attachment upload service
- Integrated file upload support in HR module
- Added multer dependency for handling uploads

#### Hiring Pipeline
- New workflow action APIs:
  - submit
  - for interview
  - accepted
  - onboard
  - reject
- Applicant creation now supports multipart/form-data and file uploads

#### Leave Management
- Leave Category module with full CRUD APIs
- Leave Cases APIs:
  - CRUD operations
  - Workflow actions:
    - submit
    - verify
    - reject
    - process
    - approve
    - cancel
- DTOs for:
  - leave category
  - leave case creation
  - pagination

#### Performance Evaluation
- New performance evaluation APIs
- Acknowledge evaluation endpoint
- New workflow action type: acknowledge

#### Time & Attendance
- Initial scaffolding for module
- Workflow-related schema models and enums

#### Workflow System
- New workflow entity action constants
- Extended workflow support for:
  - performance evaluations
  - time and attendance

---

### 🔄 Changed
- Refactored performance evaluation controller and service
- Renamed recruitment and onboarding module directory

---

### ⚙️ Configuration
- Updated package-lock.json
- Added multer dependency

---

### 🧩 Misc
- Added "done evaluated" flag for completed evaluations

---

## [1.0.0] - Previous Release

### 🚀 Initial Stable Release
- Deployed to Render (NestJS backend)
- Database on Supabase with Prisma ORM
- General API improvements and QoL updates