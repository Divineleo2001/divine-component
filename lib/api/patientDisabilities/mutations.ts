import { db } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import { 
  PatientDisabilityId, 
  NewPatientDisabilityParams,
  UpdatePatientDisabilityParams, 
  updatePatientDisabilitySchema,
  insertPatientDisabilitySchema, 
  patientDisabilities,
  patientDisabilityIdSchema 
} from "@/lib/db/schema/patientDisabilities";
import { getUserAuth } from "@/lib/auth/utils";

export const createPatientDisability = async (patientDisability: NewPatientDisabilityParams) => {
  const { session } = await getUserAuth();
  const newPatientDisability = insertPatientDisabilitySchema.parse({ ...patientDisability, userId: session?.user.id! });
  try {
    await db.insert(patientDisabilities).values(newPatientDisability)
    return { success: true }
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updatePatientDisability = async (id: PatientDisabilityId, patientDisability: UpdatePatientDisabilityParams) => {
  const { session } = await getUserAuth();
  const { id: patientDisabilityId } = patientDisabilityIdSchema.parse({ id });
  const newPatientDisability = updatePatientDisabilitySchema.parse({ ...patientDisability, userId: session?.user.id! });
  try {
    await db
     .update(patientDisabilities)
     .set({...newPatientDisability, updatedAt: new Date() })
     .where(and(eq(patientDisabilities.id, patientDisabilityId!), eq(patientDisabilities.userId, session?.user.id!)))
    return {success: true}
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deletePatientDisability = async (id: PatientDisabilityId) => {
  const { session } = await getUserAuth();
  const { id: patientDisabilityId } = patientDisabilityIdSchema.parse({ id });
  try {
    await db.delete(patientDisabilities).where(and(eq(patientDisabilities.id, patientDisabilityId!), eq(patientDisabilities.userId, session?.user.id!)))
    return {success: true}
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

