import { type Patient } from "@/lib/db/schema/patients";
import { type History, type CompleteHistory } from "@/lib/db/schema/histories";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<History>) => void;

export const useOptimisticHistories = (
  histories: CompleteHistory[],
  patients: Patient[]
) => {
  const [optimisticHistories, addOptimisticHistory] = useOptimistic(
    histories,
    (
      currentState: CompleteHistory[],
      action: OptimisticAction<History>,
    ): CompleteHistory[] => {
      const { data } = action;

      const optimisticPatient = patients.find(
        (patient) => patient.id === data.patientId,
      )!;

      const optimisticHistory = {
        ...data,
        patient: optimisticPatient,
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticHistory]
            : [...currentState, optimisticHistory];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticHistory } : item,
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

  return { addOptimisticHistory, optimisticHistories };
};
