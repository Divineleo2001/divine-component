import { sql } from "drizzle-orm";
import { text, varchar, timestamp, mysqlTable } from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { patients } from "./patients"
import { type getPatientComorbidities } from "@/lib/api/patientComorbidities/queries";

import { nanoid, timestamps } from "@/lib/utils";


export const patientComorbidities = mysqlTable('patient_comorbidities', {
  id: varchar("id", { length: 191 }).primaryKey().$defaultFn(() => nanoid()),
  comorbidityName: text("comorbidity_name").notNull(),
  patientId: varchar("patient_id", { length: 256 }).references(() => patients.id, { onDelete: "cascade" }).notNull(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),

});


// Schema for patientComorbidities - used to validate API requests
const baseSchema = createSelectSchema(patientComorbidities).omit(timestamps)

export const insertPatientComorbiditySchema = createInsertSchema(patientComorbidities).omit(timestamps);
export const insertPatientComorbidityParams = baseSchema.extend({
  patientId: z.coerce.string().min(1)
}).omit({ 
  id: true,
  userId: true
});

export const updatePatientComorbiditySchema = baseSchema;
export const updatePatientComorbidityParams = baseSchema.extend({
  patientId: z.coerce.string().min(1)
}).omit({ 
  userId: true
});
export const patientComorbidityIdSchema = baseSchema.pick({ id: true });

// Types for patientComorbidities - used to type API request params and within Components
export type PatientComorbidity = typeof patientComorbidities.$inferSelect;
export type NewPatientComorbidity = z.infer<typeof insertPatientComorbiditySchema>;
export type NewPatientComorbidityParams = z.infer<typeof insertPatientComorbidityParams>;
export type UpdatePatientComorbidityParams = z.infer<typeof updatePatientComorbidityParams>;
export type PatientComorbidityId = z.infer<typeof patientComorbidityIdSchema>["id"];
    
// this type infers the return from getPatientComorbidities() - meaning it will include any joins
export type CompletePatientComorbidity = Awaited<ReturnType<typeof getPatientComorbidities>>["patientComorbidities"][number];

