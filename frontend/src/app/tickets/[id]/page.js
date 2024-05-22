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

const renderField = (field, data) => {
  if (!data[field.key] && field.key === "date_closed") return null; // Do not render if no closure date

  return (
    <div className="block mb-4">
      <label htmlFor={field.key} className="text-gray-700 font-semibold">
        {field.label}:
      </label>
      <div className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm">
        {field.formatter ? field.formatter(data[field.key]) : data[field.key]}
      </div>
    </div>
  );
};

function TicketDetails({ ticket }) {
  const ticketFields = [
    { key: "ticket_id", label: "Ticket ID" },
    { key: "patient_id", label: "Installazione" },
    {
      key: "ts",
      label: "Data di apertura",
      formatter: (value) => new Date(value).toLocaleString(),
    },
    {
      key: "date_closed",
      label: "Data di chiusura",
      formatter: (value) => value && new Date(value).toLocaleString(),
    },
    {
      key: "category",
      label: "Categoria",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold text-center text-black mb-4">
        Dettagli del ticket
      </h1>
      <div className="space-y-6 text-black">
        <div className="grid grid-cols-1 gap-1">
          {ticketFields.map((field) => renderField(field, ticket))}
        </div>
      </div>
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
    <main className="bg-gray-100 min-h-screen pt-10 pb-6 px-2 md:px-0">
      <div className="max-w-3xl mx-auto px-4 bg-white shadow rounded-lg p-6">
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
