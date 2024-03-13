"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type Disability, CompleteDisability } from "@/lib/db/schema/disabilities";
import Modal from "@/components/shared/Modal";

import { useOptimisticDisabilities } from "@/app/(app)/disabilities/useOptimisticDisabilities";
import { Button } from "@/components/ui/button";
import DisabilityForm from "./DisabilityForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (disability?: Disability) => void;

export default function DisabilityList({
  disabilities,
   
}: {
  disabilities: CompleteDisability[];
   
}) {
  const { optimisticDisabilities, addOptimisticDisability } = useOptimisticDisabilities(
    disabilities,
     
  );
  const [open, setOpen] = useState(false);
  const [activeDisability, setActiveDisability] = useState<Disability | null>(null);
  const openModal = (disability?: Disability) => {
    setOpen(true);
    disability ? setActiveDisability(disability) : setActiveDisability(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeDisability ? "Edit Disability" : "Create Disability"}
      >
        <DisabilityForm
          disability={activeDisability}
          addOptimistic={addOptimisticDisability}
          openModal={openModal}
          closeModal={closeModal}
          
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticDisabilities.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticDisabilities.map((disability) => (
            <Disability
              disability={disability}
              key={disability.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const Disability = ({
  disability,
  openModal,
}: {
  disability: CompleteDisability;
  openModal: TOpenModal;
}) => {
  const optimistic = disability.id === "optimistic";
  const deleting = disability.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("disabilities")
    ? pathname
    : pathname + "/disabilities/";


  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>{disability.name}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={ basePath + "/" + disability.id }>
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
        No disabilities
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new disability.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Disabilities </Button>
      </div>
    </div>
  );
};
