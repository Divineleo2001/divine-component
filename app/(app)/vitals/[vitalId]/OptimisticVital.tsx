"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/vitals/useOptimisticVitals";
import { type Vital } from "@/lib/db/schema/vitals";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import VitalForm from "@/components/vitals/VitalForm";
import { type Patient, type PatientId } from "@/lib/db/schema/patients";

export default function OptimisticVital({ 
  vital,
  patients,
  patientId 
}: { 
  vital: Vital; 
  
  patients: Patient[];
  patientId?: PatientId
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Vital) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticVital, setOptimisticVital] = useOptimistic(vital);
  const updateVital: TAddOptimistic = (input) =>
    setOptimisticVital({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <VitalForm
          vital={optimisticVital}
          patients={patients}
        patientId={patientId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateVital}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticVital.loc}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticVital.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticVital, null, 2)}
      </pre>
    </div>
  );
}
