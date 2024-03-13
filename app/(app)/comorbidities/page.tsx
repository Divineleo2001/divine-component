import { Suspense } from "react";

import Loading from "@/app/loading";
import ComorbidityList from "@/components/comorbidities/ComorbidityList";
import { getComorbidities } from "@/lib/api/comorbidities/queries";

import { checkAuth } from "@/lib/auth/utils";

export const revalidate = 0;

export default async function ComorbiditiesPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Comorbidities</h1>
        </div>
        <Comorbidities />
      </div>
    </main>
  );
}

const Comorbidities = async () => {
  await checkAuth();

  const { comorbidities } = await getComorbidities();
  
  return (
    <Suspense fallback={<Loading />}>
      <ComorbidityList comorbidities={comorbidities}  />
    </Suspense>
  );
};
