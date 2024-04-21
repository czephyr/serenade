import { NextResponse } from "next/server";
import { getAccessToken } from "@/utils/sessionTokenAccessor";
import { getServerSession } from "next-auth/next";
import authOptions from "../../auth/[...nextauth]/options";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  console.log("reached internal post");
  if (session) {
    const postBody = await req.json();
    const url = `${process.env.BACKEND_HOST}/api/v1/patients/${postBody.patient_id}`;
    let accessToken = await getAccessToken();
    console.log("PUT body: " + JSON.stringify(postBody));
    const resp = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
      method: "PUT",
      body: JSON.stringify({ [postBody.fieldId]: postBody.value }),
    });

    if (resp.ok) {
      const data = await resp.json();
      console.log("PUT answer:" + JSON.stringify(data));
      return NextResponse.json({ data }, { status: resp.status });
    }

    return NextResponse.json(
      { error: await resp.text() },
      { status: resp.status }
    );
  }
  return NextResponse.json({ error: "Unauthorized" }, { status: res.status });
}

// POST to endpoint which gets the patient_id and the key value to edit
