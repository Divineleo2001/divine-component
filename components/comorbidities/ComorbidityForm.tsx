import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/comorbidities/useOptimisticComorbidities";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBackPath } from "@/components/shared/BackButton";



import { type Comorbidity, insertComorbidityParams } from "@/lib/db/schema/comorbidities";
import {
  createComorbidityAction,
  deleteComorbidityAction,
  updateComorbidityAction,
} from "@/lib/actions/comorbidities";


const ComorbidityForm = ({
  
  comorbidity,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  comorbidity?: Comorbidity | null;
  
  openModal?: (comorbidity?: Comorbidity) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Comorbidity>(insertComorbidityParams);
  const editing = !!comorbidity?.id;
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("comorbidities");


  const onSuccess = (
    action: Action,
    data?: { error: string; values: Comorbidity },
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
      toast.success(`Comorbidity ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const comorbidityParsed = await insertComorbidityParams.safeParseAsync({  ...payload });
    if (!comorbidityParsed.success) {
      setErrors(comorbidityParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = comorbidityParsed.data;
    const pendingComorbidity: Comorbidity = {
      updatedAt: comorbidity?.updatedAt ?? new Date(),
      createdAt: comorbidity?.createdAt ?? new Date(),
      id: comorbidity?.id ?? "",
      userId: comorbidity?.userId ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic && addOptimistic({
          data: pendingComorbidity,
          action: editing ? "update" : "create",
        });

        const error = editing
          ? await updateComorbidityAction({ ...values, id: comorbidity.id })
          : await createComorbidityAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingComorbidity 
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
          defaultValue={comorbidity?.name ?? ""}
        />
        {errors?.name ? (
          <p className="text-xs text-destructive mt-2">{errors.name[0]}</p>
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
              addOptimistic && addOptimistic({ action: "delete", data: comorbidity });
              const error = await deleteComorbidityAction(comorbidity.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: comorbidity,
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

export default ComorbidityForm;

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
