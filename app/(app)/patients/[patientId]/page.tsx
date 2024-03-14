import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getPatientByIdWithVitalsAndCommentsAndHistoriesAndPatientComorbiditiesAndPatientDisabilities } from "@/lib/api/patients/queries";
import OptimisticPatient from "./OptimisticPatient";
import { checkAuth } from "@/lib/auth/utils";
import VitalList from "@/components/vitals/VitalList";
import CommentList from "@/components/comments/CommentList";
import HistoryList from "@/components/histories/HistoryList";
import PatientComorbidityList from "@/components/patientComorbidities/PatientComorbidityList";
import PatientDisabilityList from "@/components/patientDisabilities/PatientDisabilityList";

import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";
import { getComorbidities } from "@/lib/api/comorbidities/queries";

export const revalidate = 0;

export default async function PatientPage({
  params,
}: {
  params: { patientId: string };
}) {
  return (
    <main className="overflow-auto">
      hello
      <Patient id={params.patientId} />
    
    </main>
  );
}

const Patient = async ({ id }: { id: string }) => {
  await checkAuth();

  const data  = await getPatientByIdWithVitalsAndCommentsAndHistoriesAndPatientComorbiditiesAndPatientDisabilities(id);

  const {

    patient,
    vitals,
    comments,
    histories,
    patientComorbidities,
    patientDisabilities,
  } =
    await getPatientByIdWithVitalsAndCommentsAndHistoriesAndPatientComorbiditiesAndPatientDisabilities(
      id
    );
  const { comorbidities } = await getComorbidities();
  console.log(data);

  if (!patient) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div>
        {comorbidities.map((comorbidity) => (
          <div>{comorbidity.name}</div>
        ))}
      </div>
      <div className="relative">
        <BackButton currentResource="patients" />
        <OptimisticPatient patient={patient} />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">
          {patient.name}&apos;s Vitals
        </h3>
        <VitalList patients={[]} patientId={patient.id} vitals={vitals} />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">
          {patient.name}&apos;s Comments
        </h3>
        <CommentList patients={[]} patientId={patient.id} comments={comments} />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">
          {patient.name}&apos;s Histories
        </h3>
        <HistoryList
          patients={[]}
          patientId={patient.id}
          histories={histories}
        />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">
          {patient.name}&apos;s Patient Comorbidities
        </h3>
        <PatientComorbidityList
          comorbidities={comorbidities}
          patients={[]}
          patientId={patient.id}
          patientComorbidities={patientComorbidities}
        />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">
          {patient.name}&apos;s Patient Disabilities
        </h3>
        <PatientDisabilityList
          patients={[]}
          patientId={patient.id}
          patientDisabilities={patientDisabilities}
        />
      </div>
    </Suspense>
  );
};
