"use server";

import { revalidatePath } from "next/cache";
import {
  createPatientComorbidity,
  deletePatientComorbidity,
  updatePatientComorbidity,
} from "@/lib/api/patientComorbidities/mutations";
import {
  PatientComorbidityId,
  NewPatientComorbidityParams,
  UpdatePatientComorbidityParams,
  patientComorbidityIdSchema,
  insertPatientComorbidityParams,
  updatePatientComorbidityParams,
} from "@/lib/db/schema/patientComorbidities";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidatePatientComorbidities = () => revalidatePath("/patient-comorbidities");

export const createPatientComorbidityAction = async (input: NewPatientComorbidityParams) => {
  try {
    const payload = insertPatientComorbidityParams.parse(input);
    await createPatientComorbidity(payload);
    revalidatePatientComorbidities();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updatePatientComorbidityAction = async (input: UpdatePatientComorbidityParams) => {
  try {
    const payload = updatePatientComorbidityParams.parse(input);
    await updatePatientComorbidity(payload.id, payload);
    revalidatePatientComorbidities();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deletePatientComorbidityAction = async (input: PatientComorbidityId) => {
  try {
    const payload = patientComorbidityIdSchema.parse({ id: input });
    await deletePatientComorbidity(payload.id);
    revalidatePatientComorbidities();
  } catch (e) {
    return handleErrors(e);
  }
};