import db from "../../database/index.js";
import { AuthMiddleware } from "../../middlewares/auth.middleware.js";
import { i18n } from "../../i18n/index.js";

import type { and as d_and, lte as d_lte, gte as d_gte } from "drizzle-orm/pg-core/expressions";
import type { FastifyRequest } from "fastify";
import type { ReplyPayload } from "../../interfaces/fastify.interface.js";
import type { BasicResponse, Route } from "../../interfaces/routes.interface.js";

interface StationFilterParams {
	boundaries?: string;
	limit?: number;
	page?: number;
}

const schemaRoute = {
	querystring: {
		type: "object",
		properties: {
			boundaries: {
				type: "string",
				pattern: "^-?\\d+\\.\\d+,-?\\d+\\.\\d+,-?\\d+\\.\\d+,-?\\d+\\.\\d+$",
			},
			limit: {
				type: "number",
				minimum: 1,
			},
			page: {
				type: "number",
				minimum: 1,
				default: 1,
			},
		},
	},
	response: {
		200: {
			type: "object",
			properties: {
				success: { type: "boolean" },
				data: {
					type: "array",
					items: {
						type: "object",
						properties: {
							bts_id: { type: "number" },
							latitude: { type: "number" },
							longitude: { type: "number" },
							owner: { type: ["number", "null"] },
							type: { type: ["string", "null"] },
							region: { type: ["number", "null"] },
							mno_id: { type: ["number", "null"] },
							networks_id: { type: ["number", "null"] },
							location_type: { type: ["string", "null"] },
						},
					},
				},
			},
		},
	},
};

const getStations: Route = {
	url: "/stations",
	method: "GET",
	schema: schemaRoute,
	onRequest: AuthMiddleware,
	handler: async (req: FastifyRequest<{ Querystring: StationFilterParams }>, res: ReplyPayload<BasicResponse<unknown>>) => {
		const { limit, page = 1 } = req.query;
		const offset = (page - 1) * (limit ?? 0);

		// const { boundaries } = req.query;

		// let boundaryCondition:
		// 	| ((
		// 			fields: { latitude: number; longitude: number },
		// 			operators: { and: typeof d_and; lte: typeof d_lte; gte: typeof d_gte },
		// 	  ) => ReturnType<typeof d_and>)
		// 	| undefined;
		// if (boundaries) {
		// 	const coords = boundaries.split(",").map(Number);
		// 	const [lat1, lon1, lat2, lon2] = coords;
		// 	if (!lat1 || !lon1 || !lat2 || !lon2) return res.status(400).send({ success: false, error: "Invalid boundaries" });
		// 	const [north, south] = lat1 > lat2 ? [lat1, lat2] : [lat2, lat1];
		// 	const [east, west] = lon1 > lon2 ? [lon1, lon2] : [lon2, lon1];

		// 	boundaryCondition = (
		// 		fields: { latitude: number; longitude: number },
		// 		{ and, lte, gte }: { and: typeof d_and; lte: typeof d_lte; gte: typeof d_gte },
		// 	) => and(lte(fields.latitude, north), gte(fields.latitude, south), lte(fields.longitude, east), gte(fields.longitude, west));
		// }

		const btsStations = await db.query.stations.findMany({
			// where: boundaryCondition,
			limit: limit ?? undefined,
			offset: limit ? offset : undefined,
			orderBy: (fields, operators) => [operators.asc(fields.bts_id)],
		});

		if (!btsStations) {
			return res.status(404).send({
				success: false,
				error: i18n.t("errors.failedToRetrieveStations", req.language),
			});
		}

		res.send({ success: true, data: btsStations });
	},
};

export default getStations;
