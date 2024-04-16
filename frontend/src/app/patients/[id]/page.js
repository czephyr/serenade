// pages/tickets.js
import { getServerSession } from "next-auth";
import authOptions from "../../api/auth/[...nextauth]/options";
import { getAccessToken } from "../../../utils/sessionTokenAccessor";
import PatientDetail from "../../../components/patientDetail";

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

export default async function TicketPage({ params }) {
  const session = await getServerSession(authOptions);
  let roleFound = "";

  if (session && session.roles?.includes("dottore")) {
    roleFound = true;
  }

  if (!roleFound) {
    return { redirect: { destination: "/unauthorized", permanent: false } };
  }
  console.log(params.id);
  const patient = await fetchPatient(params.id);

  return (
    <main className="text-white p-4">
      <h1 className="text-4xl text-center mb-6">Patient Details</h1>
      <div className="details-container">
        {/* {ticket && <TicketDetails ticket={ticket} />} */}
        <PatientDetail patient={patient} />
        {/* {patient && <PatientDetails patient={patient} role={roleFound} />} */}
      </div>
    </main>
  );
}