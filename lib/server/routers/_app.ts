import { computersRouter } from "./computers";
import { router } from "@/lib/server/trpc";
import { patientsRouter } from "./patients";
import { vitalsRouter } from "./vitals";
import { commentsRouter } from "./comments";
import { historiesRouter } from "./histories";
import { patientComorbiditiesRouter } from "./patientComorbidities";
import { patientDisabilitiesRouter } from "./patientDisabilities";

export const appRouter = router({
  computers: computersRouter,
  patients: patientsRouter,
  vitals: vitalsRouter,
  comments: commentsRouter,
  histories: historiesRouter,
  patientComorbidities: patientComorbiditiesRouter,
  patientDisabilities: patientDisabilitiesRouter,
});

export type AppRouter = typeof appRouter;
