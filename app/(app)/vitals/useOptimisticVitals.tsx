import { type Patient } from "@/lib/db/schema/patients";
import { type Vital, type CompleteVital } from "@/lib/db/schema/vitals";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Vital>) => void;

export const useOptimisticVitals = (
  vitals: CompleteVital[],
  patients: Patient[]
) => {
  const [optimisticVitals, addOptimisticVital] = useOptimistic(
    vitals,
    (
      currentState: CompleteVital[],
      action: OptimisticAction<Vital>,
    ): CompleteVital[] => {
      const { data } = action;

      const optimisticPatient = patients.find(
        (patient) => patient.id === data.patientId,
      )!;

      const optimisticVital = {
        ...data,
        patient: optimisticPatient,
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticVital]
            : [...currentState, optimisticVital];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticVital } : item,
          );
        case "delete":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, id: "delete" } : item,
          );
        default:
          return currentState;
      }
    },
  );

  return { addOptimisticVital, optimisticVitals };
};
