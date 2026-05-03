## 🧩 System Overview

The ERP API is designed as a **modular enterprise platform** that supports multiple business domains across an organization.

It follows a scalable architecture where each module represents a core business function, allowing the system to expand beyond a single domain.

### Current & Planned Modules

- 🛠 **Administration**
- 🗂 **Master Data Management**
- 👤 **User Management & Access Control**
- 👔 **Managerial Access**
- 👥 **Human Resources (HRIS)** *(near completion)*
- 📊 **Employee Dashboard**

### Upcoming / In Progress Modules

- 💰 Accounting
- 🧾 Finance
- 📦 Inventory
- 🛒 Purchasing
- 📣 Marketing & Operations
- 💵 Payroll
- 🏢 Corporate Services
- 🧑‍💻 IT Helpdesk
- 📜 Compliance
- 🧬 Biometric Integration
- ⭐ Additional internal systems (e.g., Stars, DB Query tools)

---

## ✨ Key Features

### 🔐 Authentication & Security

* JWT-based authentication
* Cookie-based session handling
* Secure API access patterns

### 📦 Modular Architecture

* Built with NestJS module-based structure
* Easily extensible for new business domains

### 📊 HRIS Workflows

* Hiring pipeline with workflow statuses
* Leave request lifecycle management
* Performance evaluation tracking & acknowledgment

### 📂 File Upload System

* Standalone attachment upload service
* Supports document uploads across modules
* Powered by `multer`

### ⚙️ Workflow Engine

* Reusable workflow action system
* Supports statuses like:

  * submit, approve, reject, process, acknowledge, etc.

### 📑 API Documentation

* Swagger UI integration
* Supports file uploads via `multipart/form-data`

---

## 🛠 Tech Stack

* **Framework:** NestJS (Node.js)
* **Language:** TypeScript
* **ORM:** Prisma
* **Database:** Supabase (PostgreSQL)
* **Deployment:** Render
* **Auth:** JWT + Cookies
* **File Uploads:** Multer
* **Docs:** Swagger

---

## 📁 Project Structure (Simplified)

```
src/
├── modules/
│   ├── hr/
│   │   ├── hiring/
│   │   ├── leave/
│   │   ├── performance/
│   │   └── attendance/
│   ├── attachment/
│   └── auth/
├── common/
├── prisma/
└── main.ts
```

---

## 🚀 Getting Started

### 📦 Install dependencies

```bash
npm install
```

### ▶️ Run the application

```bash
# development
npm run start:dev

# production
npm run start:prod
```

---

## 📘 API Documentation

Once running, access Swagger UI:

```
http://localhost:3000/api
```

---

## 🌐 Deployment

* **Backend:** Render
* **Database:** Supabase (PostgreSQL)
* **ORM:** Prisma

Make sure to configure:

* Environment variables
* Database connection string
* JWT secrets

---

## 🔄 Recent Updates (v1.3.0)

* ✅ Attachment upload service (standalone)
* ✅ Hiring pipeline workflow APIs with file uploads
* ✅ Leave management system (categories + cases)
* ✅ Performance evaluation acknowledgment feature
* ✅ Workflow engine enhancements
* ✅ Time & Attendance module scaffolding

---

## 🧪 Testing

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# coverage
npm run test:cov
```

---

## 📈 Design Goals

* Scalable enterprise-ready architecture
* Clean separation of concerns
* Reusable workflow systems
* Maintainable and extensible modules

---

## ⚠️ Notes

This project is part of an internal enterprise system and reflects:

* Real-world backend patterns
* HRIS domain modeling
* API design best practices

---

## 📄 License

MIT License
