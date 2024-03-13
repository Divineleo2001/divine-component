
import { type Disability, type CompleteDisability } from "@/lib/db/schema/disabilities";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Disability>) => void;

export const useOptimisticDisabilities = (
  disabilities: CompleteDisability[],
  
) => {
  const [optimisticDisabilities, addOptimisticDisability] = useOptimistic(
    disabilities,
    (
      currentState: CompleteDisability[],
      action: OptimisticAction<Disability>,
    ): CompleteDisability[] => {
      const { data } = action;

      

      const optimisticDisability = {
        ...data,
        
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticDisability]
            : [...currentState, optimisticDisability];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticDisability } : item,
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

  return { addOptimisticDisability, optimisticDisabilities };
};
