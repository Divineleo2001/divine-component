import { db } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import { 
  HistoryId, 
  NewHistoryParams,
  UpdateHistoryParams, 
  updateHistorySchema,
  insertHistorySchema, 
  histories,
  historyIdSchema 
} from "@/lib/db/schema/histories";
import { getUserAuth } from "@/lib/auth/utils";

export const createHistory = async (history: NewHistoryParams) => {
  const { session } = await getUserAuth();
  const newHistory = insertHistorySchema.parse({ ...history, userId: session?.user.id! });
  try {
    await db.insert(histories).values(newHistory)
    return { success: true }
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateHistory = async (id: HistoryId, history: UpdateHistoryParams) => {
  const { session } = await getUserAuth();
  const { id: historyId } = historyIdSchema.parse({ id });
  const newHistory = updateHistorySchema.parse({ ...history, userId: session?.user.id! });
  try {
    await db
     .update(histories)
     .set({...newHistory, updatedAt: new Date() })
     .where(and(eq(histories.id, historyId!), eq(histories.userId, session?.user.id!)))
    return {success: true}
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteHistory = async (id: HistoryId) => {
  const { session } = await getUserAuth();
  const { id: historyId } = historyIdSchema.parse({ id });
  try {
    await db.delete(histories).where(and(eq(histories.id, historyId!), eq(histories.userId, session?.user.id!)))
    return {success: true}
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

