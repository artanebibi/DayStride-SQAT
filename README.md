

## DayStride SQA
📘 Software Quality Assurance for DayStride

[![Coverage Status](https://coveralls.io/repos/github/artanebibi/DayStride-SQAT/badge.svg?branch=main)](https://coveralls.io/github/artanebibi/DayStride-SQAT?branch=main)

This repository contains the testing artifacts, pipelines, and documentation for DayStride, ensuring that the system is robust, reliable, and aligned with its SRS while fitting within DayStride’s agile workflow.
---
## 📌 Project Description
DayStride is a habit, goal, and to-do tracking web application with:

- Django REST API backend

- React (Vite + Mantine + Tailwind) frontend

- JWT-based authentication

- User dashboards for daily planning

- GoalHub for exploring public goals

This repository ensures DayStride’s quality through structured testing and CI/CD practices.
---
## What We Test
Unit Testing (backend models/serializers, frontend components).

- Integration Testing (Small):

- Backend: API endpoints with DB.

- Frontend: Hooks/components with mocked APIs.

- Integration Testing (In the Large):

- Full API workflows with frontend and backend live.

- UI & E2E Testing: Login, registration, CRUD flows using Playwright.

  
---
## 🚀 CI/CD Workflow

DayStride’s CI/CD pipeline ensures continuous quality through automated testing, container orchestration, and runtime validation.

### 🔄 On each push to `main`:
- Run **unit** and **integration-small** tests  
- Upload **coverage reports** to [Coveralls](https://coveralls.io)

### 🧪 Integration-large and UI tests:
- Executed in **development environment**, triggered manually  
- Uses `docker-dev.yaml` for container orchestration  
  → **Bottom-up sequence**: Database → Backend → Frontend

### ☁️ Deployment to AWS EC2 (staging):
- Automatically triggers **K6 load testing** post-deployment  
- Followed by **OWASP ZAP DAST security scan** on the exposed EC2 web app

> 🧠 Designed to support an agile workflow with lightweight TDD principles where feasible


- Load Testing: Using k6 on critical API endpoints (e.g., /api/dashboard/).

- Security Testing: OWASP ZAP baseline scans post-deployment.

Tests traced to SRS requirements for systematic validation.


---
## 📝 Documentation

Comprehensive documentation is available in the `docs/` directory and on GitHub:

- **Software Requirements Specification (SRS)**  
  ↳ Aligned with implemented tests

- **High-Level Test Plan (HLTP)**

- **Test Execution Reports**  
  ↳ Includes coverage reports, auto-uploaded as CI/CD pipeline artifacts
