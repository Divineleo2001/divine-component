"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/disabilities/useOptimisticDisabilities";
import { type Disability } from "@/lib/db/schema/disabilities";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import DisabilityForm from "@/components/disabilities/DisabilityForm";


export default function OptimisticDisability({ 
  disability,
   
}: { 
  disability: Disability; 
  
  
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Disability) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticDisability, setOptimisticDisability] = useOptimistic(disability);
  const updateDisability: TAddOptimistic = (input) =>
    setOptimisticDisability({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <DisabilityForm
          disability={optimisticDisability}
          
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateDisability}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticDisability.name}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticDisability.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticDisability, null, 2)}
      </pre>
    </div>
  );
}
