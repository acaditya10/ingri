import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { ReservationStatus } from "@/types/reservation";

export async function PATCH(req: NextRequest) {
  try {
    const { id, status }: { id: string; status: ReservationStatus } =
      await req.json();

    const docRef = adminDb.collection("reservations").doc(id);
    await docRef.update({ status });

    const updatedDoc = await docRef.get();
    const data = { id: updatedDoc.id, ...updatedDoc.data() };

    return NextResponse.json({ success: true, reservation: data });
  } catch {
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}