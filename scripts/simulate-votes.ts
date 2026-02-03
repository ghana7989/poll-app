#!/usr/bin/env tsx

/**
 * Simulate Votes Script
 * 
 * A simpler script focused solely on generating votes for a poll.
 * 
 * Usage:
 *   npm run simulate-votes <poll-slug> [number-of-votes]
 * 
 * Examples:
 *   npm run simulate-votes abc123xyz
 *   npm run simulate-votes abc123xyz 100
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import * as dotenv from "dotenv";
import { randomBytes } from "crypto";

// Load environment variables
dotenv.config({ path: ".env.local" });

// Initialize Convex client
const CONVEX_URL = process.env.VITE_CONVEX_URL || process.env.CONVEX_URL;
if (!CONVEX_URL) {
  console.error("❌ Error: VITE_CONVEX_URL or CONVEX_URL environment variable not found");
  console.error("Please set it in your .env.local file");
  process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);

/**
 * Generate a unique fingerprint for each simulated user
 */
function generateFingerprint(): string {
  return randomBytes(16).toString("hex");
}

/**
 * Get a random element from an array
 */
function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Add a small random delay to avoid rate limiting
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Main function
 */
async function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error("❌ Error: Poll slug is required");
    console.error("\nUsage:");
    console.error("  npm run simulate-votes <poll-slug> [number-of-votes]");
    console.error("\nExample:");
    console.error("  npm run simulate-votes abc123xyz 50");
    process.exit(1);
  }
  
  const pollSlug = args[0];
  const numVotes = parseInt(args[1]) || 20;
  
  console.log("🗳️  Vote Simulator");
  console.log("=================\n");
  console.log(`Poll Slug: ${pollSlug}`);
  console.log(`Votes to generate: ${numVotes}`);
  
  try {
    // Fetch poll data
    console.log("\n🔍 Fetching poll data...");
    const poll = await client.query(api.polls.get, { slug: pollSlug });
    
    if (!poll) {
      console.error(`❌ Error: Poll with slug "${pollSlug}" not found`);
      process.exit(1);
    }
    
    console.log(`✅ Found poll: "${poll.title}"`);
    console.log(`   Type: ${poll.type}`);
    console.log(`   Options: ${poll.options.map(o => o.label).join(", ")}`);
    console.log(`   Status: ${poll.status}`);
    
    if (poll.status === "closed") {
      console.error("\n❌ Error: This poll is closed and cannot accept votes.");
      process.exit(1);
    }
    
    if (poll.closesAt && poll.closesAt < Date.now()) {
      console.error("\n❌ Error: This poll has expired and cannot accept votes.");
      process.exit(1);
    }
    
    console.log(`\n📊 Generating ${numVotes} votes...`);
    console.log("This may take a while due to rate limiting...\n");
    
    let successful = 0;
    let failed = 0;
    const startTime = Date.now();
    
    for (let i = 0; i < numVotes; i++) {
      try {
        const fingerprint = generateFingerprint();
        
        // Determine which options to vote for
        let selectedOptions: Id<"poll_options">[];
        
        if (poll.type === "single") {
          // Single choice: pick one random option
          selectedOptions = [getRandomElement(poll.options)._id];
        } else {
          // Multiple choice: pick 1 to maxSelections options
          const max = poll.maxSelections || poll.options.length;
          const numToSelect = Math.floor(Math.random() * max) + 1;
          
          // Shuffle and take first N options
          const shuffled = [...poll.options].sort(() => Math.random() - 0.5);
          selectedOptions = shuffled.slice(0, numToSelect).map(opt => opt._id);
        }
        
        await client.mutation(api.votes.cast, {
          pollId: poll._id,
          optionIds: selectedOptions,
          voterFingerprint: fingerprint,
        });
        
        successful++;
        
        // Progress indicator
        const percent = Math.round((successful / numVotes) * 100);
        const bar = "█".repeat(Math.floor(percent / 2)) + "░".repeat(50 - Math.floor(percent / 2));
        process.stdout.write(`\r  [${bar}] ${percent}% (${successful}/${numVotes})`);
        
        // Add delay to avoid rate limiting (100-300ms)
        await delay(100 + Math.random() * 200);
      } catch (error: any) {
        failed++;
        if (!error.message?.includes("Rate limit")) {
          console.error(`\n  ⚠️  Vote ${i + 1} failed:`, error.message);
        }
      }
    }
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    
    console.log(`\n\n✨ Voting simulation complete!`);
    console.log(`   Successful: ${successful} votes`);
    if (failed > 0) {
      console.log(`   Failed: ${failed} votes`);
    }
    console.log(`   Duration: ${duration}s`);
    console.log(`\nView your poll at: /poll/${pollSlug}`);
    
  } catch (error: any) {
    console.error("\n❌ Error:", error.message);
    process.exit(1);
  }
}

// Run the script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
