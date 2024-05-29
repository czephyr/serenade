// pages/tickets.js
import { getServerSession } from "next-auth";

import { fetchFromBackend } from "@/utils/fetches";
import authOptions from "@/app/api/auth/[...nextauth]/options";

import DocumentManager from "@/components/documentManager";
import TicketList from "@/components/ticketList";
import PatientDetail from "@/components/patientDetail";
import InstallationDetail from "@/components/installationDetail";
import genHue from "@/utils/hue";
import BackButton from "@/components/backButton";
import DashboardButton from "@/components/dashboardButton";

export default async function TicketPage({ params }) {
  const session = await getServerSession(authOptions);
  let roleFound = "";
  let patientDetails;
  if (session?.roles?.includes("iit")) {
    roleFound = "iit";
  } else if (session?.roles?.includes("imt")) {
    roleFound = "imt";
  } else if (session?.roles?.includes("unimi")) {
    roleFound = "unimi";
  }
  if (!roleFound) {
    return { redirect: { destination: "/unauthorized", permanent: false } };
  }
  if (roleFound == "iit" || roleFound == "unimi") {
    try {
      let endpoint;
      let infoType;

      if (roleFound == "iit") {
        infoType = "installations info";
        endpoint = `installations/${params.id}/info`;
      } else if (roleFound == "unimi") {
        infoType = "patient unimi info";
        endpoint = `patients/${params.id}/screenings/lastest`;
      }

      patientDetails = await fetchFromBackend(infoType, endpoint);
    } catch (error) {
      console.error(error.message);
      return { redirect: { destination: "/unauthorized", permanent: false } };
    }

    patientDetails.patient_id = params.id;
  }

  const installation = await fetchFromBackend(
    "installations",
    `installations/${params.id}`
  );
  let installationTickets;
  if (roleFound === "imt" || roleFound === "iit") {
    installationTickets = await fetchFromBackend(
      "tickets",
      `installations/${params.id}/tickets`
    );
  }
  const documents = await fetchFromBackend(
    "documents",
    `installations/${params.id}/documents`
  );

  return (
    <main className="bg-gray-100 min-h-screen pt-10 pb-6 px-2 md:px-0">
      <div className="max-w-3xl mx-auto px-4 bg-white shadow rounded-lg p-6">
        <BackButton />
        <h1 className="text-2xl font-bold text-center text-black mb-2">
          Installazione {genHue({ seed: installation.hue })}
        </h1>
        <div className="space-y-1">
          {roleFound !== "unimi" && (
            <TicketList
              installation_id={params.id}
              installationTickets={installationTickets.sort(
                (a, b) => a.date_delta - b.date_delta
              )}
            />
          )}
          {(roleFound === "iit" || roleFound == "unimi") && (
            <PatientDetail initialData={patientDetails} role={roleFound} />
          )}
          {roleFound == "unimi" && (
            <DashboardButton installation_id={params.id} />
          )}
          <InstallationDetail
            installation_id={params.id}
            initialData={installation}
            role={roleFound}
          />
          <DocumentManager
            initialDocuments={documents}
            installation_id={params.id}
            role={roleFound}
          />
        </div>
      </div>
    </main>
  );
}
