import { type Patient } from "@/lib/db/schema/patients";
import { type Comment, type CompleteComment } from "@/lib/db/schema/comments";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Comment>) => void;

export const useOptimisticComments = (
  comments: CompleteComment[],
  patients: Patient[]
) => {
  const [optimisticComments, addOptimisticComment] = useOptimistic(
    comments,
    (
      currentState: CompleteComment[],
      action: OptimisticAction<Comment>,
    ): CompleteComment[] => {
      const { data } = action;

      const optimisticPatient = patients.find(
        (patient) => patient.id === data.patientId,
      )!;

      const optimisticComment = {
        ...data,
        patient: optimisticPatient,
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticComment]
            : [...currentState, optimisticComment];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticComment } : item,
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

  return { addOptimisticComment, optimisticComments };
};
