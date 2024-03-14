import { getComorbidityById, getComorbidities } from "@/lib/api/comorbidities/queries";
import { publicProcedure, router } from "@/lib/server/trpc";
import {
  comorbidityIdSchema,
  insertComorbidityParams,
  updateComorbidityParams,
} from "@/lib/db/schema/comorbidities";
import { createComorbidity, deleteComorbidity, updateComorbidity } from "@/lib/api/comorbidities/mutations";

export const comorbiditiesRouter = router({
  getComorbidities: publicProcedure.query(async () => {
    return getComorbidities();
  }),
  getComorbidityById: publicProcedure.input(comorbidityIdSchema).query(async ({ input }) => {
    return getComorbidityById(input.id);
  }),
  createComorbidity: publicProcedure
    .input(insertComorbidityParams)
    .mutation(async ({ input }) => {
      return createComorbidity(input);
    }),
  updateComorbidity: publicProcedure
    .input(updateComorbidityParams)
    .mutation(async ({ input }) => {
      return updateComorbidity(input.id, input);
    }),
  deleteComorbidity: publicProcedure
    .input(comorbidityIdSchema)
    .mutation(async ({ input }) => {
      return deleteComorbidity(input.id);
    }),
});
