// pages/tickets.js
import { getServerSession } from "next-auth";

import { fetchFromBackend } from "@/utils/fetches";
import authOptions from "@/app/api/auth/[...nextauth]/options";

import TicketMessages from "@/components/ticketMessageForm";
import BackButton from "@/components/backButton";

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
    {
      key: "ts",
      label: "Data di apertura",
      formatter: (value) => new Date(value).toLocaleString('it-IT',{ timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'}),
    },
    {
      key: "date_closed",
      label: "Data di chiusura",
      formatter: (value) => value && new Date(value).toLocaleString('it-IT',{ timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'}),
    },
    {
      key: "category",
      label: "Categoria",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 bg-white shadow rounded-lg p-6">
      <BackButton />
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
  const ticket = await fetchFromBackend(
    `ticket with id ${params.id}`,
    `tickets/${params.id}`
  );
  const ticketMessages = await fetchFromBackend(
    `ticket messages with id ${params.id}`,
    `tickets/${params.id}/messages`
  );

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
      </div>
    </main>
  );
}
