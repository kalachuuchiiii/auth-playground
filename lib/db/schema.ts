

import {
    pgTable,
    uuid,
    varchar,
    timestamp,
    integer,
    index,
    uniqueIndex,
} from "drizzle-orm/pg-core";

export const verificationRequests = pgTable(
    "verification_requests",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        email: varchar("email", { length: 255 }).notNull(),
        hashedCode: varchar("hashed_code", { length: 255 }).notNull(),
        hashedPassword: varchar("hashed_password", { length: 255 }).notNull(),
        attempts: integer("attempts").default(0).notNull(),
        usedAt: timestamp("used_at", { withTimezone: true }),
        createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
        expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    },
    (table) => [
        index("verification_requests_email_idx").on(table.email),
        uniqueIndex("verification_requests_email_unique").on(table.email),
    ]
);


export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    nickname: varchar("nickname", { length: 50 }).notNull(),
});

export const credentials = pgTable("credentials", {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 255 })
        .notNull()
        .unique(),
    password: varchar("password", { length: 255 }).notNull(),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});