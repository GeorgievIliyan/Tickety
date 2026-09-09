import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  const { email, password, name } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();

  const existing = await db.collection("users").findOne({ email });
  if (existing) {
    return NextResponse.json({ error: "User already exists" }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.collection("users").insertOne({
    email,
    password: hashedPassword,
    name: name ?? null,
    credits: 1,
    createdAt: new Date(),
  });

  return NextResponse.json({ ok: true });
}