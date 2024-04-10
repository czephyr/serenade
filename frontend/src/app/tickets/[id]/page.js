// pages/tickets.js
import { getServerSession } from "next-auth";
import authOptions from "../../api/auth/[...nextauth]/options";
import { getAccessToken } from "../../../utils/sessionTokenAccessor";

// Assuming these functions are in a utilities file or directly in your page file

async function fetchTicketDetails(ticketId) {
  const accessToken = await getAccessToken(); // Ensure you have implemented this function
  const url = `http://0.0.0.0:8000/tickets/${ticketId}`;
  const resp = await fetch(url, {
      headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
      },
  });
  if (!resp.ok) {
      throw new Error('Failed to fetch ticket details.');
  }
  return resp.json();
}

async function fetchPatientDetails(patientId) {
  const accessToken = await getAccessToken(); // Ensure this function is implemented to get the access token
  const url = `http://0.0.0.0:8000/patients/${patientId}`;
  const resp = await fetch(url, {
      headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
      },
  });
  if (!resp.ok) {
      throw new Error('Failed to fetch patient details.');
  }
  return resp.json();
}

function TicketDetails({ ticket }) {
  return (
    <div className="ticket-details">
      <h2>Ticket Details</h2>
      <p>Ticket ID: {ticket.key}</p>
      <p>Status: {ticket.status}</p>
    </div>
  );
}

function PatientDetails({ patient, role }) {
  if (role === 'iit') {
    return (
      <div className="patient-details">
        <h2>Patient Details</h2>
        <p>Name: {patient.first_name} {patient.last_name}</p>
        <p>Age: {patient.age}</p>
        <p>Gender: {patient.gender}</p>
        <p>Address: {patient.address}</p>
        <p>Phone number: {patient.phone_number}</p>
      </div>
    );
  } else if (role === 'imt') {
    return (
      <div className="patient-details">
        <h2>Installation Details</h2>
        <p>Patient ID: {patient.id}</p>
        <p>Dashboard: <a href={`http://localhost:4000/d/a1ec5e92-2864-4359-9b10-26e1717ca519/data?orgId=1&var-patientid=${patient.id}`}>View Dashboard</a></p>
      </div>
    );
  }
  return null;
}

export default async function TicketPage({ params }) {
  const session = await getServerSession(authOptions);
  let roleFound = '';

  if (session?.roles?.includes("iit")) {
    roleFound = 'iit';
  } else if (session?.roles?.includes("imt")) {
    roleFound = 'imt';
  }

  if (!roleFound) {
    return { redirect: { destination: "/unauthorized", permanent: false } };
  }

  const ticket = await fetchTicketDetails(params.id);
  const patient = await fetchPatientDetails(params.id);

  return (
    <main className="text-white p-4">
        <h1 className="text-4xl text-center mb-6">Ticket and Patient Details</h1>
        <div className="details-container">
            {ticket && <TicketDetails ticket={ticket} />}
            {patient && <PatientDetails patient={patient} role={roleFound} />}
        </div>
    </main>
  );
}