import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getPatientByIdWithComments } from "@/lib/api/patients/queries";
import OptimisticPatient from "./OptimisticPatient";
import { checkAuth } from "@/lib/auth/utils";
import CommentList from "@/components/comments/CommentList";

import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function PatientPage({
  params,
}: {
  params: { patientId: string };
}) {

  return (
    <main className="overflow-auto">
      <Patient id={params.patientId} />
    </main>
  );
}

const Patient = async ({ id }: { id: string }) => {
  await checkAuth();

  const { patient, comments } = await getPatientByIdWithComments(id);
  

  if (!patient) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="patients" />
        <OptimisticPatient patient={patient}  />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">{patient.name}&apos;s Comments</h3>
        <CommentList
          patients={[]}
          patientId={patient.id}
          comments={comments}
        />
      </div>
    </Suspense>
  );
};
