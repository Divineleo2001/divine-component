import { getPatientDisabilityById, getPatientDisabilities } from "@/lib/api/patientDisabilities/queries";
import { publicProcedure, router } from "@/lib/server/trpc";
import {
  patientDisabilityIdSchema,
  insertPatientDisabilityParams,
  updatePatientDisabilityParams,
} from "@/lib/db/schema/patientDisabilities";
import { createPatientDisability, deletePatientDisability, updatePatientDisability } from "@/lib/api/patientDisabilities/mutations";

export const patientDisabilitiesRouter = router({
  getPatientDisabilities: publicProcedure.query(async () => {
    return getPatientDisabilities();
  }),
  getPatientDisabilityById: publicProcedure.input(patientDisabilityIdSchema).query(async ({ input }) => {
    return getPatientDisabilityById(input.id);
  }),
  createPatientDisability: publicProcedure
    .input(insertPatientDisabilityParams)
    .mutation(async ({ input }) => {
      return createPatientDisability(input);
    }),
  updatePatientDisability: publicProcedure
    .input(updatePatientDisabilityParams)
    .mutation(async ({ input }) => {
      return updatePatientDisability(input.id, input);
    }),
  deletePatientDisability: publicProcedure
    .input(patientDisabilityIdSchema)
    .mutation(async ({ input }) => {
      return deletePatientDisability(input.id);
    }),
});
