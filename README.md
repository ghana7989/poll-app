# Pollify - Realtime Poll App

A modern realtime polling application built with React 19, Supabase, and Cloudflare Workers + Pages.

## Features

- 🔴 **Realtime Updates** - Watch votes stream in live via Supabase Realtime
- 📊 **Beautiful Visualizations** - Animated charts with Framer Motion
- 🔒 **Privacy-Respecting** - Browser fingerprinting for vote deduplication
- 🚀 **Global Scale** - Deployed on Cloudflare's edge network
- 🎨 **Modern UI** - Purple/blue color scheme with glassmorphism design
- 📱 **Responsive** - Works seamlessly on mobile and desktop
- 🔐 **Google OAuth** - Secure authentication via Supabase Auth
- 📤 **Share Anywhere** - Link, QR code, and embed options
- ⚡ **Rate Limiting** - Prevents abuse with Supabase Edge Functions

## Tech Stack

### Frontend
- **React 19** + Vite + TypeScript
- **React Router v7** for routing
- **TanStack Query** for server state
- **Zustand** for UI state
- **Framer Motion** for animations
- **Tailwind CSS v4** + shadcn/ui components
- **React Hook Form** + Zod validation
- **react-qr-code** - QR code generation

### Backend
- **Supabase** - PostgreSQL database, Realtime, Auth, Edge Functions
- **Cloudflare Workers + Pages** - Deployment platform
- **FingerprintJS** - Browser fingerprinting for vote deduplication

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Cloudflare account (for deployment)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ghana7989/poll-app.git
cd poll-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.dev.vars` file in the root directory:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_...
APP_URL=http://localhost:5173
APP_NAME=Pollify
```

4. Run database migrations:

The database schema is already created via Supabase MCP. You can view the migration SQL in the plan document.

5. Enable Google OAuth in Supabase:
   - Go to Supabase Dashboard → Authentication → Providers
   - Enable Google provider
   - Add your OAuth credentials from Google Cloud Console

6. Enable Realtime:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE votes;
```

### Development

Start the development server:
```bash
npm run dev
```

Or with Wrangler (matches production environment):
```bash
npm run dev:wrangler
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

### Deployment

The app auto-deploys to Cloudflare Pages on push to the `main` branch.

**Set environment variables in Cloudflare Dashboard:**

1. Go to Workers & Pages → poll-app → Settings → Environment Variables
2. Add:
   - `SUPABASE_URL`
   - `SUPABASE_PUBLISHABLE_DEFAULT_KEY`
   - `APP_URL` (your production URL)
   - `APP_NAME`

**Manual deployment** (if needed):
```bash
npm run deploy
```

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── auth/            # Authentication components
│   ├── poll/            # Poll-specific components
│   └── layout/          # Layout components
├── hooks/               # Custom React hooks
├── pages/               # Page components
├── utils/               # Utilities and helpers
│   ├── config.ts        # Runtime config loader
│   ├── supabase.ts      # Supabase client
│   ├── types.ts         # TypeScript types
│   ├── validators.ts    # Zod schemas
│   ├── constants.ts     # App constants
│   └── fingerprint.ts   # Browser fingerprinting
└── index.ts             # Cloudflare Worker
```

## Key Features Explained

### Environment Variable Strategy

Instead of bundling environment variables at build time, this app uses a Cloudflare Worker to serve configuration at runtime via `/api/config`. This provides:
- Better security (secrets never bundled)
- Runtime configuration changes
- Edge network performance

### Vote Deduplication

- Browser fingerprinting via FingerprintJS
- Unique constraint on `(poll_id, voter_fingerprint)` in database
- LocalStorage for instant UI feedback

### Realtime Updates

- Supabase Realtime subscription on `votes` table
- Updates TanStack Query cache on new votes
- Framer Motion animates bar chart changes

### Rate Limiting

- Supabase Edge Function checks limits
- 10 votes per minute per fingerprint
- 5 polls per 5 minutes per user

## Scripts

- `npm run dev` - Start Vite dev server
- `npm run dev:wrangler` - Start Wrangler dev server (matches production)
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run deploy` - Deploy to Cloudflare Pages
- `npm run lint` - Run ESLint

## License

MIT

## Author

Built with ❤️ by [Your Name]
