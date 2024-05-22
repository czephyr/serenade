import { getServerSession } from "next-auth";
import authOptions from "../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

export default async function RoleBasedRedirect() {
  const session = await getServerSession(authOptions);
  if (
    session?.roles?.includes("iit") ||
    session?.roles?.includes("unimi") ||
    session?.roles?.includes("imt")
  ) {
    redirect("/installations");
  } else if (session?.roles?.includes("dottore")) {
    redirect("/patients");
  }
}
