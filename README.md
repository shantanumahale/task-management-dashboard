# Task Management Dashboard

A React + TypeScript task management app with Redux state management, dark mode, and full CRUD support.

## Tech Stack

- React 19 + TypeScript
- Redux Toolkit (state management)
- React Router v6 (routing)
- Tailwind CSS v3 (styling, dark mode)
- Jest + React Testing Library (unit tests)

## Getting Started

### Prerequisites

- Node.js 16+
- npm

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm start
```

Opens [http://localhost:3000](http://localhost:3000) in the browser. The page reloads on file changes.

### Build for production

```bash
npm run build
```

Outputs an optimized production bundle to the `build/` folder.

---

## Running the Unit Test Suite

### Run all tests (single pass, CI mode)

```bash
CI=true npm test
```

Runs the full test suite once and exits with a pass/fail code. Use this in CI pipelines or to get a final summary without the interactive watcher.

### Run all tests in watch mode (development)

```bash
npm test
```

Launches Jest in interactive watch mode. Tests re-run automatically on file changes. Press `a` to run all tests, `q` to quit.

### Run a single test file

```bash
CI=true npm test -- --testPathPattern="TaskList"
```

Replace `TaskList` with any filename or pattern to target a specific file.

### Run tests matching a specific test name

```bash
CI=true npm test -- --testNamePattern="filters tasks by title"
```

### View coverage report

```bash
CI=true npm test -- --coverage
```

Generates an HTML coverage report in `coverage/lcov-report/index.html`.

---

## Test File Overview

| File | What it covers |
|---|---|
| `src/App.test.js` | App smoke tests (root route renders) |
| `src/features/tasks/tasksSlice.test.ts` | Redux slice — all actions and state transitions |
| `src/components/TaskCard.test.tsx` | Task row rendering, edit/delete dispatch, status update |
| `src/components/TaskForm.test.tsx` | Edit side panel — load, save, cancel, validation |
| `src/components/TaskFormModal.test.tsx` | Create modal — open, save, cancel, keyboard close |
| `src/components/TaskList.test.tsx` | Search, sort by date, filter by status |
| `src/components/SummaryCard.test.tsx` | Label/count rendering, click handler, gradient class |
| `src/components/StatusSelect.test.tsx` | Dropdown open/close, option selection, ARIA attributes |
| `src/components/DeleteModal.test.tsx` | Confirm/cancel delete, Escape key, focus management |
| `src/components/ThemeToggle.test.tsx` | Light/dark toggle, localStorage persistence |
| `src/pages/Dashboard.test.tsx` | Dashboard layout, navigation, form open/close |
| `src/pages/StatusPage.test.tsx` | Status route filtering, back navigation, summary cards |
