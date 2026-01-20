import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  // Convex Auth tables
  ...authTables,
  
  polls: defineTable({
    creatorId: v.optional(v.id("users")), // Optional for anonymous polls
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
    closesAt: v.optional(v.number()), // Unix timestamp
  })
    .index("by_slug", ["slug"])
    .index("by_creator", ["creatorId"])
    .index("by_visibility", ["visibility"]),
  
  poll_options: defineTable({
    pollId: v.id("polls"),
    label: v.string(),
    position: v.number(),
    imageUrl: v.optional(v.string()),
  })
    .index("by_poll_and_position", ["pollId", "position"])
    .index("by_poll", ["pollId"]),
  
  votes: defineTable({
    pollId: v.id("polls"),
    optionId: v.id("poll_options"),
    voterId: v.optional(v.id("users")),
    voterFingerprint: v.string(),
  })
    .index("by_poll", ["pollId"])
    .index("by_poll_and_fingerprint", ["pollId", "voterFingerprint"])
    .index("by_option", ["optionId"]),
  
  comments: defineTable({
    pollId: v.id("polls"),
    commenterId: v.optional(v.id("users")),
    commenterFingerprint: v.string(),
    content: v.string(),
  })
    .index("by_poll", ["pollId"]),
  
  rate_limits: defineTable({
    identifier: v.string(), // fingerprint or userId
    action: v.string(), // "vote" or "create_poll"
    count: v.number(),
    windowStart: v.number(), // Unix timestamp
  }).index("by_identifier_and_action_and_window", ["identifier", "action", "windowStart"]),
});
