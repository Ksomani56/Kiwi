# TriSparc Script Manager — TRD

## 1. Technical Philosophy

The application should remain lightweight.

There is no requirement for a traditional backend server or a frontend framework.

Recommended architecture:

```text
Browser
  |
  +-- HTML
  +-- Tailwind CSS
  +-- Vanilla JavaScript
  |
  v
Supabase
  +-- Authentication
  +-- PostgreSQL
```

Hosting:

```text
GitHub
   |
   v
Vercel
   |
   v
Static Web App
   |
   v
Supabase
```

## 2. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | HTML |
| Styling | Tailwind CSS |
| Application logic | Vanilla JavaScript |
| Authentication | Supabase Auth |
| Database | Supabase PostgreSQL |
| File handling | Browser FileReader |
| Charts | Chart.js |
| Hosting | Vercel |

### Explicitly not required

- React
- Next.js
- Node.js backend
- Python backend
- AI API
- Redis
- Docker
- Microservices
- Elasticsearch

## 3. Database

### 3.1 `scripts`

Suggested fields:

```text
id
title
short_title
description
raw_content
duration
word_count
created_by
created_at
updated_at
```

### 3.2 `script_beats`

Suggested fields:

```text
id
script_id
sequence
start_sec
end_sec
title
spoken
on_screen
shot
delivery_note
wpm
```

Relationship:

```text
scripts
   |
   +-- script_beats
          +-- beat 1
          +-- beat 2
          +-- beat 3
          +-- ...
```

### 3.3 Authentication

Use Supabase Auth.

No custom password/authentication system is required.

## 4. Application Data Flow

### Opening the application

```text
User
  |
  v
Authentication
  |
  v
Fetch scripts
  |
  v
Script library
  |
  v
Select script
  |
  v
Fetch script + beats
  |
  v
Render script
```

### Adding a script

```text
Paste / Upload
      |
      v
Raw text
      |
      v
Rule-based parser
      |
      v
Structured beats
      |
      v
Calculate analytics
      |
      v
Save script
      |
      v
Save beats
      |
      v
Open script
```

## 5. Parser

The parser runs client-side.

### Supported input

```text
[0-3s] HOOK

Spoken: Our first client paid us ₹3 lakh.

On-screen text: ₹3 LAKH

[SHOT: Close-up of laptop.]
```

### Parsed representation

```javascript
{
  time: "[0-3s]",
  title: "HOOK",
  startSec: 0,
  endSec: 3,
  spoken: "Our first client paid us ₹3 lakh.",
  onScreen: "₹3 LAKH",
  shot: "Close-up of laptop.",
  deliveryNote: null,
  wpm: 0
}
```

The existing parser is the starting point, but its regex rules should be cleaned up and made tolerant of reasonable formatting variations.

## 6. Analytics

Analytics are calculated in JavaScript.

### Duration

Use the final beat's `endSec`.

### Word count

Count words in all spoken sections.

### WPM

```text
(words / duration) × 60
```

### Shot count

Count beats containing a shot.

### On-screen count

Count beats containing on-screen text.

## 7. File Upload

V1 supports:

```text
.txt
.md
```

The browser reads the file as text.

The original file does not need to be permanently stored for V1.

The parsed script and raw content are stored in the database.

## 8. Security

Supabase Row Level Security should be enabled.

Minimum behaviour:

```text
Unauthenticated
      |
      X
Cannot access scripts

Authenticated
      |
      v
Can access scripts
```

The frontend must not contain the production script database as hard-coded JavaScript.

## 9. Hosting

Recommended:

**Vercel**

Deployment flow:

```text
Local project
     |
     v
GitHub
     |
     v
Vercel
     |
     v
Production
```

Supabase is configured separately.

## 10. Performance

The application should remain lightweight.

Requirements:

- Avoid unnecessary dependencies.
- Load only required script data.
- Calculate analytics for the active script.
- Minimize animations.
- Prioritize mobile performance.
- Avoid large libraries unless required.

## 11. Project Structure

Suggested structure:

```text
trisparc-script-manager/
│
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   ├── parser.js
│   ├── analytics.js
│   ├── supabase.js
│   └── ui.js
│
├── assets/
│
└── README.md
```

The application can remain even simpler if splitting files is unnecessary during initial development.
