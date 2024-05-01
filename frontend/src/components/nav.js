import Link from "next/link";
import { getServerSession } from "next-auth";
import authOptions from "../app/api/auth/[...nextauth]/options";
import AuthStatus from "./authStatus";

export default async function Nav() {
  const session = await getServerSession(authOptions);
  return (
    <ul className="flex justify-between max-w-5xl mx-auto px-4 bg-white">
      <li className="my-3">
        <Link
          href="/redirect"
          className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300"
        >
          Serenade
        </Link>
      </li>
      <li>{session && <AuthStatus />}</li>
    </ul>
  );
}
