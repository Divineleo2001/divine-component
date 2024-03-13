import { db } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import { 
  DisabilityId, 
  NewDisabilityParams,
  UpdateDisabilityParams, 
  updateDisabilitySchema,
  insertDisabilitySchema, 
  disabilities,
  disabilityIdSchema 
} from "@/lib/db/schema/disabilities";
import { getUserAuth } from "@/lib/auth/utils";

export const createDisability = async (disability: NewDisabilityParams) => {
  const { session } = await getUserAuth();
  const newDisability = insertDisabilitySchema.parse({ ...disability, userId: session?.user.id! });
  try {
    await db.insert(disabilities).values(newDisability)
    return { success: true }
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateDisability = async (id: DisabilityId, disability: UpdateDisabilityParams) => {
  const { session } = await getUserAuth();
  const { id: disabilityId } = disabilityIdSchema.parse({ id });
  const newDisability = updateDisabilitySchema.parse({ ...disability, userId: session?.user.id! });
  try {
    await db
     .update(disabilities)
     .set({...newDisability, updatedAt: new Date() })
     .where(and(eq(disabilities.id, disabilityId!), eq(disabilities.userId, session?.user.id!)))
    return {success: true}
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteDisability = async (id: DisabilityId) => {
  const { session } = await getUserAuth();
  const { id: disabilityId } = disabilityIdSchema.parse({ id });
  try {
    await db.delete(disabilities).where(and(eq(disabilities.id, disabilityId!), eq(disabilities.userId, session?.user.id!)))
    return {success: true}
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

