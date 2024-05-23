// pages/tickets.js
import { getServerSession } from "next-auth";

import { fetchFromBackend } from "@/utils/fetches";
import authOptions from "@/app/api/auth/[...nextauth]/options";

import DocumentManager from "@/components/documentManager";
import TicketList from "@/components/ticketList";
import PatientDetail from "@/components/patientDetail";
import InstallationDetail from "@/components/installationDetail";
import BackButton from "@/components/backButton";
import genHue from "../../../utils/hue";

export default async function TicketPage({ params }) {
  const session = await getServerSession(authOptions);
  let roleFound = "";
  let patientDetails;
  if (session?.roles?.includes("iit")) {
    roleFound = "iit";
    patientDetails = await fetchFromBackend(
      "installations info",
      `installations/${params.id}/info`
    );
    patientDetails.patient_id = params.id;
  } else if (session?.roles?.includes("imt")) {
    roleFound = "imt";
  }

  if (!roleFound) {
    return { redirect: { destination: "/unauthorized", permanent: false } };
  }
  const installation = await fetchFromBackend(
    "installations",
    `installations/${params.id}`
  );
  const installationTickets = await fetchFromBackend(
    "tickets",
    `installations/${params.id}/tickets`
  );
  const documents = await fetchFromBackend(
    "documents",
    `installations/${params.id}/documents`
  );

  return (
    <main className="bg-gray-100 min-h-screen pt-10 pb-6 px-2 md:px-0">
      <div className="max-w-3xl mx-auto px-4 bg-white shadow rounded-lg p-6">
        <BackButton />
        <h1 className="text-2xl font-bold text-center text-black mb-2">
          Installazione {genHue(installation.hue)}
        </h1>
        <div className="space-y-1">
          <TicketList
            installation_id={params.id}
            installationTickets={installationTickets}
          />
          {roleFound === "iit" && (
            <PatientDetail initialData={patientDetails} role={roleFound} />
          )}
          <InstallationDetail
            installation_id={params.id}
            initialData={installation}
          />
          <DocumentManager
            initialDocuments={documents}
            installation_id={params.id}
          />
        </div>
      </div>
    </main>
  );
}
