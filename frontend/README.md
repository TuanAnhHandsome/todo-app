# Todo App — React Frontend

Full-stack Todo application frontend built with React + Vite.

## Features
- Register / Login (Auth)
- Add / Edit / Delete todo
- Mark as complete / incomplete
- Filter: All / Active / Done
- Clear all completed
- Session persists on reload

## Tech Stack
- React 18
- Vite
- CSS (no UI library — written from scratch)

## Project Structure

```
src/
├── components/
│   ├── AuthPage.jsx     ← Login & Register form
│   ├── TodoApp.jsx      ← Main todo screen
│   ├── TodoItem.jsx     ← Single todo row (edit inline)
│   └── FilterBar.jsx    ← Filter tabs + clear button
├── services/
│   └── api.js           ← API layer (mock localStorage → Spring Boot)
├── App.jsx              ← Root, manages auth state
├── main.jsx             ← Entry point
└── index.css            ← All styles
```

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev

# 3. Open browser
http://localhost:5173
```

## Connect to Spring Boot Backend

All API calls are in `src/services/api.js`.

Each function has two sections:
- **Commented out** — real fetch() calls to Spring Boot
- **Active** — mock with localStorage

To connect backend:
1. Start Spring Boot on `http://localhost:8080`
2. In `api.js`, uncomment the fetch blocks and delete the mock blocks
3. Vite proxy in `vite.config.js` already set up for `/api` → `localhost:8080`

## Expected Spring Boot Endpoints

| Method | URL                  | Description         |
|--------|----------------------|---------------------|
| POST   | /api/auth/register   | Register new user   |
| POST   | /api/auth/login      | Login, returns JWT  |
| GET    | /api/todos           | Get all todos       |
| POST   | /api/todos           | Create todo         |
| PUT    | /api/todos/{id}      | Update todo         |
| DELETE | /api/todos/{id}      | Delete todo         |
