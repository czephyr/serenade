"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

const PatientDetail = ({ initialData, role }) => {
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
    first_name: false,
    last_name: false,
    neuro_diag: false,
    age_class: false,
    home_address: false,
    medical_notes: false,
    gender: false, // Only true when editing,
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
      const response = await fetch("/api/patients/edit", {
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
    "date_join",
    "date_exit",
    "first_name",
    "last_name",
    "codice_fiscale",
    "gender",

    "date_of_birth",
    "place_of_birth",
    "age",
    "age_class",

    "neuro_diag",
    "home_address",
    "medical_notes",
  ];

  const renderField = (field, role) => {
    if ((field === "gender") & ((role === "imt") | (role === "dottore"))) {
      return (
        <label htmlFor={field} className="block px-5">
          <span className="text-gray-700">
            Sesso:
            <input
              type="text"
              id={field}
              value={patient[field]}
              disabled
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </span>
        </label>
      );
    } else if ((field === "date_of_birth") & (role === "dottore")) {
      return (
        <label htmlFor={field} className="block px-5">
          <span className="text-gray-700">
            Data di nascita:
            <input
              type="text"
              id={field}
              value={patient[field]}
              disabled
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </span>
        </label>
      );
    } else if ((field === "place_of_birth") & (role === "dottore")) {
      return (
        <label htmlFor={field} className="block px-5">
          <span className="text-gray-700">
            Nato a:
            <input
              type="text"
              id={field}
              value={patient[field]}
              disabled
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </span>
        </label>
      );
    } else if ((field === "age") & (role === "dottore")) {
      return (
        <label htmlFor={field} className="block px-5">
          <span className="text-gray-700">
            Età:
            <input
              type="text"
              id={field}
              value={patient[field]}
              disabled
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </span>
        </label>
      );
    } else if ((field === "neuro_diag") & (role === "dottore")) {
      return (
        <span className="text-gray-700 flex w-full items-center">
          <label htmlFor={field} className="flex-1">
            Neuro:
          </label>
          <div className="flex flex-grow items-center">
            <select
              id={field}
              value={patient[field]}
              onChange={(e) => handleChange(e, field)}
              disabled={!isEditing[field]}
              className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value={patient[field]}>{patient[field]}</option>
              <option value="neurodegen">neurodegen</option>
              <option value="no neurodegen">no neurodegen</option>
            </select>
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
        </span>
      );
    } else if ((field === "medical_notes") & (role === "dottore")) {
      return (
        <label htmlFor={field} className="block mt-3">
          <span className="text-gray-700">Medical notes:</span>
          <div className="flex items-center mt-1">
            <textarea
              id={field}
              value={patient[field]}
              onChange={(e) => handleChange(e, field)}
              readOnly={!isEditing[field]}
              className="flex-grow px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
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
    } else if (field === "first_name" || field === "last_name") {
      return (
        <span className="text-gray-700 flex w-full items-center">
          <label htmlFor={field} className="flex-1">
            {field === "first_name" ? "Nome:" : "Cognome:"}
          </label>
          <div className="flex flex-grow items-center">
            <input
              type="text"
              id={field}
              value={patient[field]}
              onChange={(e) => handleChange(e, field)}
              readOnly={!isEditing[field]}
              className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
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
        </span>
        // <span className="text-gray-700 flex w-full">
        //   <label htmlFor={field}>
        //     {field === "first_name" ? "Nome:" : "Cognome:"}
        //     <input
        //       type="text"
        //       id={field}
        //       value={patient[field]}
        //       onChange={(e) => handleChange(e, field)}
        //       readOnly={!isEditing[field]}
        //       className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        //     />
        //   </label>
        //   <button
        //     className={`text-white ${isEditing[field] ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700"} focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-1.5 text-center`}
        //     onClick={() =>
        //       isEditing[field]
        //         ? handleSend(patient.patient_id, field, patient[field])
        //         : handleEdit(field)
        //     }
        //   >
        //     {isEditing[field] ? "Send" : "Edit"}
        //   </button>{" "}
        // </span>
      );
    } else if (field == "home_address") {
      return (
        <label htmlFor={field} className="block">
          <span className="text-gray-700">Address:</span>
          <div className="flex items-center mt-1">
            <input
              type="text"
              id={field}
              value={patient[field]}
              className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              onChange={(e) => handleChange(e, field)}
              readOnly={!isEditing[field]}
            />
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
        // <label htmlFor={field} className="block">
        //   <span className="text-gray-700">
        //     Address:
        //     <input
        //       type="text"
        //       id={field}
        //       value={patient[field]}
        //       className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        //       onChange={(e) => handleChange(e, field)}
        //       readOnly={!isEditing[field]}
        //     />
        //     <button
        //       className={`text-white ${isEditing[field] ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700"} focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-1.5 text-center`}
        //       onClick={() =>
        //         isEditing[field]
        //           ? handleSend(patient.patient_id, field, patient[field])
        //           : handleEdit(field)
        //       }
        //     >
        //       {isEditing[field] ? "Send" : "Edit"}
        //     </button>
        //   </span>
        // </label>
      );
    } else if ((field == "codice_fiscale") & (role === "dottore")) {
      return (
        <span className="text-gray-700 flex w-full items-center">
          <label htmlFor={field} className="flex-1">
            Codice fiscale:
          </label>
          <div className="flex flex-grow items-center">
            <input
              type="text"
              id={field}
              value={patient[field]}
              onChange={(e) => handleChange(e, field)}
              readOnly={!isEditing[field]}
              className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
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
        </span>
      );
    } else if ((field == "date_join") & (role === "dottore")) {
      return (
        <span className="text-gray-700 flex w-full items-center">
          <label htmlFor={field} className="flex-1">
            Data di Ingresso:
          </label>
          <div className="flex flex-grow items-center">
            <input
              type="date"
              id={field}
              value={patient[field] ? patient[field].slice(0, 10) : ""}
              onChange={(e) => handleChange(e, field)}
              disabled={!isEditing[field]}
              className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
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
        </span>
      );
    } else if ((field === "date_exit") & (role === "dottore")) {
      return (
        <span className="text-gray-700 flex w-full items-center">
          <label htmlFor={field} className="flex-1">
            Data di Fine:
          </label>
          <div className="flex flex-grow items-center">
            <input
              type="date"
              id={field}
              value={patient[field] ? patient[field].slice(0, 10) : ""}
              onChange={(e) => handleChange(e, field)}
              disabled={!isEditing[field]}
              className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
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
        </span>
      );
    } else {
      return "";
    }
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

  return (
    <main>
      {JSON.stringify(initialData)}
      <Toaster />
      <div className="max-w-3xl mx-auto px-4 bg-white shadow rounded-lg p-6">
        <h1 className="text-lg font-bold leading-tight mb-4">Paziente</h1>
        <div className="space-y-6 text-black">
          <div className="grid grid-cols-1 gap-1">
            {fields.map((field) => renderField(field, role))}
            <div className="bg-white p-6 mt-6 shadow-lg rounded">
              <h3 className="text-lg font-semibold text-black leading-tight  mb-4">
                Contacts
              </h3>
              <div className="space-y-4 ">
                {console.log(contacts)}
                {contacts.map((contact, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center mb-2 bg-white p-2"
                  >
                    <span className="text-gray-800">
                      {contact.alias} - {contact.phone_no} - {contact.email}
                    </span>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        removeContactAtIndex(index);
                      }}
                      className="py-1 px-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Remove
                    </a>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowAddContactForm(true)}
                className="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-0.5 px-4 rounded"
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
        </div>
      </div>
    </main>
  );
};

export default PatientDetail;
