import { sql } from "drizzle-orm";
import { text, varchar, timestamp, mysqlTable } from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { patients } from "./patients"
import { type getHistories } from "@/lib/api/histories/queries";

import { nanoid, timestamps } from "@/lib/utils";


export const histories = mysqlTable('histories', {
  id: varchar("id", { length: 191 }).primaryKey().$defaultFn(() => nanoid()),
  history: text("history").notNull(),
  patientId: varchar("patient_id", { length: 256 }).references(() => patients.id, { onDelete: "cascade" }).notNull(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),

});


// Schema for histories - used to validate API requests
const baseSchema = createSelectSchema(histories).omit(timestamps)

export const insertHistorySchema = createInsertSchema(histories).omit(timestamps);
export const insertHistoryParams = baseSchema.extend({
  patientId: z.coerce.string().min(1)
}).omit({ 
  id: true,
  userId: true
});

export const updateHistorySchema = baseSchema;
export const updateHistoryParams = baseSchema.extend({
  patientId: z.coerce.string().min(1)
}).omit({ 
  userId: true
});
export const historyIdSchema = baseSchema.pick({ id: true });

// Types for histories - used to type API request params and within Components
export type History = typeof histories.$inferSelect;
export type NewHistory = z.infer<typeof insertHistorySchema>;
export type NewHistoryParams = z.infer<typeof insertHistoryParams>;
export type UpdateHistoryParams = z.infer<typeof updateHistoryParams>;
export type HistoryId = z.infer<typeof historyIdSchema>["id"];
    
// this type infers the return from getHistories() - meaning it will include any joins
export type CompleteHistory = Awaited<ReturnType<typeof getHistories>>["histories"][number];

