# GymBro Admin Dashboard

This is a standalone Vite + React application providing an admin-only analytics dashboard for GymBro. It visualizes key performance indicators and user activity metrics.

## Installation

1. Clone the repository.
2. Install dependencies:
```bash
npm install
```

## Environment Variables

Copy `.env.example` to `.env` and configure your backend URL:
```bash
cp .env.example .env
```

Required variables:
- `VITE_API_URL`: The base URL for the backend API.

## Running Locally

Start the development server:
```bash
npm run dev
```

## Building for Production

Build the application for deployment (e.g., to Vercel):
```bash
npm run build
```

## Important Notes
- The backend `/reports/...` endpoints require admin access. You must log in with a user account that has `is_admin=True` in the database.
