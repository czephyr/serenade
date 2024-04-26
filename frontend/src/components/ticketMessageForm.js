"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

function TicketMessages({ ticketMessages, ticketNum, isOpen, installNum }) {
  const [messages, setMessages] = useState(ticketMessages);
  const { data: session, status } = useSession();
  const router = useRouter();
  async function sendMsg(newMessage, ticket_num) {
    // Trim the message and check if it is empty, prevent submission if it is
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

  async function closeTicket(ticket_num) {
    if (session && session.roles?.includes("iit")) {
      const postBody = {
        ticket_num: ticket_num,
      };
      console.log("in closeTicket, num is:" + ticket_num);
      let resp;
      try {
        resp = await fetch("/api/tickets/close", {
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
      <div className="bg-white  shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h3 className="text-lg font-bold leading-tight mb-4">
          Ticket Messages
        </h3>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>
              <strong>{new Date(msg.ts).toLocaleString()}</strong> {msg.sender}:{" "}
              {msg.body}
            </li>
          ))}
        </ul>

        {isOpen && (
          <>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMsg(e.target.elements.new_message.value, ticketNum);
                e.target.reset();
              }}
            >
              <input
                type="text"
                name="new_message"
                placeholder="Type your message here"
                required
              />
              <button type="submit">Send Message</button>
            </form>
          </>
        )}
      </div>
      {isOpen && (
        <>
          <button
            className="text-white"
            onClick={() => closeTicket(installNum)}
          >
            Close Ticket
          </button>
        </>
      )}
    </div>
  );
}

export default TicketMessages;
