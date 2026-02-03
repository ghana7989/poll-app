#!/usr/bin/env tsx

/**
 * Generate Activity Script
 * 
 * This script generates simulated activity for a poll, including:
 * - Random votes from different "users" (using unique fingerprints)
 * - Discussion comments with varied content
 * 
 * Usage:
 *   npm run generate-activity <poll-slug> [options]
 * 
 * Options:
 *   --votes <number>      Number of votes to generate (default: 20)
 *   --comments <number>   Number of comments to generate (default: 10)
 * 
 * Examples:
 *   npm run generate-activity abc123xyz
 *   npm run generate-activity abc123xyz --votes 50 --comments 20
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

// Sample comment templates for varied discussion
const COMMENT_TEMPLATES = [
  "Great poll! I think {option} is clearly the best choice.",
  "Interesting results! I'm surprised {option} is so popular.",
  "I voted for {option} because it makes the most sense to me.",
  "This is a tough choice between {option} and the others.",
  "I disagree with the majority here. {option} all the way!",
  "Never thought about it this way before. {option} is interesting.",
  "Can someone explain why {option} has so many votes?",
  "{option} definitely deserves more recognition!",
  "I'm torn between a few options, but went with {option}.",
  "The results are closer than I expected! Team {option}!",
  "Hot take: {option} is overrated. Here's why...",
  "Love seeing the diverse opinions here! Go {option}!",
  "Changed my mind after reading the comments. {option} FTW!",
  "This poll made me realize {option} is the obvious answer.",
  "Interesting perspective! I hadn't considered {option} like that.",
];

const SIMPLE_COMMENTS = [
  "Thanks for creating this poll!",
  "Very interesting question!",
  "This is harder to decide than I thought.",
  "Can't wait to see the final results!",
  "Great discussion happening here!",
  "I love seeing everyone's different opinions!",
  "This poll really makes you think.",
  "Fascinating to see the diversity of choices!",
  "Looking forward to more polls like this!",
  "The results are surprising!",
];

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
 * Generate a random comment, optionally mentioning an option
 */
function generateComment(optionLabel?: string): string {
  if (!optionLabel || Math.random() < 0.3) {
    // 30% chance of simple comment without option mention
    return getRandomElement(SIMPLE_COMMENTS);
  }
  
  const template = getRandomElement(COMMENT_TEMPLATES);
  return template.replace("{option}", optionLabel);
}

/**
 * Add a small random delay to avoid rate limiting
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate votes for a poll
 */
async function generateVotes(
  pollId: Id<"polls">,
  options: Array<{ _id: Id<"poll_options">; label: string }>,
  pollType: "single" | "multiple",
  maxSelections: number | undefined,
  count: number
) {
  console.log(`\n📊 Generating ${count} votes...`);
  
  let successful = 0;
  let failed = 0;
  
  for (let i = 0; i < count; i++) {
    try {
      const fingerprint = generateFingerprint();
      
      // Determine how many options to vote for
      let selectedOptions: Id<"poll_options">[];
      
      if (pollType === "single") {
        // Single choice: pick one random option
        selectedOptions = [getRandomElement(options)._id];
      } else {
        // Multiple choice: pick 1 to maxSelections options
        const max = maxSelections || options.length;
        const numToSelect = Math.floor(Math.random() * max) + 1;
        
        // Shuffle and take first N options
        const shuffled = [...options].sort(() => Math.random() - 0.5);
        selectedOptions = shuffled.slice(0, numToSelect).map(opt => opt._id);
      }
      
      await client.mutation(api.votes.cast, {
        pollId,
        optionIds: selectedOptions,
        voterFingerprint: fingerprint,
      });
      
      successful++;
      process.stdout.write(`\r  Progress: ${successful}/${count} votes`);
      
      // Add delay to avoid rate limiting (100-300ms)
      await delay(100 + Math.random() * 200);
    } catch (error: any) {
      failed++;
      if (!error.message?.includes("Rate limit")) {
        console.error(`\n  ⚠️  Vote ${i + 1} failed:`, error.message);
      }
    }
  }
  
  console.log(`\n  ✅ Successfully generated ${successful} votes`);
  if (failed > 0) {
    console.log(`  ⚠️  Failed to generate ${failed} votes`);
  }
}

/**
 * Generate comments for a poll
 */
async function generateComments(
  pollId: Id<"polls">,
  options: Array<{ _id: Id<"poll_options">; label: string }>,
  count: number
) {
  console.log(`\n💬 Generating ${count} comments...`);
  
  let successful = 0;
  let failed = 0;
  
  for (let i = 0; i < count; i++) {
    try {
      const fingerprint = generateFingerprint();
      
      // 70% chance to mention a random option in the comment
      const mentionOption = Math.random() < 0.7;
      const optionLabel = mentionOption ? getRandomElement(options).label : undefined;
      const content = generateComment(optionLabel);
      
      await client.mutation(api.comments.create, {
        pollId,
        content,
        commenterFingerprint: fingerprint,
      });
      
      successful++;
      process.stdout.write(`\r  Progress: ${successful}/${count} comments`);
      
      // Add delay to avoid spam (300-700ms between comments)
      await delay(300 + Math.random() * 400);
    } catch (error: any) {
      failed++;
      console.error(`\n  ⚠️  Comment ${i + 1} failed:`, error.message);
    }
  }
  
  console.log(`\n  ✅ Successfully generated ${successful} comments`);
  if (failed > 0) {
    console.log(`  ⚠️  Failed to generate ${failed} comments`);
  }
}

/**
 * Main function
 */
async function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0].startsWith("--")) {
    console.error("❌ Error: Poll slug is required");
    console.error("\nUsage:");
    console.error("  npm run generate-activity <poll-slug> [options]");
    console.error("\nOptions:");
    console.error("  --votes <number>      Number of votes to generate (default: 20)");
    console.error("  --comments <number>   Number of comments to generate (default: 10)");
    console.error("\nExample:");
    console.error("  npm run generate-activity abc123xyz --votes 50 --comments 20");
    process.exit(1);
  }
  
  const pollSlug = args[0];
  
  // Parse options
  let numVotes = 20;
  let numComments = 10;
  
  for (let i = 1; i < args.length; i += 2) {
    const flag = args[i];
    const value = parseInt(args[i + 1]);
    
    if (flag === "--votes" && !isNaN(value)) {
      numVotes = value;
    } else if (flag === "--comments" && !isNaN(value)) {
      numComments = value;
    }
  }
  
  console.log("🚀 Poll Activity Generator");
  console.log("==========================\n");
  console.log(`Poll Slug: ${pollSlug}`);
  console.log(`Votes to generate: ${numVotes}`);
  console.log(`Comments to generate: ${numComments}`);
  
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
    console.log(`   Options: ${poll.options.length}`);
    console.log(`   Status: ${poll.status}`);
    
    if (poll.status === "closed") {
      console.error("\n⚠️  Warning: This poll is closed. Votes may not be accepted.");
      console.error("Continue anyway? (Press Ctrl+C to cancel, or wait 3 seconds to continue)");
      await delay(3000);
    }
    
    if (!poll.allowComments && numComments > 0) {
      console.log("\n⚠️  Warning: Comments are disabled for this poll. Skipping comments.");
      numComments = 0;
    }
    
    // Generate votes
    if (numVotes > 0) {
      await generateVotes(
        poll._id,
        poll.options,
        poll.type,
        poll.maxSelections,
        numVotes
      );
    }
    
    // Generate comments
    if (numComments > 0) {
      await generateComments(poll._id, poll.options, numComments);
    }
    
    console.log("\n✨ Activity generation complete!");
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
