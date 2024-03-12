import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/patient-comorbidities/useOptimisticPatientComorbidities";

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

import { type PatientComorbidity, insertPatientComorbidityParams } from "@/lib/db/schema/patientComorbidities";
import {
  createPatientComorbidityAction,
  deletePatientComorbidityAction,
  updatePatientComorbidityAction,
} from "@/lib/actions/patientComorbidities";
import { type Patient, type PatientId } from "@/lib/db/schema/patients";

const PatientComorbidityForm = ({
  patients,
  patientId,
  patientComorbidity,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  patientComorbidity?: PatientComorbidity | null;
  patients: Patient[];
  patientId?: PatientId
  openModal?: (patientComorbidity?: PatientComorbidity) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<PatientComorbidity>(insertPatientComorbidityParams);
  const editing = !!patientComorbidity?.id;
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("patient-comorbidities");


  const onSuccess = (
    action: Action,
    data?: { error: string; values: PatientComorbidity },
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
      toast.success(`PatientComorbidity ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const patientComorbidityParsed = await insertPatientComorbidityParams.safeParseAsync({ patientId, ...payload });
    if (!patientComorbidityParsed.success) {
      setErrors(patientComorbidityParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = patientComorbidityParsed.data;
    const pendingPatientComorbidity: PatientComorbidity = {
      updatedAt: patientComorbidity?.updatedAt ?? new Date(),
      createdAt: patientComorbidity?.createdAt ?? new Date(),
      id: patientComorbidity?.id ?? "",
      userId: patientComorbidity?.userId ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic && addOptimistic({
          data: pendingPatientComorbidity,
          action: editing ? "update" : "create",
        });

        const error = editing
          ? await updatePatientComorbidityAction({ ...values, id: patientComorbidity.id })
          : await createPatientComorbidityAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingPatientComorbidity 
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
            errors?.comorbidityName ? "text-destructive" : "",
          )}
        >
          Comorbidity Name
        </Label>
        <Input
          type="text"
          name="comorbidityName"
          className={cn(errors?.comorbidityName ? "ring ring-destructive" : "")}
          defaultValue={patientComorbidity?.comorbidityName ?? ""}
        />
        {errors?.comorbidityName ? (
          <p className="text-xs text-destructive mt-2">{errors.comorbidityName[0]}</p>
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
        <Select defaultValue={patientComorbidity?.patientId} name="patientId">
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
              addOptimistic && addOptimistic({ action: "delete", data: patientComorbidity });
              const error = await deletePatientComorbidityAction(patientComorbidity.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: patientComorbidity,
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

export default PatientComorbidityForm;

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
