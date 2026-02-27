import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
  Preview,
  Img
} from "@react-email/components";
import { format } from "date-fns";

interface Props {
  name: string;
  email: string;
  phone?: string;
  date: string;
  time: string;
  partySize: number;
  reservationId: string;
  specialRequests?: string;
}

// Replace this with your actual live domain once deployed!
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://your-live-domain.com";

export function AdminNotificationEmail({
  name,
  email,
  phone,
  date,
  time,
  partySize,
  reservationId,
  specialRequests
}: Props) {
  const formattedDate = format(new Date(date + "T00:00:00"), "EEEE, MMMM do");

  // UPGRADED: Fixed the 12:00 PM / 12:00 AM edge cases
  const formatTime = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    const hour = h % 12 || 12;
    return `${hour}:${m.toString().padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
  };

  return (
    <Html>
      <Head />
      <Preview>{`New reservation: ${name} · ${partySize} guests on ${formattedDate} at ${formatTime(time)}`}</Preview>
      <Body style={{ backgroundColor: "#0D2626", fontFamily: "sans-serif" }}>
        <Container style={{ maxWidth: "480px", margin: "0 auto", padding: "40px 20px" }}>

          <Section style={{ textAlign: "center", paddingBottom: "24px" }}>
            {/* Added the logo here too for consistency with the customer email */}
            <Img
              src={`${baseUrl}/images/logo.png`}
              width="80"
              height="auto"
              alt="ingri logo"
              style={{ margin: "0 auto", display: "block", paddingBottom: "12px" }}
            />
            <Text style={{ color: "#8A9E9E", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0" }}>
              New Reservation Alert
            </Text>
          </Section>

          <Section style={{ background: "rgba(42,107,107,0.15)", border: "1px solid rgba(42,107,107,0.3)", borderRadius: "12px", padding: "24px", marginBottom: "24px" }}>
            <Text style={{ color: "#F5F0E8", fontSize: "20px", margin: "0 0 4px", fontWeight: "500" }}>
              {name}
            </Text>
            <Text style={{ color: "#8A9E9E", fontSize: "13px", margin: "0 0 20px" }}>
              {partySize} {partySize === 1 ? "guest" : "guests"} · {formattedDate} · {formatTime(time)}
            </Text>

            <Hr style={{ borderColor: "rgba(245,240,232,0.06)", margin: "0 0 16px" }} />

            <InfoRow label="Email" value={email} />
            {phone && <InfoRow label="Phone" value={phone} />}
            {specialRequests && <InfoRow label="Notes" value={specialRequests} />}

            <Hr style={{ borderColor: "rgba(245,240,232,0.06)", margin: "12px 0 16px" }} />

            <InfoRow label="ID" value={reservationId.slice(0, 8).toUpperCase()} mono />
          </Section>

          <Text style={{ color: "rgba(245,240,232,0.4)", fontSize: "12px", textAlign: "center", lineHeight: "1.5" }}>
            Log in to the admin panel to manage this reservation.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// UPGRADED: Replaced flexbox with a bulletproof email table structure
function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <table width="100%" cellPadding="0" cellSpacing="0" border={0}>
      <tbody>
        <tr>
          <td style={{ paddingBottom: "10px", color: "#8A9E9E", fontSize: "12px", width: "70px", verticalAlign: "top" }}>
            {label}
          </td>
          <td style={{ paddingBottom: "10px", color: "#F5F0E8", fontSize: "12px", fontFamily: mono ? "monospace" : "inherit", verticalAlign: "top" }}>
            {value}
          </td>
        </tr>
      </tbody>
    </table>
  );
}