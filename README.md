# NovaProp Website

Simulated prop trading platform website.

## Stack
- Single-file SPA (HTML/CSS/JS)
- Hosted on Vercel
- Clean URL routing via `vercel.json`

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

## Config
Update `novaprop_config.json` (not included — served from CRM)
to update plans, prices, webhook URLs and more.

## OG Image
Replace `og-image.png` with a branded 1200x630 PNG once
final assets are ready.
