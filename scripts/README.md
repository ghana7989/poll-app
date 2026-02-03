# Poll Activity Scripts

This directory contains utility scripts for generating test data and simulating user activity on polls.

## Prerequisites

Make sure you have your Convex deployment URL configured in your `.env.local` file:

```env
VITE_CONVEX_URL=https://your-deployment.convex.cloud
```

## Scripts

### 1. Generate Activity (`generate-activity.ts`)

A comprehensive script that generates both votes and comments for a poll, simulating realistic user engagement.

#### Usage

```bash
npm run generate-activity <poll-slug> [options]
```

#### Options

- `--votes <number>` - Number of votes to generate (default: 20)
- `--comments <number>` - Number of comments to generate (default: 10)

#### Examples

```bash
# Generate default activity (20 votes, 10 comments)
npm run generate-activity abc123xyz

# Generate 50 votes and 20 comments
npm run generate-activity abc123xyz --votes 50 --comments 20

# Generate only votes (no comments)
npm run generate-activity abc123xyz --votes 100 --comments 0

# Generate only comments (no votes)
npm run generate-activity abc123xyz --votes 0 --comments 30
```

#### Features

- **Smart Voting**: Respects poll type (single/multiple choice) and max selections
- **Varied Comments**: Uses templates to generate realistic discussion comments
- **Rate Limiting**: Automatically adds delays to avoid hitting rate limits
- **Progress Tracking**: Shows real-time progress as activity is generated
- **Error Handling**: Gracefully handles errors and continues generating data

---

### 2. Simulate Votes (`simulate-votes.ts`)

A focused script for generating only votes, useful for testing poll results and analytics.

#### Usage

```bash
npm run simulate-votes <poll-slug> [number-of-votes]
```

#### Examples

```bash
# Generate 20 votes (default)
npm run simulate-votes abc123xyz

# Generate 100 votes
npm run simulate-votes abc123xyz 100
```

#### Features

- **Fast Voting**: Optimized for quickly generating large numbers of votes
- **Visual Progress Bar**: Shows a nice progress indicator with percentage
- **Poll Validation**: Checks if poll is active and can accept votes
- **Statistics**: Shows success rate and duration at the end

---

## How It Works

### Fingerprint Generation

Both scripts generate unique fingerprints for each simulated user using cryptographically random values. This ensures:
- Each vote/comment appears to come from a different user
- No duplicate vote errors
- Realistic activity patterns

### Rate Limiting

The scripts include built-in delays to avoid triggering rate limits:
- **Votes**: 100-300ms delay between each vote
- **Comments**: 300-700ms delay between each comment

These delays ensure smooth operation while still generating data quickly.

### Comment Generation

The `generate-activity` script includes templates for varied comments:
- Option-specific comments (70% probability)
- General discussion comments (30% probability)
- Natural language variations

Example generated comments:
- "Great poll! I think Option A is clearly the best choice."
- "Thanks for creating this poll!"
- "I disagree with the majority here. Option B all the way!"

---

## Common Use Cases

### Testing a New Poll

```bash
# Create some initial activity
npm run generate-activity my-new-poll --votes 30 --comments 15
```

### Load Testing

```bash
# Generate a large number of votes
npm run simulate-votes my-poll 500
```

### Populating Discussion

```bash
# Focus on generating comments
npm run generate-activity my-poll --votes 5 --comments 50
```

### Demo/Presentation

```bash
# Quick realistic activity for a demo
npm run generate-activity demo-poll --votes 25 --comments 12
```

---

## Troubleshooting

### "Poll not found" Error

Make sure you're using the correct poll slug (the part after `/poll/` in the URL).

### "Rate limit exceeded" Error

If you see rate limit errors:
1. The scripts already include delays, but you can wait a minute and try again
2. Reduce the number of votes/comments to generate
3. The failed items are tracked and reported at the end

### "Poll is closed" Error

- For `simulate-votes`: This will fail immediately (can't vote on closed polls)
- For `generate-activity`: You'll get a warning but can continue (comments might still work)

### Environment Variable Not Found

Make sure your `.env.local` file exists and contains either:
- `VITE_CONVEX_URL=https://...` 
- or `CONVEX_URL=https://...`

---

## Tips

1. **Start Small**: Test with a small number first to make sure everything works
2. **Use Realistic Numbers**: For demos, 20-50 votes and 10-20 comments look natural
3. **Stagger Activity**: Run the script multiple times for more realistic timestamps
4. **Check Results**: View your poll in the browser to see the generated activity

---

## Technical Details

### Stack
- TypeScript with `tsx` runtime
- Convex Client for database mutations
- Node.js crypto for secure random generation

### Data Generated

**Votes:**
- Unique fingerprint per vote
- Random option selection based on poll type
- Respects single/multiple choice constraints
- Respects max selections setting

**Comments:**
- Unique fingerprint per comment
- Varied content using templates
- Option mentions in 70% of comments
- 1-1000 character length (validated by backend)

---

Happy testing! 🎉
