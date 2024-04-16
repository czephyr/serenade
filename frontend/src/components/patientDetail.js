"use client";

import React, { useState, useRef } from "react";

const PatientDetail = ({ patient }) => {
  const [patientState, setpatientState] = useState({
    firstName: "John",
    lastName: "Doe",
    codiceFiscale: "XYZ1234567890",
    gender: "Male",
    dateOfBirth: "1990-01-01",
    placeOfBirth: "Naples",
    neuroDiag: "None",
    ageClass: "Adult",
    homeAddress: "1234 Main St",
    medicalNotes: "No notes",
  });

  const [editableField, setEditableField] = useState(null);

  const handleEdit = (field) => {
    setEditableField(field);
  };

  const handleSave = (field, value) => {
    setpatientState((prev) => ({ ...prev, [field]: value }));
    setEditableField(null);
    saveFieldToBackend(field, value);
  };

  const handleChange = (field, event) => {
    setpatientState((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const saveFieldToBackend = (fieldId, value) => {
    console.log("Saving", fieldId, "with value", value);
    // Here you would typically use fetch or axios to send data to your backend
  };

  const aliasRef = useRef(null);
  const phoneNoRef = useRef(null);
  const emailRef = useRef(null);

  const [contacts, setContacts] = useState(patient.contacts);
  // console.log(contacts);
  // console.log("we");
  // console.log(patient.contacts);
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

  const norefresh = (event) => {
    event.preventDefault();
    const alias = aliasRef.current.value;
    const phone_no = phoneNoRef.current.value;
    const email = emailRef.current.value;

    addContact({ alias, phone_no, email });
  };

  function editField(fieldId) {
    var input = document.getElementById(fieldId);
    input.disabled = false;
    input.focus();

    input.onblur = function () {
      input.disabled = true;
      saveField(fieldId, input.value);
    };
  }

  function saveField(fieldId, value) {
    // Example function that would call your API
    console.log("Saving", fieldId, "with value", value);
    // Here you would typically use fetch() or another method to send data to your backend
  }

  return (
    <div id="component">
      <div id="patient-info">
        Patient infos
        {Object.entries(patientState).map(([key, value]) => (
          <div key={key} className="edit-field">
            <label>{key.replace(/([A-Z])/g, " $1").trim()}:</label>
            {editableField === key ? (
              <input
                type={key === "dateOfBirth" ? "date" : "text"}
                value={value}
                onChange={(e) => handleChange(key, e)}
                onBlur={() => handleSave(key, value)}
              />
            ) : (
              <span onDoubleClick={() => handleEdit(key)}>{value}</span>
            )}
            <button onClick={() => handleEdit(key)}>Edit</button>
          </div>
        ))}
      </div>
      <br></br>
      <div>
        Contacts
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
        <a onClick={() => setShowAddContactForm(true)}>Add New Contact</a>
      </div>
      {showAddContactForm && (
        <form onSubmit={norefresh}>
          <input type="text" name="alias" placeholder="Alias" ref={aliasRef} />
          <input
            type="text"
            name="phone_no"
            placeholder="Phone Number"
            ref={phoneNoRef}
          />
          <input type="email" name="email" placeholder="Email" ref={emailRef} />
          <button type="submit">Add Contact</button>
        </form>
      )}
    </div>
  );
};

export default PatientDetail;
