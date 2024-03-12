"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/comments/useOptimisticComments";
import { type Comment } from "@/lib/db/schema/comments";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import CommentForm from "@/components/comments/CommentForm";
import { type Patient, type PatientId } from "@/lib/db/schema/patients";

export default function OptimisticComment({ 
  comment,
  patients,
  patientId 
}: { 
  comment: Comment; 
  
  patients: Patient[];
  patientId?: PatientId
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Comment) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticComment, setOptimisticComment] = useOptimistic(comment);
  const updateComment: TAddOptimistic = (input) =>
    setOptimisticComment({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <CommentForm
          comment={optimisticComment}
          patients={patients}
        patientId={patientId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateComment}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticComment.comment}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticComment.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticComment, null, 2)}
      </pre>
    </div>
  );
}
