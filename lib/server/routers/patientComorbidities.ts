import { getPatientComorbidityById, getPatientComorbidities } from "@/lib/api/patientComorbidities/queries";
import { publicProcedure, router } from "@/lib/server/trpc";
import {
  patientComorbidityIdSchema,
  insertPatientComorbidityParams,
  updatePatientComorbidityParams,
} from "@/lib/db/schema/patientComorbidities";
import { createPatientComorbidity, deletePatientComorbidity, updatePatientComorbidity } from "@/lib/api/patientComorbidities/mutations";

export const patientComorbiditiesRouter = router({
  getPatientComorbidities: publicProcedure.query(async () => {
    return getPatientComorbidities();
  }),
  getPatientComorbidityById: publicProcedure.input(patientComorbidityIdSchema).query(async ({ input }) => {
    return getPatientComorbidityById(input.id);
  }),
  createPatientComorbidity: publicProcedure
    .input(insertPatientComorbidityParams)
    .mutation(async ({ input }) => {
      return createPatientComorbidity(input);
    }),
  updatePatientComorbidity: publicProcedure
    .input(updatePatientComorbidityParams)
    .mutation(async ({ input }) => {
      return updatePatientComorbidity(input.id, input);
    }),
  deletePatientComorbidity: publicProcedure
    .input(patientComorbidityIdSchema)
    .mutation(async ({ input }) => {
      return deletePatientComorbidity(input.id);
    }),
});
