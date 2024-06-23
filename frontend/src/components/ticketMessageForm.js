"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

function TicketMessages({
  ticketMessages,
  ticketNum,
  isOpen,
  installNum,
  role,
}) {
  const [messages, setMessages] = useState(ticketMessages);
  const { data: session, status } = useSession();
  const router = useRouter();
  async function sendMsg(newMessage, ticket_num) {
    const trimmedMessage = newMessage.trim();
    if (trimmedMessage === "") {
      console.log("Empty message submission attempt.");
      return;
    }

    if (
      session &&
      (session.roles?.includes("iit") || session.roles?.includes("imt"))
    ) {
      const postBody = {
        ticket_num: ticket_num,
        msg: newMessage,
      };

      let resp;
      try {
        resp = await fetch("/api/tickets/messages", {
          method: "POST",
          headers: {
            headers: {
              "Content-Type": "application/json",
            },
          },
          body: JSON.stringify(postBody),
        });
      } catch (err) {
        console.log(err);
      }

      const result = await resp.json();
      setMessages([...messages, result.data]);
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("it-IT", {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  async function closeTicket(ticket_num) {
    // Confirm dialog to ensure the user wants to close the ticket
    const confirmClose = confirm("Sei sicuro di voler chiudere questo ticket?");
    if (!confirmClose) {
      return; // If the user cancels, exit the function
    }

    if (session) {
      const postBody = {
        ticket_num: ticket_num,
      };
      console.log("in closeTicket, num is:" + ticket_num);
      let resp;
      try {
        resp = await fetch("/api/tickets/close", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postBody),
        });
      } catch (err) {
        console.log(err);
      }

      const result = await resp.json();
      if (resp.ok) {
        router.push(`/installations/${installNum}`);
        router.refresh();
      } else {
        console.log("Unable to call the API: " + result.error);
      }
    }
  }

  return (
    <div className="text-black">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h3 className="text-lg font-bold leading-tight mb-4">Messaggi</h3>
        <ul className="list-disc pl-5 mb-4">
          {messages.map((msg, index) => (
            <li key={index} className="mb-1">
              <strong>{formatDate(msg.ts)}</strong>{" "}
              <span className="text-indigo-600">{msg.sender}:</span> {msg.body}
            </li>
          ))}
        </ul>

        {isOpen && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMsg(e.target.elements.new_message.value, ticketNum);
              e.target.reset();
            }}
            className="flex items-end gap-2"
          >
            <textarea
              name="new_message"
              placeholder="Type your message here"
              required
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
              rows="3"
            ></textarea>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Send Message
            </button>
          </form>
        )}
      </div>
      {isOpen && role == "imt" && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => closeTicket(ticketNum)}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Close Ticket
          </button>
        </div>
      )}
    </div>
  );
}

export default TicketMessages;
