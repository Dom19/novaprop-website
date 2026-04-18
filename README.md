# NovaProp Website

Simulated prop trading platform — novaprop.io

## Stack
- Single-file SPA (HTML/CSS/JS)
- Vercel hosting with clean URL routing
- Morpho API (ProBrokers) for user registration and challenges

## Routes
| URL | Page |
|---|---|
| `/` | Home |
| `/pagos` | Payouts & Cycles |
| `/faq` | FAQ Library |
| `/planes/nebula` | Plan Nebula (3-Step) |
| `/planes/orbit` | Plan Orbit (2-Step) |
| `/planes/nova-prime` | Plan Nova Prime (1-Step) |
| `/planes/supernova` | Plan Supernova (Instant) |
| `/reglas` | Trading Rules |
| `/legal` | AML & Verification |

## Deploy
Push to GitHub → Vercel auto-deploys.

## Environment Variables (Vercel)
Set these in Vercel → Settings → Environment Variables:

| Variable | Value | Required |
|---|---|---|
| `MORPHO_API_KEY` | `pk_live_...` | When available — enables live template sync |

**Never put the API key in config files or source code.**

## Config
Edit `novaprop_config.json` to update:
- Plan prices and sizes
- Morpho template UUIDs (when Morpho provides them)
- Checkout URL pattern
- Fees, payout cycles, banner messages

## Morpho Integration
### Registration (active)
- Endpoint: `POST https://api.morphos.com/api/v1/auth/signup`
- Public endpoint — no API key needed
- Fields: `names`, `surnames`, `email`, `password`, `phone`, `country`, `source`

### Templates / Challenges (ready, pending API key)
- When `MORPHO_API_KEY` is set in Vercel env vars, `/api/templates` 
  fetches live templates from Morpho and the site uses real UUIDs for checkout
- Without the key, the site uses UUIDs from `novaprop_config.json`

### Checkout Flow
1. User clicks "Iniciar Desafío"
2. Site calls `getCheckoutUrl(plan, size)`
3. If UUID available → redirect to `checkoutUrl?template=UUID`
4. If not → open registration modal

## Security
- API key only in Vercel env vars — never in code or config files
- CSP headers configured in HTML meta + Vercel headers
- HSTS enabled via vercel.json
- Honeypot + rate limiting on registration form
- Open redirect protection on checkout redirect
- No sensitive data in console.log

## OG Image
Replace `og-image.png` with updated branding if needed (1200x630px).
