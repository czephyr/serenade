"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import CodiceFiscale from "codice-fiscale-js";

import React, { useRef, useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

import BackButton from "@/components/backButton";

export default function NewPatientForm() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [contacts, setContacts] = useState([]);
  const [isCfValid, setIsCfValid] = useState(false);
  const [cfInputError, setCfInputError] = useState("");
  const aliasRef = useRef(null);
  const phoneNoRef = useRef(null);
  const emailRef = useRef(null);
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const cfRef = useRef();
  const addressRef = useRef();
  const medicalNotesRef = useRef();
  const neuroRef = useRef();
  const formRef = useRef();
  const joinDateRef = useRef();

  const apartmentTypeRef = useRef();
  const internetTypeRef = useRef();
  const flatmatesRef = useRef();
  const petsRef = useRef();
  const smartphoneModelRef = useRef();

  useEffect(() => {
    if (
      status === "unauthenticated" ||
      (status === "authenticated" && !session.roles?.includes("dottore"))
    ) {
      router.push("/unauthorized");
      router.refresh();
    }
  }, [session, status, router]);

  const handleCfChange = () => {
    const cfInput = cfRef.current.value;
    try {
      const cf = new CodiceFiscale(cfInput); // Attempt to create a CodiceFiscale instance
      const firstName = firstNameRef.current.value.toLowerCase();
      const lastName = lastNameRef.current.value.toLowerCase();
      const isNameValid = [...cf.name.toLowerCase()].every((char) =>
        firstName.includes(char)
      );
      const isSurnameValid = [...cf.surname.toLowerCase()].every((char) =>
        lastName.includes(char)
      );
      if (isNameValid && isSurnameValid) {
        setIsCfValid(true);
        setCfInputError(""); // Clear any previous error message
      } else {
        setIsCfValid(false);
        setCfInputError("Nome o cognome non corrisponde al Codice Fiscale");
      }
    } catch (error) {
      setIsCfValid(false);
      setCfInputError("Codice Fiscale non valido");
    }
  };

  const handleNameChange = () => {
    handleCfChange();
    console.log("0000");
  };

  const addContact = () => {
    const newContact = {
      alias: aliasRef.current.value,
      phone_no: phoneNoRef.current.value,
      email: emailRef.current.value,
    };
    setContacts([...contacts, newContact]);
    // Clear input fields
    aliasRef.current.value = "";
    phoneNoRef.current.value = "";
    emailRef.current.value = "";
  };

  const removeContactAtIndex = (index) => {
    setContacts(contacts.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let result;
    const patientData = {
      first_name: firstNameRef.current.value,
      last_name: lastNameRef.current.value,
      codice_fiscale: cfRef.current.value,
      neuro_diag: neuroRef.current.value,
      home_address: addressRef.current.value,
      medical_notes: medicalNotesRef.current.value,
      contacts: contacts,
      date_join: joinDateRef.current.value,
    };

    console.log(JSON.stringify(patientData));
    try {
      const response = await fetch("/api/patients/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patientData),
      });
      result = await response.json();
      if (response.ok) {
        console.log("tutto ok");
        // formRef.current.reset();
        // setContacts([]);
        // router.refresh(); // Refresh the page to show new data
        // toast.success("Successfully created!", {
        //   position: "bottom-left",
        // });
      } else if (response.status == 409) {
        setCfInputError("Il codice fiscale è già presente nel database");
        return;
      } else {
        console.error("API call failed: ", result.error);
        return;
      }
    } catch (error) {
      console.error("Failedeeeeeeeeeeee to submit patient data: ", error);
      return;
    }

    const installationData = {
      apartment_type: apartmentTypeRef.current.value,
      internet_type: internetTypeRef.current.value,
      flatmates: flatmatesRef.current.value,
      pets: petsRef.current.value,
      smartphone_model: smartphoneModelRef.current.value,
      appliances: "",
      issues_notes: "",
      habits_notes: "",
      other_notes: "",
    };
    try {
      console.log("seconda post a " + result.data.patient_id);
      const response = await fetch(
        `/api/installations/create?installation_id=${result.data.patient_id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(installationData),
        }
      );
      const second_result = await response.json();
      if (response.ok) {
        console.log("seconda post ok");
        formRef.current.reset();
        setContacts([]);
        router.refresh(); // Refresh the page to show new data
        toast.success("Paziente creato con successo!", {
          position: "bottom-left",
        });
        router.push("/");
      } else {
        console.error("API call failed: ", second_result.error);
      }
    } catch (error) {
      console.error("Failed to submit patient data: ", error);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  const currentDate = new Date();
  // set the ending date with a default value of today + 12months
  const futureDate = new Date(
    currentDate.getTime() + 365 * 24 * 60 * 60 * 1000
  );

  return (
    <main className="bg-gray-100 min-h-screen pt-10 pb-6 px-2 md:px-0">
      <Toaster />
      <div className="max-w-5xl mx-auto px-4 bg-white shadow rounded-lg p-6">
        <BackButton />
        <h1 className="text-2xl font-bold text-center mb-2">
          Creazione paziente
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6" ref={formRef}>
          <div className="grid grid-cols-1 gap-1">
            <div className="grid grid-cols-2 gap-3 mb-1">
              <label htmlFor="joinDate" className="block">
                <span className="text-gray-700">Data arruolamento:</span>
                <input
                  type="date"
                  id="joinDate"
                  ref={joinDateRef}
                  defaultValue={currentDate.toISOString().substring(0, 10)}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </label>
            </div>
            <label htmlFor="firstName" className="block">
              <span className="text-gray-700">Nome*:</span>

              <input
                type="text"
                id="firstName"
                ref={firstNameRef}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
                onChange={handleNameChange}
              />
            </label>
            <label htmlFor="lastName" className="block">
              <span className="text-gray-700">Cognome*:</span>

              <input
                type="text"
                id="lastName"
                ref={lastNameRef}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
                onChange={handleNameChange}
              />
            </label>
            <label htmlFor="neuro" className="block">
              <span className="text-gray-700">Categoria*:</span>
              <select
                id="neuro"
                ref={neuroRef}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              >
                <option value="">----</option>
                <option value="neurodegen">neurodegen</option>
                <option value="no neurodegen">no neurodegen</option>
              </select>
            </label>
            <label htmlFor="cf" className="block">
              <span className="text-gray-700">Codice Fiscale*:</span>

              <input
                type="text"
                id="cf"
                ref={cfRef}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
                onChange={handleCfChange}
              />
              {cfInputError && (
                <p className="text-red-500 text-sm mt-2">{cfInputError}</p>
              )}
            </label>
            <label htmlFor="address" className="block">
              <span className="text-gray-700">Indirizzo*:</span>

              <input
                type="text"
                id="address"
                ref={addressRef}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </label>
            <label htmlFor="medicalNotes" className="block">
              <span className="text-gray-700">Note Mediche:</span>
              <textarea
                id="medicalNotes"
                ref={medicalNotesRef}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </label>

            <label htmlFor="apartmentType" className="block">
              <span className="text-gray-700">Tipo appartamento:</span>
              <input
                type="text"
                id="apartmentType"
                ref={apartmentTypeRef}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </label>
            <label htmlFor="internetType" className="block">
              <span className="text-gray-700">Tipo connessione internet:</span>
              <textarea
                id="internetType"
                ref={internetTypeRef}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </label>
            <label htmlFor="flatmates" className="block">
              <span className="text-gray-700">Informazioni abitazione:</span>
              <textarea
                id="flatmates"
                ref={flatmatesRef}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </label>
            <label htmlFor="pets" className="block">
              <span className="text-gray-700">Animali domestici:</span>
              <textarea
                id="pets"
                ref={petsRef}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </label>
            <label htmlFor="smartphoneModel" className="block">
              <span className="text-gray-700">Modello smartphone:</span>
              <textarea
                id="smartphoneModel"
                ref={smartphoneModelRef}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </label>

            <div className="mt-4">
              <h3 className="text-lg font-bold">Contatti</h3>
              {contacts.length == 0 && (
                <p className="text-red-500 text-sm px-3 py-1">
                  È necessario inserire almeno un contatto
                </p>
              )}
              {contacts.map((contact, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center mb-2 bg-white p-2 shadow rounded"
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
              <div className="bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4 space-y-1">
                <label htmlFor="alias" className="block">
                  <span className="text-gray-700">Nome:</span>
                  <input
                    type="text"
                    name="alias"
                    ref={aliasRef}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </label>

                <label htmlFor="phone_no" className="block">
                  <span className="text-gray-700">Numero di telefono:</span>
                  <input
                    type="text"
                    name="phone_no"
                    ref={phoneNoRef}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </label>

                <label htmlFor="email" className="block">
                  <span className="text-gray-700">Email:</span>
                  <input
                    type="email"
                    name="email"
                    ref={emailRef}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </label>

                <span>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      addContact({
                        alias: aliasRef.current.value,
                        phone_no: phoneNoRef.current.value,
                        email: emailRef.current.value,
                      });
                      // Clear the input fields after adding the contact
                      aliasRef.current.value = "";
                      phoneNoRef.current.value = "";
                      emailRef.current.value = "";
                    }}
                    className="mt-3 w-32 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white no-underline bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Aggiungi
                  </a>
                </span>
              </div>
            </div>
            <div className="mt-6">
              <button
                type="submit"
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isCfValid && contacts.length > 0 ? "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500" : "bg-gray-500 cursor-not-allowed"}`}
                disabled={!isCfValid && contacts.length == 0}
              >
                Crea paziente
              </button>
              {cfInputError && (
                <p className="text-red-500 text-sm mt-2">{cfInputError}</p>
              )}
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
