import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import AmbientToggle from "@/components/AmbientToggle";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ingri — Reserve Your Table",
  description:
    "Experience exceptional dining at ingri. Reserve your table for an unforgettable evening.",
  openGraph: {
    title: "ingri Restaurant",
    description: "Reserve your table for an unforgettable dining experience.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable}`}>
      <body>
        {children}
        <AmbientToggle />
        <Toaster theme="dark" position="bottom-right" />
      </body>
    </html>
  );
}