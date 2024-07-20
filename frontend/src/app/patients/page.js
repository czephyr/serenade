import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { fetchFromBackend } from "@/utils/fetches";
import authOptions from "@/app/api/auth/[...nextauth]/options";

import PatientsTable from "@/components/patientsTable";

export default async function Patients() {
  const session = await getServerSession(authOptions);

  if (session && session.roles?.includes("dottore")) {
    try {
      const patients = await fetchFromBackend("patients", "patients");

      return <PatientsTable data={patients} />;
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
