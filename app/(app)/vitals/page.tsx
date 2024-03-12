import { Suspense } from "react";

import Loading from "@/app/loading";
import VitalList from "@/components/vitals/VitalList";
import { getVitals } from "@/lib/api/vitals/queries";
import { getPatients } from "@/lib/api/patients/queries";
import { checkAuth } from "@/lib/auth/utils";

export const revalidate = 0;

export default async function VitalsPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Vitals</h1>
        </div>
        <Vitals />
      </div>
    </main>
  );
}

const Vitals = async () => {
  await checkAuth();

  const { vitals } = await getVitals();
  const { patients } = await getPatients();
  return (
    <Suspense fallback={<Loading />}>
      <VitalList vitals={vitals} patients={patients} />
    </Suspense>
  );
};
