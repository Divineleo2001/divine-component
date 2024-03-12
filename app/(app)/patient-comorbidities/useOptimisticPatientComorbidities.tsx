import { type Patient } from "@/lib/db/schema/patients";
import { type PatientComorbidity, type CompletePatientComorbidity } from "@/lib/db/schema/patientComorbidities";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<PatientComorbidity>) => void;

export const useOptimisticPatientComorbidities = (
  patientComorbidities: CompletePatientComorbidity[],
  patients: Patient[]
) => {
  const [optimisticPatientComorbidities, addOptimisticPatientComorbidity] = useOptimistic(
    patientComorbidities,
    (
      currentState: CompletePatientComorbidity[],
      action: OptimisticAction<PatientComorbidity>,
    ): CompletePatientComorbidity[] => {
      const { data } = action;

      const optimisticPatient = patients.find(
        (patient) => patient.id === data.patientId,
      )!;

      const optimisticPatientComorbidity = {
        ...data,
        patient: optimisticPatient,
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticPatientComorbidity]
            : [...currentState, optimisticPatientComorbidity];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticPatientComorbidity } : item,
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

  return { addOptimisticPatientComorbidity, optimisticPatientComorbidities };
};
