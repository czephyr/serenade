import { NextResponse } from "next/server";
import { getAccessToken } from "@/utils/sessionTokenAccessor";
import { getServerSession } from "next-auth/next";
import authOptions from "@/app/api/auth/[...nextauth]/options";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  console.log("reached internal post");
  if (session) {
    const postBody = await req.json();
    console.log(postBody);
    const url = `${process.env.BACKEND_HOST}/api/v1/patients/${postBody.patient_id}`;
    let accessToken = await getAccessToken();

    const resp = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
      method: "DELETE",
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
