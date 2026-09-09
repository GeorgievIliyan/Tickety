import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";

const ticketSchema = z.object({
  type: z.enum(["single", "day-pass"]),
});

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = ticketSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { type } = parsed.data;
  const price = type === "single" ? 1 : 3;

  const client = await clientPromise;
  const db = client.db();

  const user = await db.collection("users").findOne({ name: session.user.name });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (user.credits < price) {
    return NextResponse.json({ error: "Not enough balance." }, { status: 400 });
  }

  try {
    await db.collection("users").updateOne(
      { _id: user._id },
      { $inc: { credits: -price } }
    );

    await db.collection("tickets").insertOne({
      type,
      userId: user._id,
      price,
      createdAt: new Date(),
      used: false,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create ticket." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}