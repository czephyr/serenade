"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";

function DocumentManager({ initialDocuments, installation_id }) {
  const [documents, setDocuments] = useState(initialDocuments);
  const fileInputRef = useRef(null);
  const router = useRouter();

  const triggerFileInput = () => {
    // Trigger the hidden file input onClick of the custom button
    fileInputRef.current.click();
  };

  async function deleteDocument(documentId) {
    if (window.confirm("Are you sure you want to delete this document?")) {
      const postBody = {
        document_id: documentId,
      };

      try {
        const response = await fetch("/api/documents/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(postBody),
        });
        const result = await response.json();
        if (response.ok) {
          setDocuments((currentDocuments) =>
            currentDocuments.filter((doc) => doc.document_id !== documentId)
          );
        } else {
          console.error("API call failed: ", result.error);
        }
      } catch (error) {
        console.error("Failed to submit patient data: ", error);
      }
    }
  }

  const downloadDocument = (documentId) => {
    // /api/v1/documents/{document_id}
    const downloadUrl = `/api/documents/download?documentId=${documentId}`;
    window.location.href = downloadUrl;
    console.log(`Downloading document with ID ${documentId}`);
    console.log(downloadUrl);
    // In a real scenario, this would be a file download operation
    // alert(`Download document with ID: ${documentId}`);
  };

  async function uploadDocument(event) {
    const file = event.target.files[0];
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("file_type", file.type);
    formData.append("file_name", file.name);
    formData.append("installation_id", installation_id);

    try {
      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (response.ok) {
        setDocuments([...documents, result.data]);
      } else {
        console.error("API call failed: ", result.error);
      }
    } catch (error) {
      console.error("Failed to submit patient data: ", error);
    }
  }

  return (
    <div className="p-5">
      <h1 className="text-lg font-bold leading-tight mb-4">Document Manager</h1>
      <div className="flex flex-col">
        {Object.values(documents).map((doc) => (
          <div
            key={doc.document_id}
            className="flex justify-between items-center px-5 py-3 border-b border-gray-200"
          >
            {console.log(doc.file_name)}{" "}
            {/* Check if file_name is outputting correctly here */}
            {console.log(JSON.stringify(documents))}
            <p>{doc.file_name}</p>
            <div className="flex space-x-2">
              <button
                onClick={() => downloadDocument(doc.document_id)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
              </button>
              <button
                onClick={() => deleteDocument(doc.document_id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 px-5">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={uploadDocument}
        />
        <button
          onClick={triggerFileInput}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
export default DocumentManager;
