"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/patient-disabilities/useOptimisticPatientDisabilities";
import { type PatientDisability } from "@/lib/db/schema/patientDisabilities";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import PatientDisabilityForm from "@/components/patientDisabilities/PatientDisabilityForm";
import { type Patient, type PatientId } from "@/lib/db/schema/patients";

export default function OptimisticPatientDisability({ 
  patientDisability,
  patients,
  patientId 
}: { 
  patientDisability: PatientDisability; 
  
  patients: Patient[];
  patientId?: PatientId
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: PatientDisability) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticPatientDisability, setOptimisticPatientDisability] = useOptimistic(patientDisability);
  const updatePatientDisability: TAddOptimistic = (input) =>
    setOptimisticPatientDisability({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <PatientDisabilityForm
          patientDisability={optimisticPatientDisability}
          patients={patients}
        patientId={patientId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updatePatientDisability}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticPatientDisability.disabilityName}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticPatientDisability.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticPatientDisability, null, 2)}
      </pre>
    </div>
  );
}
