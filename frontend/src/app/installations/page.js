import TimeAgo from "javascript-time-ago";
import it from "javascript-time-ago/locale/it";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { fetchFromBackend } from "@/utils/fetches";
import authOptions from "@/app/api/auth/[...nextauth]/options";

import StatusBadge from "@/components/statusBadge";
import genHue from "@/utils/hue";
export default async function Installations() {
  const session = await getServerSession(authOptions);
  TimeAgo.addDefaultLocale(it);
  const timeAgo = new TimeAgo("it-IT");

  // Adjust the role check to include 'iit' or 'iim'
  if (
    session &&
    (session.roles?.includes("iit") ||
      session.roles?.includes("imt") ||
      session.roles?.includes("unimi"))
  ) {
    try {
      const installations = await fetchFromBackend(
        "installations",
        "installations"
      );
      return (
        <main className="bg-gray-100 min-h-screen pt-10 pb-6 px-2 md:px-0">
          <div className="max-w-3xl mx-auto px-4 bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold text-center mb-2">
              Installazioni
            </h1>
            <div className="overflow-x-auto">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase tracking-wider">
                      Alias
                    </th>
                    <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase tracking-wider">
                      Stato
                    </th>
                    <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase tracking-wider">
                      Ultimo aggiornamento
                    </th>
                    <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase tracking-wider">
                      Dettagli
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {installations.map((installation) => (
                    <tr key={installation.patient_id}>
                      <td className="px-5 py-5 border-b">
                        {genHue({ seed: installation.hue })}
                      </td>
                      <td className="px-5 py-5 border-b">
                        <StatusBadge status={installation.status} />
                      </td>
                      <td className="px-5 py-5 border-b">
                        {timeAgo.format(Date.now() - installation.date_delta * 1000)}
                      </td>
                      <td className="px-5 py-5 border-b">
                        <a
                          href={`/installations/${installation.patient_id}`}
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
                              d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z"
                            />
                          </svg>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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
