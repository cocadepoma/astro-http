import type { APIRoute } from 'astro';
import { Clients, db, eq, sql } from 'astro:db';

export const prerender = false;

export const GET: APIRoute = async ({ params: { id }, request }) => {
  const client = await getClient(Number(id));

  if (client.length === 0) {
    return clientNotFound();
  }

  return new Response(
    JSON.stringify(client),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
}

export const PATCH: APIRoute = async ({ params: { id }, request }) => {
  const { name, age, isActive = true } = await request.json();

  const client = await getClient(Number(id));

  if (client.length === 0) {
    return clientNotFound();
  }

  await db
    .update(Clients)
    .set({ name, age, isActive })
    .where(eq(Clients.id, Number(id)));

  return new Response(
    'Updated!',
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
}

export const DELETE: APIRoute = async ({ params: { id }, request }) => {
  const client = await getClient(Number(id));

  if (client.length === 0) {
    return clientNotFound();
  }

  await db
    .delete(Clients)
    .where(eq(Clients.id, Number(id)));

  return new Response(
    'Deleted!',
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
}

const getClient = async (id: number) => {
  return await db
    .select()
    .from(Clients)
    .where(sql`${Clients.id} = ${id}`);
}

const clientNotFound = () => {
  return new Response(
    'Client not found',
    {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
};