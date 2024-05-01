// pages/tickets.js
import { getServerSession } from "next-auth";
import authOptions from "../../api/auth/[...nextauth]/options";
import { getAccessToken } from "../../../utils/sessionTokenAccessor";
import PatientDetail from "../../../components/patientDetail";
import InstallationDetail from "@/components/installationDetail";

async function fetchPatient(patient_id) {
  const accessToken = await getAccessToken();
  const url = `${process.env.BACKEND_HOST}/api/v1/patients/${patient_id}`;

  const resp = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!resp.ok) {
    throw new Error("Failed to fetch ticket details.");
  }
  return resp.json();
}

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
  const patient = await fetchPatient(params.id);
  const installation = await fetchInstallationDetails(params.id);
  console.log(JSON.stringify(patient));
  return (
    <main className="bg-gray-100 min-h-screen pt-10 pb-6 px-2 md:px-0">
      <div className="max-w-3xl mx-auto px-4 bg-white shadow rounded-lg p-6">
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
