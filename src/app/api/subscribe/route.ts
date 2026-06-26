import { NextResponse } from "next/server";
import { Resend } from "resend";


export async function POST(req: Request) {
  try {
    // Instantiate Resend inside the handler to prevent build-time crashes
    // when process.env.RESEND_API_KEY is not defined in the CI/build environment.
    const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy");

    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Call Resend contacts API (no audienceId required for the new model)
    const { data, error } = await resend.contacts.create({
      email,
      unsubscribed: false,
    } as any); // Using 'as any' just in case the SDK typings are outdated for the audienceId param

    if (error) {
      console.error("Resend API error:", error);
      return NextResponse.json(
        { error: "Failed to subscribe. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("Subscription error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
