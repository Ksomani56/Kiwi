# Kiwi — Script Manager

Lightweight, mobile-first script manager for TriSparc and clients.

**Stack:** HTML · CSS · Vanilla JS · Supabase · Vercel

---

## Setup

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase_setup.sql`
3. Go to **Settings → API** and copy your **Project URL** and **anon key**

### 2. Configure credentials

Open `js/supabase.js` and replace:

```js
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

### 3. Create a user

In Supabase → **Authentication → Users**, click **Add User** and create a login.

### 4. Run locally

Just open `index.html` in a browser — no build step required.

### 5. Deploy to Vercel

```bash
# Push to GitHub, then connect the repo in vercel.com
# No build command needed — it's a static site
```

---

## Script Format

```
[0-3s] HOOK

Spoken: Your spoken line here.
On-screen text: BIG TEXT ON SCREEN
[SHOT: Close-up of laptop.]
Note: Deliver with energy.

[3-10s] CONTEXT

Spoken: Second beat spoken line.
```

---

## Project Structure

```
Kiwi/
├── index.html
├── css/styles.css
├── js/
│   ├── supabase.js   ← credentials
│   ├── api.js        ← Supabase queries
│   ├── parser.js     ← script parser + analytics
│   └── app.js        ← UI controller
└── supabase_setup.sql
```
