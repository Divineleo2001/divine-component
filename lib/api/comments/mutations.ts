import { db } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import { 
  CommentId, 
  NewCommentParams,
  UpdateCommentParams, 
  updateCommentSchema,
  insertCommentSchema, 
  comments,
  commentIdSchema 
} from "@/lib/db/schema/comments";
import { getUserAuth } from "@/lib/auth/utils";

export const createComment = async (comment: NewCommentParams) => {
  const { session } = await getUserAuth();
  const newComment = insertCommentSchema.parse({ ...comment, userId: session?.user.id! });
  try {
    await db.insert(comments).values(newComment)
    return { success: true }
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateComment = async (id: CommentId, comment: UpdateCommentParams) => {
  const { session } = await getUserAuth();
  const { id: commentId } = commentIdSchema.parse({ id });
  const newComment = updateCommentSchema.parse({ ...comment, userId: session?.user.id! });
  try {
    await db
     .update(comments)
     .set({...newComment, updatedAt: new Date() })
     .where(and(eq(comments.id, commentId!), eq(comments.userId, session?.user.id!)))
    return {success: true}
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteComment = async (id: CommentId) => {
  const { session } = await getUserAuth();
  const { id: commentId } = commentIdSchema.parse({ id });
  try {
    await db.delete(comments).where(and(eq(comments.id, commentId!), eq(comments.userId, session?.user.id!)))
    return {success: true}
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

