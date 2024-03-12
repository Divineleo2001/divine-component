"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/patient-comorbidities/useOptimisticPatientComorbidities";
import { type PatientComorbidity } from "@/lib/db/schema/patientComorbidities";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import PatientComorbidityForm from "@/components/patientComorbidities/PatientComorbidityForm";
import { type Patient, type PatientId } from "@/lib/db/schema/patients";

export default function OptimisticPatientComorbidity({ 
  patientComorbidity,
  patients,
  patientId 
}: { 
  patientComorbidity: PatientComorbidity; 
  
  patients: Patient[];
  patientId?: PatientId
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: PatientComorbidity) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticPatientComorbidity, setOptimisticPatientComorbidity] = useOptimistic(patientComorbidity);
  const updatePatientComorbidity: TAddOptimistic = (input) =>
    setOptimisticPatientComorbidity({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <PatientComorbidityForm
          patientComorbidity={optimisticPatientComorbidity}
          patients={patients}
        patientId={patientId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updatePatientComorbidity}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticPatientComorbidity.comorbidityName}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticPatientComorbidity.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticPatientComorbidity, null, 2)}
      </pre>
    </div>
  );
}
