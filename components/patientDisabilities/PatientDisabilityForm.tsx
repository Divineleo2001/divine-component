import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/patient-disabilities/useOptimisticPatientDisabilities";

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

import { type PatientDisability, insertPatientDisabilityParams } from "@/lib/db/schema/patientDisabilities";
import {
  createPatientDisabilityAction,
  deletePatientDisabilityAction,
  updatePatientDisabilityAction,
} from "@/lib/actions/patientDisabilities";
import { type Patient, type PatientId } from "@/lib/db/schema/patients";

const PatientDisabilityForm = ({
  patients,
  patientId,
  patientDisability,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  patientDisability?: PatientDisability | null;
  patients: Patient[];
  patientId?: PatientId
  openModal?: (patientDisability?: PatientDisability) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<PatientDisability>(insertPatientDisabilityParams);
  const editing = !!patientDisability?.id;
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("patient-disabilities");


  const onSuccess = (
    action: Action,
    data?: { error: string; values: PatientDisability },
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
      toast.success(`PatientDisability ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const patientDisabilityParsed = await insertPatientDisabilityParams.safeParseAsync({ patientId, ...payload });
    if (!patientDisabilityParsed.success) {
      setErrors(patientDisabilityParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = patientDisabilityParsed.data;
    const pendingPatientDisability: PatientDisability = {
      updatedAt: patientDisability?.updatedAt ?? new Date(),
      createdAt: patientDisability?.createdAt ?? new Date(),
      id: patientDisability?.id ?? "",
      userId: patientDisability?.userId ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic && addOptimistic({
          data: pendingPatientDisability,
          action: editing ? "update" : "create",
        });

        const error = editing
          ? await updatePatientDisabilityAction({ ...values, id: patientDisability.id })
          : await createPatientDisabilityAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingPatientDisability 
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
            errors?.disabilityName ? "text-destructive" : "",
          )}
        >
          Disability Name
        </Label>
        <Input
          type="text"
          name="disabilityName"
          className={cn(errors?.disabilityName ? "ring ring-destructive" : "")}
          defaultValue={patientDisability?.disabilityName ?? ""}
        />
        {errors?.disabilityName ? (
          <p className="text-xs text-destructive mt-2">{errors.disabilityName[0]}</p>
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
        <Select defaultValue={patientDisability?.patientId} name="patientId">
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
              addOptimistic && addOptimistic({ action: "delete", data: patientDisability });
              const error = await deletePatientDisabilityAction(patientDisability.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: patientDisability,
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

export default PatientDisabilityForm;

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
