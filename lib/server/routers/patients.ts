import { getPatientById, getPatients } from "@/lib/api/patients/queries";
import { publicProcedure, router } from "@/lib/server/trpc";
import {
  patientIdSchema,
  insertPatientParams,
  updatePatientParams,
} from "@/lib/db/schema/patients";
import { createPatient, deletePatient, updatePatient } from "@/lib/api/patients/mutations";

export const patientsRouter = router({
  getPatients: publicProcedure.query(async () => {
    return getPatients();
  }),
  getPatientById: publicProcedure.input(patientIdSchema).query(async ({ input }) => {
    return getPatientById(input.id);
  }),
  createPatient: publicProcedure
    .input(insertPatientParams)
    .mutation(async ({ input }) => {
      return createPatient(input);
    }),
  updatePatient: publicProcedure
    .input(updatePatientParams)
    .mutation(async ({ input }) => {
      return updatePatient(input.id, input);
    }),
  deletePatient: publicProcedure
    .input(patientIdSchema)
    .mutation(async ({ input }) => {
      return deletePatient(input.id);
    }),
});
