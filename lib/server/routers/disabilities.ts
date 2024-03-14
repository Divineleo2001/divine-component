import { getDisabilityById, getDisabilities } from "@/lib/api/disabilities/queries";
import { publicProcedure, router } from "@/lib/server/trpc";
import {
  disabilityIdSchema,
  insertDisabilityParams,
  updateDisabilityParams,
} from "@/lib/db/schema/disabilities";
import { createDisability, deleteDisability, updateDisability } from "@/lib/api/disabilities/mutations";

export const disabilitiesRouter = router({
  getDisabilities: publicProcedure.query(async () => {
    return getDisabilities();
  }),
  getDisabilityById: publicProcedure.input(disabilityIdSchema).query(async ({ input }) => {
    return getDisabilityById(input.id);
  }),
  createDisability: publicProcedure
    .input(insertDisabilityParams)
    .mutation(async ({ input }) => {
      return createDisability(input);
    }),
  updateDisability: publicProcedure
    .input(updateDisabilityParams)
    .mutation(async ({ input }) => {
      return updateDisability(input.id, input);
    }),
  deleteDisability: publicProcedure
    .input(disabilityIdSchema)
    .mutation(async ({ input }) => {
      return deleteDisability(input.id);
    }),
});
