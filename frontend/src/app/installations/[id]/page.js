// pages/tickets.js
import { getServerSession } from "next-auth";
import authOptions from "../../api/auth/[...nextauth]/options";
import { getAccessToken } from "../../../utils/sessionTokenAccessor";
import { DocForm } from "../../../components/ticketComponents";
import TicketList from "../../../components/ticketList";
import PatientDetail from "@/components/patientDetail";

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
    throw new Error("Failed to fetch ticket details.");
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
  } else if (session?.roles?.includes("imt")) {
    roleFound = "imt";
  }

  if (!roleFound) {
    return { redirect: { destination: "/unauthorized", permanent: false } };
  }
  const installation = await fetchInstallationDetails(params.id);
  const installationTickets = await fetchInstallationTickets(params.id);
  // const documents = fetchDocumentsInfo(params.id);

  return (
    <main className="bg-gray-100 min-h-screen pt-10 pb-6 px-2 md:px-0">
      <div className="max-w-3xl mx-auto px-4 bg-white shadow rounded-lg p-6">
        <PatientDetail initialData={patientDetails} role={roleFound} />

        {/* {patientDetails && (
          <div>
            {JSON.stringify(patientDetails)}
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <h3 className="text-lg font-bold leading-tight mb-4">
                Personal Profile
              </h3>
              <ul>
                <li>
                  <strong>First Name:</strong> {patientDetails.first_name}
                </li>
                <li>
                  <strong>Last Name:</strong> {patientDetails.last_name}
                </li>
                <li>
                  <strong>Home Address:</strong> {patientDetails.home_address}
                </li>
                <li>
                  <strong>Contacts:</strong>
                  <ul>
                    {patientDetails.contacts.map((contact, index) => (
                      <li key={index}>
                        <strong>Alias:</strong> {contact.alias}
                        <br />
                        <strong>Phone No:</strong> {contact.phone_no}
                        <br />
                        <strong>Email:</strong> {contact.email}
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        )} */}
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h3 className="text-lg font-bold leading-tight mb-4">
            Patient Profile Details
          </h3>
          <ul>
            <li>
              <strong>Patient ID:</strong> {installation.patient_id}
            </li>
            <li>
              <strong>Apartment Type:</strong> {installation.apartment_type}
            </li>
            <li>
              <strong>Internet Type:</strong> {installation.internet_type}
            </li>
            <li>
              <strong>Flatmates:</strong> {installation.flatmates}
            </li>
            <li>
              <strong>Pets:</strong> {installation.pets}
            </li>
            <li>
              <strong>Visitors:</strong> {installation.visitors}
            </li>
            <li>
              <strong>Smartphone Model:</strong> {installation.smartphone_model}
            </li>
            <li>
              <strong>Appliances:</strong> {installation.appliances}
            </li>
            <li>
              <strong>Issues Notes:</strong> {installation.issues_notes}
            </li>
            <li>
              <strong>Habits Notes:</strong> {installation.habits_notes}
            </li>
            <li>
              <strong>Other Notes:</strong> {installation.other_notes}
            </li>
            <li>
              <strong>Start Date:</strong>{" "}
              {new Date(installation.date_start).toLocaleString()}
            </li>
            <li>
              <strong>End Date:</strong>{" "}
              {new Date(installation.date_end).toLocaleString()}
            </li>
            <li>
              <strong>Color:</strong> {installation.hue}
            </li>
          </ul>
        </div>
        {/* <DocForm documents={documents} /> */}
        <br></br>
        <TicketList
          installation_id={params.id}
          installationTickets={installationTickets}
        />
      </div>
    </main>
  );
}
