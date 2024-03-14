"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/comorbidities/useOptimisticComorbidities";
import { type Comorbidity } from "@/lib/db/schema/comorbidities";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import ComorbidityForm from "@/components/comorbidities/ComorbidityForm";


export default function OptimisticComorbidity({ 
  comorbidity,
   
}: { 
  comorbidity: Comorbidity; 
  
  
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Comorbidity) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticComorbidity, setOptimisticComorbidity] = useOptimistic(comorbidity);
  const updateComorbidity: TAddOptimistic = (input) =>
    setOptimisticComorbidity({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <ComorbidityForm
          comorbidity={optimisticComorbidity}
          
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateComorbidity}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticComorbidity.name}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticComorbidity.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticComorbidity, null, 2)}
      </pre>
    </div>
  );
}
