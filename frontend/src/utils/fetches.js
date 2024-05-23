import { getAccessToken } from "@/utils/sessionTokenAccessor";

export async function fetchFromBackend(fetched, endpoint) {
  const url = `${process.env.BACKEND_HOST}/api/v1/${endpoint}`;
  console.log(`fetch to ${url}`);

  let accessToken = await getAccessToken();

  const resp = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
  });

  if (resp.ok) {
    const data = await resp.json();
    return data;
  }

  throw new Error(`Failed to fetch ${fetched}. Status: ${resp.status}`);
}
