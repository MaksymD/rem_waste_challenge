# rem_waste_challenge

**Test Automation Project for REMWASTE Challenge**  
This repository contains the automated test suite for the React frontend and Node.js backend application developed for
the REMWASTE Challenge. The goal of this project is to ensure the functional correctness and visual stability of the
application through automated testing, integrated into a Continuous Integration (CI) pipeline.

## 1. Test Coverage Areas

### 1.1 Functional UI Automation

**Login Functionality:**

- Successful login with valid credentials (`admin/adminpassword`)
- Unsuccessful login with invalid credentials
- Unsuccessful login with missing username
- Unsuccessful login with missing password

**Item Management:**

- Creating a new item
- Editing an existing item
- Deleting an item
- Asserting the presence of expected data after actions

### 1.2 API Test Automation

Direct testing of backend API endpoints, including:

- `POST /api/login` (positive and negative cases)
- `GET /api/items` (positive and negative cases)
- `POST /api/items` (positive and negative cases)
- `PUT /api/items/:id` (positive and negative cases)
- `DELETE /api/items/:id` (positive and negative cases)

---

### 1.3 CI/CD Integration

- All Playwright tests are automatically executed on **push/pull requests** to `main` or `master` branches using *
  *GitHub Actions**
- **Test reports** (HTML, JSON) are uploaded as artifacts to the GitHub Actions UI for review

---

## 2. Tools Used

- **Playwright** (UI Automation & API Testing)  
  Chosen for its speed, reliability, cross-browser compatibility, and built-in visual regression testing. Uses
  `data-testid` for stable selectors.

- **GitHub Actions** (CI/CD Pipeline)  
  Seamlessly integrates with GitHub, enabling free automation of tests on every code change.

- **Node.js & npm**  
  Runtime and package manager for Playwright and backend server.

- **dotenv**  
  Manages environment variables for configuration flexibility.

---

## 3. How to Run the Tests

### Prerequisites

- Node.js
- npm
- Git

### Setup Steps

**Clone the Repository:**

**Install Dependencies:**

```bash
npm install
```

**Install Playwright:**

```bash
npx playwright install --with-deps
```

### Run All Tests

```bash
npx playwright test
```