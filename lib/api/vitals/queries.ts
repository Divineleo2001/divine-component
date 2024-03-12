import { db } from "@/lib/db/index";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { type VitalId, vitalIdSchema, vitals } from "@/lib/db/schema/vitals";
import { patients } from "@/lib/db/schema/patients";

export const getVitals = async () => {
  const { session } = await getUserAuth();
  const rows = await db.select({ vital: vitals, patient: patients }).from(vitals).leftJoin(patients, eq(vitals.patientId, patients.id)).where(eq(vitals.userId, session?.user.id!));
  const v = rows .map((r) => ({ ...r.vital, patient: r.patient})); 
  return { vitals: v };
};

export const getVitalById = async (id: VitalId) => {
  const { session } = await getUserAuth();
  const { id: vitalId } = vitalIdSchema.parse({ id });
  const [row] = await db.select({ vital: vitals, patient: patients }).from(vitals).where(and(eq(vitals.id, vitalId), eq(vitals.userId, session?.user.id!))).leftJoin(patients, eq(vitals.patientId, patients.id));
  if (row === undefined) return {};
  const v =  { ...row.vital, patient: row.patient } ;
  return { vital: v };
};


