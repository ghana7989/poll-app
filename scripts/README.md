# Development Scripts

## Vote Simulation Script

The `simulate-votes.ts` script allows you to simulate live votes for testing the real-time voting features of your poll app.

### Usage

```bash
npm run simulate-votes <poll-id> [options]
```

### Options

- `--count <number>` - Number of votes to simulate (default: 10)
- `--interval <ms>` - Time between votes in milliseconds (default: 1000)
- `--random-delay` - Add random delay variation (0-2x interval)
- `--help`, `-h` - Show help message

### Examples

**Simulate 10 votes with 1 second interval:**
```bash
npm run simulate-votes abc123
```

**Simulate 50 votes with 500ms interval:**
```bash
npm run simulate-votes abc123 --count 50 --interval 500
```

**Simulate 20 votes with random delays:**
```bash
npm run simulate-votes abc123 --count 20 --random-delay
```

**Quick burst of 100 votes:**
```bash
npm run simulate-votes abc123 --count 100 --interval 100
```

### How It Works

1. The script connects to your Supabase database using credentials from `.dev.vars`
2. Fetches the poll details and available options
3. For each simulated vote:
   - Generates a unique random fingerprint
   - Randomly selects one or more options (respecting the poll's multiple vote setting)
   - Inserts the vote into the database
   - Waits for the specified interval before the next vote

### Requirements

- `.dev.vars` file must be present with valid Supabase credentials
- The poll ID must exist in your database
- The poll must be active and accepting votes

### Development Mode Fingerprinting

The fingerprinting logic has been updated to support development testing:

- **Development Mode**: Generates random fingerprints on each vote, allowing you to test multiple votes from the same browser
- **Production Mode**: Uses FingerprintJS to generate stable browser fingerprints for vote deduplication

The mode is automatically detected based on `import.meta.env.DEV` (Vite's development mode flag).

### Testing Live Updates

1. Start your dev server: `npm run dev`
2. Open a poll page in your browser: `http://localhost:5173/poll/your-poll-id`
3. In a separate terminal, run the simulation script
4. Watch the votes appear in real-time on the poll page!

### Notes

- Simulated votes are anonymous (no user ID)
- Each simulated vote gets a unique fingerprint
- The script respects the poll's `allow_multiple_votes` setting
- Failed votes are logged but don't stop the simulation
