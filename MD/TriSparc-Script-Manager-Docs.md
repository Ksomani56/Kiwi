# TriSparc Script Manager — Product Documentation

# TriSparc Script Manager — PRD

## 1. Product Overview

TriSparc Script Manager is a lightweight, mobile-first web application for storing, viewing, uploading, and organizing video scripts.

Users can add scripts by pasting text or uploading a `.txt` / `.md` file. The application parses supported script formatting into:

- VO / Spoken dialogue
- On-screen text
- Shots
- Delivery notes

Users can view the structured script and basic script analytics.

The application is hosted online so TriSparc and its clients can access the shared script library.

## 2. Goals

### Primary goals

- Store scripts permanently instead of keeping them inside HTML/JavaScript.
- Make scripts accessible from any device.
- Provide a simple mobile-first script-reading experience.
- Allow users to add scripts through text paste or file upload.
- Structure supported script formatting automatically using a rule-based parser.
- Provide basic script analysis.
- Allow authenticated users to access the application.

### Non-goals

The application is not intended to become:

- A full project-management system.
- An AI writing assistant.
- A video editing tool.
- A production-management system.
- A social/content publishing platform.
- A sophisticated collaboration platform.

## 3. Target Users

### TriSparc team

Can:

- View scripts
- Add scripts
- Upload scripts
- Analyze scripts
- Manage the script library

### Clients

Can:

- Log in
- View available scripts
- Add their own scripts
- View script analysis

V1 can use a shared authenticated script library. Workspace/client separation can be introduced later if required.

## 4. Core Features

### 4.1 Authentication

Basic authentication is required because the application is publicly hosted.

Requirements:

- Login
- Logout
- Persistent session
- Protected application access

No complex authentication flow is required for V1.

### 4.2 Script Library

The home screen displays available scripts.

Each script shows:

- Script title
- Short name
- Duration
- Last updated

Users can select a script to open it.

### 4.3 Search

A simple search field allows searching script content.

Search should work with the current script filters.

### 4.4 Add Script

Users can add a script using either:

#### Paste

Fields:

- Script title
- Short name
- Raw script content

#### File upload

Supported:

- `.txt`
- `.md`

The filename may be used as the default title.

### 4.5 Script Parsing

The application uses a rule-based parser.

Example:

```text
[0-3s] HOOK

Spoken: Our first client paid us ₹3 lakh.

On-screen text: ₹3 LAKH

[SHOT: Person talking to camera.]
```

The parser identifies:

- Timestamp
- Beat title
- Spoken / VO
- On-screen text
- Shot
- Delivery note

The parsed structure is stored in the database.

### 4.6 Script Viewer

When a script is opened, show:

- Script title
- Description
- Duration
- Individual beats
- Timestamp
- Beat title
- VO
- On-screen text
- Shot
- Delivery note

The current prototype's visual structure should remain the reference.

### 4.7 Filters

Provide:

- All
- Spoken
- Text
- Shots

### 4.8 Script Analysis

Basic metrics:

- Total duration
- Number of beats
- Number of spoken/VO sections
- Number of shots
- Number of on-screen text sections
- Word count
- Approximate WPM

Retain a simple time-distribution chart showing duration per beat.

No AI analysis is required.

### 4.9 Persistence

Scripts must persist across:

- Page refresh
- Logout/login
- Different devices

Scripts must not exist only in browser memory.

## 5. Responsive Requirements

The application is mobile-first.

Priority:

Mobile → Tablet → Desktop

### Mobile

- Vertical script library
- Single-column script viewer
- Analytics below script
- Compact menu
- Full-width import form
- Touch-friendly controls

### Desktop

- Preserve the current two-column script + analytics layout where appropriate.

## 6. V1 Success Criteria

V1 is complete when:

1. A user can log in.
2. A user can see saved scripts.
3. A user can open a script.
4. A user can paste a script.
5. A user can upload `.txt` / `.md`.
6. Supported script elements are parsed correctly.
7. Scripts are saved permanently.
8. Scripts are readable on mobile.
9. Basic analytics work.
10. Multiple authenticated users can access the hosted application.


---

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


---

# TriSparc Script Manager — UI PRD

## 1. Design Reference

The current HTML prototype is the primary UI reference.

The production application should retain its overall visual language and interaction patterns rather than introducing a new design.

Retain:

- Typography hierarchy
- White cards
- Slate borders
- Existing blue accent
- Script beat cards
- Filter controls
- Analytics panel
- Import interface
- Mobile slide-out menu
- Desktop two-column layout

The UI should become simpler only by removing features that are outside V1.

## 2. Design Direction

The application should feel:

- Plain
- Clean
- Lightweight
- Functional
- Easy to read
- Mobile-first

The script itself is the primary content.

Avoid decorative UI that does not help the user read or manage scripts.

## 3. Mobile-First Principle

Design from mobile upward:

```text
Mobile
  ↓
Tablet
  ↓
Desktop
```

Do not design desktop first and shrink it for mobile.

Target:

```text
320px+
```

## 4. Mobile Header

Use a compact header.

```text
┌─────────────────────────┐
│ T  TriSparc       ☰     │
└─────────────────────────┘
```

The existing slide-out menu concept should remain.

Menu contains:

```text
Scripts

+ Add Script

Script 1
Script 2
Script 3
```

Avoid adding unnecessary navigation sections.

## 5. Script Library

Mobile layout:

```text
Scripts                         +

Search scripts...

┌──────────────────────────┐
│ Script 1                 │
│ The First Client Crisis  │
│ 55 sec                   │
└──────────────────────────┘

┌──────────────────────────┐
│ Script 2                 │
│ Competing on Speed       │
│ 42 sec                   │
└──────────────────────────┘
```

Cards should use:

- White background
- Thin border
- Small or no shadow
- Comfortable padding
- Large touch target

## 6. Script Viewer

The existing beat-card structure remains the primary viewing UI.

Example:

```text
The First Client Crisis

55 sec

────────────────────

[0-3s] HOOK

ON-SCREEN TEXT
₹3 LAKH. FIRST CLIENT.

SPOKEN
"Our first client paid us ₹3 lakh..."

────────────────────

[3-10s] CONTEXT

SPOKEN
"They wanted a marketplace app..."

────────────────────

SHOT
Kshitij on a call...
```

The script should be easy to scan vertically.

## 7. Filters

Retain:

```text
All   Spoken   Text   Shots
```

On small screens, allow horizontal scrolling if required.

Do not add more filter categories in V1.

## 8. Search

Search should be:

- Easy to locate
- Full-width on mobile
- Fast
- Able to search script content

Placeholder:

```text
Search spoken text, shot notes, overlays...
```

The existing prototype's search behaviour can be retained.

## 9. Analytics

### Desktop

Use the existing two-column concept:

```text
┌─────────────────────────────┬───────────────────────┐
│ Script Content              │ Analytics             │
│                             │                       │
│ Beat                        │ Duration              │
│ Beat                        │ Word count            │
│ Beat                        │ Shot count            │
│                             │ Text count            │
│                             │                       │
│                             │ Chart                 │
└─────────────────────────────┴───────────────────────┘
```

### Mobile

Analytics moves below the script:

```text
Script
  ↓
All beats
  ↓
Analytics
  ↓
Stats
  ↓
Chart
```

Do not put analytics above the script on mobile.

## 10. Add Script

On mobile, the import modal should behave like a full-width/full-screen sheet.

```text
Add Script

Title
[________________]

Short Name
[________________]

Script

[ Paste your script...       ]
[                            ]
[                            ]

Upload .txt / .md

             Cancel   Save
```

Fields stack vertically on mobile.

On desktop, the existing two-column title/short-name layout can remain.

## 11. Typography

Retain the current typography direction:

- Inter for UI
- Outfit for headings
- Fira Code for script/technical content

Prioritize readability on mobile.

## 12. Colors

Use the existing palette:

- White
- Slate
- Light gray
- TriSparc blue

Do not create a different color theme for every script.

One consistent visual system should be used throughout the application.

## 13. Desktop Layout

Desktop may retain the existing layout:

```text
┌─────────────────────────────────────────────────────┐
│ Header                                               │
├─────────────────────────────┬───────────────────────┤
│ Script                      │ Analytics             │
│                             │                       │
│ Beat                        │ Stats                 │
│ Beat                        │                       │
│ Beat                        │ Chart                 │
└─────────────────────────────┴───────────────────────┘
```

The desktop version should feel like an expanded version of the mobile interface, not a separate product.

## 14. UI Principles

### Simple

Every screen has one obvious purpose.

### Content first

The script is more important than the interface around it.

### Mobile first

Controls and layouts must work comfortably on small screens.

### Minimal controls

Only show controls needed for V1.

### Consistent

Use one card system, one typography system, and one color system.

## 15. Features intentionally excluded from the V1 UI

Do not include:

- Teleprompter
- Audio recording
- Master shot-list page
- Script-specific themes
- Complex export systems
- AI analysis
- Advanced collaboration UI
- Project management
- Comments/review system

These can be considered later only if the product actually needs them.
