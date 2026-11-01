# Larp Club

A playful tech alter ego playground built at LarpHacks 2026. Main track and intended Render sub-track.

Live: https://larp-learn.onrender.com

## Features

- Larp Lounge: persona studio, startup pitch machine, buzzword decoder, three-round stand-up simulator.
- Earn the Flex: six-step API mission, request simulator, JSON exercises, word-tile final challenge.
- XP, earned achievements, local persistence, and a private guest cloud save.
- Original simplified Larpy SVG mascot. English UI, keyboard-accessible controls, responsive layouts, reduced-motion support.

## Run and test

Requires Node 20+. No dependencies needed.

```sh
npm start
npm test
```

Local development: http://localhost:3000. Render publishes `public/` as a free static site. Build command: `node --check public/app.js`. Public-source deployments require a manual deploy in Render after source changes.

## Backend

Supabase project `larp-learn`, ref `htfwssnntwjosaozkpkk`, Canadian region. `backend/index.ts` is deployed as `larp-api`.

The function creates random 256-bit guest bearer capabilities and stores only SHA-256 token hashes. Browser sessions can read/write only their matching progress. Raw database tables have RLS enabled and all anonymous/authenticated role privileges revoked; only the server service role accesses them. No service key is in this repo. Anonymous session creation is rate-limited. Guest access is tied to browser storage, not an email login or cross-device account.

Endpoints: POST `/session`, GET/PUT `/progress`, POST `/receipt`, GET `/health`. The Edge Function uses custom guest-capability authentication instead of Supabase Auth JWTs. CORS permits the production origin. The Supabase security advisor's “RLS enabled, no policy” INFO notices are intentional: no public client directly accesses either table.

## Sentry

Project `larp-learn` in `robro-0j`; official browser loader connected. A real integration test was received as LARP-LEARN-1. Unexpected backend and receipt errors are captured with feature tags. Session replay and tracing remain off. Diagnostic page `/?diagnostics=1` sends one named test event on explicit button click.

## Agentboxd email

Verified end to end: a receipt sent through the live app arrived in the Robro Gmail inbox. Builder benefit active until December 1, 2026. A send-only key scoped to larpy-larpclub@homingbox.net is stored in encrypted Supabase secrets and expires December 1. The backend implements a fixed-content, user-requested skills receipt via the official Agentboxd send endpoint. To reconfigure, set `AGENTBOXD_API_KEY` and `AGENTBOXD_INBOX_ID` in Supabase Edge Function secrets. Never put them in public frontend files. The page truthfully reports whether email is configured. Requires mission completion and explicit one-time email consent. Limits: one per guest/recipient per 24 hours and a global daily cap. It does not subscribe anyone to a newsletter. Provider acceptance means queued, not confirmed delivered.

## Demo

1. Choose an alter ego and generate a ridiculous startup pitch.
2. Decode “API” into a useful plain-English explanation.
3. Survive a stand-up question.
4. Open the learning path, send a wrong endpoint, recover to 200 OK.
5. Complete the JSON and word-tile exercises, then show the earned skills receipt.

The pitch tool uses local templates, not an AI inference service. The API lesson uses a clearly labelled simulation. Badges are playful practice acknowledgements, not professional certifications.
