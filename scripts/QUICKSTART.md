# Quick Start Guide 🚀

Get started with poll activity generation in 60 seconds!

## Step 1: Get Your Poll Slug

1. Open your poll app in the browser
2. Navigate to any poll or create a new one
3. Copy the slug from the URL

Example URL: `http://localhost:5173/poll/abc123xyz`  
→ Your slug: `abc123xyz`

## Step 2: Run Your First Script

### Option A: Full Activity (Recommended for Demos)

```bash
npm run generate-activity abc123xyz
```

This creates:
- ✅ 20 random votes
- ✅ 10 varied discussion comments
- ✅ Takes ~10-15 seconds

### Option B: Just Votes (Recommended for Testing)

```bash
npm run simulate-votes abc123xyz
```

This creates:
- ✅ 20 random votes
- ✅ Takes ~5-8 seconds

## Step 3: Check the Results

1. Refresh your poll page in the browser
2. You should see:
   - Updated vote counts
   - Chart bars animated
   - Comments in the discussion section
   - Live activity!

---

## Next Steps

### Want More Activity?

```bash
# 50 votes and 20 comments
npm run generate-activity abc123xyz --votes 50 --comments 20
```

### Want Just Comments?

```bash
# No votes, only comments
npm run generate-activity abc123xyz --votes 0 --comments 30
```

### Want High Volume?

```bash
# 100 votes for load testing
npm run simulate-votes abc123xyz 100
```

---

## Understanding the Output

You'll see something like this:

```
🚀 Poll Activity Generator
==========================

Poll Slug: abc123xyz
Votes to generate: 20
Comments to generate: 10

🔍 Fetching poll data...
✅ Found poll: "What's your favorite color?"
   Type: single
   Options: 4
   Status: active

📊 Generating 20 votes...
  Progress: 20/20 votes
  ✅ Successfully generated 20 votes

💬 Generating 10 comments...
  Progress: 10/10 comments
  ✅ Successfully generated 10 comments

✨ Activity generation complete!

View your poll at: /poll/abc123xyz
```

---

## Common Patterns

### For a Demo/Presentation

```bash
npm run generate-activity demo-poll --votes 35 --comments 12
```

### For Load Testing

```bash
npm run simulate-votes test-poll 100
```

### For Testing Comments UI

```bash
npm run generate-activity chat-poll --votes 5 --comments 30
```

### For Realistic Timeline (Staggered)

```bash
# First batch
npm run simulate-votes my-poll 20

# Wait 1-2 minutes, then add more
npm run simulate-votes my-poll 15

# Add some discussion
npm run generate-activity my-poll --votes 5 --comments 10
```

---

## Troubleshooting

### ❌ "Poll not found"
→ Double-check your poll slug is correct

### ❌ "VITE_CONVEX_URL not found"  
→ Your `.env.local` is already set up correctly! This shouldn't happen.

### ❌ "Rate limit exceeded"
→ Scripts have delays built-in, this is rare. Wait 1 minute and try again.

### ❌ "Poll is closed"
→ Closed polls can't accept votes. Open it or use a different poll.

---

## What Each Script Does

### `generate-activity` 
**Best for:** Demos, full simulations, testing everything  
**Creates:** Votes + Comments  
**Speed:** Moderate (has delays for realism)

### `simulate-votes`
**Best for:** Quick tests, load testing, analytics testing  
**Creates:** Only votes  
**Speed:** Fast (optimized for volume)

---

## Example Session

```bash
# Create a new poll in your app
# Get the slug, let's say it's "xyz789"

# Add some initial activity
$ npm run generate-activity xyz789

# Watch in browser - refresh to see results
# Looks good! Add more votes

$ npm run simulate-votes xyz789 30

# Need more discussion
$ npm run generate-activity xyz789 --votes 0 --comments 15

# Perfect! Poll is now active and engaging
```

---

## Pro Tips

1. **Start small**: Always test with 5-10 items first
2. **Check your work**: Refresh browser after each run
3. **Mix it up**: Use both scripts for variety
4. **Stagger it**: Run multiple times for realistic timestamps
5. **Read the docs**: See `README.md` for advanced usage

---

## Documentation Files

- **`QUICKSTART.md`** (this file) - Get started fast
- **`README.md`** - Complete documentation
- **`EXAMPLES.md`** - Real-world use cases
- **`SUMMARY.md`** - Technical deep-dive

---

## One-Liners for Common Tasks

```bash
# Quick demo setup
npm run generate-activity <slug> --votes 30 --comments 10

# Load test
npm run simulate-votes <slug> 100

# Discussion focus
npm run generate-activity <slug> --votes 5 --comments 40

# Minimal test
npm run generate-activity <slug> --votes 5 --comments 3
```

---

## That's It! 

You're ready to generate poll activity. Just remember:

1. Get your poll slug
2. Run the appropriate script
3. Refresh your browser
4. Enjoy the activity!

For more details, check out the other docs in this folder.

Happy polling! 🎉
