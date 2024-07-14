import NewTicketForm from "./newTicketForm";
import StatusBadge from "./statusBadge";
import TimeAgo from "javascript-time-ago";
import it from "javascript-time-ago/locale/it";

const TicketList = ({ installation_id, installationTickets, role }) => {
  TimeAgo.addDefaultLocale(it);
  const timeAgo = new TimeAgo("it-IT");
  return (
    <div className="max-w-5xl mx-auto px-4 bg-white shadow rounded-lg p-6">
      <h1 className="text-lg font-bold leading-tight mb-4">Tickets</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase tracking-wider">
                Tipologia
              </th>
              <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase tracking-wider">
                Ultimo aggiornamento
              </th>
              <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase tracking-wider">
                Stato
              </th>
              <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase tracking-wider">
                Da
              </th>
              <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase tracking-wider">
                Dettagli
              </th>
            </tr>
          </thead>
          <tbody>
            {installationTickets.map((ticket) => (
              <tr key={ticket.ticket_id}>
                <td className="px-5 py-5 border-b">{ticket.category}</td>
                <td className="px-5 py-5 border-b">
                  {timeAgo.format(Date.now() - ticket.date_delta * 1000)}
                </td>
                <td className="px-5 py-5 border-b">
                  <StatusBadge status={ticket.status} />
                </td>
                <td className="px-5 py-5 border-b">{ticket.last_sender}</td>
                <td className="px-5 py-5 border-b">
                  <a
                    href={`/tickets/${ticket.ticket_id}`}
                    className="inline-flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    role="button"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                      />
                    </svg>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {role == "imt" && (
        <div className="text-white">
          <NewTicketForm installation_id={installation_id} />
        </div>
      )}
    </div>
  );
};

export default TicketList;
