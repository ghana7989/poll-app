# Realtime Poll App — Specification

## Product Vision

A modern realtime polling app. Users create polls, share via link (`/poll/{slug}`), and watch votes stream in live. Clean UI, minimal friction, privacy-respecting.

---

## Tech Stack

### Frontend

- **Framework:** React 19 + Vite + TypeScript
- **Routing:** React Router v7
- **Styling:** Tailwind CSS v4 + shadcn/ui components
- **Animations:** Framer Motion
- **State:** TanStack Query (server state) + Zustand (UI state)
- **Forms:** React Hook Form + Zod validation
- **Icons:** Lucide React
- **Toasts:** Sonner

### Backend

- **Platform:** Supabase (all-in-one)
  - PostgreSQL database
  - Realtime subscriptions (for live vote updates)
  - Auth (Google OAuth)
  - Edge Functions (rate limiting)

### Deployment

- **Frontend:** Cloudflare Pages (free)
- **Backend:** Supabase (free tier)

### Key Packages

```
react, react-dom, react-router
@tanstack/react-query, zustand
framer-motion
tailwindcss, clsx, tailwind-merge
@supabase/supabase-js
react-hook-form, @hookform/resolvers, zod
lucide-react, sonner
qrcode.react (for QR sharing)
@fingerprintjs/fingerprintjs (vote deduplication)
date-fns, nanoid
```

---

## Database Schema

### Tables

**profiles**

- Extends Supabase auth.users
- Fields: id, email, full_name, avatar_url, created_at

**polls**

- id (uuid, primary key)
- slug (unique, auto-generated 8-char alphanumeric)
- creator_id (references profiles)
- title (required, max 200 chars)
- description (optional, max 500 chars)
- type (enum: 'single' | 'multiple')
- visibility (enum: 'public' | 'unlisted' | 'private')
- status (enum: 'active' | 'closed')
- show_results_before_vote (boolean, default true)
- require_auth_to_vote (boolean, default false)
- allow_embed (boolean, default true)
- max_selections (int, for multi-select polls)
- closes_at (timestamp, optional auto-close)
- created_at, updated_at

**poll_options**

- id, poll_id (foreign key)
- label (required, max 100 chars)
- image_url (optional, for future image options)
- position (int, for ordering)

**votes**

- id, poll_id, option_id
- voter_id (nullable, for authenticated votes)
- voter_fingerprint (for duplicate prevention)
- created_at
- Unique constraint on (poll_id, voter_fingerprint)

**rate_limits**

- identifier, action, count, window_start
- Used by edge function for rate limiting

### Key Database Features

- Auto-generate slug on poll creation via trigger
- Auto-update updated_at via trigger
- Auto-create profile on auth signup via trigger
- Enable Realtime on votes table
- RLS policies for access control

---

## App Structure

```
src/
├── components/
│   ├── ui/                 # shadcn/ui primitives
│   ├── poll/               # create-poll-form, results-chart, poll-share-modal, etc.
│   ├── dashboard/          # poll-list, stats-cards, delete-dialog
│   ├── auth/               # auth-guard, login-button, user-menu
│   └── layout/             # app-layout, header, footer
├── hooks/
│   ├── use-auth.ts         # Auth state + Google sign-in
│   ├── use-poll.ts         # Fetch single poll
│   ├── use-polls.ts        # Fetch user's polls
│   ├── use-poll-results.ts # Fetch + realtime vote subscription
│   ├── use-vote.ts         # Submit vote
│   └── use-create-poll.ts  # Create poll
├── lib/
│   ├── supabase.ts         # Client init
│   ├── fingerprint.ts      # Browser fingerprint helper
│   ├── utils.ts            # cn(), formatNumber(), etc.
│   ├── constants.ts        # Limits, config
│   └── validators.ts       # Zod schemas
├── pages/
│   ├── home.tsx            # Landing
│   ├── login.tsx           # Google sign-in
│   ├── create.tsx          # Poll creation (auth required)
│   ├── poll.tsx            # Vote + results (/poll/:slug)
│   ├── dashboard.tsx       # Manage polls (auth required)
│   └── embed.tsx           # Widget (/embed/:slug)
└── App.tsx                 # Routes + providers
```

---

## Pages & Features

### Landing Page (`/`)

- Hero with value prop and CTA
- Feature highlights: instant updates, visual insights, privacy, global scale
- Use case tags: live streams, teams, events, education, product feedback
- CTA button → login if not authed, else create page

### Login Page (`/login`)

- Single "Continue with Google" button
- Centered card, minimal design
- Redirect to dashboard after success

### Create Poll Page (`/create`) — Auth Required

**Main form:**

- Question/title input
- Description textarea (optional)
- Options list with add/remove (min 2, max 20)
- Drag to reorder options
- Single vs. multiple selection toggle
- Max selections dropdown (when multiple)

**Advanced settings (collapsible):**

- Visibility: public / unlisted / private
- Show results before voting: toggle
- Require sign-in to vote: toggle
- Allow embedding: toggle
- Auto-close date: datetime picker

Submit creates poll and redirects to `/poll/{slug}`

### Poll Page (`/poll/:slug`) — Public

**Voting UI (if allowed):**

- Clickable option cards with radio/checkbox style
- Vote button (disabled until selection)
- "Already voted" message if duplicate fingerprint

**Results UI:**

- Animated horizontal bar chart
- Bars reorder by vote count with layout animation
- Live updates via Supabase Realtime subscription
- Percentage + count display
- Leading option highlighted

**Other elements:**

- Share button → modal with link, QR, embed code
- Status badges (closed, unlisted)
- Creator link to dashboard

### Dashboard Page (`/dashboard`) — Auth Required

- Stats: total polls, total votes, active polls
- Poll list with title, status, vote count, date
- Actions per poll: view, share, copy embed, delete
- Delete confirmation dialog
- Empty state with create CTA

### Embed Page (`/embed/:slug`)

- Minimal standalone widget, no app chrome
- Supports `?theme=dark|light` query param
- "Powered by Pollify" footer link
- Embedding only available for logged-in poll creators

---

## Share Flow

Modal with three tabs:

1. **Link:** Copy URL button + native share (mobile)
2. **QR Code:** Scannable QR for poll URL
3. **Embed:** Iframe code snippet (if allow_embed enabled)

URL format: `{domain}/poll/{slug}`

---

## Realtime Implementation

1. Initial page load fetches vote counts via TanStack Query
2. Subscribe to Supabase Realtime channel on `votes` table, filtered by poll_id
3. On INSERT event, update TanStack Query cache (increment option count)
4. Framer Motion animates bar width changes and reordering

---

## Vote Deduplication

- Generate browser fingerprint via FingerprintJS free tier
- Store hashed fingerprint with each vote
- Database unique constraint on (poll_id, voter_fingerprint)
- Also track voted polls in localStorage for instant UI feedback

---

## Rate Limiting

Supabase Edge Function:

- **Voting:** 10 per minute per fingerprint
- **Poll creation:** 5 per 5 minutes per fingerprint

Returns `{ allowed: true }` or `{ allowed: false, retryAfter: seconds }`

---

## Authentication

- Google OAuth only via Supabase Auth
- Profile auto-created on signup (database trigger)
- Required for: creating polls, dashboard, embed code access
- Optional for: voting (configurable per poll)

---

## UI Design Direction

- Dark mode default with glassmorphism cards
- Background: deep dark (#0a0a0f)
- Accents: violet/fuchsia gradient
- Cards: semi-transparent bg, subtle borders, backdrop blur
- Typography: Inter font
- Animations: smooth springs on all transitions
- Mobile-first, thumb-friendly touch targets

---

## Environment Variables

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_APP_URL=
VITE_APP_NAME=Pollify
```

---

## Deployment

### Supabase

1. Create project
2. Enable Google OAuth (add credentials from Google Cloud Console)
3. Run migration (tables, enums, triggers, RLS)
4. Enable Realtime on votes table
5. Deploy rate-limit edge function

### Cloudflare Pages

1. Connect repo
2. Build: `npm run build`
3. Output: `dist`
4. Add env vars
5. Add `_redirects`: `/* /index.html 200`

---

## Future (Not MVP)

- Image options
- Vote velocity analytics
- Poll templates
- Team workspaces
- Webhooks
- Custom themes
- CSV export
