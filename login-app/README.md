# Nexus Login App

A professional full-stack login application built with React + Node.js/Express.

## Project Structure

```
login-app/
├── backend/          # Node.js + Express API
│   ├── server.js
│   └── package.json
├── frontend/         # React application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js
│   │   ├── index.js
│   │   ├── index.css
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── components/
│   │   │   └── ProtectedRoute.js
│   │   ├── pages/
│   │   │   ├── LoginPage.js
│   │   │   └── WelcomePage.js
│   │   └── services/
│   │       └── api.js
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### 1. Start the Backend

```bash
cd backend
npm install
npm start
```

The API will run at: `http://localhost:5000`

### 2. Start the Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

The app will open at: `http://localhost:3000`

## Credentials

| Username | Password |
|----------|----------|
| admin    | admin    |

## API Endpoints

| Method | Endpoint   | Description              |
|--------|------------|--------------------------|
| POST   | /login     | Authenticate a user      |
| GET    | /verify    | Verify a JWT token       |
| GET    | /health    | Health check             |

### POST /login

**Request body:**
```json
{
  "username": "admin",
  "password": "admin"
}
```

**Success (200):**
```json
{
  "success": true,
  "message": "Login successful.",
  "token": "<jwt_token>",
  "user": {
    "username": "admin",
    "fullName": "Admin User",
    "email": "admin@company.com",
    "role": "Administrator",
    "lastLogin": "2024-01-01T12:00:00.000Z"
  }
}
```

**Failure (401):**
```json
{
  "success": false,
  "message": "Invalid username or password. Please try again."
}
```

## Features

- ✅ JWT-based authentication
- ✅ Protected routes
- ✅ Remember username (localStorage)
- ✅ Session persistence (sessionStorage)
- ✅ Proper HTTP status codes (200, 400, 401)
- ✅ Password show/hide toggle
- ✅ Real-time form validation
- ✅ Professional dark UI design
- ✅ Responsive layout
- ✅ Live system clock
- ✅ Activity feed & system health dashboard
