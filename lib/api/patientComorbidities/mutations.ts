import { db } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import { 
  PatientComorbidityId, 
  NewPatientComorbidityParams,
  UpdatePatientComorbidityParams, 
  updatePatientComorbiditySchema,
  insertPatientComorbiditySchema, 
  patientComorbidities,
  patientComorbidityIdSchema 
} from "@/lib/db/schema/patientComorbidities";
import { getUserAuth } from "@/lib/auth/utils";

export const createPatientComorbidity = async (patientComorbidity: NewPatientComorbidityParams) => {
  const { session } = await getUserAuth();
  const newPatientComorbidity = insertPatientComorbiditySchema.parse({ ...patientComorbidity, userId: session?.user.id! });
  try {
    await db.insert(patientComorbidities).values(newPatientComorbidity)
    return { success: true }
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updatePatientComorbidity = async (id: PatientComorbidityId, patientComorbidity: UpdatePatientComorbidityParams) => {
  const { session } = await getUserAuth();
  const { id: patientComorbidityId } = patientComorbidityIdSchema.parse({ id });
  const newPatientComorbidity = updatePatientComorbiditySchema.parse({ ...patientComorbidity, userId: session?.user.id! });
  try {
    await db
     .update(patientComorbidities)
     .set({...newPatientComorbidity, updatedAt: new Date() })
     .where(and(eq(patientComorbidities.id, patientComorbidityId!), eq(patientComorbidities.userId, session?.user.id!)))
    return {success: true}
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deletePatientComorbidity = async (id: PatientComorbidityId) => {
  const { session } = await getUserAuth();
  const { id: patientComorbidityId } = patientComorbidityIdSchema.parse({ id });
  try {
    await db.delete(patientComorbidities).where(and(eq(patientComorbidities.id, patientComorbidityId!), eq(patientComorbidities.userId, session?.user.id!)))
    return {success: true}
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

