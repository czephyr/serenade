// pages/create-product.js
import { getSession } from "next-auth/react";
import NewPatientForm from "../../../components/NewPatientForm"; // Assume this is your form component
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../api/auth/[...nextauth]/route";

export  default async function CreatePatient() {
  const session = await getServerSession(authOptions)
  if (!session || !session.roles.includes("dottore")) {
    return {
      redirect: {
        destination: '/unauthorized',
        permanent: false,
      },
    };
  }

  return (
    <main>
      <NewPatientForm />
    </main>
  );
}