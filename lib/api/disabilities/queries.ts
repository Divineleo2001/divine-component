import { db } from "@/lib/db/index";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { type DisabilityId, disabilityIdSchema, disabilities } from "@/lib/db/schema/disabilities";

export const getDisabilities = async () => {
  const { session } = await getUserAuth();
  const rows = await db.select().from(disabilities).where(eq(disabilities.userId, session?.user.id!));
  const d = rows
  return { disabilities: d };
};

export const getDisabilityById = async (id: DisabilityId) => {
  const { session } = await getUserAuth();
  const { id: disabilityId } = disabilityIdSchema.parse({ id });
  const [row] = await db.select().from(disabilities).where(and(eq(disabilities.id, disabilityId), eq(disabilities.userId, session?.user.id!)));
  if (row === undefined) return {};
  const d = row;
  return { disability: d };
};


