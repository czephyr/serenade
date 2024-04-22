"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

const PatientDetail = ({ patient }) => {
  const [patientState, setpatientState] = useState({
    first_name: patient.first_name,
    last_name: patient.last_name,
    codice_fiscale: patient.codice_fiscale,
    gender: patient.gender,
    date_of_birth: patient.date_of_birth,
    place_of_birth: patient.place_of_birth,
    neuro_diag: patient.neuro_diag,
    age_class: patient.age_class,
    home_address: patient.home_address,
    medical_notes: patient.medical_notes,
  });
  console.log(patientState);
  const router = useRouter();

  const [editableField, setEditableField] = useState(null);

  const handleEdit = (field) => {
    setEditableField(field);
  };

  const handleSave = (field, value, patient_id) => {
    setpatientState((prev) => ({ ...prev, [field]: value }));
    setEditableField(null);
    saveFieldToBackend(field, value, patient_id);
  };

  const handleChange = (field, event) => {
    setpatientState((prev) => ({ ...prev, [field]: event.target.value }));
  };

  async function saveFieldToBackend(fieldId, value, patient_id) {
    console.log("Saving", fieldId, "with value", value);

    const postBody = {
      patient_id: patient_id,
      fieldId: fieldId,
      value: value,
    };

    try {
      const response = await fetch("/api/patients/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postBody),
      });
      const result = await response.json();
      if (response.ok) {
        router.refresh(); // Refresh the page to show new data
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

  const aliasRef = useRef(null);
  const phoneNoRef = useRef(null);
  const emailRef = useRef(null);

  const [contacts, setContacts] = useState(patient.contacts);
  console.log(contacts);

  const [showAddContactForm, setShowAddContactForm] = useState(false);
  const removeContactAtIndex = (idToRemove) => {
    const updatedContacts = contacts.filter(
      (contact, index) => contact.id !== idToRemove
    );
    deleteContact(idToRemove);
    setContacts(updatedContacts);
  };
  async function deleteContact(contact_id) {
    const postBody = {
      contact_id: contact_id,
    };

    try {
      const response = await fetch("/api/patients/contacts/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postBody),
      });
      const result = await response.json();
      if (response.ok) {
      } else {
        console.error("API call failed: ", result.error);
      }
    } catch (error) {
      console.error("Failed to submit patient data: ", error);
    }
  }

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

  return (
    <div className="bg-gray-100 p-8">
      <Toaster />
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold leading-tight text-gray-900 mb-4">
          Patient Information
        </h3>
        {Object.entries(patientState).map(([key, value]) => (
          <div key={key} className="mb-3">
            <label className="block text-sm font-medium text-gray-700 capitalize">
              {key.replace(/([A-Z])/g, " $1").trim()}:
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              {editableField === key ? (
                <input
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  type={key === "dateOfBirth" ? "date" : "text"}
                  value={value}
                  onChange={(e) => handleChange(key, e)}
                  onBlur={() => handleSave(key, value, patient.patient_id)}
                />
              ) : (
                <span
                  className="flex items-center px-3 py-2 bg-gray-100 border border-gray-300 text-gray-900 sm:text-sm rounded-md"
                  onDoubleClick={() => handleEdit(key)}
                >
                  {value}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white shadow rounded-lg p-6 mt-6">
        <h3 className="text-lg font-semibold leading-tight text-gray-900 mb-4">
          Contacts
        </h3>
        <div className="space-y-4">
          {console.log(contacts)}
          {contacts.map((contact, index) => (
            <div
              key={contact.id}
              className="flex justify-between items-center bg-gray-100 p-2 rounded-md"
            >
              <span className="text-gray-700">
                {JSON.stringify(contact.alias)} -{" "}
                {JSON.stringify(contact.phone_no)} -{" "}
                {JSON.stringify(contact.email)}
              </span>
              <button
                onClick={() => removeContactAtIndex(contact.id)}
                className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-1.5 text-center inline-flex items-center"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={() => setShowAddContactForm(true)}
          className="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add New Contact
        </button>
      </div>

      {showAddContactForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Add New Contact
              </h3>
              <div className="mt-2 px-7 py-3">
                <input
                  type="text"
                  name="alias"
                  placeholder="Alias"
                  ref={aliasRef}
                  className="mb-3 px-3 py-2 text-black border border-gray-300 rounded-md w-full"
                />
                <input
                  type="text"
                  name="phone_no"
                  placeholder="Phone Number"
                  ref={phoneNoRef}
                  className="mb-3 px-3 py-2 text-black border border-gray-300 rounded-md w-full"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  ref={emailRef}
                  className="mb-3 px-3 py-2 text-black border border-gray-300 rounded-md w-full"
                />
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() =>
                    addContact(
                      {
                        alias: aliasRef.current.value,
                        phone_no: phoneNoRef.current.value,
                        email: emailRef.current.value,
                      },
                      patient.patient_id
                    )
                  }
                  className="px-4 py-2 bg-green-500 text-base font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
                >
                  Add Contact
                </button>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => setShowAddContactForm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDetail;
