import { db } from "@/lib/db/index";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { type PatientComorbidityId, patientComorbidityIdSchema, patientComorbidities } from "@/lib/db/schema/patientComorbidities";
import { patients } from "@/lib/db/schema/patients";
import { comorbidities } from "@/lib/db/schema/comorbidities";

export const getPatientComorbidities = async () => {
  const { session } = await getUserAuth();
  const rows = await db.select({ patientComorbidity: patientComorbidities, patient: patients}).from(patientComorbidities).leftJoin(patients, eq(patientComorbidities.patientId, patients.id)).where(eq(patientComorbidities.userId, session?.user.id!));
  const p = rows .map((r) => ({ ...r.patientComorbidity, patient: r.patient})); 
  return { patientComorbidities: p };
};

export const getPatientComorbidityById = async (id: PatientComorbidityId) => {
  const { session } = await getUserAuth();
  const { id: patientComorbidityId } = patientComorbidityIdSchema.parse({ id });
  const [row] = await db.select({ patientComorbidity: patientComorbidities, patient: patients }).from(patientComorbidities).where(and(eq(patientComorbidities.id, patientComorbidityId), eq(patientComorbidities.userId, session?.user.id!))).leftJoin(patients, eq(patientComorbidities.patientId, patients.id));
  if (row === undefined) return {};
  const p =  { ...row.patientComorbidity, patient: row.patient } ;
  return { patientComorbidity: p };
};


