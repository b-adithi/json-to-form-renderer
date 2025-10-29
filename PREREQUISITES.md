# Prerequisites for Running the Project

This document outlines the requirements and setup steps for both the frontend and backend of the Form Renderer application.

## 1. System Requirements

- Node.js (v18 or higher recommended)
- npm (comes with Node.js)
- MongoDB (for backend database)
- Git (for version control)

## 2. Backend Setup

- Navigate to the `backend/` directory.
  Install dependencies:
  ```sh
  npm install
  # or
  yarn install
  ```
- Ensure MongoDB is running locally or update the connection string in `backend/models/db.js`.
  Start the backend server:
  ```sh
  npm start
  # or
  yarn dev
  ```
- The backend runs on `http://localhost:4000` by default.

## 3. Frontend Setup

- Navigate to the `frontend/` directory.
  Install dependencies:
  ```sh
  npm install
  # or
  yarn install
  ```
  Start the frontend development server:
  ```sh
  npm run dev
  # or
  yarn dev
  ```
- The frontend runs on `http://localhost:5173` by default.

## 4. Environment Variables

- Backend: You may configure environment variables in a `.env` file (e.g., for MongoDB URI, JWT secret).
- Frontend: No environment variables required for basic setup.

## 5. Running Tests

Backend: Run tests with

```sh
npm test
# or
yarn test
```

Frontend: Run tests with

```sh
npm run test
# or
yarn test
```

## 6. Additional Notes

- Ensure ports `4000` (backend) and `5173` (frontend) are available.
- For production, configure environment variables and use a production-ready database.
- Refer to the README in each folder for more details on features and usage.

---

For troubleshooting or advanced configuration, see the individual `README.md` files in `frontend/` and `backend/`.
