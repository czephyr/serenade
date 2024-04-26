"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

const InstallationDetail = ({ initialData, role }) => {
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
    issue_notes: false,
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
    const postBody = {
      patient_id: patient_id,
      fieldId: field,
      value: value,
    };

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

  const fields = [
    "apartment_type",
    "internet_type",
    "flatmates",
    "pets",
    "visitors",
    "smartphone_model",
    "appliances", // Only true when editing
    "issue_notes",
    "habits_notes",
    "other_notes",
    "date_start",
    "date_end",
    "date_join",
    "date_exit",
  ];

  const renderField = (field) => {
    // Define labels for specific fields if needed
    const fieldLabels = {
      apartment_type: "Type of Apartment:",
      internet_type: "Type of Internet:",
      flatmates: "Number of Flatmates:",
      pets: "Pets:",
      visitors: "Allowed Visitors:",
      smartphone_model: "Smartphone Model:",
      appliances: "Appliances:",
      issue_notes: "Issue Notes:",
      habits_notes: "Habits Notes:",
      other_notes: "Other Notes:",
      date_start: "Start Date:",
      date_end: "End Date:",
      date_join: "Joining Date:",
      date_exit: "Exit Date:",
    };

    // Special handling for notes which might use textarea
    const textAreaFields = ["issue_notes", "habits_notes", "other_notes"];

    return (
      <label htmlFor={field} className="block mt-3">
        <span className="text-gray-700">{fieldLabels[field] || field}</span>
        <div className="flex items-center mt-1">
          {textAreaFields.includes(field) ? (
            <textarea
              id={field}
              value={patient[field]}
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
          <button
            className={`ml-2 text-white ${isEditing[field] ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700"} focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-1.5 text-center`}
            onClick={() =>
              isEditing[field]
                ? handleSend(patient.patient_id, field, patient[field])
                : handleEdit(field)
            }
          >
            {isEditing[field] ? "Send" : "Edit"}
          </button>
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
        <h1 className="text-2xl font-bold text-center text-black mb-2">
          Dettagli installazione
        </h1>
        <div className="space-y-6 text-black">
          <div className="grid grid-cols-1 gap-1">
            {fields.map((field) => renderField(field, role))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default InstallationDetail;
