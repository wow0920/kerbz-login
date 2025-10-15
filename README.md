# Kerbz Login Demo App

React Native (Expo) demo app authenticating against Kerbz staging API, persisting session securely, calling a protected endpoint, handling global 401, and implementing an inactivity lock.

## Features

- Redux Toolkit session: `{ token, user, lastActiveAt }`
- Secure token storage via `expo-secure-store`
- Axios client with auth header injector and global 401 → logout
- Screens: `Login`, `Home` (uses `/me`), `Lock` (inactivity)
- Inactivity lock after 5 minutes of no activity (route changes or app foreground). Unlock by calling `/me`.
- Debug button to call `/logout` to simulate token invalidation, next `/me` auto-logs out.

## Setup

1) Install dependencies

```bash
npm install
```

2) Configure environment

Copy `.env.example` to `.env` and adjust as needed:

```bash
cp .env.example .env
```

Optional: For demo, set `EXPO_PUBLIC_INACTIVITY_LOCK_MS=30000` (30s) to quickly show the lock.

3) Run (Android required; iOS optional)

```bash
npm run android   # or: npm run ios / npm start
```

## API

- Base URL: `EXPO_PUBLIC_API_BASE_URL` (defaults to staging)
- Login: `POST /login` { email, password } → `{ token, id, name, ... }`
- Me: `GET /me` (Bearer token) → `{ id, name, unreadCount }`
- Logout: `POST /logout` (Bearer token) → invalidates token on server

## How to Demo

1) Login using provided test credentials (not committed to repo).
2) On Home, press “Refresh /me” to fetch protected data.
3) Press “Debug: Invalidate on server (POST /logout)”, then press “Refresh /me”. The call returns 401 → app clears session and navigates to Login automatically.
4) Inactivity Lock: Set `EXPO_PUBLIC_INACTIVITY_LOCK_MS=30000`, interact, then wait 30s without navigating or foregrounding the app → Lock screen appears. Press “Unlock” to call `/me`. If token is valid, it unlocks; if 401, you’re redirected to Login.

## Project Structure

- `src/store/sessionSlice.js` — Redux slice: token, user, lastActiveAt
- `src/store/index.js` — configure store and unauthorized helpers
- `src/api/client.js` — Axios client, interceptors, SecureStore helpers
- `src/api/auth.js` — login, me, logout wrappers
- `src/components/AuthGate.jsx` — global auth/lock routing guard
- `src/components/ActivityTracker.jsx` — updates `lastActiveAt` on app active and route change
- `app/login.jsx` — login screen
- `app/lock.jsx` — lock screen
- `app/(tabs)/index.tsx` — Home screen (/me data + debug buttons)

## Tests

Lightweight unit tests (no Jest dependency):

```bash
npm test
```

This runs `scripts/test-auth.js` which validates reducer behavior and unauthorized flow.

## Notes

- Any 401 response triggers a global logout via the Axios interceptor. There’s no refresh token flow.
- Token is stored securely with `expo-secure-store`. If you see auth errors on cold start, ensure the SecureStore permission prompts were accepted.
- If your test account requires email verification, contact us to verify.
