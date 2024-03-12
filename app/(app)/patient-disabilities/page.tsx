import { Suspense } from "react";

import Loading from "@/app/loading";
import PatientDisabilityList from "@/components/patientDisabilities/PatientDisabilityList";
import { getPatientDisabilities } from "@/lib/api/patientDisabilities/queries";
import { getPatients } from "@/lib/api/patients/queries";
import { checkAuth } from "@/lib/auth/utils";

export const revalidate = 0;

export default async function PatientDisabilitiesPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Patient Disabilities</h1>
        </div>
        <PatientDisabilities />
      </div>
    </main>
  );
}

const PatientDisabilities = async () => {
  await checkAuth();

  const { patientDisabilities } = await getPatientDisabilities();
  const { patients } = await getPatients();
  return (
    <Suspense fallback={<Loading />}>
      <PatientDisabilityList patientDisabilities={patientDisabilities} patients={patients} />
    </Suspense>
  );
};
