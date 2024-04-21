// pages/tickets.js
import { getServerSession } from "next-auth";
import authOptions from "../../api/auth/[...nextauth]/options";
import { getAccessToken } from "../../../utils/sessionTokenAccessor";
import {
  DocForm,
  SendMsgForm,
  CloseButton,
} from "../../../components/ticketComponents";

import TicketMessages from "../../../components/ticketMessageForm";

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
    <div className="bg-white text-black shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h3 className="text-lg font-bold leading-tight mb-4">Ticket Details</h3>
      <ul>
        <li>
          <strong>Ticket ID:</strong> {ticket.ticket_id}
        </li>
        <li>
          <strong>Patient ID:</strong> {ticket.patient_id}
        </li>
        <li>
          <strong>Issue Date and Time:</strong>{" "}
          {new Date(ticket.ts).toLocaleString()}
        </li>
        {ticket.date_closed && (
          <li>
            <strong>Closure Date and Time:</strong>{" "}
            {new Date(ticket.date_closed).toLocaleString()}
          </li>
        )}
      </ul>
    </div>
  );
}

// function TicketMessages({ messageList }) {
//   return (
//     <div className="ticket-details">
//       <h2>Message list</h2>
//       {JSON.stringify(messageList)}
//       {/* <p>Ticket ID: {ticket.key}</p> */}
//       {/* <p>Status: {ticket.status}</p> */}
//     </div>
//   );
// }

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
      <h1 className="text-4xl text-center mb-6">Ticket</h1>
      <div className="details-container">
        {JSON.stringify(ticket)}
        <TicketDetails ticket={ticket} />
        <TicketMessages
          ticketMessages={ticketMessages}
          ticketNum={ticket.ticket_id}
          isOpen={!ticket.date_closed}
          installNum={ticket.patient_id}
        />
        {/* <TicketMessages messageList={ticketMessages} />
        <SendMsgForm ticket={params.id} />
        <CloseButton ticket={params.id} /> */}
        {/* {patient && <PatientDetails patient={patient} role={roleFound} />} */}
      </div>
    </main>
  );
}
