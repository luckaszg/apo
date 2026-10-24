import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

// Checks that the D1 and R2 bindings are wired up.
export const GET: APIRoute = async () => {
	const db = await env.DB.prepare('SELECT 1 AS ok').first<{ ok: number }>();
	await env.BUCKET.head('healthcheck');
	return Response.json({ db: db?.ok === 1, bucket: true });
};
