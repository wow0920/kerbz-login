# Kerbz Login Demo App

Expo Router + TypeScript demo app that authenticates against the Kerbz staging API, persists the session securely, injects the auth header on requests, handles global 401s, and implements an inactivity lock.

## Features

- Redux Toolkit session: `{ token, user, lastActiveAt }`
- Secure token storage via `expo-secure-store` (persist across restarts)
- Axios client with Bearer injection and global 401 → logout
- Auth routing guard (`AuthGate`) and activity tracker to update `lastActiveAt`
- Screens: `Login`, `Home` (profile), `Lock` (inactivity)
- Inactivity lock after a timeout (default ~5 minutes). Unlock triggers `/me`.

## Setup

1. Install dependencies

```bash
npm install
```

2. Configure environment

Copy `.env.example` to `.env.local` and adjust as needed:

```bash
cp .env.example .env.local
```

Optional: For a quick demo, set `EXPO_PUBLIC_INACTIVITY_LOCK_TIMEOUT=30` (seconds) to see the lock screen sooner.

3. Run (Android, iOS or Web)

```bash
npm run android   # or: npm run ios
npm start         # opens the Expo dev tools
```

## API

- Base URL: `EXPO_PUBLIC_API_BASE_URL` (defaults to staging)
- Login: `POST /login` with `{ email, password }` → `{ token, user }`
- Me: `GET /me` (Bearer token) → user info (used to validate/unlock session)
- Logout: `POST /logout` (Bearer token)

Note: In staging, `/me` may be unavailable; the app sets user info from the `/login` response on sign-in and uses `/me` primarily to validate the token during unlock.

## Project Structure

- `app/_layout.tsx` — App providers, API bootstrap, routes, and guards
- `app/login.tsx` — Login screen (stores token, sets user from `/login`)
- `app/index.tsx` — Home screen (shows user profile)
- `app/lock.tsx` — Lock screen (calls `/me` to unlock; can logout)
- `api/client.ts` — Axios instance, SecureStore token helpers, 401 interceptor
- `api/auth.ts` — API wrappers: `login`, `me`, `logout`
- `store/index.ts` — Redux store + unauthorized/logout helpers
- `store/sessionSlice.ts` — Session reducer and selectors
- `components/auth-gate.tsx` — Global auth/inactivity routing guard
- `components/activity-tracker.tsx` — Updates `lastActiveAt` on app active and route change
- `constants/env.ts` — Environment variables (`API_BASE_URL`, `INACTIVITY_LOCK_TIMEOUT`)
- `constants/types.ts` — Shared TypeScript types for API/session
- `global.css`, `tailwind.config.js` — Styling via NativeWind/Tailwind

## Notes

- Any 401 triggers a global logout via the Axios interceptor; there is no refresh token flow.
- Token is stored securely with `expo-secure-store` and read on cold start.
