import { relations } from "drizzle-orm/relations";

import { apiTokens, bands, cells, locations, operators, regions, stationNotes, stations, userLists, users } from "./schema.js";

export const operatorRelations = relations(operators, ({ one, many }) => ({
	parent: one(operators, {
		fields: [operators.parent_id],
		references: [operators.id],
	}),
	children: many(operators),
	stations: many(stations),
}));

export const regionRelations = relations(regions, ({ many }) => ({
	locations: many(locations),
}));

export const locationRelations = relations(locations, ({ one, many }) => ({
	region: one(regions, {
		fields: [locations.region_id],
		references: [regions.id],
	}),
	stations: many(stations),
}));

export const stationRelations = relations(stations, ({ one, many }) => ({
	location: one(locations, {
		fields: [stations.location_id],
		references: [locations.id],
	}),
	operator: one(operators, {
		fields: [stations.operator_id],
		references: [operators.id],
	}),
	cells: many(cells),
}));

export const cellRelations = relations(cells, ({ one }) => ({
	station: one(stations, {
		fields: [cells.station_id],
		references: [stations.id],
	}),
	band: one(bands, {
		fields: [cells.band_id],
		references: [bands.id],
	}),
}));

export const bandRelations = relations(bands, ({ many }) => ({
	cells: many(cells),
}));

export const userListRelations = relations(userLists, ({ one }) => ({
	list: one(users, {
		fields: [userLists.created_by],
		references: [users.id],
	}),
}));

export const userNotesRelations = relations(stationNotes, ({ one }) => ({
	user: one(users, {
		fields: [stationNotes.user_id],
		references: [users.id],
	}),
}));

export const apiTokensRelations = relations(apiTokens, ({ one }) => ({
	apiToken: one(users, {
		fields: [apiTokens.user_id],
		references: [users.id],
	}),
}));

export const usersRelations = relations(users, ({ many }) => ({
	notes: many(stationNotes),
	lists: many(userLists),
	apiTokens: many(apiTokens),
}));
