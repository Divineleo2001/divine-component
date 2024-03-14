"use server";

import { revalidatePath } from "next/cache";
import {
  createDisability,
  deleteDisability,
  updateDisability,
} from "@/lib/api/disabilities/mutations";
import {
  DisabilityId,
  NewDisabilityParams,
  UpdateDisabilityParams,
  disabilityIdSchema,
  insertDisabilityParams,
  updateDisabilityParams,
} from "@/lib/db/schema/disabilities";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateDisabilities = () => revalidatePath("/disabilities");

export const createDisabilityAction = async (input: NewDisabilityParams) => {
  try {
    const payload = insertDisabilityParams.parse(input);
    await createDisability(payload);
    revalidateDisabilities();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateDisabilityAction = async (input: UpdateDisabilityParams) => {
  try {
    const payload = updateDisabilityParams.parse(input);
    await updateDisability(payload.id, payload);
    revalidateDisabilities();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteDisabilityAction = async (input: DisabilityId) => {
  try {
    const payload = disabilityIdSchema.parse({ id: input });
    await deleteDisability(payload.id);
    revalidateDisabilities();
  } catch (e) {
    return handleErrors(e);
  }
};