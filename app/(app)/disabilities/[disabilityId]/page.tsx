import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getDisabilityById } from "@/lib/api/disabilities/queries";
import OptimisticDisability from "./OptimisticDisability";
import { checkAuth } from "@/lib/auth/utils";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function DisabilityPage({
  params,
}: {
  params: { disabilityId: string };
}) {

  return (
    <main className="overflow-auto">
      <Disability id={params.disabilityId} />
    </main>
  );
}

const Disability = async ({ id }: { id: string }) => {
  await checkAuth();

  const { disability } = await getDisabilityById(id);
  

  if (!disability) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="disabilities" />
        <OptimisticDisability disability={disability}  />
      </div>
    </Suspense>
  );
};
