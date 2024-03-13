import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getComorbidityById } from "@/lib/api/comorbidities/queries";
import OptimisticComorbidity from "./OptimisticComorbidity";
import { checkAuth } from "@/lib/auth/utils";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function ComorbidityPage({
  params,
}: {
  params: { comorbidityId: string };
}) {

  return (
    <main className="overflow-auto">
      <Comorbidity id={params.comorbidityId} />
    </main>
  );
}

const Comorbidity = async ({ id }: { id: string }) => {
  await checkAuth();

  const { comorbidity } = await getComorbidityById(id);
  

  if (!comorbidity) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="comorbidities" />
        <OptimisticComorbidity comorbidity={comorbidity}  />
      </div>
    </Suspense>
  );
};
