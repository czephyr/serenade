"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

const NewTicketForm = ({ installation_id }) => {
  const router = useRouter();

  const msgRef = useRef(null);
  const categoryRef = useRef(null);

  const [showAddTicket, setShowAddTicket] = useState(false);

  async function addTicket(msg, category, patient_id) {
    // const updatedContacts = [...contacts, contact];
    // console.log(updatedContacts);
    // console.log(contacts);

    const postBody = {
      patient_id: patient_id,
      message: {
        body: msg,
      },
      category: category,
    };
    console.log(postBody);
    try {
      const response = await fetch("/api/tickets/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postBody),
      });
      const result = await response.json();
      if (response.ok) {
        setShowAddTicket(false);
        toast.success("Ticket creato!", {
          position: "bottom-left",
        });
        router.refresh();
      } else {
        console.error("API call failed: ", result.error);
      }
    } catch (error) {
      console.error("Failed to submit patient data: ", error);
    }
  }

  return (
    <div className="mt-4">
      <Toaster />
      <a
        onClick={() => setShowAddTicket(true)}
        className="text-blue-500 hover:underline"
      >
        Create new ticket
      </a>
      <Toaster />
      {/* <div className="bg-white shadow rounded-lg p-6 mt-6">
        <button
          onClick={() => setShowAddTicket(true)}
          className="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add New Ticket
        </button>
      </div> */}
      {showAddTicket && (
        <div className="fixed inset-0 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium">Add New Ticket</h3>
              <div className="mt-2 px-7 py-3">
                <input
                  type="text-area"
                  name="msg"
                  placeholder="Message"
                  ref={msgRef}
                  className="mb-3 px-3 py-2 border border-gray-300 text-gray-900 rounded-md w-full"
                  required
                />
              </div>
              <div className="mt-2 px-7 py-3">
                <select
                  id="category"
                  ref={categoryRef}
                  className="mb-3 px-3 py-2 rounded-md w-full"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="disinstallazione">disinstallazione</option>
                  <option value="manutenzione">manutenzione</option>
                </select>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() =>
                    addTicket(
                      msgRef.current.value,
                      categoryRef.current.value,
                      installation_id
                    )
                  }
                  className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
                >
                  Send
                </button>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => setShowAddTicket(false)}
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

export default NewTicketForm;
