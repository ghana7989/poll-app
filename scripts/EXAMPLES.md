# Script Usage Examples

Quick reference for common scenarios when using the poll activity scripts.

## Quick Start

First, create a poll in your app (or find an existing one). Note its slug from the URL.

For example, if your poll URL is: `http://localhost:5173/poll/abc123xyz`  
Then your poll slug is: `abc123xyz`

---

## Basic Examples

### Generate Default Activity
```bash
npm run generate-activity abc123xyz
```
This generates:
- 20 random votes
- 10 varied comments

### Just Generate Votes
```bash
npm run simulate-votes abc123xyz
```
This generates:
- 20 random votes (default)

---

## Advanced Examples

### Heavy Vote Testing
```bash
# Simulate 100 voters
npm run simulate-votes abc123xyz 100

# Or using the full script
npm run generate-activity abc123xyz --votes 100 --comments 0
```

### Discussion-Heavy Poll
```bash
# Generate lots of discussion with fewer votes
npm run generate-activity abc123xyz --votes 10 --comments 50
```

### Realistic Demo Setup
```bash
# Phase 1: Initial burst of activity
npm run generate-activity abc123xyz --votes 25 --comments 8

# Wait a minute or two, then add more
# Phase 2: More votes come in
npm run simulate-votes abc123xyz 15

# Phase 3: Discussion picks up
npm run generate-activity abc123xyz --votes 5 --comments 10
```

### Load Test
```bash
# Test with high volume
npm run generate-activity abc123xyz --votes 200 --comments 50
```

---

## Multi-Poll Scenarios

### Populate Multiple Polls

Create a simple bash script:

```bash
#!/bin/bash
# populate-all.sh

polls=("abc123xyz" "def456uvw" "ghi789rst")

for poll in "${polls[@]}"
do
  echo "Populating poll: $poll"
  npm run generate-activity "$poll" --votes 30 --comments 15
  echo "Waiting 5 seconds..."
  sleep 5
done

echo "All polls populated!"
```

Then run:
```bash
chmod +x populate-all.sh
./populate-all.sh
```

### Different Activity Levels

```bash
# High engagement poll
npm run generate-activity poll-a --votes 100 --comments 40

# Medium engagement poll
npm run generate-activity poll-b --votes 50 --comments 20

# Low engagement poll
npm run generate-activity poll-c --votes 15 --comments 5
```

---

## Use Cases

### 🎨 Before a Demo
```bash
# Make your poll look active and interesting
npm run generate-activity demo-poll --votes 35 --comments 12
```

### 🧪 Testing Analytics
```bash
# Generate enough data to test charts and statistics
npm run simulate-votes test-poll 150
```

### 💬 Testing Live Comments
```bash
# Focus on comment functionality
npm run generate-activity chat-poll --votes 5 --comments 30
```

### 📊 Testing Different Poll Types

For a single-choice poll:
```bash
# Each vote picks one option
npm run simulate-votes single-choice-poll 50
```

For a multiple-choice poll:
```bash
# Each vote can pick multiple options
npm run simulate-votes multi-choice-poll 50
```

### 🔥 Stress Testing
```bash
# Push the limits
npm run generate-activity stress-test --votes 500 --comments 100
```

---

## Monitoring Progress

Both scripts show real-time progress:

**simulate-votes.ts:**
```
[████████████████████████████████░░] 84% (42/50)
```

**generate-activity.ts:**
```
📊 Generating 50 votes...
  Progress: 42/50 votes

💬 Generating 20 comments...
  Progress: 15/20 comments
```

---

## Tips & Best Practices

1. **Start Small**: Always test with 5-10 items first
   ```bash
   npm run generate-activity test-poll --votes 5 --comments 3
   ```

2. **Stagger Activity**: Run multiple times for realistic timestamps
   ```bash
   npm run simulate-votes my-poll 20
   # Wait 2 minutes
   npm run simulate-votes my-poll 15
   # Wait 1 minute
   npm run generate-activity my-poll --votes 10 --comments 8
   ```

3. **Check Your Work**: Visit the poll in browser after each run
   ```
   http://localhost:5173/poll/your-poll-slug
   ```

4. **Respect Rate Limits**: The scripts handle this automatically, but if you see errors:
   - Wait 1 minute between runs
   - Reduce the numbers
   - Let the script finish before running again

5. **Mix It Up**: Use both scripts for variety
   ```bash
   npm run simulate-votes poll-1 30      # Quick votes
   npm run generate-activity poll-1 --votes 0 --comments 15  # Add discussion
   ```

---

## Troubleshooting

### Nothing happens?
- Check that your poll slug is correct
- Verify `.env.local` has `VITE_CONVEX_URL`
- Make sure Convex backend is running (`npx convex dev`)

### Votes/comments not showing?
- Refresh your browser
- Check the console for errors
- Verify the poll isn't closed

### Script running slow?
- This is normal! Rate limiting adds delays
- For 100 votes, expect ~20-30 seconds
- Comments are slower (they're more spaced out)

### Getting rate limit errors?
- Wait 1 minute and try again
- The limits reset after the time window
- Scripts already include optimal delays

---

## Clean Up

If you generated too much test data and want to start fresh, you can either:

1. Create a new poll
2. Manually delete the poll and recreate it
3. Use the Convex dashboard to clear data (advanced)

---

Happy polling! 🎉
