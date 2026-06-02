# VHI ImagineDiagnostics Portal

Vascular Intelligence Portal powered by Next.js + Claude AI + Healthie via Keragon.

## Deploy to Vercel

1. Upload this folder to your GitHub repo (replace the old `index.html`)
2. Vercel auto-deploys on push

## Environment Variables

Add these in Vercel → Settings → Environment Variables:

| Variable | Value |
|---|---|
| `ANTHROPIC_API_KEY` | Your Anthropic API key from console.anthropic.com |
| `KERAGON_WEBHOOK_SECRET` | A secret string you create (e.g. `vhi-secret-2026`) |

## Connect Healthie via Keragon

Once deployed, your webhook URL is:
```
https://vhi-portal.vercel.app/api/webhook
```

In Keragon:
1. Create a new workflow triggered by Healthie patient events
2. Add an HTTP action pointing to the webhook URL above
3. Add header: `x-keragon-secret: your-secret-value`
4. Map Healthie patient fields to the webhook payload

## API Routes

- `GET /api/patients` — returns all patients (demo or live)
- `POST /api/webhook` — receives patient data from Keragon/Healthie
- `POST /api/chat` — secure AI assistant (keeps API key server-side)

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:3000
