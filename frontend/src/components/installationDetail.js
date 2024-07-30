"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

const InstallationDetail = ({ installation_id, initialData, role }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [patient, setPatient] = useState(initialData);
  useEffect(() => {
    // if (
    //   status === "unauthenticated" ||
    //   (status === "authenticated" && !session.roles?.includes("dottore"))
    // ) {
    //   router.push("/unauthorized");
    //   router.refresh();
    // }
  }, [session, status, router]);

  const [isEditing, setIsEditing] = useState({
    apartment_type: false,
    internet_type: false,
    flatmates: false,
    pets: false,
    visitors: false,
    smartphone_model: false,
    appliances: false, // Only true when editing
    issues_notes: false,
    habits_notes: false,
    other_notes: false,
    date_start: false,
    date_end: false,
    date_join: false,
  });

  const handleEdit = (field) => {
    setIsEditing({ ...isEditing, [field]: true });
  };

  async function handleSend(patient_id, field, value) {
    console.log(patient_id);
    const postBody = {
      patient_id: patient_id,
      fieldId: field,
      value: value,
    };
    console.log("handlesend" + JSON.stringify(postBody));
    try {
      const response = await fetch("/api/installations/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postBody),
      });
      const result = await response.json();
      if (response.ok) {
        setPatient((prev) => ({ ...prev, [field]: value }));
        setIsEditing({ ...isEditing, [field]: false });
        toast.success("Modificato con successo!", {
          position: "bottom-left",
        });
      } else {
        console.error("API call failed: ", result.error);
      }
    } catch (error) {
      console.error("Failed to submit patient data: ", error);
    }
  }

  const handleChange = (event, field) => {
    setPatient({ ...patient, [field]: event.target.value });
    if (field == "codice_fiscale") {
      router.refresh();
    }
  };

  const fields = {
    dottore: ["apartment_type", "internet_type", "flatmates", "pets"],
    imt_iit: [
      "date_start",
      "date_end",
      "visitors",
      "smartphone_model",
      "appliances",
      "issues_notes",
      "habits_notes",
      "other_notes",
    ],
  };

  const fields_acl = {
    apartment_type: {
      label: "Tipo appartamento:",
      roles: {
        iit: { visible: true, editable: true },
        imt: { visible: true, editable: false },
        unimi: { visible: false, editable: false },
        dottore: { visible: true, editable: true },
      },
    },
    internet_type: {
      label: "Tipo connessione internet:",
      roles: {
        iit: { visible: true, editable: true },
        imt: { visible: true, editable: false },
        unimi: { visible: false, editable: false },
        dottore: { visible: true, editable: true },
      },
    },
    flatmates: {
      label: "Informazioni abitazione:",
      roles: {
        iit: { visible: true, editable: true },
        imt: { visible: true, editable: false },
        unimi: { visible: false, editable: false },
        dottore: { visible: true, editable: true },
      },
    },
    pets: {
      label: "Animali domestici:",
      roles: {
        iit: { visible: true, editable: true },
        imt: { visible: true, editable: false },
        unimi: { visible: true, editable: false },
        dottore: { visible: true, editable: true },
      },
    },
    visitors: {
      label: "Visitatori:",
      roles: {
        iit: { visible: true, editable: true },
        imt: { visible: true, editable: false },
        unimi: { visible: true, editable: false },
        dottore: { visible: false, editable: false },
      },
    },
    smartphone_model: {
      label: "Modello smartphone:",
      roles: {
        iit: { visible: true, editable: true },
        imt: { visible: true, editable: false },
        unimi: { visible: true, editable: false },
        dottore: { visible: false, editable: false },
      },
    },
    appliances: {
      label: "Elettrodomestici:",
      roles: {
        iit: { visible: true, editable: true },
        imt: { visible: true, editable: false },
        unimi: { visible: false, editable: false },
        dottore: { visible: false, editable: false },
      },
    },
    issues_notes: {
      label: "Note sui problemi:",
      roles: {
        iit: { visible: true, editable: true },
        imt: { visible: true, editable: false },
        unimi: { visible: false, editable: false },
        dottore: { visible: false, editable: false },
      },
    },
    habits_notes: {
      label: "Note sulle abitudini:",
      roles: {
        iit: { visible: true, editable: true },
        imt: { visible: true, editable: false },
        unimi: { visible: false, editable: false },
        dottore: { visible: false, editable: false },
      },
    },
    other_notes: {
      label: "Altre note:",
      roles: {
        iit: { visible: true, editable: true },
        imt: { visible: true, editable: false },
        unimi: { visible: true, editable: false },
        dottore: { visible: false, editable: false },
      },
    },
    date_start: {
      label: "Data inizio raccolta dati:",
      roles: {
        iit: { visible: true, editable: false },
        imt: { visible: true, editable: true },
        unimi: { visible: true, editable: false },
        dottore: { visible: false, editable: false },
      },
    },
    date_end: {
      label: "Data fine raccolta dati:",
      roles: {
        iit: { visible: true, editable: false },
        imt: { visible: true, editable: true },
        unimi: { visible: true, editable: false },
        dottore: { visible: false, editable: false },
      },
    },
  };

  const renderField = (field) => {
    // Check if the field should be displayed for the current role
    if (!fields_acl[field]["roles"][role]["visible"]) {
      return null; // Don't render anything if the field is not included for the role
    }

    // Special handling for notes which might use textarea
    const textAreaFields = [
      "issues_notes",
      "habits_notes",
      "other_notes",
      "flatmates",
      "visitors",
      "appliances",
    ];

    return (
      <label htmlFor={field} className="block mt-3">
        <span className="text-gray-700">{fields_acl[field]["label"]}</span>
        <div className="flex items-center mt-1">
          {textAreaFields.includes(field) ? (
            <textarea
              id={field}
              value={patient[field]}
              onChange={(e) => handleChange(e, field)}
              readOnly={!isEditing[field]}
              className={`block w-full px-3 py-2 h-40 ${!isEditing[field] ? "bg-gray-50 text-gray-600" : "bg-white"} border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
          ) : field === "date_start" || field === "date_end" ? (
            <input
              type="date"
              id={field}
              value={patient[field] ? patient[field].slice(0, 10) : ""}
              onChange={(e) => handleChange(e, field)}
              readOnly={!isEditing[field]}
              className={`block w-full px-3 py-2 ${!isEditing[field] ? "bg-gray-50 text-gray-600" : "bg-white"} border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
          ) : (
            <input
              type="text"
              id={field}
              value={patient[field]}
              onChange={(e) => handleChange(e, field)}
              readOnly={!isEditing[field]}
              className={`block w-full px-3 py-2 ${!isEditing[field] ? "bg-gray-50 text-gray-600" : "bg-white"} border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
          )}
          {fields_acl[field]["roles"][role]["editable"] && (
            <button
              className={`ml-2 text-white ${isEditing[field] ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700"} focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-1.5 text-center`}
              onClick={() =>
                isEditing[field]
                  ? handleSend(installation_id, field, patient[field])
                  : handleEdit(field)
              }
            >
              {isEditing[field] ? "Salva" : "Modifica"}
            </button>
          )}
        </div>
      </label>
    );
  };

  return (
    <main>
      <Toaster />
      <div className="max-w-5xl mx-auto px-4 bg-white shadow rounded-lg p-6">
        <h1 className="text-lg font-bold leading-tight mb-4">
        Dettagli abitazione
        </h1>
        <div className="space-y-6 text-black">
          <div className="grid grid-cols-1 gap-1">
            {[...fields.imt_iit, ...fields.dottore].map(renderField)}
          </div>
        </div>
      </div>
    </main>
  );
};

export default InstallationDetail;
