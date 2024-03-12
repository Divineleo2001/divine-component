import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/patients/useOptimisticPatients";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBackPath } from "@/components/shared/BackButton";




import { type Patient, insertPatientParams } from "@/lib/db/schema/patients";
import {
  createPatientAction,
  deletePatientAction,
  updatePatientAction,
} from "@/lib/actions/patients";


const PatientForm = ({
  
  patient,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  patient?: Patient | null;
  
  openModal?: (patient?: Patient) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Patient>(insertPatientParams);
  const editing = !!patient?.id;
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("patients");


  const onSuccess = (
    action: Action,
    data?: { error: string; values: Patient },
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
      toast.success(`Patient ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const patientParsed = await insertPatientParams.safeParseAsync({  ...payload });
    if (!patientParsed.success) {
      setErrors(patientParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = patientParsed.data;
    const pendingPatient: Patient = {
      updatedAt: patient?.updatedAt ?? new Date(),
      createdAt: patient?.createdAt ?? new Date(),
      id: patient?.id ?? "",
      userId: patient?.userId ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic && addOptimistic({
          data: pendingPatient,
          action: editing ? "update" : "create",
        });

        const error = editing
          ? await updatePatientAction({ ...values, id: patient.id })
          : await createPatientAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingPatient 
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
            errors?.name ? "text-destructive" : "",
          )}
        >
          Name
        </Label>
        <Input
          type="text"
          name="name"
          className={cn(errors?.name ? "ring ring-destructive" : "")}
          defaultValue={patient?.name ?? ""}
        />
        {errors?.name ? (
          <p className="text-xs text-destructive mt-2">{errors.name[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.age ? "text-destructive" : "",
          )}
        >
          Age
        </Label>
        <Input
          type="text"
          name="age"
          className={cn(errors?.age ? "ring ring-destructive" : "")}
          defaultValue={patient?.age ?? ""}
        />
        {errors?.age ? (
          <p className="text-xs text-destructive mt-2">{errors.age[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.gender ? "text-destructive" : "",
          )}
        >
          Gender
        </Label>
        <Input
          type="text"
          name="gender"
          className={cn(errors?.gender ? "ring ring-destructive" : "")}
          defaultValue={patient?.gender ?? ""}
        />
        {errors?.gender ? (
          <p className="text-xs text-destructive mt-2">{errors.gender[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.patientId ? "text-destructive" : "",
          )}
        >
          Patient Id
        </Label>
        <Input
          type="text"
          name="patientId"
          className={cn(errors?.patientId ? "ring ring-destructive" : "")}
          defaultValue={patient?.patientId ?? ""}
        />
        {errors?.patientId ? (
          <p className="text-xs text-destructive mt-2">{errors.patientId[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
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
              addOptimistic && addOptimistic({ action: "delete", data: patient });
              const error = await deletePatientAction(patient.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: patient,
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

export default PatientForm;

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
