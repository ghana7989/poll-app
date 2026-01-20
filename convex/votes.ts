import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { checkRateLimit, getUserId } from "./helpers";

/**
 * Check if a user/fingerprint has already voted on a poll
 */
export const hasVoted = query({
  args: {
    pollId: v.id("polls"),
    voterFingerprint: v.string(),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const existingVote = await ctx.db
      .query("votes")
      .withIndex("by_poll_and_fingerprint", (q) =>
        q.eq("pollId", args.pollId).eq("voterFingerprint", args.voterFingerprint)
      )
      .first();

    return !!existingVote;
  },
});

/**
 * Cast vote(s) on a poll
 * Includes fingerprint deduplication and rate limiting
 */
export const cast = mutation({
  args: {
    pollId: v.id("polls"),
    optionIds: v.array(v.id("poll_options")),
    voterFingerprint: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Get poll to check settings
    const poll = await ctx.db.get(args.pollId);
    if (!poll) {
      throw new Error("Poll not found");
    }

    // Check if poll is closed
    if (poll.status === "closed") {
      throw new Error("This poll is closed");
    }

    // Check if poll has expired
    if (poll.closesAt && poll.closesAt < Date.now()) {
      throw new Error("This poll has expired");
    }

    // Check auth requirements
    const userId = await getUserId(ctx);
    if (poll.requireAuthToVote && !userId) {
      throw new Error("You must be logged in to vote on this poll");
    }

    // Validate option count based on poll type
    if (poll.type === "single" && args.optionIds.length !== 1) {
      throw new Error("You must select exactly one option");
    }

    if (poll.type === "multiple") {
      if (args.optionIds.length === 0) {
        throw new Error("You must select at least one option");
      }
      if (poll.maxSelections && args.optionIds.length > poll.maxSelections) {
        throw new Error(`You can select at most ${poll.maxSelections} options`);
      }
    }

    // Verify all options belong to this poll
    for (const optionId of args.optionIds) {
      const option = await ctx.db.get(optionId);
      if (!option || option.pollId !== args.pollId) {
        throw new Error("Invalid option selected");
      }
    }

    // Rate limiting: 10 votes per minute (60000ms)
    await checkRateLimit(ctx, args.voterFingerprint, "vote", 10, 60000);

    // Check for duplicate vote using fingerprint
    const existingVote = await ctx.db
      .query("votes")
      .withIndex("by_poll_and_fingerprint", (q) =>
        q.eq("pollId", args.pollId).eq("voterFingerprint", args.voterFingerprint)
      )
      .first();

    if (existingVote) {
      throw new Error("You have already voted on this poll");
    }

    // Insert votes
    for (const optionId of args.optionIds) {
      await ctx.db.insert("votes", {
        pollId: args.pollId,
        optionId,
        voterId: userId ?? undefined,
        voterFingerprint: args.voterFingerprint,
      });
    }

    return null;
  },
});

/**
 * Get vote details for a specific poll (for analytics)
 */
export const getVoteDetails = query({
  args: { pollId: v.id("polls") },
  returns: v.array(
    v.object({
      _id: v.id("votes"),
      _creationTime: v.number(),
      optionId: v.id("poll_options"),
      voterId: v.optional(v.id("users")),
    })
  ),
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    const poll = await ctx.db.get(args.pollId);

    if (!poll) {
      throw new Error("Poll not found");
    }

    // Only poll creator can see vote details
    if (poll.creatorId !== userId) {
      throw new Error("Not authorized to view vote details");
    }

    const votes = await ctx.db
      .query("votes")
      .withIndex("by_poll", (q) => q.eq("pollId", args.pollId))
      .collect();

    return votes.map((vote) => ({
      _id: vote._id,
      _creationTime: vote._creationTime,
      optionId: vote.optionId,
      voterId: vote.voterId,
    }));
  },
});
