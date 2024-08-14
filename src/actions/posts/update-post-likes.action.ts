import { defineAction, z } from "astro:actions";
import { db, eq, Posts } from "astro:db";

export const updatePostLikes = defineAction({
  accept: "json",
  input: z.object({
    postSlug: z.string(),
    likes: z.number(),
  }),
  handler: async ({ postSlug, likes }) => {
    const posts = await db.select().from(Posts).where(eq(Posts.id, postSlug));

    if (posts.length === 0) {
      const newPost = {
        id: postSlug,
        title: 'Post not found',
        likes: 0,
      };

      await db.insert(Posts).values(newPost);
    }

    const post = posts.at(0)!;
    post.likes = post.likes + likes;

    await db.update(Posts).set(post).where(eq(Posts.id, postSlug));

    return true;
  },
});