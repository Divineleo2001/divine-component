"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/patients/useOptimisticPatients";
import { type Patient } from "@/lib/db/schema/patients";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import PatientForm from "@/components/patients/PatientForm";


export default function OptimisticPatient({ 
  patient,
   
}: { 
  patient: Patient; 
  
  
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Patient) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticPatient, setOptimisticPatient] = useOptimistic(patient);
  const updatePatient: TAddOptimistic = (input) =>
    setOptimisticPatient({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <PatientForm
          patient={optimisticPatient}
          
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updatePatient}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticPatient.name}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticPatient.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticPatient, null, 2)}
      </pre>
    </div>
  );
}
