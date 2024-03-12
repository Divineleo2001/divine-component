import { sql } from "drizzle-orm";
import { text, int, varchar, timestamp, mysqlTable } from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { type getPatients } from "@/lib/api/patients/queries";

import { nanoid, timestamps } from "@/lib/utils";


export const patients = mysqlTable('patients', {
  id: varchar("id", { length: 191 }).primaryKey().$defaultFn(() => nanoid()),
  name: text("name"),
  gender: text("gender"),
  age: int("age"),
  userId: varchar("user_id", { length: 256 }).notNull(),
  
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),

});


// Schema for patients - used to validate API requests
const baseSchema = createSelectSchema(patients).omit(timestamps)

export const insertPatientSchema = createInsertSchema(patients).omit(timestamps);
export const insertPatientParams = baseSchema.extend({
  age: z.coerce.number()
}).omit({ 
  id: true,
  userId: true
});

export const updatePatientSchema = baseSchema;
export const updatePatientParams = baseSchema.extend({
  age: z.coerce.number()
}).omit({ 
  userId: true
});
export const patientIdSchema = baseSchema.pick({ id: true });

// Types for patients - used to type API request params and within Components
export type Patient = typeof patients.$inferSelect;
export type NewPatient = z.infer<typeof insertPatientSchema>;
export type NewPatientParams = z.infer<typeof insertPatientParams>;
export type UpdatePatientParams = z.infer<typeof updatePatientParams>;
export type PatientId = z.infer<typeof patientIdSchema>["id"];
    
// this type infers the return from getPatients() - meaning it will include any joins
export type CompletePatient = Awaited<ReturnType<typeof getPatients>>["patients"][number];

