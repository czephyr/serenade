import { getServerSession } from "next-auth";
import authOptions from "../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import { getAccessToken } from "../../utils/sessionTokenAccessor";
import { SetDynamicRoute } from "@/utils/setDynamicRoute";

async function getAllInstallations() {
  const url = `${process.env.BACKEND_HOST}/api/v1/installations/`; // Adjust the URL to your tickets API endpoint

  let accessToken = await getAccessToken();

  const resp = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
  });

  if (resp.ok) {
    const data = await resp.json();
    return data;
  }

  throw new Error("Failed to fetch instal;ations. Status: " + resp.status);
}

export default async function Installations() {
  const session = await getServerSession(authOptions);

  // Adjust the role check to include 'iit' or 'iim'
  if (
    session &&
    (session.roles?.includes("iit") || session.roles?.includes("imt"))
  ) {
    try {
      const installations = await getAllInstallations(); // Fetch tickets instead of patients

      return (
        <main className="text-white">
          <SetDynamicRoute></SetDynamicRoute>
          <main>
            <h1 className="text-4xl text-center">Installation List</h1>
            <div className="overflow-x-auto">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase tracking-wider">
                      Installation ID
                    </th>
                    <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase tracking-wider">
                      Last Update
                    </th>
                    <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase tracking-wider">
                      Color
                    </th>
                    <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {installations.map((installation) => (
                    <tr key={installation.patient_id}>
                      <td className="px-5 py-5 border-b">
                        Patient {installation.patient_id}
                      </td>
                      <td className="px-5 py-5 border-b">
                        {installation.status}
                      </td>
                      <td className="px-5 py-5 border-b">
                        {installation.date_delta}
                      </td>
                      <td className="px-5 py-5 border-b">{installation.hue}</td>
                      <td className="px-5 py-5 border-b">
                        <a
                          href={`/installations/${installation.patient_id}`}
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
          <div>{JSON.stringify(installations)}</div>
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
