import { db } from "@/lib/db/index";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { type PatientId, patientIdSchema, patients } from "@/lib/db/schema/patients";
import { vitals, type CompleteVital } from "@/lib/db/schema/vitals";
import { comments, type CompleteComment } from "@/lib/db/schema/comments";
import { histories, type CompleteHistory } from "@/lib/db/schema/histories";
import { patientComorbidities, type CompletePatientComorbidity } from "@/lib/db/schema/patientComorbidities";
import { patientDisabilities, type CompletePatientDisability } from "@/lib/db/schema/patientDisabilities";

export const getPatients = async () => {
  const { session } = await getUserAuth();
  const rows = await db.select().from(patients).where(eq(patients.userId, session?.user.id!));
  const p = rows
  return { patients: p };
};

export const getPatientById = async (id: PatientId) => {
  const { session } = await getUserAuth();
  const { id: patientId } = patientIdSchema.parse({ id });
  const [row] = await db.select().from(patients).where(and(eq(patients.id, patientId), eq(patients.userId, session?.user.id!)));
  if (row === undefined) return {};
  const p = row;
  return { patient: p };
};

export const getPatientByIdWithVitalsAndCommentsAndHistoriesAndPatientComorbiditiesAndPatientDisabilities = async (id: PatientId) => {
  const { session } = await getUserAuth();
  const { id: patientId } = patientIdSchema.parse({ id });
  const rows = await db.select({ patient: patients, vital: vitals, comment: comments, history: histories, patientComorbidity: patientComorbidities, patientDisability: patientDisabilities }).from(patients).where(and(eq(patients.id, patientId), eq(patients.userId, session?.user.id!))).leftJoin(vitals, eq(patients.id, vitals.patientId)).leftJoin(comments, eq(patients.id, comments.patientId)).leftJoin(histories, eq(patients.id, histories.patientId)).leftJoin(patientComorbidities, eq(patients.id, patientComorbidities.patientId)).leftJoin(patientDisabilities, eq(patients.id, patientDisabilities.patientId));
  if (rows.length === 0) return {};
  const p = rows[0].patient;
  const pv = rows.filter((r) => r.vital !== null).map((v) => v.vital) as CompleteVital[];
  const pc = rows.filter((r) => r.comment !== null).map((c) => c.comment) as CompleteComment[];
  const ph = rows.filter((r) => r.history !== null).map((h) => h.history) as CompleteHistory[];
  const pp = rows.filter((r) => r.patientComorbidity !== null).map((p) => p.patientComorbidity) as CompletePatientComorbidity[];
  const ppd = rows.filter((r) => r.patientDisability !== null).map((p) => p.patientDisability) as CompletePatientDisability[];

  return { patient: p, vitals: pv, comments: pc, histories: ph, patientComorbidities: pp, patientDisabilities: ppd };
};

