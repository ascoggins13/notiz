# Notiz MVP Starter

Consent-first, real-world introductions. This monorepo contains:

- `mobile/`: Expo + React Native + TypeScript
- `server/`: Node.js + Express + TypeScript, deployable to Render
- `firebase/`: Firestore rules and indexes

## MVP flow

1. Sign up or sign in.
2. Check into a venue.
3. Describe yourself.
4. Describe the person you noticed.
5. The server scores active check-ins at the same venue.
6. When two notices point at each other, a mutual match is created.
7. Both users see **You noticed each other.**
8. Each selects a connection preference.

## Architecture

```text
Expo mobile app
  -> Firebase Authentication
  -> Render Express API (Firebase ID token)
  -> Firebase Admin SDK
  -> Firestore
```

Critical writes go through the API. The client can read only its own check-ins, notices, and matches.

## 1. Firebase setup

1. Create a Firebase project.
2. Enable Email/Password Authentication.
3. Create a Firestore database.
4. Add a Web App and copy its config into `mobile/.env`.
5. Create a service account for the server.
6. Deploy rules and indexes from `firebase/`.

```bash
npm install -g firebase-tools
firebase login
firebase use YOUR_PROJECT_ID
firebase deploy --only firestore:rules,firestore:indexes
```

## 2. Server setup

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

For local development, set `GOOGLE_APPLICATION_CREDENTIALS` to your service-account JSON path. On Render, store the service account JSON as `FIREBASE_SERVICE_ACCOUNT_JSON`.

## 3. Mobile setup

```bash
cd mobile
cp .env.example .env
npm install
npx expo start
```

Set `EXPO_PUBLIC_API_URL` to the local server URL. Android Emulator usually uses `http://10.0.2.2:4000`; iOS Simulator can use `http://localhost:4000`. A physical phone must use your computer's LAN IP.

## 4. Render deployment

Create a Render Web Service pointing at `server/`.

- Build command: `npm install && npm run build`
- Start command: `npm start`
- Health check: `/health`

Environment variables:

- `NODE_ENV=production`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_SERVICE_ACCOUNT_JSON`
- `ALLOWED_ORIGINS=*` for early testing; restrict later

## Two-user test

Use two simulators/devices and two accounts.

- Both check into the same venue.
- User A describes User B.
- User B describes User A.
- Use clearly different clothing combinations.
- A reciprocal notice should create a match.

## Important production work still required

- Apple/Google sign-in
- Push-token registration and production push credentials
- Geofenced venue verification
- Rate limiting backed by Redis rather than memory
- Moderation tooling and report review
- Age/identity controls
- Analytics, crash reporting, and observability
- Accessibility and polished UI
