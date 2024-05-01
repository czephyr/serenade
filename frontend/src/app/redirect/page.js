import { getServerSession } from "next-auth";
import authOptions from "../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

export default async function RoleBasedRedirect() {
  const session = await getServerSession(authOptions);
  let roleFound = "";
  if (session?.roles?.includes("iit")) {
    roleFound = "iit";
    redirect("/installations");
  } else if (session?.roles?.includes("dottore")) {
    roleFound = "dottore";
    redirect("/patients");
  }
}
