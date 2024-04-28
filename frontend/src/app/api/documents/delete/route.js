import { NextResponse } from "next/server";
import { getAccessToken } from "@/utils/sessionTokenAccessor";
import { getServerSession } from "next-auth/next";
import authOptions from "../../auth/[...nextauth]/options";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  console.log("reached internal post");
  if (session) {
    const postBody = await req.json();
    const url = `${process.env.BACKEND_HOST}/api/v1/documents/${postBody.document_id}`;
    let accessToken = await getAccessToken();

    console.log(postBody);
    const resp = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
      method: "DELETE",
      body: JSON.stringify(postBody.contact),
    });

    if (resp.ok) {
      const data = await resp.json();
      console.log(data);
      return NextResponse.json({ data }, { status: resp.status });
    }

    return NextResponse.json(
      { error: await resp.text() },
      { status: resp.status }
    );
  }
  return NextResponse.json({ error: "Unauthorized" }, { status: res.status });
}
