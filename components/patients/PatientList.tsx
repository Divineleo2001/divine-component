"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type Patient, CompletePatient } from "@/lib/db/schema/patients";
import Modal from "@/components/shared/Modal";

import { useOptimisticPatients } from "@/app/(app)/patients/useOptimisticPatients";
import { Button } from "@/components/ui/button";
import PatientForm from "./PatientForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (patient?: Patient) => void;

export default function PatientList({
  patients,
   
}: {
  patients: CompletePatient[];
   
}) {
  const { optimisticPatients, addOptimisticPatient } = useOptimisticPatients(
    patients,
     
  );
  const [open, setOpen] = useState(false);
  const [activePatient, setActivePatient] = useState<Patient | null>(null);
  const openModal = (patient?: Patient) => {
    setOpen(true);
    patient ? setActivePatient(patient) : setActivePatient(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activePatient ? "Edit Patient" : "Create Patient"}
      >
        hello1
        <PatientForm
          patient={activePatient}
          addOptimistic={addOptimisticPatient}
          openModal={openModal}
          closeModal={closeModal}
          
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticPatients.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticPatients.map((patient) => (
            <Patient
              patient={patient}
              key={patient.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const Patient = ({
  patient,
  openModal,
}: {
  patient: CompletePatient;
  openModal: TOpenModal;
}) => {
  const optimistic = patient.id === "optimistic";
  const deleting = patient.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("patients")
    ? pathname
    : pathname + "/patients/";


  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>{patient.name}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={ basePath + "/" + patient.id }>
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
        No patients
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new patient.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Patients </Button>
      </div>
    </div>
  );
};
