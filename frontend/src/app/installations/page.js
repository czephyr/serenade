import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { fetchFromBackend } from "@/utils/fetches";
import authOptions from "@/app/api/auth/[...nextauth]/options";

import InstallationTable from "@/components/installationsTable";

export default async function Installations() {
  const session = await getServerSession(authOptions);

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
      return <InstallationTable data={installations} />;
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
