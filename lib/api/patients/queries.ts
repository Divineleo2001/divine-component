import { db } from "@/lib/db/index";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { type PatientId, patientIdSchema, patients } from "@/lib/db/schema/patients";
import { comments, type CompleteComment } from "@/lib/db/schema/comments";

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

export const getPatientByIdWithComments = async (id: PatientId) => {
  const { session } = await getUserAuth();
  const { id: patientId } = patientIdSchema.parse({ id });
  const rows = await db.select({ patient: patients, comment: comments }).from(patients).where(and(eq(patients.id, patientId), eq(patients.userId, session?.user.id!))).leftJoin(comments, eq(patients.id, comments.patientId));
  if (rows.length === 0) return {};
  const p = rows[0].patient;
  const pc = rows.filter((r) => r.comment !== null).map((c) => c.comment) as CompleteComment[];

  return { patient: p, comments: pc };
};

