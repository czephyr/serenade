"use client";

import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

const DeleteButton = ({ patient_id }) => {
  const router = useRouter();

  async function handleDelete(patient_id) {
    if (
      window.confirm(
        "Sei sicuro di voler eliminare questo paziente? Questa azione è IRREVERSIBILE ed elimina TUTTI i dati riguardanti il paziente, anche i dati disponibili agli utenti tecnici."
      )
    ) {
      const postBody = {
        patient_id: patient_id,
      };

      try {
        const response = await fetch("/api/patients/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(postBody),
        });
        const result = await response.json();
        if (response.ok) {
          toast.success("Eliminato con successo!", {
            position: "bottom-left",
          });
          router.push("/redirect");
        } else {
          console.error("API call failed: ", result.error);
        }
      } catch (error) {
        console.error("Failed to submit patient data: ", error);
      }
    }
  }
  return (
    <div className="flex justify-center mt-4 py-5">
      <Toaster />

      <a
        href="#"
        onClick={() => {
          handleDelete(patient_id);
        }}
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        style={{ textDecoration: "none" }}
      >
        Elimina paziente
      </a>
    </div>
  );
};

export default DeleteButton;
