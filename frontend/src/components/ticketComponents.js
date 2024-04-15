"use client";

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

function DocForm(ticket_num) {
  return (
    <div>
      <form
        action={`${process.env.DB_HOST}/api/v1/tickets/${ticket_num}/documents`}
        method="post"
        enctype="multipart/form-data"
      >
        <input type="text" name="test" value="testtesttest" />
        <input
          type="file"
          accept="application/pdf"
          name="file"
          enctype="multipart/form-data"
        />
        <button type="submit">Upload PDF</button>
      </form>
      <form
        action={`${process.env.DB_HOST}/api/v1/tickets/${ticket_num}/documents`}
        method="get"
      >
        <button type="submit">Download PDF</button>
      </form>
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
