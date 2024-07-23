import { NextResponse } from "next/server";
import { getAccessToken } from "@/utils/sessionTokenAccessor";
import { getServerSession } from "next-auth/next";
import authOptions from "../../auth/[...nextauth]/options";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  console.log("reached internal post");
  if (session) {
    const formData = await req.formData();

    const url = `${process.env.BACKEND_HOST}/api/v1/installations/${formData.get("installation_id")}/documents?file_type=${encodeURIComponent(formData.get("file_type"))}&file_name=${encodeURIComponent(formData.get("file_name"))}`;
    let accessToken = await getAccessToken();

    const outgoingFormData = new FormData();
    outgoingFormData.append("file", formData.get("file"));

    const resp = await fetch(url, {
      headers: {
        Authorization: "Bearer " + accessToken,
        // Do not set 'Content-Type': 'multipart/form-data', let fetch do it
      },
      method: "POST",
      body: outgoingFormData,
    });
    if (resp.ok) {
      const data = await resp.json();
      return NextResponse.json({ data }, { status: resp.status });
    }

    return NextResponse.json(
      { error: await resp.text() },
      { status: resp.status }
    );
  }
  return NextResponse.json({ error: "Unauthorized" }, { status: res.status });
}
