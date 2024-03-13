"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type Comorbidity, CompleteComorbidity } from "@/lib/db/schema/comorbidities";
import Modal from "@/components/shared/Modal";

import { useOptimisticComorbidities } from "@/app/(app)/comorbidities/useOptimisticComorbidities";
import { Button } from "@/components/ui/button";
import ComorbidityForm from "./ComorbidityForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (comorbidity?: Comorbidity) => void;

export default function ComorbidityList({
  comorbidities,
   
}: {
  comorbidities: CompleteComorbidity[];
   
}) {
  const { optimisticComorbidities, addOptimisticComorbidity } = useOptimisticComorbidities(
    comorbidities,
     
  );
  const [open, setOpen] = useState(false);
  const [activeComorbidity, setActiveComorbidity] = useState<Comorbidity | null>(null);
  const openModal = (comorbidity?: Comorbidity) => {
    setOpen(true);
    comorbidity ? setActiveComorbidity(comorbidity) : setActiveComorbidity(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeComorbidity ? "Edit Comorbidity" : "Create Comorbidity"}
      >
        <ComorbidityForm
          comorbidity={activeComorbidity}
          addOptimistic={addOptimisticComorbidity}
          openModal={openModal}
          closeModal={closeModal}
          
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticComorbidities.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticComorbidities.map((comorbidity) => (
            <Comorbidity
              comorbidity={comorbidity}
              key={comorbidity.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const Comorbidity = ({
  comorbidity,
  openModal,
}: {
  comorbidity: CompleteComorbidity;
  openModal: TOpenModal;
}) => {
  const optimistic = comorbidity.id === "optimistic";
  const deleting = comorbidity.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("comorbidities")
    ? pathname
    : pathname + "/comorbidities/";


  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>{comorbidity.name}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={ basePath + "/" + comorbidity.id }>
          Edit
        </Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No comorbidities
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new comorbidity.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Comorbidities </Button>
      </div>
    </div>
  );
};
