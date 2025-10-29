# Prerequisites and Commands for Building and Viewing the Project

## Prerequisite Software & Versions

To build and view this project, ensure you have the following software installed:

| Software      | Minimum Version | Recommended Version |
| ------------- | --------------- | ------------------- |
| Node.js       | 18.x            | 20.x                |
| npm           | 9.x             | 10.x                |
| Git           | 2.30            | Latest              |
| VS Code (IDE) | 1.70            | Latest              |

> **Note:** This project uses [Vite](https://vitejs.dev/) for development and [Jest](https://jestjs.io/) for testing. No global installation is required; dependencies are managed via `npm`.

---

## Installation

1. **Clone the Repository**

   ```sh
   git clone <repository-url>
   cd json-to-form-rendered
   ```

2. **Install Dependencies**
   ```sh
   npm install
   ```
   _Installs all required packages listed in [`package.json`](package.json)._

---

## Commands & Expected Outcomes

| Command                                        | Description                            | Expected Outcome                                        |
| ---------------------------------------------- | -------------------------------------- | ------------------------------------------------------- |
| `npm run dev`                                  | Start development server               | Local server at `http://localhost:5173` with hot reload |
| `npm run build`                                | Build for production                   | Compiled files in `dist/` directory                     |
| `npm run preview`                              | Preview production build               | Local server serving `dist/` at `http://localhost:4173` |
| Command                                        | Description                            | Expected Outcome                                        |
| -----------------------                        | -------------------------------------- | ------------------------------------------------------- |
| `npm run dev` / `yarn dev`                     | Start development server               | Local server at `http://localhost:5173` with hot reload |
| `npm run build` / `yarn build`                 | Build for production                   | Compiled files in `dist/` directory                     |
| `npm run preview` / `yarn preview`             | Preview production build               | Local server serving `dist/` at `http://localhost:4173` |
| `npm run lint` / `yarn lint`                   | Run ESLint for code quality            | Displays lint errors/warnings in terminal               |
| `npm test` / `yarn test`                       | Run all Jest test cases                | Shows test results and summary                          |
| `npm run test:watch` / `yarn test:watch`       | Run tests in watch mode                | Re-runs tests on file changes                           |
| `npm run test:coverage` / `yarn test:coverage` | Run tests and generate coverage report | Coverage report in [`coverage`](coverage) folder        |
| `npm run test:ci` / `yarn test:ci`             | Run tests for CI with coverage         | CI-friendly output and coverage report                  |

---

## Viewing the Application

- **Development:**  
  After running `npm run dev`, open [http://localhost:5173](http://localhost:5173) in your browser to view the app with live reload.

- **Production Preview:**  
  After building (`npm run build`), run `npm run preview` and visit [http://localhost:4173](http://localhost:4173).

---

## Additional Notes

- **Testing:**  
  Test files are located in [`src/pages/__tests__`](src/pages/__tests__), [`src/utils/__tests__`](src/utils/__tests__), etc.  
  Coverage reports are generated in the [`coverage`](coverage) directory.

- **Linting:**  
  ESLint configuration is in [`eslint.config.js`](eslint.config.js).

- **TypeScript:**  
  TypeScript configuration is managed via [`tsconfig.json`](tsconfig.json).

---

For further details, see [`README.md`](README.md).
