"use server";

import { revalidatePath } from "next/cache";
import {
  createVital,
  deleteVital,
  updateVital,
} from "@/lib/api/vitals/mutations";
import {
  VitalId,
  NewVitalParams,
  UpdateVitalParams,
  vitalIdSchema,
  insertVitalParams,
  updateVitalParams,
} from "@/lib/db/schema/vitals";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateVitals = () => revalidatePath("/vitals");

export const createVitalAction = async (input: NewVitalParams) => {
  try {
    const payload = insertVitalParams.parse(input);
    await createVital(payload);
    revalidateVitals();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateVitalAction = async (input: UpdateVitalParams) => {
  try {
    const payload = updateVitalParams.parse(input);
    await updateVital(payload.id, payload);
    revalidateVitals();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteVitalAction = async (input: VitalId) => {
  try {
    const payload = vitalIdSchema.parse({ id: input });
    await deleteVital(payload.id);
    revalidateVitals();
  } catch (e) {
    return handleErrors(e);
  }
};