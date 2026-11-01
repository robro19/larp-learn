# Larp → Learn

**Fake the confidence. Earn the competence.** Built for LarpHacks 2026, main track + intended Render sub-track.

A playful, accessible tech-learning app starring Larpy the Lion. The complete **API Incident** mission turns a buzzword-filled startup pitch into six practical learning steps and an earned skills receipt. Future personas are explicitly marked as future content.

## Run

Node 20 or later. No runtime dependencies or API keys required.

```sh
npm start
```

Open http://localhost:3000. `PORT` overrides the port. `/health` is the deployment health check. Progress is stored locally in the browser. The API exercise is explicitly simulated and does not send requests to a third-party API.

## Deploy on Render

Connect this GitHub repository and create a Blueprint using `render.yaml`, or create a free Node web service with build command `npm install --ignore-scripts` and start command `npm start`. No database required.

## Current integrations

- Render deployment configuration included; deployment must be verified in the dashboard.
- Sentry organization: `robro-0j`, $180 promotional credit claimed. SDK connection pending project creation and a verified DSN. No fake monitoring or placeholder DSNs.
- No paid AI inference required; lessons and feedback are deterministic so the live demo remains reliable.

## Demo (3 minutes)

1. Open the playground. Introduce Larpy and the premise: learners borrow confidence and then earn it.
2. Choose Full-stack founder and deliver a ridiculous startup pitch.
3. Define an API. Send the wrong request to see a 404, then send GET /api/snacks for 200 OK.
4. Read JSON, choose a responsible response to 503, and explain the full flow.
5. Show the credential and actual skills receipt. Refresh to demonstrate persistence.

## Asset

Larpy is an original SVG mascot, included in `public/larpy.svg`. All product code and illustrations are local. Google Fonts is optional; system fonts provide a fallback.
