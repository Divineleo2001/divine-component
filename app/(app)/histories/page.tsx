import { Suspense } from "react";

import Loading from "@/app/loading";
import HistoryList from "@/components/histories/HistoryList";
import { getHistories } from "@/lib/api/histories/queries";
import { getPatients } from "@/lib/api/patients/queries";
import { checkAuth } from "@/lib/auth/utils";

export const revalidate = 0;

export default async function HistoriesPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Histories</h1>
        </div>
        <Histories />
      </div>
    </main>
  );
}

const Histories = async () => {
  await checkAuth();

  const { histories } = await getHistories();
  const { patients } = await getPatients();
  return (
    <Suspense fallback={<Loading />}>
      <HistoryList histories={histories} patients={patients} />
    </Suspense>
  );
};
