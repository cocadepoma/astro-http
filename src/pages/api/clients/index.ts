import type { APIRoute } from 'astro';
import { getCollection, getEntry } from 'astro:content';
import { db, Clients } from 'astro:db';

export const prerender = false;

export const GET: APIRoute = async ({ params, request }) => {
  try {
    const clients = await db.select().from(Clients);

    return new Response(
      JSON.stringify(clients),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ message: error?.message || 'Internal Server Error' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

export const POST: APIRoute = async ({ params, request }) => {
  try {
    const { name, age, isActive = true } = await request.json();

    if (!name || !age) {
      return new Response(
        JSON.stringify({ message: 'Missing required fields' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    await db.insert(Clients).values([{ name, age, isActive }]);

    return new Response(
      'Ok!',
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ message: error?.message || 'Internal Server Error' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}