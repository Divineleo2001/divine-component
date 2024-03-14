import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getPatientComorbidityById } from "@/lib/api/patientComorbidities/queries";
import { getPatients } from "@/lib/api/patients/queries";
import OptimisticPatientComorbidity from "@/app/(app)/patient-comorbidities/[patientComorbidityId]/OptimisticPatientComorbidity";
import { checkAuth } from "@/lib/auth/utils";

import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";
import { getComorbidities } from "@/lib/api/comorbidities/queries";

export const revalidate = 0;

export default async function PatientComorbidityPage({
  params,
}: {
  params: { patientComorbidityId: string };
}) {
  return (
    <main className="overflow-auto">
      <PatientComorbidity id={params.patientComorbidityId} />
    </main>
  );
}

const PatientComorbidity = async ({ id }: { id: string }) => {
  await checkAuth();

  const { patientComorbidity } = await getPatientComorbidityById(id);
  const { patients } = await getPatients();
  const { comorbidities } = await getComorbidities();

  if (!patientComorbidity) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="patient-comorbidities" />
        <OptimisticPatientComorbidity
          comorbidities={comorbidities}
          patientComorbidity={patientComorbidity}
          patients={patients}
          patientId={patientComorbidity.patientId}
        />
      </div>
    </Suspense>
  );
};
