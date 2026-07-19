# The Inner Grail — the PUBLIC version (live AI for everyone)

This folder is a complete, deployable web app. Unlike the claude.ai artifact
(which is sandboxed and cannot call a live AI), this runs on real web hosting, so
the **Oracle answers with the live Gemini AI for every visitor**.

```
grail_public/
  index.html        the app (the Oracle calls /api/oracle)
  api/oracle.js     the serverless Oracle — calls Gemini with a SERVER-SIDE key
  vercel.json       host config
  package.json
```

The Gemini key lives **only on the server** (an environment variable) — it is
never in the page, never sent to the browser, never exposed to visitors.

---

## Deploy on Vercel (free tier — the easiest path)

**Option A — one command (needs Node installed):**
1. Install the CLI once:  `npm i -g vercel`
2. In this folder:        `vercel`   (log in when prompted; accept the defaults)
3. Add your key:          `vercel env add GEMINI_API_KEY`  → paste your Gemini API key → choose "Production"
4. Ship it:               `vercel --prod`
5. Vercel prints your public URL (e.g. `https://the-inner-grail.vercel.app`). Share it. The Oracle is live.

**Option B — no command line (the dashboard):**
1. Put this `grail_public` folder in a GitHub repo (its own repo is cleanest).
2. Go to vercel.com → **Add New… → Project** → import that repo.
3. In the project's **Settings → Environment Variables**, add
   `GEMINI_API_KEY` = your Gemini API key.
4. **Deploy.** Vercel gives you the public URL.

**Get a Gemini API key** (free tier): https://aistudio.google.com/apikey

---

## It also works on Netlify or Cloudflare Pages
The only host-specific piece is the function folder:
- **Netlify:** move `api/oracle.js` to `netlify/functions/oracle.js`, and in
  `index.html` the two fetches to `/api/oracle` become `/.netlify/functions/oracle`
  (or add a `netlify.toml` redirect `/api/oracle -> /.netlify/functions/oracle`).
  Set `GEMINI_API_KEY` in Site settings → Environment.
- **Cloudflare Pages:** put the function at `functions/api/oracle.js` (Pages
  Functions already route `/api/*`), set `GEMINI_API_KEY` as a Pages env var.

---

## What the visitor gets
- Merlin's onboarding → their seat at the Round Table.
- The wheel, Today's Quest (from real transits), the Dream Gate, the shareable Seat Card.
- **The Oracle:** they type what's arising → the **live AI** reads it, names the
  seat, explains the mirror and the transit, and writes the full nine-verse decree.
  The Oracle screen shows a green **"Living AI Oracle connected — gemini"** banner
  once the server confirms.

## Cost & limits
- Vercel/Netlify/Cloudflare free tiers cover a generous amount of traffic.
- Gemini's free tier has a daily request cap; for heavy public use, enable
  billing on the Google AI key or swap `GRAIL_GEMINI_MODEL` / add an
  `ANTHROPIC_API_KEY` lane in `api/oracle.js`.
