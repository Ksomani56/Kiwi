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
