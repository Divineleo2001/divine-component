import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/histories/useOptimisticHistories";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBackPath } from "@/components/shared/BackButton";


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { type History, insertHistoryParams } from "@/lib/db/schema/histories";
import {
  createHistoryAction,
  deleteHistoryAction,
  updateHistoryAction,
} from "@/lib/actions/histories";
import { type Patient, type PatientId } from "@/lib/db/schema/patients";

const HistoryForm = ({
  patients,
  patientId,
  history,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  history?: History | null;
  patients: Patient[];
  patientId?: PatientId
  openModal?: (history?: History) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<History>(insertHistoryParams);
  const editing = !!history?.id;
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("histories");


  const onSuccess = (
    action: Action,
    data?: { error: string; values: History },
  ) => {
    const failed = Boolean(data?.error);
    if (failed) {
      openModal && openModal(data?.values);
      toast.error(`Failed to ${action}`, {
        description: data?.error ?? "Error",
      });
    } else {
      router.refresh();
      postSuccess && postSuccess();
      toast.success(`History ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const historyParsed = await insertHistoryParams.safeParseAsync({ patientId, ...payload });
    if (!historyParsed.success) {
      setErrors(historyParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = historyParsed.data;
    const pendingHistory: History = {
      updatedAt: history?.updatedAt ?? new Date(),
      createdAt: history?.createdAt ?? new Date(),
      id: history?.id ?? "",
      userId: history?.userId ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic && addOptimistic({
          data: pendingHistory,
          action: editing ? "update" : "create",
        });

        const error = editing
          ? await updateHistoryAction({ ...values, id: history.id })
          : await createHistoryAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingHistory 
        };
        onSuccess(
          editing ? "update" : "create",
          error ? errorFormatted : undefined,
        );
      });
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors(e.flatten().fieldErrors);
      }
    }
  };

  return (
    <form action={handleSubmit} onChange={handleChange} className={"space-y-8"}>
      {/* Schema fields start */}
              <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.history ? "text-destructive" : "",
          )}
        >
          History
        </Label>
        <Input
          type="text"
          name="history"
          className={cn(errors?.history ? "ring ring-destructive" : "")}
          defaultValue={history?.history ?? ""}
        />
        {errors?.history ? (
          <p className="text-xs text-destructive mt-2">{errors.history[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>

      {patientId ? null : <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.patientId ? "text-destructive" : "",
          )}
        >
          Patient
        </Label>
        <Select defaultValue={history?.patientId} name="patientId">
          <SelectTrigger
            className={cn(errors?.patientId ? "ring ring-destructive" : "")}
          >
            <SelectValue placeholder="Select a patient" />
          </SelectTrigger>
          <SelectContent>
          {patients?.map((patient) => (
            <SelectItem key={patient.id} value={patient.id.toString()}>
              {patient.id}{/* TODO: Replace with a field from the patient model */}
            </SelectItem>
           ))}
          </SelectContent>
        </Select>
        {errors?.patientId ? (
          <p className="text-xs text-destructive mt-2">{errors.patientId[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div> }
      {/* Schema fields end */}

      {/* Save Button */}
      <SaveButton errors={hasErrors} editing={editing} />

      {/* Delete Button */}
      {editing ? (
        <Button
          type="button"
          disabled={isDeleting || pending || hasErrors}
          variant={"destructive"}
          onClick={() => {
            setIsDeleting(true);
            closeModal && closeModal();
            startMutation(async () => {
              addOptimistic && addOptimistic({ action: "delete", data: history });
              const error = await deleteHistoryAction(history.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: history,
              };

              onSuccess("delete", error ? errorFormatted : undefined);
            });
          }}
        >
          Delet{isDeleting ? "ing..." : "e"}
        </Button>
      ) : null}
    </form>
  );
};

export default HistoryForm;

const SaveButton = ({
  editing,
  errors,
}: {
  editing: Boolean;
  errors: boolean;
}) => {
  const { pending } = useFormStatus();
  const isCreating = pending && editing === false;
  const isUpdating = pending && editing === true;
  return (
    <Button
      type="submit"
      className="mr-2"
      disabled={isCreating || isUpdating || errors}
      aria-disabled={isCreating || isUpdating || errors}
    >
      {editing
        ? `Sav${isUpdating ? "ing..." : "e"}`
        : `Creat${isCreating ? "ing..." : "e"}`}
    </Button>
  );
};
