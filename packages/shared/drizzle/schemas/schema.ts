import { type AnyPgColumn, boolean, integer, jsonb, numeric, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const operators = pgTable("operators", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 100 }).notNull().unique(),
	parent_id: integer("parent_id").references((): AnyPgColumn => operators.id),
	mnc_code: integer("mnc_code").notNull(),
});

export const regions = pgTable("regions", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 100 }).notNull().unique(),
});

export const locations = pgTable("locations", {
	id: serial("id").primaryKey(),
	region_id: integer("region_id")
		.references(() => regions.id)
		.notNull(),
	city: varchar("city", { length: 100 }).notNull(),
	address: text("address").notNull(),
	longitude: numeric("longitude", { precision: 9, scale: 6 }).notNull(),
	latitude: numeric("latitude", { precision: 8, scale: 6 }).notNull(),
});

export const stations = pgTable("stations", {
	id: serial("id").primaryKey(),
	station_id: varchar("station_id", { length: 9 }).notNull(),
	bts_id: integer("bts_id"),
	location_id: integer("location_id").references(() => locations.id),
	operator_id: integer("operator_id").references(() => operators.id),
	lac: integer("lac"),
	rnc: varchar("rnc", { length: 50 }),
	enbi: integer("enbi"),
	is_common_bch: boolean("is_common_bch").default(false),
	is_cdma: boolean("is_cdma").default(false),
	is_umts: boolean("is_umts").default(false),
	is_gsm: boolean("is_gsm").default(false),
	is_lte: boolean("is_lte").default(false),
	is_5g: boolean("is_5g").default(false),
	is_outdoor: boolean("is_outdoor").default(true),
	installation_type: varchar("installation_type", { length: 100 }),
	notes: text("notes"),
	last_updated: timestamp({ withTimezone: true }).notNull().defaultNow(),
	date_created: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const cells = pgTable("cells", {
	id: serial("id").primaryKey(),
	station_id: integer("station_id")
		.references(() => stations.id)
		.notNull(),
	standard: varchar("standard", { length: 20 }).notNull(),
	band_id: integer("band_id")
		.references(() => bands.id)
		.notNull(),
	config: jsonb("config").notNull().$type<{ duplex: string | null; ecid: number; clid: number; carrier: number }>(),
	sector: integer("sector").notNull(),
	last_updated: timestamp({ withTimezone: true }).notNull().defaultNow(),
	date_created: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const bands = pgTable("bands", {
	id: serial("id").primaryKey(),
	value: integer("value").unique(),
	name: varchar("name", { length: 50 }).notNull(),
	frequency: varchar("frequency", { length: 50 }),
	duplex: varchar("duplex", { length: 5 }),
});
