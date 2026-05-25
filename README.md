# GymBro Analytics

Admin-only analytics dashboard for the GymBro fitness app. It connects to the GymBro backend, authenticates an administrator, and turns product, AI, onboarding, telemetry, and demographic data into a focused operational dashboard.

## What It Shows

- **Overview:** daily active users, onboarded users, today's engagement, recent API errors, DAU trend, and onboarding funnel.
- **Analytics:** request volume, tokens, response time, hourly usage, AI-after-event behavior, and user intensity.
- **Segment Analysis:** age, gender, weight, and height distribution; request usage by segment; top-vs-bottom segment comparisons.
- **Telemetry:** hourly activity flow, event breakdowns, and sleep telemetry.
- **System:** AI provider health and request activity over time.
- **Admin controls:** date range filters, time granularity, include/exclude admins toggle, searchable modals, report export, and EN/RU/ET localization.

## Tech Stack

- React 18
- Vite 7
- Tailwind CSS
- Recharts
- React Router
- i18next / react-i18next
- Lucide React icons

## Requirements

- Node.js 18+
- npm
- Running GymBro backend with admin auth enabled
- Admin user account with `is_admin = true`

The dashboard is a frontend-only app. It does not store database credentials, OpenAI keys, JWT secrets, or Railway secrets. It only needs the public backend base URL.

## Quick Start

```bash
npm install
cp .env.example .env
npm run dev
```

Set the backend URL in `.env`:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Open the Vite URL shown in the terminal and log in with an admin GymBro account.

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_API_URL` | Yes | Public base URL for the GymBro backend API. Example: `https://your-backend.up.railway.app` |

Only `VITE_*` variables are available in the browser bundle. Do not put private secrets in this repository or in frontend environment variables.

## Backend API Contract

The dashboard expects the GymBro backend to expose these routes:

| Area | Endpoints |
| --- | --- |
| Auth | `POST /auth/login`, `GET /auth/me` |
| Reports | `/reports/dau-today`, `/reports/interactions-today`, `/reports/daily-active-users`, `/reports/onboarding`, `/reports/ai-health`, `/reports/hourly-activity`, `/reports/engagement`, `/reports/users` |
| Analytics | `/analytics/usage-summary`, `/analytics/users/onboarded`, `/analytics/segment-comparison`, `/analytics/by-age-group`, `/analytics/by-time-range`, `/analytics/by-gender`, `/analytics/by-weight-bucket`, `/analytics/by-height-bucket`, `/analytics/users-by-age-group`, `/analytics/users-by-gender`, `/analytics/users-by-weight-bucket`, `/analytics/users-by-height-bucket`, `/analytics/hourly-usage`, `/analytics/ai-after-events`, `/analytics/export-report` |

Most analytics routes support `start` and `end` query params. Time-range analytics also supports `granularity=hour|day|week|month`.

Admin rows are excluded by default. Turning on the include-admins toggle sends:

```http
X-Include-Admins: true
```

## Available Scripts

```bash
npm run dev
```

Starts the local Vite dev server.

```bash
npm run build
```

Builds the production bundle into `dist/`.

```bash
npm run preview
```

Serves the built app locally for a production-style smoke test.

## Deployment

This app can be deployed to Vercel, Netlify, Railway static hosting, or any static web server.

Set this deployment variable:

```env
VITE_API_URL=https://your-gymbro-backend.example.com
```

Backend requirements for production:

- CORS must allow the dashboard origin.
- `/auth/me` must return `is_admin`.
- Analytics/report endpoints must require a valid bearer token.
- The admin account must already exist in the GymBro backend database.

## Security Notes

- The dashboard stores the admin access token in `localStorage` as `admin_token`.
- Route access is guarded client-side, but real authorization must be enforced by the backend.
- Never add backend secrets to `.env`, `VITE_*` variables, or committed files.
- `.env` is ignored by Git. Commit `.env.example` only.
- If a backend URL changes, update `VITE_API_URL` and rebuild/redeploy.

## Project Structure

```text
src/
  api.js                         API client and error handling
  App.jsx                        Routes and admin auth guard
  main.jsx                       React entrypoint and i18n setup
  components/
    LanguageToggle.jsx
  screens/
    LoginScreen.jsx
    DashboardScreen.jsx
  i18n/
    index.js
    resources.js                 EN/RU/ET translations
  utils/
    analyticsDisplay.js          Segment label mapping
    formatters.js                Locale-aware date and metric formatting
```

## Troubleshooting

**`VITE_API_URL environment variable is missing`**

Create `.env` from `.env.example` and restart the dev server.

**Login works, then access is denied**

The backend user exists but does not have `is_admin = true`.

**Dashboard loads but charts are empty**

Check that the GymBro backend has telemetry, AI request, onboarding, and profile data for the selected date range.

**401 or 403 from report endpoints**

Log out and log back in. If it still fails, verify backend JWT configuration and admin permissions.

**CORS error in browser console**

Allow the dashboard origin in the GymBro backend CORS settings.
