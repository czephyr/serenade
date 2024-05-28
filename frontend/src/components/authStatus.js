"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect } from "react";

async function keycloakSessionLogOut() {
  try {
    await fetch(`/api/auth/logout`, { method: "GET" });
  } catch (err) {
    console.error(err);
  }
}

export default function AuthStatus() {
  const { data: session, status } = useSession();
  useEffect(() => {
    if (
      status != "loading" &&
      session &&
      session?.error === "RefreshAccessTokenError"
    ) {
      signOut({ callbackUrl: "/" });
    }
  }, [session, status]);

  if (status == "loading") {
    return <div className="my-3">Loading...</div>;
  } else if (session) {
    return (
      <div className="my-3">
        <span className="text-black-100">
          Benvenuto <b>{session?.user.name}</b>
        </span>
        <button
          className="bg-blue-900 font-bold text-white py-1 px-2 ml-3 rounded border border-gray-50"
          onClick={() => {
            keycloakSessionLogOut().then(() => signOut({ callbackUrl: "/" }));
          }}
        >
          Log out
        </button>
      </div>
    );
  }

  return (
    <button
      className="w-80 bg-blue-500 hover:bg-blue-700 text-white font-bold my-5 py-2 px-1 rounded focus:outline-none focus:shadow-outline"
      onClick={() => signIn("keycloak", { callbackUrl: "/redirect" })}
    >
      Autenticati
    </button>
  );
}
