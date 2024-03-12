import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getVitalById } from "@/lib/api/vitals/queries";
import { getPatients } from "@/lib/api/patients/queries";import OptimisticVital from "@/app/(app)/vitals/[vitalId]/OptimisticVital";
import { checkAuth } from "@/lib/auth/utils";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function VitalPage({
  params,
}: {
  params: { vitalId: string };
}) {

  return (
    <main className="overflow-auto">
      <Vital id={params.vitalId} />
    </main>
  );
}

const Vital = async ({ id }: { id: string }) => {
  await checkAuth();

  const { vital } = await getVitalById(id);
  const { patients } = await getPatients();

  if (!vital) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="vitals" />
        <OptimisticVital vital={vital} patients={patients}
        patientId={vital.patientId} />
      </div>
    </Suspense>
  );
};
