import Link from "next/link";
import { getServerSession } from "next-auth";
import authOptions from "../app/api/auth/[...nextauth]/options";

export default async function Nav() {
  const session = await getServerSession(authOptions);
  return (
    <ul className="mt-3">
      user:{session?.user.name}
      <li className="my-1">
        <Link className="hover:bg-gray-500" href="/">
          Home
        </Link>
      </li>
      <li className="my-1">
        <Link className="hover:bg-gray-500" href="/patients">
          Patients
        </Link>
      </li>
      <li className="my-1">
        <Link className="hover:bg-gray-500" href="/patients/create">
          Create patient
        </Link>
      </li>
      <li className="my-1">
        <Link className="hover:bg-gray-500" href="/installations">
          Installations
        </Link>
      </li>
    </ul>
  );
}
