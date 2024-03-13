import { db } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import { 
  ComorbidityId, 
  NewComorbidityParams,
  UpdateComorbidityParams, 
  updateComorbiditySchema,
  insertComorbiditySchema, 
  comorbidities,
  comorbidityIdSchema 
} from "@/lib/db/schema/comorbidities";
import { getUserAuth } from "@/lib/auth/utils";

export const createComorbidity = async (comorbidity: NewComorbidityParams) => {
  const { session } = await getUserAuth();
  const newComorbidity = insertComorbiditySchema.parse({ ...comorbidity, userId: session?.user.id! });
  try {
    await db.insert(comorbidities).values(newComorbidity)
    return { success: true }
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateComorbidity = async (id: ComorbidityId, comorbidity: UpdateComorbidityParams) => {
  const { session } = await getUserAuth();
  const { id: comorbidityId } = comorbidityIdSchema.parse({ id });
  const newComorbidity = updateComorbiditySchema.parse({ ...comorbidity, userId: session?.user.id! });
  try {
    await db
     .update(comorbidities)
     .set({...newComorbidity, updatedAt: new Date() })
     .where(and(eq(comorbidities.id, comorbidityId!), eq(comorbidities.userId, session?.user.id!)))
    return {success: true}
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteComorbidity = async (id: ComorbidityId) => {
  const { session } = await getUserAuth();
  const { id: comorbidityId } = comorbidityIdSchema.parse({ id });
  try {
    await db.delete(comorbidities).where(and(eq(comorbidities.id, comorbidityId!), eq(comorbidities.userId, session?.user.id!)))
    return {success: true}
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

