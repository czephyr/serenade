"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useRef, useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function NewPatientForm() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [contacts, setContacts] = useState([]);
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
  const endingDateRef = useRef();

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
    // Conditionally add 'ending_date' if it is not empty
    if (endingDateRef.current && endingDateRef.current.value !== "") {
      patientData.date_exit = endingDateRef.current.value;
    }

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
      } else {
        console.error("API call failed: ", result.error);
      }
    } catch (error) {
      console.error("Failed to submit patient data: ", error);
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
        toast.success("Successfully created!", {
          position: "bottom-left",
        });
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

  return (
    <main className="bg-gray-100 min-h-screen pt-10 pb-6 px-2 md:px-0">
      <Toaster />
      <div className="max-w-3xl mx-auto px-4 bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-2">Create Patient</h1>
        <form onSubmit={handleSubmit} className="space-y-6" ref={formRef}>
          <div className="grid grid-cols-1 gap-1">
            <div className="grid grid-cols-2 gap-3 mb-1">
              <label htmlFor="joinDate" className="block">
                <span className="text-gray-700">Join Date:</span>
                <input
                  type="date"
                  id="joinDate"
                  ref={joinDateRef}
                  defaultValue={new Date().toISOString().substring(0, 10)}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </label>
              <label htmlFor="endingDate" className="block">
                <span className="text-gray-700">Ending Date:</span>
                <input
                  type="date"
                  id="endingDate"
                  ref={endingDateRef}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </label>
            </div>
            <label htmlFor="firstName" className="block">
              <span className="text-gray-700">First Name:</span>

              <input
                type="text"
                id="firstName"
                ref={firstNameRef}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </label>
            <label htmlFor="lastName" className="block">
              <span className="text-gray-700">Last Name:</span>

              <input
                type="text"
                id="lastName"
                ref={lastNameRef}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </label>
            {/* <label htmlFor="age" className="block">
              <span className="text-gray-700">Age:</span>
              <select
                id="age"
                ref={ageRef}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              >
                <option value="">Select Age</option>
                <option value="65-74">65-74</option>
                <option value="75-84">75-84</option>
                <option value="85+">85+</option>
              </select>
            </label> */}

            <label htmlFor="neuro" className="block">
              <span className="text-gray-700">Neuro:</span>
              <select
                id="neuro"
                ref={neuroRef}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              >
                <option value="">Select Neuro</option>
                <option value="neurodegen">neurodegen</option>
                <option value="no neurodegen">no neurodegen</option>
              </select>
            </label>
            <label htmlFor="cf" className="block">
              <span className="text-gray-700">Codice Fiscale:</span>

              <input
                type="text"
                id="cf"
                ref={cfRef}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </label>
            <label htmlFor="address" className="block">
              <span className="text-gray-700">Address:</span>

              <input
                type="text"
                id="address"
                ref={addressRef}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </label>
            <label htmlFor="medicalNotes" className="block">
              <span className="text-gray-700">Medical Notes:</span>
              <textarea
                id="medicalNotes"
                ref={medicalNotesRef}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </label>

            <label htmlFor="apartmentType" className="block">
              <span className="text-gray-700">Apartment Type:</span>
              <input
                type="text"
                id="apartmentType"
                ref={apartmentTypeRef}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </label>
            <label htmlFor="internetType" className="block">
              <span className="text-gray-700">Internet Type:</span>
              <textarea
                id="internetType"
                ref={internetTypeRef}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </label>
            <label htmlFor="flatmates" className="block">
              <span className="text-gray-700">Flatmates:</span>
              <textarea
                id="flatmates"
                ref={flatmatesRef}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </label>
            <label htmlFor="pets" className="block">
              <span className="text-gray-700">Pets:</span>
              <textarea
                id="pets"
                ref={petsRef}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </label>
            <label htmlFor="smartphoneModel" className="block">
              <span className="text-gray-700">Smartphone Model:</span>
              <textarea
                id="smartphoneModel"
                ref={smartphoneModelRef}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </label>

            <div className="mt-4">
              <h3 className="text-lg font-bold">Contacts</h3>
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
                  <span className="text-gray-700">Alias:</span>
                  <input
                    type="text"
                    name="alias"
                    placeholder="Alias"
                    ref={aliasRef}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </label>

                <label htmlFor="phone_no" className="block">
                  <span className="text-gray-700">Phone number:</span>
                  <input
                    type="text"
                    name="phone_no"
                    placeholder="Phone Number"
                    ref={phoneNoRef}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </label>

                <label htmlFor="email" className="block">
                  <span className="text-gray-700">Email:</span>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
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
                    Add Contact
                  </a>
                </span>
              </div>
            </div>
            <div className="mt-6">
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create Patient
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
