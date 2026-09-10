import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request: NextRequest) {
  const { scannedData } = await request.json();

  if (!scannedData || !ObjectId.isValid(scannedData)) {
    return NextResponse.json({ valid: false, message: "Invalid ticket code!" });
  }

  const client = await clientPromise;
  const db = client.db();

  const ticket = await db.collection("tickets").findOne({
    _id: new ObjectId(scannedData),
  });

  if (!ticket) {
    return NextResponse.json({ valid: false, message: "Ticket does not exist!" });
  }

  if (ticket.type === "single") {
    if (ticket.used) {
      return NextResponse.json({ valid: false, message: "Ticket has already been used!" });
    }

    await db.collection("tickets").updateOne(
      { _id: ticket._id },
      { $set: { used: true, usedAt: new Date() } }
    );

    return NextResponse.json({ valid: true, message: "Ticket is valid!" });
  }

  if (ticket.type === "day-pass") {
    const expiresAt = new Date(ticket.createdAt);
    expiresAt.setHours(expiresAt.getHours() + 24);

    if (new Date() > expiresAt) {
      return NextResponse.json({ valid: false, message: "Day pass has expired!" });
    }

    return NextResponse.json({ valid: true, message: "Day pass is valid!" });
  }

  return NextResponse.json({ valid: false, message: "Unknown ticket type!" });
}