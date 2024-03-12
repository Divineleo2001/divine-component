import { sql } from "drizzle-orm";
import { text, int, varchar, timestamp, mysqlTable, uniqueIndex } from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { patients } from "./patients"
import { type getComments } from "@/lib/api/comments/queries";

import { nanoid, timestamps } from "@/lib/utils";


export const comments = mysqlTable('comments', {
  id: varchar("id", { length: 191 }).primaryKey().$defaultFn(() => nanoid()),
  comment: text("comment").notNull(),
  commentId: int("comment_id").autoincrement(),
  patientId: varchar("patient_id", { length: 256 }).references(() => patients.id, { onDelete: "cascade" }).notNull(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),

}, (comments) => {
  return {
    commentIdIndex: uniqueIndex('comment_comment_id_idx').on(comments.commentId),
  }
});


// Schema for comments - used to validate API requests
const baseSchema = createSelectSchema(comments).omit(timestamps)

export const insertCommentSchema = createInsertSchema(comments).omit(timestamps);
export const insertCommentParams = baseSchema.extend({
  commentId: z.coerce.number(),
  patientId: z.coerce.string().min(1)
}).omit({ 
  id: true,
  userId: true
});

export const updateCommentSchema = baseSchema;
export const updateCommentParams = baseSchema.extend({
  commentId: z.coerce.number(),
  patientId: z.coerce.string().min(1)
}).omit({ 
  userId: true
});
export const commentIdSchema = baseSchema.pick({ id: true });

// Types for comments - used to type API request params and within Components
export type Comment = typeof comments.$inferSelect;
export type NewComment = z.infer<typeof insertCommentSchema>;
export type NewCommentParams = z.infer<typeof insertCommentParams>;
export type UpdateCommentParams = z.infer<typeof updateCommentParams>;
export type CommentId = z.infer<typeof commentIdSchema>["id"];
    
// this type infers the return from getComments() - meaning it will include any joins
export type CompleteComment = Awaited<ReturnType<typeof getComments>>["comments"][number];

