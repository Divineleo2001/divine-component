import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/vitals/useOptimisticVitals";

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

import { type Vital, insertVitalParams } from "@/lib/db/schema/vitals";
import {
  createVitalAction,
  deleteVitalAction,
  updateVitalAction,
} from "@/lib/actions/vitals";
import { type Patient, type PatientId } from "@/lib/db/schema/patients";

const VitalForm = ({
  patients,
  patientId,
  vital,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  vital?: Vital | null;
  patients: Patient[];
  patientId?: PatientId
  openModal?: (vital?: Vital) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Vital>(insertVitalParams);
  const editing = !!vital?.id;
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("vitals");


  const onSuccess = (
    action: Action,
    data?: { error: string; values: Vital },
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
      toast.success(`Vital ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const vitalParsed = await insertVitalParams.safeParseAsync({ patientId, ...payload });
    if (!vitalParsed.success) {
      setErrors(vitalParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = vitalParsed.data;
    const pendingVital: Vital = {
      updatedAt: vital?.updatedAt ?? new Date(),
      createdAt: vital?.createdAt ?? new Date(),
      id: vital?.id ?? "",
      userId: vital?.userId ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic && addOptimistic({
          data: pendingVital,
          action: editing ? "update" : "create",
        });

        const error = editing
          ? await updateVitalAction({ ...values, id: vital.id })
          : await createVitalAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingVital 
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
            errors?.loc ? "text-destructive" : "",
          )}
        >
          Loc
        </Label>
        <Input
          type="text"
          name="loc"
          className={cn(errors?.loc ? "ring ring-destructive" : "")}
          defaultValue={vital?.loc ?? ""}
        />
        {errors?.loc ? (
          <p className="text-xs text-destructive mt-2">{errors.loc[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.airwayStatus ? "text-destructive" : "",
          )}
        >
          Airway Status
        </Label>
        <Input
          type="text"
          name="airwayStatus"
          className={cn(errors?.airwayStatus ? "ring ring-destructive" : "")}
          defaultValue={vital?.airwayStatus ?? ""}
        />
        {errors?.airwayStatus ? (
          <p className="text-xs text-destructive mt-2">{errors.airwayStatus[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.breathingStatus ? "text-destructive" : "",
          )}
        >
          Breathing Status
        </Label>
        <Input
          type="text"
          name="breathingStatus"
          className={cn(errors?.breathingStatus ? "ring ring-destructive" : "")}
          defaultValue={vital?.breathingStatus ?? ""}
        />
        {errors?.breathingStatus ? (
          <p className="text-xs text-destructive mt-2">{errors.breathingStatus[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.pulseRateQuality ? "text-destructive" : "",
          )}
        >
          Pulse Rate Quality
        </Label>
        <Input
          type="text"
          name="pulseRateQuality"
          className={cn(errors?.pulseRateQuality ? "ring ring-destructive" : "")}
          defaultValue={vital?.pulseRateQuality ?? ""}
        />
        {errors?.pulseRateQuality ? (
          <p className="text-xs text-destructive mt-2">{errors.pulseRateQuality[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.breathingRate ? "text-destructive" : "",
          )}
        >
          Breathing Rate
        </Label>
        <Input
          type="text"
          name="breathingRate"
          className={cn(errors?.breathingRate ? "ring ring-destructive" : "")}
          defaultValue={vital?.breathingRate ?? ""}
        />
        {errors?.breathingRate ? (
          <p className="text-xs text-destructive mt-2">{errors.breathingRate[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.pulseRate ? "text-destructive" : "",
          )}
        >
          Pulse Rate
        </Label>
        <Input
          type="text"
          name="pulseRate"
          className={cn(errors?.pulseRate ? "ring ring-destructive" : "")}
          defaultValue={vital?.pulseRate ?? ""}
        />
        {errors?.pulseRate ? (
          <p className="text-xs text-destructive mt-2">{errors.pulseRate[0]}</p>
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
        <Select defaultValue={vital?.patientId} name="patientId">
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
              addOptimistic && addOptimistic({ action: "delete", data: vital });
              const error = await deleteVitalAction(vital.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: vital,
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

export default VitalForm;

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
