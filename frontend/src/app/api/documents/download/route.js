import { NextResponse } from "next/server";
import { getAccessToken } from "@/utils/sessionTokenAccessor";
import { getServerSession } from "next-auth/next";
import authOptions from "../../auth/[...nextauth]/options";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  console.log("reached internal post");

  if (session) {
    const url = `${process.env.BACKEND_HOST}/api/v1/documents/${req.nextUrl.searchParams.get("documentId")}`;
    let accessToken = await getAccessToken();

    const resp = await fetch(url, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });
    if (resp.ok) {
      const res = new NextResponse(resp.body, {
        status: 200,
        headers: new Headers({
          "content-type": "application/pdf",
        }),
      });

      return res;
    }

    // return NextResponse.json(
    //   { error: await resp.text() },
    //   { status: resp.status }
    // );
  }
  return NextResponse.json({ error: "Unauthorized" }, { status: res.status });
}
