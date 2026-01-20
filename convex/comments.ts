import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getUserId } from "./helpers";

/**
 * List comments for a poll
 */
export const list = query({
  args: { pollId: v.id("polls") },
  returns: v.array(
    v.object({
      _id: v.id("comments"),
      _creationTime: v.number(),
      pollId: v.id("polls"),
      commenterId: v.optional(v.id("users")),
      commenterFingerprint: v.string(),
      content: v.string(),
      commenter: v.optional(
        v.object({
          _id: v.id("users"),
          name: v.optional(v.string()),
          image: v.optional(v.string()),
        })
      ),
    })
  ),
  handler: async (ctx, args) => {
    const poll = await ctx.db.get(args.pollId);
    if (!poll) {
      throw new Error("Poll not found");
    }

    // Check if user can view this poll
    const userId = await getUserId(ctx);
    if (poll.visibility === "private" && poll.creatorId !== userId) {
      throw new Error("Not authorized to view this poll");
    }

    const comments = await ctx.db
      .query("comments")
      .withIndex("by_poll", (q) => q.eq("pollId", args.pollId))
      .order("asc")
      .collect();

    // Fetch commenter info for each comment
    const commentsWithCommenters = await Promise.all(
      comments.map(async (comment) => {
        let commenter = undefined;
        if (comment.commenterId) {
          const commenterUser = await ctx.db.get(comment.commenterId);
          if (commenterUser) {
            commenter = {
              _id: commenterUser._id,
              name: commenterUser.name,
              image: commenterUser.image,
            };
          }
        }

        return {
          ...comment,
          commenter,
        };
      })
    );

    return commentsWithCommenters;
  },
});

/**
 * Add a new comment to a poll
 */
export const create = mutation({
  args: {
    pollId: v.id("polls"),
    content: v.string(),
    commenterFingerprint: v.string(),
  },
  returns: v.id("comments"),
  handler: async (ctx, args) => {
    // Validate content length
    if (args.content.length < 1 || args.content.length > 1000) {
      throw new Error("Comment must be between 1 and 1000 characters");
    }

    const poll = await ctx.db.get(args.pollId);
    if (!poll) {
      throw new Error("Poll not found");
    }

    // Check if comments are allowed
    if (!poll.allowComments) {
      throw new Error("Comments are not allowed on this poll");
    }

    // Check if poll is active
    if (poll.status === "closed") {
      throw new Error("Cannot comment on a closed poll");
    }

    const userId = await getUserId(ctx);

    const commentId = await ctx.db.insert("comments", {
      pollId: args.pollId,
      commenterId: userId ?? undefined,
      commenterFingerprint: args.commenterFingerprint,
      content: args.content,
    });

    return commentId;
  },
});

/**
 * Delete a comment
 * Users can delete their own comments, poll creators can delete any comment on their polls
 */
export const deleteComment = mutation({
  args: { commentId: v.id("comments") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const comment = await ctx.db.get(args.commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error("You must be logged in to delete comments");
    }

    const poll = await ctx.db.get(comment.pollId);
    if (!poll) {
      throw new Error("Poll not found");
    }

    // Check if user is comment author or poll creator
    const isCommentAuthor = comment.commenterId === userId;
    const isPollCreator = poll.creatorId === userId;

    if (!isCommentAuthor && !isPollCreator) {
      throw new Error("Not authorized to delete this comment");
    }

    await ctx.db.delete(args.commentId);
    return null;
  },
});
