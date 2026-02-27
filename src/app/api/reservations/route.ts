import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { resend } from "@/lib/resend";
import { CustomerConfirmationEmail } from "@/emails/CustomerConfirmation";
import { AdminNotificationEmail } from "@/emails/AdminNotification";
import { CreateReservationPayload } from "@/types/reservation";

export async function POST(req: NextRequest) {
  try {
    const body: CreateReservationPayload = await req.json();

    // Validate required fields
    if (!body.name || !body.email || !body.date || !body.time || !body.party_size) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert into Firestore
    // Add created_at and status fields which Supabase would have added by default
    const reservationData = {
      ...body,
      status: "pending",
      created_at: new Date().toISOString()
    };

    const docRef = await adminDb.collection("reservations").add(reservationData);
    const data = { id: docRef.id, ...reservationData };

    // Send emails in parallel
    const emailResults = await Promise.allSettled([
      // Customer confirmation
      resend.emails.send({
        from: process.env.ADMIN_EMAIL_FROM!,
        to: body.email,
        subject: "Your reservation at ingri is confirmed",
        react: CustomerConfirmationEmail({
          name: body.name,
          date: body.date,
          time: body.time,
          partySize: body.party_size,
          reservationId: data.id,
          specialRequests: body.special_requests,
        }),
      }),

      // Admin notification
      resend.emails.send({
        from: process.env.ADMIN_EMAIL_FROM!,
        to: process.env.ADMIN_EMAIL!,
        subject: `New reservation — ${body.name} · ${body.date} at ${body.time}`,
        react: AdminNotificationEmail({
          name: body.name,
          email: body.email,
          phone: body.phone,
          date: body.date,
          time: body.time,
          partySize: body.party_size,
          reservationId: data.id,
          specialRequests: body.special_requests,
        }),
      }),
    ]);

    emailResults.forEach((result, index) => {
      const type = index === 0 ? "Customer Confirmation" : "Admin Notification";
      if (result.status === "rejected") {
        console.error(`[Resend Error] Failed to send ${type} email:`, result.reason);
      } else if (result.value && result.value.error) {
        console.error(`[Resend Error] API error for ${type} email:`, result.value.error);
      }
    });

    return NextResponse.json({ success: true, reservation: data });
  } catch (err) {
    console.error("Reservation error:", err);
    return NextResponse.json(
      { error: "Failed to create reservation" },
      { status: 500 }
    );
  }
}