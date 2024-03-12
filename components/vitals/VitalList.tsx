"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type Vital, CompleteVital } from "@/lib/db/schema/vitals";
import Modal from "@/components/shared/Modal";
import { type Patient, type PatientId } from "@/lib/db/schema/patients";
import { useOptimisticVitals } from "@/app/(app)/vitals/useOptimisticVitals";
import { Button } from "@/components/ui/button";
import VitalForm from "./VitalForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (vital?: Vital) => void;

export default function VitalList({
  vitals,
  patients,
  patientId 
}: {
  vitals: CompleteVital[];
  patients: Patient[];
  patientId?: PatientId 
}) {
  const { optimisticVitals, addOptimisticVital } = useOptimisticVitals(
    vitals,
    patients 
  );
  const [open, setOpen] = useState(false);
  const [activeVital, setActiveVital] = useState<Vital | null>(null);
  const openModal = (vital?: Vital) => {
    setOpen(true);
    vital ? setActiveVital(vital) : setActiveVital(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeVital ? "Edit Vital" : "Create Vital"}
      >
        <VitalForm
          vital={activeVital}
          addOptimistic={addOptimisticVital}
          openModal={openModal}
          closeModal={closeModal}
          patients={patients}
        patientId={patientId}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticVitals.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticVitals.map((vital) => (
            <Vital
              vital={vital}
              key={vital.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const Vital = ({
  vital,
  openModal,
}: {
  vital: CompleteVital;
  openModal: TOpenModal;
}) => {
  const optimistic = vital.id === "optimistic";
  const deleting = vital.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("vitals")
    ? pathname
    : pathname + "/vitals/";


  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>{vital.loc}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={ basePath + "/" + vital.id }>
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
        No vitals
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new vital.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Vitals </Button>
      </div>
    </div>
  );
};
