import { Suspense } from "react";

import Loading from "@/app/loading";
import PatientComorbidityList from "@/components/patientComorbidities/PatientComorbidityList";
import { getPatientComorbidities } from "@/lib/api/patientComorbidities/queries";
import { getPatients } from "@/lib/api/patients/queries";
import { checkAuth } from "@/lib/auth/utils";
import { getComorbidities } from "@/lib/api/comorbidities/queries";

export const revalidate = 0;

export default async function PatientComorbiditiesPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Patient Comorbidities</h1>
        </div>
        <PatientComorbidities />
      </div>
    </main>
  );
}

const PatientComorbidities = async () => {
  await checkAuth();

  const { patientComorbidities } = await getPatientComorbidities();
  const { patients } = await getPatients();
  const {comorbidities } = await getComorbidities();
  return (
    <Suspense fallback={<Loading />}>
      <PatientComorbidityList patientComorbidities={patientComorbidities} patients={patients} comorbidities={comorbidities} />
    </Suspense>
  );
};
