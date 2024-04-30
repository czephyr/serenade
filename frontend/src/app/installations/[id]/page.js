// pages/tickets.js
import { getServerSession } from "next-auth";
import authOptions from "../../api/auth/[...nextauth]/options";
import { getAccessToken } from "../../../utils/sessionTokenAccessor";
import DocumentManager from "../../../components/documentManager";
import TicketList from "../../../components/ticketList";
import PatientDetail from "@/components/patientDetail";
import InstallationDetail from "@/components/installationDetail";

async function fetchInstallationDetails(installation_id) {
  const accessToken = await getAccessToken();
  const url = `${process.env.BACKEND_HOST}/api/v1/installations/${installation_id}`;

  const resp = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!resp.ok) {
    throw new Error("Failed to fetch installation details.");
  }
  return resp.json();
}

async function fetchInstallationTickets(installation_id) {
  const accessToken = await getAccessToken();
  const url = `${process.env.BACKEND_HOST}/api/v1/installations/${installation_id}/tickets`;

  const resp = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!resp.ok) {
    throw new Error("Failed to fetch ticket messages.");
  }
  return resp.json();
}

async function fetchPatientDetails(installation_id) {
  const accessToken = await getAccessToken();
  const url = `${process.env.BACKEND_HOST}/api/v1/installations/${installation_id}/info`;

  const resp = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!resp.ok) {
    throw new Error("Failed to fetch ticket messages.");
  }
  return resp.json();
}

async function fetchDocumentsInfo(patient_id) {
  const accessToken = await getAccessToken();
  const url = `${process.env.BACKEND_HOST}/api/v1/installations/${patient_id}/documents`;

  const resp = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!resp.ok) {
    throw new Error("Failed to fetch ticket messages.");
  }
  return resp.json();
}

export default async function TicketPage({ params }) {
  const session = await getServerSession(authOptions);
  let roleFound = "";
  let patientDetails;
  if (session?.roles?.includes("iit")) {
    roleFound = "iit";
    patientDetails = await fetchPatientDetails(params.id);
    patientDetails.patient_id = params.id;
  } else if (session?.roles?.includes("imt")) {
    roleFound = "imt";
  }

  if (!roleFound) {
    return { redirect: { destination: "/unauthorized", permanent: false } };
  }
  const installation = await fetchInstallationDetails(params.id);
  const installationTickets = await fetchInstallationTickets(params.id);
  const documents = await fetchDocumentsInfo(params.id);

  return (
    <main className="bg-gray-100 min-h-screen pt-10 pb-6 px-2 md:px-0">
      <div className="max-w-3xl mx-auto px-4 bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center text-black mb-2">
          Installazione {installation.hue}
        </h1>
        <div className="space-y-1">
          <TicketList
            installation_id={params.id}
            installationTickets={installationTickets}
          />
          <PatientDetail initialData={patientDetails} role={roleFound} />
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
