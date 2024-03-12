"use server";

import { revalidatePath } from "next/cache";
import {
  createHistory,
  deleteHistory,
  updateHistory,
} from "@/lib/api/histories/mutations";
import {
  HistoryId,
  NewHistoryParams,
  UpdateHistoryParams,
  historyIdSchema,
  insertHistoryParams,
  updateHistoryParams,
} from "@/lib/db/schema/histories";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateHistories = () => revalidatePath("/histories");

export const createHistoryAction = async (input: NewHistoryParams) => {
  try {
    const payload = insertHistoryParams.parse(input);
    await createHistory(payload);
    revalidateHistories();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateHistoryAction = async (input: UpdateHistoryParams) => {
  try {
    const payload = updateHistoryParams.parse(input);
    await updateHistory(payload.id, payload);
    revalidateHistories();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteHistoryAction = async (input: HistoryId) => {
  try {
    const payload = historyIdSchema.parse({ id: input });
    await deleteHistory(payload.id);
    revalidateHistories();
  } catch (e) {
    return handleErrors(e);
  }
};