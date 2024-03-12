import { db } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import { 
  VitalId, 
  NewVitalParams,
  UpdateVitalParams, 
  updateVitalSchema,
  insertVitalSchema, 
  vitals,
  vitalIdSchema 
} from "@/lib/db/schema/vitals";
import { getUserAuth } from "@/lib/auth/utils";

export const createVital = async (vital: NewVitalParams) => {
  const { session } = await getUserAuth();
  const newVital = insertVitalSchema.parse({ ...vital, userId: session?.user.id! });
  try {
    await db.insert(vitals).values(newVital)
    return { success: true }
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateVital = async (id: VitalId, vital: UpdateVitalParams) => {
  const { session } = await getUserAuth();
  const { id: vitalId } = vitalIdSchema.parse({ id });
  const newVital = updateVitalSchema.parse({ ...vital, userId: session?.user.id! });
  try {
    await db
     .update(vitals)
     .set({...newVital, updatedAt: new Date() })
     .where(and(eq(vitals.id, vitalId!), eq(vitals.userId, session?.user.id!)))
    return {success: true}
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteVital = async (id: VitalId) => {
  const { session } = await getUserAuth();
  const { id: vitalId } = vitalIdSchema.parse({ id });
  try {
    await db.delete(vitals).where(and(eq(vitals.id, vitalId!), eq(vitals.userId, session?.user.id!)))
    return {success: true}
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

