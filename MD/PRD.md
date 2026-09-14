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
