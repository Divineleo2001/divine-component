import { Suspense } from "react";

import Loading from "@/app/loading";
import DisabilityList from "@/components/disabilities/DisabilityList";
import { getDisabilities } from "@/lib/api/disabilities/queries";

import { checkAuth } from "@/lib/auth/utils";

export const revalidate = 0;

export default async function DisabilitiesPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Disabilities</h1>
        </div>
        <Disabilities />
      </div>
    </main>
  );
}

const Disabilities = async () => {
  await checkAuth();

  const { disabilities } = await getDisabilities();
  
  return (
    <Suspense fallback={<Loading />}>
      <DisabilityList disabilities={disabilities}  />
    </Suspense>
  );
};
