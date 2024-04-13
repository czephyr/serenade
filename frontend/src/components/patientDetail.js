"use client";

import React, { useState, useRef } from "react";

const PatientDetail = ({ patient }) => {
  const aliasRef = useRef(null);
  const phoneNoRef = useRef(null);
  const emailRef = useRef(null);

  const [contacts, setContacts] = useState(patient.contacts);
  console.log(contacts);
  console.log("we");
  console.log(patient.contacts);
  const [showAddContactForm, setShowAddContactForm] = useState(false);
  const removeContactAtIndex = (indexToRemove) => {
    const updatedContacts = contacts.filter(
      (_, index) => index !== indexToRemove
    );
    setContacts(updatedContacts);
  };

  const addContact = (contact) => {
    const updatedContacts = [...contacts, contact];
    console.log(updatedContacts);
    setContacts(updatedContacts);
    console.log(contacts);
    // If there is a handler to update the patient details in the parent state or context, call it.
    // if (onContactsChange) onContactsChange(updatedContacts);
    // Hide the form after adding the contact.
    setShowAddContactForm(false);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const alias = aliasRef.current.value;
    const phone_no = phoneNoRef.current.value;
    const email = emailRef.current.value;

    addContact({ alias, phone_no, email });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Submit the formData to the server
    // Example: POST request to your API endpoint
    console.log("Form data submitted:", formData);
    // Add your fetch logic here
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Patient Information */}
      <input type="text" name="nome" defaultValue={patient.first_name} />
      <input type="text" name="cognome" defaultValue={patient.last_name} />
      {/* ... other fields ... */}

      <div>
        {contacts.map((contact, index) => (
          <div key={index}>
            {contact.alias} - {contact.phone_no} - {contact.email}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                removeContactAtIndex(index);
              }}
            >
              X
            </a>
          </div>
        ))}
        {showAddContactForm && (
          <form onSubmit={handleFormSubmit}>
            <input
              type="text"
              name="alias"
              placeholder="Alias"
              ref={aliasRef}
            />
            <input
              type="text"
              name="phone_no"
              placeholder="Phone Number"
              ref={phoneNoRef}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              ref={emailRef}
            />
            <button type="submit">Add Contact</button>
          </form>
        )}
        <button onClick={() => setShowAddContactForm(true)}>
          Add New Contact
        </button>
      </div>
      {/* <input
        type="text"
        name="caregiver2"
        value={formData.caregiver2}
        onChange={handleChange}
        placeholder="Nome e Cognome Caregiver"
      /> */}

      {/* Submit Button */}
      <button type="submit">Salva</button>
    </form>
  );
};

export default PatientDetail;
