// pages/tickets.js
import { getServerSession } from "next-auth";
import authOptions from "../../api/auth/[...nextauth]/options";
import { getAccessToken } from "../../../utils/sessionTokenAccessor";
import {
  DocForm,
  SendMsgForm,
  CloseButton,
} from "../../../components/ticketComponents";

async function fetchTicketDetails(ticket_id) {
  const accessToken = await getAccessToken();
  const url = `${process.env.BACKEND_HOST}/api/v1/tickets/${ticket_id}`;

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

async function fetchTicketMessages(ticket_id) {
  const accessToken = await getAccessToken();
  const url = `${process.env.BACKEND_HOST}/api/v1/tickets/${ticket_id}/messages`;

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

function TicketDetails({ ticket }) {
  return (
    <div className="ticket-details">
      <h2>Ticket Details</h2>
      {JSON.stringify(ticket)}
      {/* <p>Ticket ID: {ticket.key}</p> */}
      {/* <p>Status: {ticket.status}</p> */}
    </div>
  );
}

function TicketMessages({ messageList }) {
  return (
    <div className="ticket-details">
      <h2>Message list</h2>
      {JSON.stringify(messageList)}
      {/* <p>Ticket ID: {ticket.key}</p> */}
      {/* <p>Status: {ticket.status}</p> */}
    </div>
  );
}

export default async function TicketPage({ params }) {
  const session = await getServerSession(authOptions);
  let roleFound = "";

  if (session?.roles?.includes("iit")) {
    roleFound = "iit";
  } else if (session?.roles?.includes("imt")) {
    roleFound = "imt";
  }

  if (!roleFound) {
    return { redirect: { destination: "/unauthorized", permanent: false } };
  }
  console.log(params.id);
  const ticket = await fetchTicketDetails(params.id);
  const ticketMessages = await fetchTicketMessages(params.id);

  return (
    <main className="text-white p-4">
      <h1 className="text-4xl text-center mb-6">Ticket and Patient Details</h1>
      <div className="details-container">
        {/* {ticket && <TicketDetails ticket={ticket} />} */}
        <TicketDetails ticket={ticket} />
        <TicketMessages messageList={ticketMessages} />
        <SendMsgForm ticket={params.id} />
        <DocForm ticket={params.id} />
        <CloseButton ticket={params.id} />
        {/* {patient && <PatientDetails patient={patient} role={roleFound} />} */}
      </div>
    </main>
  );
}
