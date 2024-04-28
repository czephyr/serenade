"use client";

import React, { useState, useRef, useEffect } from "react";

async function closeTicket(ticket_id) {
  const accessToken = await getAccessToken();
  const url = `${process.env.BACKEND_HOST}/api/v1/tickets/${ticket_id}/close`;

  const resp = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      method: "POST",
    },
  });
  if (!resp.ok) {
    throw new Error("Failed to fetch ticket messages.");
  }
  return resp.json();
}

function CloseButton(ticket_num) {
  return <button onClick={() => closeTicket(ticket_num)}>Close Ticket</button>;
}

function handleDelete(documentId) {
  fetch(`${process.env.DB_HOST}/api/v1/documents/${documentId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        alert("Document deleted successfully");
        // Optionally refresh the list or remove the document from the display
      } else {
        alert("Failed to delete the document");
      }
    })
    .catch((error) => {
      console.error("Error deleting the document:", error);
      alert("Error deleting the document");
    });
}

const handleUpload = async (event) => {
  event.preventDefault(); // Prevent the normal form submission

  const formData = new FormData();
  formData.append("file", fileInputRef.current.files[0]);

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DB_HOST}/api/v1/installation/${patientId}/documents`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (response.ok) {
      alert("File uploaded successfully");
    } else {
      alert("Failed to upload file");
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    alert("Error uploading file");
  }
};

function DocForm({ documents }) {
  const fileInputRef = useRef(null);
  return (
    <div>
      <div className="text-white">
        {/* {JSON.stringify(patient_id)} */}
        <form onSubmit={handleUpload} enctype="multipart/form-data">
          <input
            type="file"
            accept="application/pdf"
            name="file"
            ref={fileInputRef}
          />
          <button type="submit">Upload PDF</button>
        </form>
      </div>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h3 className="text-lg font-bold leading-tight mb-4">Documents</h3>
        {Object.values(documents).map((document, index) => (
          <div key={index} className="mb-4">
            <h4>Document ID: {document.document_id}</h4>
            <p>Timestamp: {new Date(document.ts).toLocaleString()}</p>
            <p>File Name: {document.file_name}</p>
            <p>File Type: {document.file_type}</p>
            <form
              action={`${process.env.DB_HOST}/api/v1/documents/${document.document_id}`}
              method="get"
            >
              <button type="submit">Download PDF</button>
            </form>
            <button
              onClick={() => handleDelete(document.document_id)}
              style={{
                backgroundColor: "red",
                color: "white",
                padding: "8px 16px",
                margin: "5px",
              }}
            >
              Delete Document
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SendMsgForm(ticket_num) {
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submit behavior (page reload)

    const formData = new FormData(event.target); // Get form data
    const newMessage = formData.get("new_message"); // Extract the new_message input

    // Using fetch to send a POST request to the server
    try {
      const response = await fetch(
        `${process.env.DB_HOST}/api/v1/tickets/${ticket_num}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ new_message: newMessage }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Message sent:", result); // Log or handle the response from the server
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" name="new_message" defaultValue="testtesttest" />
        <button type="submit">Send MSG</button>
      </form>
    </div>
  );
}

export { CloseButton, DocForm, SendMsgForm };
