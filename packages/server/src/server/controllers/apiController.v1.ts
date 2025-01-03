import { readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { logger } from "../config.js";

import type { FastifyInstance } from "fastify";

function walk(dir: string): string[] {
	return readdirSync(dir, { withFileTypes: true }).flatMap((file) => (file.isDirectory() ? walk(join(dir, file.name)) : join(dir, file.name)));
}

export async function APIv1Controller(fastify: FastifyInstance) {
	const __dirname = fileURLToPath(new URL(".", import.meta.url));
	const routeFiles = walk(join(__dirname, "..", "routes", "v1"));

	for (const file of routeFiles) {
		try {
			const { default: route } = await import(`file:///${file}`);
			logger.extend("APIv1Controller")("Registering route: %o %s", route.method, route.url);
			fastify.route(route);
		} catch (error) {
			logger.extend("APIv1Controller")("Error registering route: %o", error);
		}
	}
}
