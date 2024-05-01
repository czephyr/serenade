import AuthStatus from "../components/authStatus"
import { getServerSession } from "next-auth";
import authOptions from "./api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
export default async function Home() {
  const session = await getServerSession(authOptions);
  if(session){
    redirect("/redirect")
  }
  return (
    <main className="bg-gray-100 min-h-screen pt-10 pb-6 px-2 md:px-0">
      <div className="max-w-md mx-auto px-4 bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center text-black mb-4">Benvenuto su Serenade!</h1>
          <div className="flex justify-center">
            <AuthStatus />
          </div>
      </div>
    </main>
  );
}
