import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { fetchFromBackend } from "@/utils/fetches";
import authOptions from "@/app/api/auth/[...nextauth]/options";

import StatusBadge from "@/components/statusBadge";

export default async function Patients() {
  const session = await getServerSession(authOptions);

  if (session && session.roles?.includes("dottore")) {
    try {
      const patients = await fetchFromBackend("patients", "patients");

      return (
        <main className="bg-gray-100 min-h-screen pt-10 pb-6 px-2 md:px-0">
          <div className="max-w-3xl mx-auto px-4 bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold text-center mb-2">Pazienti</h1>
            <div className="overflow-x-auto">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase tracking-wider">
                      Cognome
                    </th>
                    <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase tracking-wider">
                      Dettagli
                    </th>
                    <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase tracking-wider">
                      Dati
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr key={patient.patient_id}>
                      <td className="px-5 py-5 border-b">
                        {patient.first_name}
                      </td>
                      <td className="px-5 py-5 border-b">
                        {patient.last_name}
                      </td>
                      <td className="px-5 py-5 border-b">
                        {patient.neuro_diag}
                      </td>
                      <td className="px-5 py-5 border-b">
                        <StatusBadge
                          status={patient.status}
                        />
                      </td>
                      <td className="px-5 py-5 border-b">
                        <a
                          href={`/patients/${patient.patient_id}`}
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
                      <td className="px-5 py-5 border-b">
                        <a
                          href={`/patients/${patient.patient_id}/data`} // Modify this URL as needed for your routing
                          className="inline-flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                          role="button"
                          aria-label="View Data"
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
                              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                            />
                          </svg>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4">
              <a
                href="/patients/create"
                className="inline-flex items-center justify-center mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                role="button"
              >
                Aggiungi nuovo paziente
              </a>
            </div>
          </div>
        </main>
      );
    } catch (err) {
      console.error(err);

      return (
        <main>
          <h1 className="text-4xl text-center">Patients</h1>
          <p className="text-red-600 text-center text-lg">
            Sorry, an error happened. Check the server logs.
          </p>
        </main>
      );
    }
  }

  redirect("/unauthorized");
}
