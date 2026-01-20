import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { generateUniqueSlug, checkRateLimit, getUserId } from "./helpers";

/**
 * Get a single poll by slug with its options
 */
export const get = query({
  args: { slug: v.string() },
  returns: v.union(
    v.object({
      _id: v.id("polls"),
      _creationTime: v.number(),
      creatorId: v.optional(v.id("users")),
      slug: v.string(),
      title: v.string(),
      description: v.optional(v.string()),
      type: v.union(v.literal("single"), v.literal("multiple")),
      visibility: v.union(v.literal("public"), v.literal("unlisted"), v.literal("private")),
      status: v.union(v.literal("active"), v.literal("closed")),
      maxSelections: v.optional(v.number()),
      showResultsBeforeVote: v.boolean(),
      requireAuthToVote: v.boolean(),
      allowEmbed: v.boolean(),
      allowComments: v.boolean(),
      closesAt: v.optional(v.number()),
      creator: v.optional(
        v.object({
          _id: v.id("users"),
          name: v.optional(v.string()),
          image: v.optional(v.string()),
        })
      ),
      options: v.array(
        v.object({
          _id: v.id("poll_options"),
          _creationTime: v.number(),
          pollId: v.id("polls"),
          label: v.string(),
          position: v.number(),
          imageUrl: v.optional(v.string()),
        })
      ),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const poll = await ctx.db
      .query("polls")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!poll) {
      return null;
    }

    // Check visibility permissions
    const userId = await getUserId(ctx);
    if (poll.visibility === "private" && poll.creatorId !== userId) {
      return null;
    }

    // Get poll options
    const options = await ctx.db
      .query("poll_options")
      .withIndex("by_poll", (q) => q.eq("pollId", poll._id))
      .collect();

    // Sort options by position
    options.sort((a, b) => a.position - b.position);

    // Get creator info if exists
    let creator = undefined;
    if (poll.creatorId) {
      const creatorUser = await ctx.db.get(poll.creatorId);
      if (creatorUser) {
        creator = {
          _id: creatorUser._id,
          name: creatorUser.name,
          image: creatorUser.image,
        };
      }
    }

    return {
      ...poll,
      creator,
      options,
    };
  },
});

/**
 * List polls created by the current user
 */
export const list = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("polls"),
      _creationTime: v.number(),
      slug: v.string(),
      title: v.string(),
      description: v.optional(v.string()),
      type: v.union(v.literal("single"), v.literal("multiple")),
      visibility: v.union(v.literal("public"), v.literal("unlisted"), v.literal("private")),
      status: v.union(v.literal("active"), v.literal("closed")),
      optionCount: v.number(),
      voteCount: v.number(),
    })
  ),
  handler: async (ctx, _args) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      return [];
    }

    const polls = await ctx.db
      .query("polls")
      .withIndex("by_creator", (q) => q.eq("creatorId", userId))
      .order("desc")
      .collect();

    // Get counts for each poll
    const pollsWithCounts = await Promise.all(
      polls.map(async (poll) => {
        const options = await ctx.db
          .query("poll_options")
          .withIndex("by_poll", (q) => q.eq("pollId", poll._id))
          .collect();

        const votes = await ctx.db
          .query("votes")
          .withIndex("by_poll", (q) => q.eq("pollId", poll._id))
          .collect();

        return {
          _id: poll._id,
          _creationTime: poll._creationTime,
          slug: poll.slug,
          title: poll.title,
          description: poll.description,
          type: poll.type,
          visibility: poll.visibility,
          status: poll.status,
          optionCount: options.length,
          voteCount: votes.length,
        };
      })
    );

    return pollsWithCounts;
  },
});

/**
 * List recent public polls
 */
export const listRecent = query({
  args: { limit: v.optional(v.number()) },
  returns: v.array(
    v.object({
      _id: v.id("polls"),
      _creationTime: v.number(),
      slug: v.string(),
      title: v.string(),
      optionCount: v.number(),
      voteCount: v.number(),
    })
  ),
  handler: async (ctx, args) => {
    const limit = args.limit ?? 6;

    const polls = await ctx.db
      .query("polls")
      .withIndex("by_visibility", (q) => q.eq("visibility", "public"))
      .order("desc")
      .take(limit);

    // Get counts for each poll
    const pollsWithCounts = await Promise.all(
      polls.map(async (poll) => {
        const options = await ctx.db
          .query("poll_options")
          .withIndex("by_poll", (q) => q.eq("pollId", poll._id))
          .collect();

        const votes = await ctx.db
          .query("votes")
          .withIndex("by_poll", (q) => q.eq("pollId", poll._id))
          .collect();

        return {
          _id: poll._id,
          _creationTime: poll._creationTime,
          slug: poll.slug,
          title: poll.title,
          optionCount: options.length,
          voteCount: votes.length,
        };
      })
    );

    return pollsWithCounts;
  },
});

/**
 * Get vote results for a poll
 */
export const getResults = query({
  args: { pollId: v.id("polls") },
  returns: v.record(v.string(), v.number()),
  handler: async (ctx, args) => {
    const votes = await ctx.db
      .query("votes")
      .withIndex("by_poll", (q) => q.eq("pollId", args.pollId))
      .collect();

    // Count votes per option
    const voteCounts: Record<string, number> = {};
    for (const vote of votes) {
      const optionId = vote.optionId;
      voteCounts[optionId] = (voteCounts[optionId] || 0) + 1;
    }

    return voteCounts;
  },
});

/**
 * Create a new poll with options
 */
export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    type: v.union(v.literal("single"), v.literal("multiple")),
    visibility: v.union(v.literal("public"), v.literal("unlisted"), v.literal("private")),
    options: v.array(
      v.object({
        label: v.string(),
        position: v.number(),
      })
    ),
    maxSelections: v.optional(v.number()),
    showResultsBeforeVote: v.boolean(),
    requireAuthToVote: v.boolean(),
    allowEmbed: v.boolean(),
    allowComments: v.boolean(),
    closesAt: v.optional(v.number()),
    fingerprint: v.string(), // For rate limiting
  },
  returns: v.object({
    pollId: v.id("polls"),
    slug: v.string(),
  }),
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    // Rate limiting: 5 polls per 5 minutes (300000ms)
    const identifier = userId || args.fingerprint;
    await checkRateLimit(ctx, identifier, "create_poll", 5, 300000);

    // Generate unique slug
    const slug = await generateUniqueSlug(ctx);

    // Insert poll
    const pollId = await ctx.db.insert("polls", {
      creatorId: userId ?? undefined,
      slug,
      title: args.title,
      description: args.description,
      type: args.type,
      visibility: args.visibility,
      status: "active" as const,
      maxSelections: args.maxSelections,
      showResultsBeforeVote: args.showResultsBeforeVote,
      requireAuthToVote: args.requireAuthToVote,
      allowEmbed: args.allowEmbed,
      allowComments: args.allowComments,
      closesAt: args.closesAt,
    });

    // Insert options
    for (const option of args.options) {
      await ctx.db.insert("poll_options", {
        pollId,
        label: option.label,
        position: option.position,
        imageUrl: undefined,
      });
    }

    return { pollId, slug };
  },
});

/**
 * Update poll metadata
 */
export const update = mutation({
  args: {
    pollId: v.id("polls"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(v.union(v.literal("active"), v.literal("closed"))),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    const poll = await ctx.db.get(args.pollId);

    if (!poll) {
      throw new Error("Poll not found");
    }

    if (poll.creatorId !== userId) {
      throw new Error("Not authorized to update this poll");
    }

    const updates: any = {};
    if (args.title !== undefined) updates.title = args.title;
    if (args.description !== undefined) updates.description = args.description;
    if (args.status !== undefined) updates.status = args.status;

    if (Object.keys(updates).length > 0) {
      await ctx.db.patch(args.pollId, updates);
    }

    return null;
  },
});

/**
 * Close a poll
 */
export const close = mutation({
  args: { pollId: v.id("polls") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    const poll = await ctx.db.get(args.pollId);

    if (!poll) {
      throw new Error("Poll not found");
    }

    if (poll.creatorId !== userId) {
      throw new Error("Not authorized to close this poll");
    }

    await ctx.db.patch(args.pollId, { status: "closed" as const });
    return null;
  },
});
