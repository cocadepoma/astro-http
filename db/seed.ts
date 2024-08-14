import { getCollection } from 'astro:content';
import { Clients, db, Posts } from 'astro:db';

// https://astro.build/db/seed
export default async function seed() {
	await db.insert(Clients).values([
		{ id: 1, name: 'Alice', age: 30, isActive: true },
		{ id: 2, name: 'Bob', age: 25, isActive: false },
		{ id: 3, name: 'Charlie', age: 35, isActive: true },
		{ id: 4, name: 'David', age: 40, isActive: false },
		{ id: 5, name: 'Eve', age: 20, isActive: true },
	]);

	const posts = await getCollection('blog');
	await db.insert(Posts).values(
		posts.map((post) => ({
			id: post.slug,
			title: post.data.title,
			likes: Math.round(Math.random() * 100),
		})));
}
