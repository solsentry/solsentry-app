const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.solsentry.app";

export class UnauthenticatedError extends Error {
  constructor() {
    super("Authentication required");
    this.name = "UnauthenticatedError";
  }
}

export async function fetchWithSession(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set("accept", "application/json");
  headers.set("content-type", "application/json");

  // A local API must allow http://localhost:3000 as a credentialed CORS origin.
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
    credentials: "include",
  });

  if (response.status === 401) throw new UnauthenticatedError();
  return response;
}
