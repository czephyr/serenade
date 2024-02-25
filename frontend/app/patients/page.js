import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getAccessToken } from "../../utils/sessionTokenAccessor";
import { SetDynamicRoute } from "@/utils/setDynamicRoute";

async function getAllPatients() {
  const url = `http://0.0.0.0:8000/patients/`;

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

  throw new Error("Failed to fetch data. Status: " + resp.status);
}

export default async function Patients() {
  const session = await getServerSession(authOptions);

  if (session && session.roles?.includes("dottore")) {
    try {
      const patients = await getAllPatients();


      return (
        <main>
          <SetDynamicRoute></SetDynamicRoute>
          <main className="text-white">
            <h1 className="text-4xl text-center">Patients List</h1>
            <div className="overflow-x-auto">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th className="px-5 py-3 border-b-2  text-left text-xs font-semibold uppercase tracking-wider">
                      PID
                    </th>
                    <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold  uppercase tracking-wider">
                    first_name
                    </th>
                    <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold  uppercase tracking-wider">
                    last_name
                    </th>
                    <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold  uppercase tracking-wider">
                    installation status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr key={patient.id}>
                      <td className="px-5 py-5 border-b">
                        {patient.id}
                      </td>
                      <td className="px-5 py-5 border-b">
                        {patient.first_name}
                      </td>
                      <td className="px-5 py-5 border-b">
                        {patient.last_name}
                      </td>
                      <td className="px-5 py-5 border-b">
                        status
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