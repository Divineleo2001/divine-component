import { db } from "@/lib/db/index";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { type HistoryId, historyIdSchema, histories } from "@/lib/db/schema/histories";
import { patients } from "@/lib/db/schema/patients";

export const getHistories = async () => {
  const { session } = await getUserAuth();
  const rows = await db.select({ history: histories, patient: patients }).from(histories).leftJoin(patients, eq(histories.patientId, patients.id)).where(eq(histories.userId, session?.user.id!));
  const h = rows .map((r) => ({ ...r.history, patient: r.patient})); 
  return { histories: h };
};

export const getHistoryById = async (id: HistoryId) => {
  const { session } = await getUserAuth();
  const { id: historyId } = historyIdSchema.parse({ id });
  const [row] = await db.select({ history: histories, patient: patients }).from(histories).where(and(eq(histories.id, historyId), eq(histories.userId, session?.user.id!))).leftJoin(patients, eq(histories.patientId, patients.id));
  if (row === undefined) return {};
  const h =  { ...row.history, patient: row.patient } ;
  return { history: h };
};


