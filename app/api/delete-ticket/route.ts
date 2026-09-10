import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse, NextRequest } from "next/server";

export async function DELETE(request: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id || !ObjectId.isValid(id)){
    return NextResponse.json({ error: "Invalid ticket id" }, { status: 400 });
  }

  const client = clientPromise
  const db = (await client).db()

  const result = await db.collection('tickets').deleteOne({
    _id: new ObjectId(id),
    userId: new ObjectId(session.user.id),
    used: true
  });
  
  if (result.deletedCount === 0) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}