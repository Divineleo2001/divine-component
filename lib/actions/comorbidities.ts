"use server";

import { revalidatePath } from "next/cache";
import {
  createComorbidity,
  deleteComorbidity,
  updateComorbidity,
} from "@/lib/api/comorbidities/mutations";
import {
  ComorbidityId,
  NewComorbidityParams,
  UpdateComorbidityParams,
  comorbidityIdSchema,
  insertComorbidityParams,
  updateComorbidityParams,
} from "@/lib/db/schema/comorbidities";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateComorbidities = () => revalidatePath("/comorbidities");

export const createComorbidityAction = async (input: NewComorbidityParams) => {
  try {
    const payload = insertComorbidityParams.parse(input);
    await createComorbidity(payload);
    revalidateComorbidities();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateComorbidityAction = async (input: UpdateComorbidityParams) => {
  try {
    const payload = updateComorbidityParams.parse(input);
    await updateComorbidity(payload.id, payload);
    revalidateComorbidities();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteComorbidityAction = async (input: ComorbidityId) => {
  try {
    const payload = comorbidityIdSchema.parse({ id: input });
    await deleteComorbidity(payload.id);
    revalidateComorbidities();
  } catch (e) {
    return handleErrors(e);
  }
};