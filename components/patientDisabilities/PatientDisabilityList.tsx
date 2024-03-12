"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type PatientDisability, CompletePatientDisability } from "@/lib/db/schema/patientDisabilities";
import Modal from "@/components/shared/Modal";
import { type Patient, type PatientId } from "@/lib/db/schema/patients";
import { useOptimisticPatientDisabilities } from "@/app/(app)/patient-disabilities/useOptimisticPatientDisabilities";
import { Button } from "@/components/ui/button";
import PatientDisabilityForm from "./PatientDisabilityForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (patientDisability?: PatientDisability) => void;

export default function PatientDisabilityList({
  patientDisabilities,
  patients,
  patientId 
}: {
  patientDisabilities: CompletePatientDisability[];
  patients: Patient[];
  patientId?: PatientId 
}) {
  const { optimisticPatientDisabilities, addOptimisticPatientDisability } = useOptimisticPatientDisabilities(
    patientDisabilities,
    patients 
  );
  const [open, setOpen] = useState(false);
  const [activePatientDisability, setActivePatientDisability] = useState<PatientDisability | null>(null);
  const openModal = (patientDisability?: PatientDisability) => {
    setOpen(true);
    patientDisability ? setActivePatientDisability(patientDisability) : setActivePatientDisability(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activePatientDisability ? "Edit PatientDisability" : "Create Patient Disability"}
      >
        <PatientDisabilityForm
          patientDisability={activePatientDisability}
          addOptimistic={addOptimisticPatientDisability}
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
      {optimisticPatientDisabilities.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticPatientDisabilities.map((patientDisability) => (
            <PatientDisability
              patientDisability={patientDisability}
              key={patientDisability.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const PatientDisability = ({
  patientDisability,
  openModal,
}: {
  patientDisability: CompletePatientDisability;
  openModal: TOpenModal;
}) => {
  const optimistic = patientDisability.id === "optimistic";
  const deleting = patientDisability.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("patient-disabilities")
    ? pathname
    : pathname + "/patient-disabilities/";


  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >

      <div className="w-full">

        <div>{patientDisability.disabilityName}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={ basePath + "/" + patientDisability.id }>
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
        No patient disabilities
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new patient disability.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Patient Disabilities </Button>
      </div>
    </div>
  );
};
