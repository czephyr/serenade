"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

const InstallationDetail = ({ installation_id, initialData, role }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showAddContactForm, setShowAddContactForm] = useState(false);
  const [contacts, setContacts] = useState(initialData.contacts);

  const [patient, setPatient] = useState(initialData);
  const aliasRef = useRef(null);
  const phoneNoRef = useRef(null);
  const emailRef = useRef(null);
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
    date_exit: false,
  });

  const handleEdit = (field) => {
    setIsEditing({ ...isEditing, [field]: true });
  };

  async function handleSend(patient_id, field, value) {
    // Here you would ideally send data to your endpoint and handle the response
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
        toast.success("Successfully edited!", {
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

  const renderField = (field) => {
    // Define labels and editable status for specific fields
    const fieldDetails = {
      apartment_type: { label: "Tipo appartamento:", editable: true },
      internet_type: { label: "Tipo connessione internet:", editable: true },
      flatmates: { label: "Informazioni abitazione:", editable: true },
      pets: { label: "Animali domestici:", editable: true },
      visitors: { label: "Visitatori:", editable: true },
      smartphone_model: { label: "Modello smartphone:", editable: true },
      appliances: { label: "Elettrodomestici:", editable: true },
      issues_notes: { label: "Note sui problemi:", editable: true },
      habits_notes: { label: "Note sulle abitudini:", editable: true },
      other_notes: { label: "Altre note:", editable: true },
      date_start: { label: "Data inizio:", editable: true },
      date_end: { label: "Data conclusione:", editable: true },
    };

    // Check if the field should be displayed for the current role
    if (
      (role === "dottore" && !fields.dottore.includes(field)) ||
      ((role === "imt" || role === "iit") && !fields.imt_iit.includes(field))
    ) {
      return null; // Don't render anything if the field is not included for the role
    }

    // Special handling for notes which might use textarea
    const textAreaFields = [
      "issues_notes",
      "habits_notes",
      "other_notes",
      "flatmates",
    ];

    const fieldInfo = fieldDetails[field] || { label: field, editable: false };

    return (
      <label htmlFor={field} className="block mt-3">
        <span className="text-gray-700">{fieldInfo.label}</span>
        <div className="flex items-center mt-1">
          {textAreaFields.includes(field) ? (
            <textarea
              id={field}
              value={patient[field]}
              onChange={(e) => handleChange(e, field)}
              readOnly={!isEditing[field]}
              className="flex-grow px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          ) : field === "date_start" || field === "date_end" ? (
            <input
              type="date"
              id={field}
              value={patient[field] ? patient[field].slice(0, 10) : ""}
              onChange={(e) => handleChange(e, field)}
              readOnly={!isEditing[field]}
              className="flex-grow px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          ) : (
            <input
              type="text"
              id={field}
              value={patient[field]}
              onChange={(e) => handleChange(e, field)}
              readOnly={!isEditing[field]}
              className="flex-grow px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          )}
          {fieldInfo.editable && (
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

  async function addContact(contact, patient_id) {
    const updatedContacts = [...contacts, contact];
    console.log(updatedContacts);
    console.log(contacts);

    const postBody = {
      patient_id: patient_id,
      contact: contact,
    };

    try {
      const response = await fetch("/api/patients/contacts/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postBody),
      });
      const result = await response.json();
      if (response.ok) {
        setContacts(updatedContacts);
        setShowAddContactForm(false);
      } else {
        console.error("API call failed: ", result.error);
      }
    } catch (error) {
      console.error("Failed to submit patient data: ", error);
    }
  }

  const removeContactAtIndex = (index) => {
    setContacts(contacts.filter((_, idx) => idx !== index));
  };

  return (
    <main>
      <Toaster />
      <div className="max-w-3xl mx-auto px-4 bg-white shadow rounded-lg p-6">
        <h1 className="text-lg font-bold leading-tight mb-4">Installazione</h1>
        <div className="space-y-6 text-black">
          <div className="grid grid-cols-1 gap-1">
            {[...fields.dottore, ...fields.imt_iit].map((field) =>
              renderField(field, role)
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default InstallationDetail;
