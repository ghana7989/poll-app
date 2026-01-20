import type { QueryCtx, MutationCtx } from "./_generated/server";
import { auth } from "./auth";
import type { Id } from "./_generated/dataModel";

/**
 * Generate a unique slug for a poll
 * Uses nanoid-style approach with random characters
 */
export async function generateUniqueSlug(
  ctx: MutationCtx
): Promise<string> {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  const length = 8;
  
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    let slug = "";
    for (let i = 0; i < length; i++) {
      slug += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    // Check if slug already exists
    const existing = await ctx.db
      .query("polls")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
    
    if (!existing) {
      return slug;
    }
    
    attempts++;
  }
  
  // Fallback: use timestamp + random
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  return `${timestamp}-${random}`;
}

/**
 * Check and enforce rate limits
 * @param ctx - Mutation context
 * @param identifier - User fingerprint or user ID
 * @param action - Action type (e.g., "vote", "create_poll")
 * @param maxCount - Maximum allowed actions
 * @param windowMs - Time window in milliseconds
 */
export async function checkRateLimit(
  ctx: MutationCtx,
  identifier: string,
  action: string,
  maxCount: number,
  windowMs: number
): Promise<void> {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  // Query for existing rate limit records in the current window
  const rateLimitRecords = await ctx.db
    .query("rate_limits")
    .withIndex("by_identifier_and_action_and_window", (q) =>
      q.eq("identifier", identifier).eq("action", action)
    )
    .filter((q) => q.gte(q.field("windowStart"), windowStart))
    .collect();
  
  // Calculate total count in current window
  const totalCount = rateLimitRecords.reduce((sum, record) => sum + record.count, 0);
  
  if (totalCount >= maxCount) {
    const resetTime = Math.ceil((rateLimitRecords[0]?.windowStart + windowMs - now) / 1000);
    throw new Error(
      `Rate limit exceeded. You can ${action} again in ${resetTime} seconds.`
    );
  }
  
  // Clean up old rate limit records (older than window)
  for (const record of rateLimitRecords) {
    if (record.windowStart < windowStart) {
      await ctx.db.delete(record._id);
    }
  }
  
  // Find or create rate limit record for current window
  const currentWindowStart = Math.floor(now / windowMs) * windowMs;
  const currentRecord = rateLimitRecords.find(
    (r) => r.windowStart === currentWindowStart
  );
  
  if (currentRecord) {
    // Increment existing record
    await ctx.db.patch(currentRecord._id, {
      count: currentRecord.count + 1,
    });
  } else {
    // Create new record
    await ctx.db.insert("rate_limits", {
      identifier,
      action,
      count: 1,
      windowStart: currentWindowStart,
    });
  }
}

/**
 * Get user ID from auth context
 * Returns null if user is not authenticated
 */
export async function getUserId(ctx: QueryCtx | MutationCtx): Promise<Id<"users"> | null> {
  return await auth.getUserId(ctx);
}
