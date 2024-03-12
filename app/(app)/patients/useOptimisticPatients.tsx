
import { type Patient, type CompletePatient } from "@/lib/db/schema/patients";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Patient>) => void;

export const useOptimisticPatients = (
  patients: CompletePatient[],
  
) => {
  const [optimisticPatients, addOptimisticPatient] = useOptimistic(
    patients,
    (
      currentState: CompletePatient[],
      action: OptimisticAction<Patient>,
    ): CompletePatient[] => {
      const { data } = action;

      

      const optimisticPatient = {
        ...data,
        
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticPatient]
            : [...currentState, optimisticPatient];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticPatient } : item,
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

  return { addOptimisticPatient, optimisticPatients };
};
