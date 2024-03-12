"use server";

import { revalidatePath } from "next/cache";
import {
  createPatient,
  deletePatient,
  updatePatient,
} from "@/lib/api/patients/mutations";
import {
  PatientId,
  NewPatientParams,
  UpdatePatientParams,
  patientIdSchema,
  insertPatientParams,
  updatePatientParams,
} from "@/lib/db/schema/patients";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidatePatients = () => revalidatePath("/patients");

export const createPatientAction = async (input: NewPatientParams) => {
  try {
    const payload = insertPatientParams.parse(input);
    await createPatient(payload);
    revalidatePatients();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updatePatientAction = async (input: UpdatePatientParams) => {
  try {
    const payload = updatePatientParams.parse(input);
    await updatePatient(payload.id, payload);
    revalidatePatients();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deletePatientAction = async (input: PatientId) => {
  try {
    const payload = patientIdSchema.parse({ id: input });
    await deletePatient(payload.id);
    revalidatePatients();
  } catch (e) {
    return handleErrors(e);
  }
};