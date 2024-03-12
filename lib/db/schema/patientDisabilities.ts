import { sql } from "drizzle-orm";
import { text, varchar, timestamp, mysqlTable } from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { patients } from "./patients"
import { type getPatientDisabilities } from "@/lib/api/patientDisabilities/queries";

import { nanoid, timestamps } from "@/lib/utils";


export const patientDisabilities = mysqlTable('patient_disabilities', {
  id: varchar("id", { length: 191 }).primaryKey().$defaultFn(() => nanoid()),
  disabilityName: text("disability_name").notNull(),
  patientId: varchar("patient_id", { length: 256 }).references(() => patients.id, { onDelete: "cascade" }).notNull(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),

});


// Schema for patientDisabilities - used to validate API requests
const baseSchema = createSelectSchema(patientDisabilities).omit(timestamps)

export const insertPatientDisabilitySchema = createInsertSchema(patientDisabilities).omit(timestamps);
export const insertPatientDisabilityParams = baseSchema.extend({
  patientId: z.coerce.string().min(1)
}).omit({ 
  id: true,
  userId: true
});

export const updatePatientDisabilitySchema = baseSchema;
export const updatePatientDisabilityParams = baseSchema.extend({
  patientId: z.coerce.string().min(1)
}).omit({ 
  userId: true
});
export const patientDisabilityIdSchema = baseSchema.pick({ id: true });

// Types for patientDisabilities - used to type API request params and within Components
export type PatientDisability = typeof patientDisabilities.$inferSelect;
export type NewPatientDisability = z.infer<typeof insertPatientDisabilitySchema>;
export type NewPatientDisabilityParams = z.infer<typeof insertPatientDisabilityParams>;
export type UpdatePatientDisabilityParams = z.infer<typeof updatePatientDisabilityParams>;
export type PatientDisabilityId = z.infer<typeof patientDisabilityIdSchema>["id"];
    
// this type infers the return from getPatientDisabilities() - meaning it will include any joins
export type CompletePatientDisability = Awaited<ReturnType<typeof getPatientDisabilities>>["patientDisabilities"][number];

