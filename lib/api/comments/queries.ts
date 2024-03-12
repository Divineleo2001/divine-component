import { db } from "@/lib/db/index";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { type CommentId, commentIdSchema, comments } from "@/lib/db/schema/comments";
import { patients } from "@/lib/db/schema/patients";

export const getComments = async () => {
  const { session } = await getUserAuth();
  const rows = await db.select({ comment: comments, patient: patients }).from(comments).leftJoin(patients, eq(comments.patientId, patients.id)).where(eq(comments.userId, session?.user.id!));
  const c = rows .map((r) => ({ ...r.comment, patient: r.patient})); 
  return { comments: c };
};

export const getCommentById = async (id: CommentId) => {
  const { session } = await getUserAuth();
  const { id: commentId } = commentIdSchema.parse({ id });
  const [row] = await db.select({ comment: comments, patient: patients }).from(comments).where(and(eq(comments.id, commentId), eq(comments.userId, session?.user.id!))).leftJoin(patients, eq(comments.patientId, patients.id));
  if (row === undefined) return {};
  const c =  { ...row.comment, patient: row.patient } ;
  return { comment: c };
};


