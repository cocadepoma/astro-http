// src/actions/index.ts
import { defineAction, z } from "astro:actions";
import { db, eq, Posts } from "astro:db";

export const getPostLikes = defineAction({
  accept: "json",
  input: z.string(),
  handler: async (postId) => {
    const posts = await db.select().from(Posts).where(eq(Posts.id, postId));

    return { likes: posts[0]?.likes || 0 };
  },
});