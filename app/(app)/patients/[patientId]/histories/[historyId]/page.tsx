import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getHistoryById } from "@/lib/api/histories/queries";
import { getPatients } from "@/lib/api/patients/queries";import OptimisticHistory from "@/app/(app)/histories/[historyId]/OptimisticHistory";
import { checkAuth } from "@/lib/auth/utils";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function HistoryPage({
  params,
}: {
  params: { historyId: string };
}) {

  return (
    <main className="overflow-auto">
      <History id={params.historyId} />
    </main>
  );
}

const History = async ({ id }: { id: string }) => {
  await checkAuth();

  const { history } = await getHistoryById(id);
  const { patients } = await getPatients();

  if (!history) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="histories" />
        <OptimisticHistory history={history} patients={patients}
        patientId={history.patientId} />
      </div>
    </Suspense>
  );
};
