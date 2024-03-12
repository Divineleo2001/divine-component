import { getHistoryById, getHistories } from "@/lib/api/histories/queries";
import { publicProcedure, router } from "@/lib/server/trpc";
import {
  historyIdSchema,
  insertHistoryParams,
  updateHistoryParams,
} from "@/lib/db/schema/histories";
import { createHistory, deleteHistory, updateHistory } from "@/lib/api/histories/mutations";

export const historiesRouter = router({
  getHistories: publicProcedure.query(async () => {
    return getHistories();
  }),
  getHistoryById: publicProcedure.input(historyIdSchema).query(async ({ input }) => {
    return getHistoryById(input.id);
  }),
  createHistory: publicProcedure
    .input(insertHistoryParams)
    .mutation(async ({ input }) => {
      return createHistory(input);
    }),
  updateHistory: publicProcedure
    .input(updateHistoryParams)
    .mutation(async ({ input }) => {
      return updateHistory(input.id, input);
    }),
  deleteHistory: publicProcedure
    .input(historyIdSchema)
    .mutation(async ({ input }) => {
      return deleteHistory(input.id);
    }),
});
