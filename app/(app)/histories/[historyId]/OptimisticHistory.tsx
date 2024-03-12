"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/histories/useOptimisticHistories";
import { type History } from "@/lib/db/schema/histories";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import HistoryForm from "@/components/histories/HistoryForm";
import { type Patient, type PatientId } from "@/lib/db/schema/patients";

export default function OptimisticHistory({ 
  history,
  patients,
  patientId 
}: { 
  history: History; 
  
  patients: Patient[];
  patientId?: PatientId
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: History) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticHistory, setOptimisticHistory] = useOptimistic(history);
  const updateHistory: TAddOptimistic = (input) =>
    setOptimisticHistory({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <HistoryForm
          history={optimisticHistory}
          patients={patients}
        patientId={patientId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateHistory}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticHistory.history}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticHistory.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticHistory, null, 2)}
      </pre>
    </div>
  );
}
