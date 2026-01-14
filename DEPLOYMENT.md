# Deployment Guide

## ✅ What's Already Done

Your poll app is fully built and ready to deploy! Here's what's been completed:

### Infrastructure ✅
- Cloudflare Workers + Pages configured
- Wrangler setup complete
- Auto-deployment from GitHub configured
- Environment configuration via `/api/config` endpoint

### Database ✅
- Supabase project created
- Database schema migrated (tables, triggers, RLS policies)
- Realtime enabled on votes table
- TypeScript types generated

### Application ✅
- Full React app with all pages and components
- Authentication with Google OAuth
- Poll creation, voting, and results
- Realtime vote updates
- Dashboard with stats
- Share modals (link, QR, embed)
- Purple/blue theme with glassmorphism
- Framer Motion animations
- Rate limiting edge function

## 🚀 Deployment Steps

### 1. Set Production Environment Variables

Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) → Workers & Pages → poll-app → Settings → Environment Variables

Add these variables:

```
SUPABASE_URL=https://xqmdxramdiaqfgwlyzgn.supabase.co
SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_6xxUMjULGYursn1cCU05kQ_ndEBRfCF
APP_URL=https://your-production-url.pages.dev
APP_NAME=Pollify
```

### 2. Enable Google OAuth in Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to: Authentication → Providers → Google
3. Add your production URL to authorized redirect URLs:
   ```
   https://your-production-url.pages.dev/**
   ```

### 3. Deploy Supabase Edge Function (Optional - Rate Limiting)

If you want to add rate limiting, deploy the edge function:

```bash
# Install Supabase CLI if needed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref xqmdxramdiaqfgwlyzgn

# Deploy the rate-limit function
supabase functions deploy rate-limit
```

### 4. Deploy to Cloudflare Pages

Your app is configured for auto-deployment! Just push to GitHub:

```bash
git add .
git commit -m "Initial deployment"
git push origin main
```

Cloudflare Pages will automatically:
- Build your app (`npm run build`)
- Deploy to the edge network
- Provide a URL like `https://poll-app-xyz.pages.dev`

**Manual deployment (if needed):**
```bash
npm run deploy
```

## 🔧 Configuration

### Local Development

```bash
# Start dev server
npm run dev

# Or with Wrangler (matches production)
npm run dev:wrangler
```

Your `.dev.vars` file is already configured for local development.

### Database Schema

The database is already set up with:
- ✅ 5 tables (profiles, polls, poll_options, votes, rate_limits)
- ✅ Enums (poll_type, poll_visibility, poll_status)
- ✅ Triggers (slug generation, timestamps, profile creation)
- ✅ RLS policies (secure access control)
- ✅ Indexes (optimized queries)
- ✅ Realtime enabled

## 📊 Monitoring

### Cloudflare Analytics
- Dashboard → Workers & Pages → poll-app → Analytics
- View requests, bandwidth, errors

### Supabase Logs
- Dashboard → Logs
- View database queries, auth events, realtime connections

## 🐛 Troubleshooting

### Build Fails
```bash
# Check TypeScript errors
npm run type-check

# Check linting
npm run lint
```

### Environment Variables Not Working
1. Verify variables are set in Cloudflare Dashboard
2. Redeploy after changing variables
3. Check `/api/config` endpoint returns correct values

### Google OAuth Not Working
1. Verify OAuth credentials in Google Cloud Console
2. Add production URL to authorized redirect URIs
3. Update Supabase Auth settings with production URL

### Realtime Not Working
1. Verify `votes` table is in realtime publication:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE votes;
```

## 📝 Next Steps

1. **Test the Production App**
   - Create a poll
   - Vote from multiple devices
   - Check realtime updates
   - Test share functionality

2. **Optional Enhancements**
   - Set up custom domain in Cloudflare
   - Add analytics tracking
   - Set up error monitoring (e.g., Sentry)
   - Configure CDN caching rules

3. **Scale Considerations**
   - Monitor Supabase usage
   - Consider upgrading Supabase plan for higher limits
   - Cloudflare Pages free tier includes:
     - Unlimited requests
     - Unlimited bandwidth
     - 500 builds/month

## 🎉 Your App is Ready!

All the code is built and working. The app will auto-deploy when you push to GitHub. Just set the production environment variables in Cloudflare Dashboard and you're live!

**Production URL will be:** `https://poll-app-[random].pages.dev`

You can add a custom domain in Cloudflare Dashboard → Workers & Pages → poll-app → Custom domains.
