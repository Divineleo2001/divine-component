"use server";

import { revalidatePath } from "next/cache";
import {
  createPatientDisability,
  deletePatientDisability,
  updatePatientDisability,
} from "@/lib/api/patientDisabilities/mutations";
import {
  PatientDisabilityId,
  NewPatientDisabilityParams,
  UpdatePatientDisabilityParams,
  patientDisabilityIdSchema,
  insertPatientDisabilityParams,
  updatePatientDisabilityParams,
} from "@/lib/db/schema/patientDisabilities";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidatePatientDisabilities = () => revalidatePath("/patient-disabilities");

export const createPatientDisabilityAction = async (input: NewPatientDisabilityParams) => {
  try {
    const payload = insertPatientDisabilityParams.parse(input);
    await createPatientDisability(payload);
    revalidatePatientDisabilities();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updatePatientDisabilityAction = async (input: UpdatePatientDisabilityParams) => {
  try {
    const payload = updatePatientDisabilityParams.parse(input);
    await updatePatientDisability(payload.id, payload);
    revalidatePatientDisabilities();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deletePatientDisabilityAction = async (input: PatientDisabilityId) => {
  try {
    const payload = patientDisabilityIdSchema.parse({ id: input });
    await deletePatientDisability(payload.id);
    revalidatePatientDisabilities();
  } catch (e) {
    return handleErrors(e);
  }
};