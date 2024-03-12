import { Suspense } from "react";

import Loading from "@/app/loading";
import PatientList from "@/components/patients/PatientList";
import { getPatients } from "@/lib/api/patients/queries";

import { checkAuth } from "@/lib/auth/utils";

export const revalidate = 0;

export default async function PatientsPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Patients</h1>
        </div>
        <Patients />
      </div>
    </main>
  );
}

const Patients = async () => {
  await checkAuth();

  const { patients } = await getPatients();
  
  return (
    <Suspense fallback={<Loading />}>
      <PatientList patients={patients}  />
    </Suspense>
  );
};
