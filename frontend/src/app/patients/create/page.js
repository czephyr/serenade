// pages/create-product.js
import { getSession } from "next-auth/react";
import { redirect } from "next/navigation";
import NewPatientForm from "../../../components/NewPatientForm"; // Assume this is your form component
import { getServerSession } from "next-auth/next";
import authOptions from "../../api/auth/[...nextauth]/options";

export default async function CreatePatient() {
  const session = await getServerSession(authOptions);
  if (session && session.roles.includes("dottore")) {
    return (
      <main>
        <NewPatientForm />
      </main>
    );
  }
  redirect("/unauthorized");
}
