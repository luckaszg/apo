import { defineConfig } from 'drizzle-kit';

// Drizzle only generates SQL migration files here; wrangler applies them to D1.
export default defineConfig({
	dialect: 'sqlite',
	schema: './src/db/schema.ts',
	out: './migrations',
});
