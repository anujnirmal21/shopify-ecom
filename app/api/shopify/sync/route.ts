import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { token, expiresAt } = await request.json();
    const cookieStore = await cookies();

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    cookieStore.set("shopify_customer_token", token, {
      expires: expiresAt ? new Date(expiresAt) : undefined,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[api/shopify/sync] Failed to set cookie:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
