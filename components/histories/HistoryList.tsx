"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type History, CompleteHistory } from "@/lib/db/schema/histories";
import Modal from "@/components/shared/Modal";
import { type Patient, type PatientId } from "@/lib/db/schema/patients";
import { useOptimisticHistories } from "@/app/(app)/histories/useOptimisticHistories";
import { Button } from "@/components/ui/button";
import HistoryForm from "./HistoryForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (history?: History) => void;

export default function HistoryList({
  histories,
  patients,
  patientId 
}: {
  histories: CompleteHistory[];
  patients: Patient[];
  patientId?: PatientId 
}) {
  const { optimisticHistories, addOptimisticHistory } = useOptimisticHistories(
    histories,
    patients 
  );
  const [open, setOpen] = useState(false);
  const [activeHistory, setActiveHistory] = useState<History | null>(null);
  const openModal = (history?: History) => {
    setOpen(true);
    history ? setActiveHistory(history) : setActiveHistory(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeHistory ? "Edit History" : "Create History"}
      >
        <HistoryForm
          history={activeHistory}
          addOptimistic={addOptimisticHistory}
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
      {optimisticHistories.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticHistories.map((history) => (
            <History
              history={history}
              key={history.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const History = ({
  history,
  openModal,
}: {
  history: CompleteHistory;
  openModal: TOpenModal;
}) => {
  const optimistic = history.id === "optimistic";
  const deleting = history.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("histories")
    ? pathname
    : pathname + "/histories/";


  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>{history.history}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={ basePath + "/" + history.id }>
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
        No histories
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new history.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Histories </Button>
      </div>
    </div>
  );
};
