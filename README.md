# StudentRun

[![Build status](https://dev.azure.com/zhaw-gruppe-x/Student%20Run/_apis/build/status/Student%20Run-CI%20CD)](https://dev.azure.com/zhaw-gruppe-x/Student%20Run/_build/latest?definitionId=1)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=StudentRun&metric=alert_status)](https://sonarcloud.io/dashboard?id=StudentRun)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=StudentRun&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=StudentRun)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=StudentRun&metric=security_rating)](https://sonarcloud.io/dashboard?id=StudentRun)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=StudentRun&metric=bugs)](https://sonarcloud.io/dashboard?id=StudentRun)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=StudentRun&metric=code_smells)](https://sonarcloud.io/dashboard?id=StudentRun)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=StudentRun&metric=coverage)](https://sonarcloud.io/dashboard?id=StudentRun)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=StudentRun&metric=duplicated_lines_density)](https://sonarcloud.io/dashboard?id=StudentRun)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=StudentRun&metric=sqale_index)](https://sonarcloud.io/dashboard?id=StudentRun)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=StudentRun&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=StudentRun)

## 🏃 Quick Start

### 💽 Connect MongoDB database

`backend/config/default.json`

```json
{
	"mongoURI":
  	"mongodb+srv://<userName>:<password>@<clusterUrl>/<defaultDatabaseName>?retryWrites=true&w=majority"
}
```

### ✅ Run frontend and backend in separate Terminal windows

- In `backend/` run command `npm start`
- In `frontend/` run command `npm start`

## 📚 Tech Stack
- **M**ongoDB: A general purpose, document-based, distributed database built for modern application developers and for the cloud era.
- **E**xpress: A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
- **R**eact: A JavaScript library for building user interfaces
- **N**ode.js: A JavaScript runtime built on [Chrome's V8 JavaScript engine](https://v8.dev/).

### ⛓ Dependencies

**Backend:**

- `express`
- `mongoose`
- `body-parser`
- `bcryptjs`
- `validation`
- `config`
- `cors`
- `jest` (Testing)
- `nodemon` (DEV)

**Frontend**

- `react`
- `axios`
- `web-vitals`
- `jest` (Testing)
- `user-event` (Testing)
- `bootstrap` (CDN)
- `fontawesome` (CDN)

## Build Automation

- [Azure DevOps](https://dev.azure.com/zhaw-gruppe-x/Student%20Run)
- Triggers:
  - Continuous integration: Polling `master`-Branch
  - Scheduled Nightly: MO-SO, 02:00 UTC

## 🧪 Tests

In both the backend and frontend portion, the JavaScript testing framework [Jest](https://jestjs.io) has been installed.

- In `backend/` run command `npm run test`
- In `frontend/` run command `npm run test`
