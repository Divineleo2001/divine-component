import { computersRouter } from "./computers";
import { router } from "@/lib/server/trpc";
import { patientsRouter } from "./patients";
import { commentsRouter } from "./comments";

export const appRouter = router({
  computers: computersRouter,
  patients: patientsRouter,
  comments: commentsRouter,
});

export type AppRouter = typeof appRouter;
