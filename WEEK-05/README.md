# WEEK 05: Modern Frontend Development

## 🎯 Objectives
- Evolve the static HTML/CSS wireframes from Week 2 into a dynamic, modern web application.
- Utilize React.js and Vite to build a fast, component-based Single Page Application (SPA).
- Implement asynchronous JavaScript (`fetch` API) for seamless backend communication.

## 🛠️ Technical Details
The clinical dashboard was re-architected as a React application to allow for dynamic state management without jarring page reloads.

**Key Components Developed:**
- `PneumoniaDetector.jsx`: The core component handling the drag-and-drop file interface.
- `HomeView.jsx` & `RecordsView.jsx`: Providing a simulated clinical environment.

**Asynchronous Logic:**
By intercepting standard form submissions, the application silently transmits the X-Ray image via a `multipart/form-data` payload, displays a loading spinner, and injects the JSON result into the DOM the millisecond it returns.

## 📂 Deliverables
- The complete `web page(PDS)` React/Vite source code.
- `package.json` with locked frontend dependencies.
