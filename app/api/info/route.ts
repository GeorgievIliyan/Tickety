import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db();

  const user = await db.collection("users").findOne({ name: session.user.name });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const tickets = await db
    .collection("tickets")
    .find({ userId: user._id })
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json({ tickets, credits: user.credits });
}