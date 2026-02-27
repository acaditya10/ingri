import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Preview,
  Button, // <-- Added Button
  Img,
  Font,   // <-- Added Font
} from "@react-email/components";
import { format } from "date-fns";

interface Props {
  name: string;
  date: string;
  time: string;
  partySize: number;
  reservationId: string;
  specialRequests?: string;
}

const formatTime = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
};

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` :
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://www.ingri.page"));

export function CustomerConfirmationEmail({
  name,
  date,
  time,
  partySize,
  reservationId,
  specialRequests,
}: Props) {
  const formattedDate = format(new Date(date + "T00:00:00"), "EEEE, MMMM do, yyyy");

  return (
    <Html>
      <Head>
        {/* UPGRADE 1: Importing Playfair Display for Apple devices */}
        <Font
          fontFamily="Playfair Display"
          fallbackFontFamily="Georgia"
          webFont={{
            url: "https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDXbtM.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Your table at ingri is confirmed for {formattedDate}</Preview>
      <Body style={{ backgroundColor: "#0D2626", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
        <Container style={{ maxWidth: "480px", margin: "0 auto", padding: "40px 20px" }}>

          <Section style={{ textAlign: "center", paddingBottom: "32px", borderBottom: "1px solid rgba(245,240,232,0.1)" }}>
            <Img
              src={`${baseUrl}/images/logo.png`}
              width="100"
              height="auto"
              alt="ingri logo"
              style={{ margin: "0 auto", display: "block" }}
            />
          </Section>

          <Section style={{ padding: "40px 0" }}>
            <Text style={{ color: "#8A9E9E", fontSize: "12px", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 12px" }}>
              Reservation Confirmed
            </Text>
            {/* UPGRADE 1 applied: Using Playfair Display/Georgia for headers */}
            <Heading style={{ color: "#F5F0E8", fontFamily: "'Playfair Display', Georgia, serif", fontSize: "28px", fontWeight: "400", margin: "0 0 24px", lineHeight: "1.3" }}>
              We look forward to welcoming you, {name.split(" ")[0]}.
            </Heading>
            <Text style={{ color: "rgba(245,240,232,0.7)", fontSize: "15px", lineHeight: "1.7" }}>
              Your table has been reserved. We can't wait to share an
              exceptional time with you.
            </Text>
          </Section>

          <Section style={{ background: "rgba(42,107,107,0.12)", border: "1px solid rgba(245,240,232,0.08)", borderRadius: "12px", padding: "24px", marginBottom: "32px" }}>
            <DetailRow label="Date" value={formattedDate} />
            <DetailRow label="Time" value={formatTime(time)} />
            <DetailRow label="Guests" value={`${partySize} ${partySize === 1 ? "person" : "people"}`} />
            {specialRequests && <DetailRow label="Special Requests" value={specialRequests} />}
            <Hr style={{ borderColor: "rgba(245,240,232,0.06)", margin: "16px 0" }} />
            <DetailRow label="Reference" value={reservationId.slice(0, 8).toUpperCase()} muted />
          </Section>

          {/* UPGRADE 2: Beautiful Call-to-Action Button Section */}
          <Section style={{ paddingBottom: "32px", textAlign: "center" }}>
            <Text style={{ color: "#F5F0E8", fontFamily: "'Playfair Display', Georgia, serif", fontSize: "18px", margin: "0 0 8px" }}>
              Museo Camera Centre
            </Text>
            <Text style={{ color: "rgba(245,240,232,0.7)", fontSize: "13px", margin: "0 0 24px" }}>
              Sector 28, DLF Phase IV, Gurugram
            </Text>

            <Button
              href="https://www.google.com/maps/dir/?api=1&destination=Museo+Camera+Centre,+Sector+28,+Gurugram"
              style={{
                backgroundColor: "#2A6B6B", // Your teal primary
                color: "#F5F0E8",
                padding: "14px 28px",
                borderRadius: "30px",
                fontSize: "13px",
                fontWeight: "500",
                textDecoration: "none",
                display: "inline-block",
                letterSpacing: "0.05em"
              }}
            >
              Get Directions
            </Button>
          </Section>

          <Text style={{ color: "rgba(245,240,232,0.5)", fontSize: "13px", lineHeight: "1.6", textAlign: "center" }}>
            Need to cancel or modify? Simply reply to this email or call us at +91 93114 15282.
            We request at least 24 hours notice.
          </Text>

          <Hr style={{ borderColor: "rgba(245,240,232,0.06)", margin: "32px 0" }} />

          <Text style={{ color: "rgba(245,240,232,0.3)", fontSize: "12px", textAlign: "center" }}>
            ingri · Open Daily · 8:00 AM – 10:00 PM
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

function DetailRow({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    // UPGRADE 3: Added role="presentation" for screen reader accessibility
    <table width="100%" cellPadding="0" cellSpacing="0" border={0} role="presentation">
      <tbody>
        <tr>
          <td style={{ paddingBottom: "12px", color: "#8A9E9E", fontSize: "13px", width: "40%", verticalAlign: "top" }}>
            {label}
          </td>
          <td style={{ paddingBottom: "12px", color: muted ? "rgba(245,240,232,0.4)" : "#F5F0E8", fontSize: "13px", textAlign: "right", fontFamily: muted ? "monospace" : "inherit", verticalAlign: "top" }}>
            {value}
          </td>
        </tr>
      </tbody>
    </table>
  );
}