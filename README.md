# Larp Club

A playful tech alter ego playground built at LarpHacks 2026. Main track and intended Render sub-track.

Live: https://larp-learn.onrender.com

## Features

- Roleplay-first Larp Lounge with three complete branching scenarios: Founder for a Day (6 scenes), Production Is on Fire (4), and AI Visionary, Under Questioning (4).
- Each scene has comic consequences, specific explanations, private progress saves, one-time XP, hints, replay, and an earned skills debrief.
- Four original participant photos on the home page, with lighter, less promotional copy.
- Shared group challenges: invite code/link, identical inventory, server-checked answers, three-attempt limit, and a generated-nickname results board. Scores lock after a correct answer; concurrent submissions cannot bypass the attempt cap.
- The Hot Seat: fresh random server inventory, real HTTP troubleshooting, and typed answers checked against the response.
- Supporting persona studio, startup pitch machine with saved output, buzzword decoder, and three-round stand-up simulator.
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

Shared rooms: POST `/rooms`, GET `/room?code=CODE`, POST `/room-submit`. Rooms accept answers for six hours; refreshing the board is explicit rather than continuous polling. Create limit: three per guest per day, 100 total per day. Anyone with the code can see the room inventory and pseudonymous board. The Postgres scoring function is executable only by the backend service role and serializes submissions with a row lock. See `backend/rooms.sql`.

Endpoints: POST `/session`, GET/PUT `/progress`, POST `/receipt`, GET `/health`. Public demo endpoints: GET `/demo-snacks` (200), GET `/demo-inventory` (fresh randomized inventory), POST `/demo-inventory` (405), POST `/demo-snacks` (405), `/demo-missing` (404), `/demo-outage` (deliberate 503). The Edge Function uses custom guest-capability authentication instead of Supabase Auth JWTs. CORS permits the production origin. The Supabase security advisor's “RLS enabled, no policy” INFO notices are intentional: no public client directly accesses these tables.

## Sentry

Project `larp-learn` in `robro-0j`; official browser loader connected. A real integration test was received as LARP-LEARN-1. Unexpected backend and receipt errors are captured with feature tags. Safe role/scene/challenge breadcrumbs provide error context; typed answers and email addresses are excluded. Session replay and tracing remain off. Diagnostic page `/?diagnostics=1` sends one named test event on explicit button click.

## Agentboxd email

Verified end to end: a receipt sent through the live app arrived in the Robro Gmail inbox. Builder benefit active until December 1, 2026. A send-only key scoped to larpy-larpclub@homingbox.net is stored in encrypted Supabase secrets and expires December 1. The backend implements a role-aware, user-requested skills receipt via the official Agentboxd send endpoint. To reconfigure, set `AGENTBOXD_API_KEY` and `AGENTBOXD_INBOX_ID` in Supabase Edge Function secrets. Never put them in public frontend files. The page truthfully reports whether email is configured. Requires a completed role or original mission and explicit one-time email consent. Limits: one per guest/recipient per 24 hours and a global daily cap. It does not subscribe anyone to a newsletter. Provider acceptance means queued, not confirmed delivered.

## Demo (3 minutes)

1. Enter Founder for a Day. Show the premise: “You are the tech person now.”
2. Try an overconfident wrong reply; show the comic consequence and specific explanation.
3. Scope the first release to a working menu and a failure state.
4. In the live demo lab, try POST /demo-snacks (405), then GET /demo-snacks (200). The response is from the actual Supabase Edge Function.
5. Read the JSON, answer the investor without jargon, and open the skills debrief.
6. Create a group challenge and share its code with a judge. Have them submit a fresh inventory answer and refresh the results board.
7. Briefly show the other two playable roles, saved progress, and the receipt email.

See `docs/JUDGING.md` for the rubric mapping and boundaries.

The pitch tool uses local templates, not an AI inference service. The original API practice uses a clearly labelled simulation. The new story request labs make real HTTP requests to a demo API serving labelled sample data. Badges are playful practice acknowledgements, not professional certifications.

Security advisory: RLS is enabled with no client policies because public table privileges are revoked and all access goes through the backend. The corresponding INFO notice is intentional; see [Supabase linter explanation](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy). Live verification covered two separate guests, shared inventory equality, scoring, successful-answer locks, concurrent attempt enforcement, and board field privacy.

QR invites render locally using MIT-licensed qrcode-generator 2.0.4, vendored from the npm registry with tarball SHA-512 integrity verification. No QR generation service receives invite links.

Reliability: cloud/local completion merges by union, saves run serially with snapshots, and stale story/room responses cannot overwrite a later screen. Room result refresh preserves unfinished answers. QR generation loads only when a room opens. Font CSS is discovered from HTML with preconnect hints. Regression tests cover merge idempotence, ordered network saves, navigation during requests, and room-switch races.
