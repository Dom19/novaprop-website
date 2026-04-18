// /api/templates.js
// Vercel Serverless Function — Morpho Templates Proxy
//
// SETUP:
//   1. Add this file to your repo at /api/templates.js
//   2. In Vercel dashboard → Settings → Environment Variables:
//      Add: MORPHO_API_KEY = pk_live_YOUR_KEY_HERE
//   3. The site will automatically start loading live templates
//
// HOW IT WORKS:
//   - Site calls GET /api/templates (same origin, no key exposed)
//   - This function calls Morpho with the key from env vars
//   - Returns filtered template data (no sensitive fields)
//   - Caches response for 5 minutes to avoid rate limits

const MORPHO_API_BASE = 'https://api.morphos.com/api/v1';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

let _cache = null;
let _cacheTime = 0;

export default async function handler(req, res) {
  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS — only allow novaprop.io
  const origin = req.headers.origin || '';
  const allowedOrigins = [
    'https://novaprop.io',
    'https://www.novaprop.io',
    // Allow Vercel preview URLs for testing
    /\.vercel\.app$/
  ];
  const isAllowed = allowedOrigins.some(o =>
    typeof o === 'string' ? o === origin : o.test(origin)
  );
  res.setHeader('Access-Control-Allow-Origin', isAllowed ? origin : 'https://novaprop.io');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Vary', 'Origin');

  // Check cache
  const now = Date.now();
  if (_cache && (now - _cacheTime) < CACHE_TTL) {
    res.setHeader('X-Cache', 'HIT');
    res.setHeader('Cache-Control', 'public, max-age=300');
    return res.status(200).json(_cache);
  }

  // Check API key
  const apiKey = process.env.MORPHO_API_KEY;
  if (!apiKey) {
    // Key not configured — return empty array (site falls back to config.json)
    return res.status(200).json([]);
  }

  try {
    const morphoRes = await fetch(
      `${MORPHO_API_BASE}/challenges/templates?visible=true&active=true&limit=100`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!morphoRes.ok) {
      console.error('[NovaProp API] Morpho templates error:', morphoRes.status);
      return res.status(200).json(_cache || []); // Return stale cache if available
    }

    const templates = await morphoRes.json();
    if (!Array.isArray(templates)) {
      return res.status(200).json([]);
    }

    // Filter to only return what the frontend needs
    // Never forward the full template object (contains broker config etc.)
    const filtered = templates
      .filter(t => t.isActive !== false && t.isPublic !== 0)
      .map(t => ({
        uuid:           t.uuid,
        price:          t.price,
        profitTarget:   t.profitTarget,
        maxDailyLoss:   t.maxDailyLoss,
        maxOverallLoss: t.maxOverallLoss,
        minTradingDays: t.minTradingDays,
        planUuid:       t.planUuid,
        phaseUuid:      t.phaseUuid,
        equityUuid:     t.equityUuid,
        plan: t.plan ? {
          uuid: t.plan.uuid,
          name: t.plan.name
        } : null,
        phase: t.phase ? {
          uuid: t.phase.uuid,
          name: t.phase.name
        } : null,
        equity: t.equity ? {
          uuid:  t.equity.uuid,
          name:  t.equity.name,
          price: t.equity.price
        } : null
      }));

    // Update cache
    _cache = filtered;
    _cacheTime = now;

    res.setHeader('X-Cache', 'MISS');
    res.setHeader('Cache-Control', 'public, max-age=300');
    return res.status(200).json(filtered);

  } catch (err) {
    console.error('[NovaProp API] Error fetching templates:', err.message);
    // Return stale cache or empty on error
    return res.status(200).json(_cache || []);
  }
}
