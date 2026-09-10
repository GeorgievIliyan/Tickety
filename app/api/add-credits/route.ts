import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { credits } = await request.json();

  if (!credits || credits < 1) {
    return NextResponse.json({ error: "Invalid credits amount" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();

  await db.collection("users").updateOne(
    { _id: new ObjectId(session.user.id) },
    { $inc: { credits } }
  );

  return NextResponse.json({ ok: true });
}