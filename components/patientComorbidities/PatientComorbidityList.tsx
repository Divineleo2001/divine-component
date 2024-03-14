"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type PatientComorbidity, CompletePatientComorbidity } from "@/lib/db/schema/patientComorbidities";
import Modal from "@/components/shared/Modal";
import { type Patient, type PatientId } from "@/lib/db/schema/patients";
import { useOptimisticPatientComorbidities } from "@/app/(app)/patient-comorbidities/useOptimisticPatientComorbidities";
import { Button } from "@/components/ui/button";
import PatientComorbidityForm from "./PatientComorbidityForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (patientComorbidity?: PatientComorbidity) => void;

export default function PatientComorbidityList({
  comorbidities,
  patientComorbidities,
  patients,
  patientId 
}: {
  comorbidities: any;
  patientComorbidities: CompletePatientComorbidity[];
  patients: Patient[];
  patientId?: PatientId 
}) {
  const { optimisticPatientComorbidities, addOptimisticPatientComorbidity } = useOptimisticPatientComorbidities(
    patientComorbidities,
    patients 
  );
  const [open, setOpen] = useState(false);
  const [activePatientComorbidity, setActivePatientComorbidity] = useState<PatientComorbidity | null>(null);
  const openModal = (patientComorbidity?: PatientComorbidity) => {
    setOpen(true);
    patientComorbidity ? setActivePatientComorbidity(patientComorbidity) : setActivePatientComorbidity(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activePatientComorbidity ? "Edit PatientComorbidity" : "Create Patient Comorbidity"}
      >

        <PatientComorbidityForm
        comorbidities={comorbidities}
          patientComorbidity={activePatientComorbidity}
          addOptimistic={addOptimisticPatientComorbidity}
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
      {optimisticPatientComorbidities.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticPatientComorbidities.map((patientComorbidity) => (
            <PatientComorbidity
              patientComorbidity={patientComorbidity}
              key={patientComorbidity.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const PatientComorbidity = ({
  patientComorbidity,
  openModal,
}: {
  patientComorbidity: CompletePatientComorbidity;
  openModal: TOpenModal;
}) => {
  const optimistic = patientComorbidity.id === "optimistic";
  const deleting = patientComorbidity.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("patient-comorbidities")
    ? pathname
    : pathname + "/patient-comorbidities/";


  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>{patientComorbidity.comorbidityName}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={ basePath + "/" + patientComorbidity.id }>
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
        No patient comorbidities
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new patient comorbidity.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Patient Comorbidities </Button>
      </div>
    </div>
  );
};
