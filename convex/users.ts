import { query } from "./_generated/server";
import { auth } from "./auth";

/**
 * Get the current authenticated user's profile
 */
export const viewer = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    
    if (!userId) {
      return null;
    }
    
    const user = await ctx.db.get(userId);
    
    if (!user) {
      return null;
    }
    
    return {
      id: userId,
      email: user.email,
      name: user.name,
      image: user.image,
      isAnonymous: user.isAnonymous,
      // Map to format expected by components
      user_metadata: {
        full_name: user.name,
        avatar_url: user.image,
      },
    };
  },
});
