// pages/tickets.js
import { getServerSession } from "next-auth";
import { fetchFromBackend } from "@/utils/fetches";

import authOptions from "@/app/api/auth/[...nextauth]/options";

import PatientDetail from "@/components/patientDetail";
import InstallationDetail from "@/components/installationDetail";
import BackButton from "@/components/backButton";

export default async function TicketPage({ params }) {
  const session = await getServerSession(authOptions);
  let roleFound = "";

  if (session?.roles?.includes("dottore")) {
    roleFound = "dottore";
  }
  if (!roleFound) {
    return { redirect: { destination: "/unauthorized", permanent: false } };
  }
  console.log(params.id);
  const patient = await fetchFromBackend(
    `patient with id ${params.id}`,
    `patients/${params.id}`
  );
  const installation = await fetchFromBackend(
    `installation with id ${params.id}`,
    `installations/${params.id}`
  );
  console.log(JSON.stringify(patient));
  return (
    <main className="bg-gray-100 min-h-screen pt-10 pb-6 px-2 md:px-0">
      <div className="max-w-5xl mx-auto px-4 bg-white shadow rounded-lg p-6">
        <BackButton />
        <h1 className="text-2xl font-bold text-center text-black mb-2">
          Dettagli paziente
        </h1>
        <PatientDetail initialData={patient} role={roleFound} />
        <InstallationDetail
          installation_id={params.id}
          initialData={installation}
          role={roleFound}
        />
      </div>
    </main>
  );
}
