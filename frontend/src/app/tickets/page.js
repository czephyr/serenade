import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import authOptions from "@/app/api/auth/[...nextauth]/options";
import { fetchFromBackend } from "@/utils/fetches";
import { SetDynamicRoute } from "@/utils/setDynamicRoute";

export default async function Tickets() {
  const session = await getServerSession(authOptions);

  // Adjust the role check to include 'iit' or 'iim'
  if (
    session &&
    (session.roles?.includes("iit") || session.roles?.includes("imt"))
  ) {
    try {
      const tickets = await fetchFromBackend("tickets", "tickets"); // Fetch tickets instead of patients

      return (
        <main className="text-white">
          <SetDynamicRoute></SetDynamicRoute>
          <main>
            <h1 className="text-4xl text-center">Tickets List</h1>
            <div className="overflow-x-auto">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase tracking-wider">
                      Ticket ID
                    </th>
                    <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr key={ticket.ticket_id}>
                      <td className="px-5 py-5 border-b">
                        Ticket {ticket.key}
                      </td>
                      <td className="px-5 py-5 border-b">{ticket.status}</td>
                      <td className="px-5 py-5 border-b">
                        <a
                          href={`/tickets/${ticket.ticket_id}`}
                          className="text-blue-500 hover:underline"
                        >
                          View Details
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </main>
        </main>
      );
    } catch (err) {
      console.error(err);

      return (
        <main>
          <h1 className="text-4xl text-center">Error</h1>
          <p className="text-red-600 text-center text-lg">
            Sorry, an error happened. Check the server logs.
          </p>
        </main>
      );
    }
  } else {
    redirect("/unauthorized");
  }
}
