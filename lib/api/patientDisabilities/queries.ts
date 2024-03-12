import { db } from "@/lib/db/index";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { type PatientDisabilityId, patientDisabilityIdSchema, patientDisabilities } from "@/lib/db/schema/patientDisabilities";
import { patients } from "@/lib/db/schema/patients";

export const getPatientDisabilities = async () => {
  const { session } = await getUserAuth();
  const rows = await db.select({ patientDisability: patientDisabilities, patient: patients }).from(patientDisabilities).leftJoin(patients, eq(patientDisabilities.patientId, patients.id)).where(eq(patientDisabilities.userId, session?.user.id!));
  const p = rows .map((r) => ({ ...r.patientDisability, patient: r.patient})); 
  return { patientDisabilities: p };
};

export const getPatientDisabilityById = async (id: PatientDisabilityId) => {
  const { session } = await getUserAuth();
  const { id: patientDisabilityId } = patientDisabilityIdSchema.parse({ id });
  const [row] = await db.select({ patientDisability: patientDisabilities, patient: patients }).from(patientDisabilities).where(and(eq(patientDisabilities.id, patientDisabilityId), eq(patientDisabilities.userId, session?.user.id!))).leftJoin(patients, eq(patientDisabilities.patientId, patients.id));
  if (row === undefined) return {};
  const p =  { ...row.patientDisability, patient: row.patient } ;
  return { patientDisability: p };
};


