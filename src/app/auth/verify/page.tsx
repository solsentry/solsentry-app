"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://api.solsentry.app";

function VerifyInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [message, setMessage] = useState("Verifying your link…");

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      setStatus("error");
      setMessage("Missing token in URL.");
      return;
    }

    fetch(`${API_BASE}/v1/auth/magic-link/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ token }),
    })
      .then(async (r) => {
        if (r.ok) {
          setStatus("ok");
          router.replace("/app");
        } else {
          setStatus("error");
          setMessage("Link expired or invalid.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Couldn't reach the sign-in server. Try again.");
      });
  }, [params, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0e13] text-[#e6e9ef] p-6">
      <div className="max-w-md w-full bg-[#11151c] border border-[#1f2630] rounded-lg p-8 text-center">
        <h1 className="text-xl font-semibold mb-3">Sign in to SolSentry</h1>
        <p className="text-[#9aa4b2] mb-6">{message}</p>
        {status === "error" && (
          <button
            onClick={() => router.push("/login")}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded font-medium"
          >
            Request new link
          </button>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#0b0e13] text-[#9aa4b2]">
          Loading…
        </div>
      }
    >
      <VerifyInner />
    </Suspense>
  );
}
