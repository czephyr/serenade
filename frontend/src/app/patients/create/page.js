// pages/create-product.js
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

import authOptions from "@/app/api/auth/[...nextauth]/options";

import NewPatientForm from "@/components/NewPatientForm";

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
