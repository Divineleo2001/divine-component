import { getVitalById, getVitals } from "@/lib/api/vitals/queries";
import { publicProcedure, router } from "@/lib/server/trpc";
import {
  vitalIdSchema,
  insertVitalParams,
  updateVitalParams,
} from "@/lib/db/schema/vitals";
import { createVital, deleteVital, updateVital } from "@/lib/api/vitals/mutations";

export const vitalsRouter = router({
  getVitals: publicProcedure.query(async () => {
    return getVitals();
  }),
  getVitalById: publicProcedure.input(vitalIdSchema).query(async ({ input }) => {
    return getVitalById(input.id);
  }),
  createVital: publicProcedure
    .input(insertVitalParams)
    .mutation(async ({ input }) => {
      return createVital(input);
    }),
  updateVital: publicProcedure
    .input(updateVitalParams)
    .mutation(async ({ input }) => {
      return updateVital(input.id, input);
    }),
  deleteVital: publicProcedure
    .input(vitalIdSchema)
    .mutation(async ({ input }) => {
      return deleteVital(input.id);
    }),
});
