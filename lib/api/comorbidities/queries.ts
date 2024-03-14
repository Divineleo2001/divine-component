import { db } from "@/lib/db/index";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { type ComorbidityId, comorbidityIdSchema, comorbidities } from "@/lib/db/schema/comorbidities";

export const getComorbidities = async () => {
  const { session } = await getUserAuth();
  const rows = await db.select().from(comorbidities).where(eq(comorbidities.userId, session?.user.id!));
  const c = rows
  return { comorbidities: c };
};

export const getComorbidityById = async (id: ComorbidityId) => {
  const { session } = await getUserAuth();
  const { id: comorbidityId } = comorbidityIdSchema.parse({ id });
  const [row] = await db.select().from(comorbidities).where(and(eq(comorbidities.id, comorbidityId), eq(comorbidities.userId, session?.user.id!)));
  if (row === undefined) return {};
  const c = row;
  return { comorbidity: c };
};


