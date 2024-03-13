
import { type Comorbidity, type CompleteComorbidity } from "@/lib/db/schema/comorbidities";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Comorbidity>) => void;

export const useOptimisticComorbidities = (
  comorbidities: CompleteComorbidity[],
  
) => {
  const [optimisticComorbidities, addOptimisticComorbidity] = useOptimistic(
    comorbidities,
    (
      currentState: CompleteComorbidity[],
      action: OptimisticAction<Comorbidity>,
    ): CompleteComorbidity[] => {
      const { data } = action;

      

      const optimisticComorbidity = {
        ...data,
        
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticComorbidity]
            : [...currentState, optimisticComorbidity];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticComorbidity } : item,
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

  return { addOptimisticComorbidity, optimisticComorbidities };
};
