import { db } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import { 
  PatientId, 
  NewPatientParams,
  UpdatePatientParams, 
  updatePatientSchema,
  insertPatientSchema, 
  patients,
  patientIdSchema 
} from "@/lib/db/schema/patients";
import { getUserAuth } from "@/lib/auth/utils";

export const createPatient = async (patient: NewPatientParams) => {
  const { session } = await getUserAuth();
  const newPatient = insertPatientSchema.parse({ ...patient, userId: session?.user.id! });
  try {
    await db.insert(patients).values(newPatient)
    return { success: true }
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updatePatient = async (id: PatientId, patient: UpdatePatientParams) => {
  const { session } = await getUserAuth();
  const { id: patientId } = patientIdSchema.parse({ id });
  const newPatient = updatePatientSchema.parse({ ...patient, userId: session?.user.id! });
  try {
    await db
     .update(patients)
     .set({...newPatient, updatedAt: new Date() })
     .where(and(eq(patients.id, patientId!), eq(patients.userId, session?.user.id!)))
    return {success: true}
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deletePatient = async (id: PatientId) => {
  const { session } = await getUserAuth();
  const { id: patientId } = patientIdSchema.parse({ id });
  try {
    await db.delete(patients).where(and(eq(patients.id, patientId!), eq(patients.userId, session?.user.id!)))
    return {success: true}
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

