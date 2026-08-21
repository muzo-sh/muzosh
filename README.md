# Your portfolio — muzo.sh

Everything's filled in with your real info already — name, bio, experience,
contacts, and your CV as the downloadable résumé. Nothing left to edit
unless you want to change something. This README is the step-by-step to get
it live on `muzo.sh`.

## What's in this folder

```
portfolio/
├── index.html       the whole page — your content, already filled in
├── styles.css        design system
├── script.js          fetches your live GitHub repos
├── resume.pdf          your CV, linked from the "Download résumé" button
├── api/
│   └── repos.py         Python function: pulls your repos from GitHub
└── README.md
```

`api/repos.py` is a small Python backend — no framework, standard library
only — that calls GitHub's API server-side and returns your top repos as
JSON. `script.js` renders them into the "Selected work" grid automatically.
Right now that grid will likely come back empty or show a "no repos yet"
message, since `github.com/muzo-sh` doesn't have public repos yet — that's
expected, and it'll fill in the moment you push your first one.

## Step 1 — Put this in a GitHub repo

You already have the `muzo-sh` GitHub account, so:

1. Go to github.com → **New repository**. Name it something like
   `portfolio` (the name doesn't matter, it won't show anywhere on the site).
2. Don't initialize it with a README — you already have one.
3. On your computer, in this folder:
   ```bash
   git init
   git add .
   git commit -m "Portfolio site"
   git branch -M main
   git remote add origin https://github.com/muzo-sh/portfolio.git
   git push -u origin main
   ```

If you don't have `git` set up locally yet, GitHub also lets you drag-and-drop
these files directly into a new repo from the browser — click **uploading an
existing file** on the new repo page instead of the steps above.

## Step 2 — Import the project into Vercel

1. Go to vercel.com and log in (same account where you bought the domain).
2. **Add New → Project**.
3. Select **Import Git Repository** and pick the `portfolio` repo you just
   pushed. If Vercel asks to install the GitHub app / connect your GitHub
   account, approve it — that's what lets Vercel redeploy automatically
   whenever you push.
4. Framework preset: leave it as **Other**. There's no build step — Vercel
   will serve `index.html` as-is and detect `api/repos.py` automatically as
   a Python function.
5. Click **Deploy**.

In under a minute you'll get a working URL like
`portfolio-xyz123.vercel.app` — open it and check the page loads and the
GitHub section shows a "no repos yet" message (not an error).

## Step 3 — Connect muzo.sh

1. In the project you just deployed, go to **Settings → Domains**.
2. Type `muzo.sh` and add it.
3. Since you bought the domain through Vercel itself, it's already in your
   Vercel account — it should attach immediately with no DNS records to
   configure. If it asks you to choose between `muzo.sh` and `www.muzo.sh`,
   pick `muzo.sh` as primary; Vercel will redirect the `www` version to it
   automatically.
4. Wait for the status to flip to **Valid** (usually seconds to a couple of
   minutes).

Visit `muzo.sh` — that's your site, live.

## Step 4 — Every future update

Once it's connected, the workflow is just:

```bash
# edit files locally, then:
git add .
git commit -m "describe what changed"
git push
```

Vercel picks up the push automatically and redeploys `muzo.sh` within
seconds — no manual redeploy step, ever.

## Optional — test the Python API locally before pushing

```bash
npm i -g vercel
vercel dev
```

This runs `index.html` and `api/repos.py` together on your machine so you
can see the live GitHub grid working before it's public.

## Notes

- GitHub's API allows 60 unauthenticated requests/hour per IP; the response
  is cached at Vercel's edge for an hour, so normal traffic won't come
  close to that.
- The four dashed "building next" cards under your projects are small,
  realistic things you can actually build and push to `muzo-sh` on GitHub —
  each one will show up in the live grid the moment it's public. Delete a
  card once the real project replaces it.
- If you ever want a contact form that sends real email, that's another
  small Python function next to `repos.py` — say the word when you're ready.
