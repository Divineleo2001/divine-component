import { type Patient } from "@/lib/db/schema/patients";
import { type PatientDisability, type CompletePatientDisability } from "@/lib/db/schema/patientDisabilities";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<PatientDisability>) => void;

export const useOptimisticPatientDisabilities = (
  patientDisabilities: CompletePatientDisability[],
  patients: Patient[]
) => {
  const [optimisticPatientDisabilities, addOptimisticPatientDisability] = useOptimistic(
    patientDisabilities,
    (
      currentState: CompletePatientDisability[],
      action: OptimisticAction<PatientDisability>,
    ): CompletePatientDisability[] => {
      const { data } = action;

      const optimisticPatient = patients.find(
        (patient) => patient.id === data.patientId,
      )!;

      const optimisticPatientDisability = {
        ...data,
        patient: optimisticPatient,
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticPatientDisability]
            : [...currentState, optimisticPatientDisability];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticPatientDisability } : item,
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

  return { addOptimisticPatientDisability, optimisticPatientDisabilities };
};
