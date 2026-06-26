"use client";

import { useState } from "react";

export function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setMessage("You're subscribed! Keep an eye on your inbox.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage("Try again. Something went wrong.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Try again. Network error.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input 
          type="email" 
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com" 
          disabled={status === "loading" || status === "success"}
          className="flex-1 bg-background/50 border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#d97706] disabled:opacity-50"
        />
        <button 
          type="submit" 
          disabled={status === "loading" || status === "success"}
          className="bg-[#d97706] text-black font-medium px-4 py-2 rounded-md text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {status === "loading" ? "..." : status === "success" ? "Done" : "Subscribe"}
        </button>
      </div>
      {message && (
        <p className={`text-xs ${status === "success" ? "text-green-500" : "text-red-400"}`}>
          {message}
        </p>
      )}
    </form>
  );
}
