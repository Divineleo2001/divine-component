import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getPatientDisabilityById } from "@/lib/api/patientDisabilities/queries";
import { getPatients } from "@/lib/api/patients/queries";import OptimisticPatientDisability from "@/app/(app)/patient-disabilities/[patientDisabilityId]/OptimisticPatientDisability";
import { checkAuth } from "@/lib/auth/utils";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function PatientDisabilityPage({
  params,
}: {
  params: { patientDisabilityId: string };
}) {

  return (
    <main className="overflow-auto">
      <PatientDisability id={params.patientDisabilityId} />
    </main>
  );
}

const PatientDisability = async ({ id }: { id: string }) => {
  await checkAuth();

  const { patientDisability } = await getPatientDisabilityById(id);
  const { patients } = await getPatients();

  if (!patientDisability) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="patient-disabilities" />
        <OptimisticPatientDisability patientDisability={patientDisability} patients={patients}
        patientId={patientDisability.patientId} />
      </div>
    </Suspense>
  );
};
