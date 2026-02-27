"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface SuccessScreenProps {
  name: string;
  date: string;
  time: string;
  partySize: number;
}

export default function SuccessScreen({
  name,
  date,
  time,
  partySize,
}: SuccessScreenProps) {
  const formatTime = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return `${h > 12 ? h - 12 : h}:${m.toString().padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-8 py-8"
    >
      {/* Animated checkmark */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
        className="w-20 h-20 rounded-full bg-teal-primary/20 border border-teal-primary/40
                   flex items-center justify-center mx-auto"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Check size={36} className="text-teal-primary" />
        </motion.div>
      </motion.div>

      <div>
        <h2 className="font-playfair text-4xl text-cream-DEFAULT mb-3">
          You&apos;re confirmed, {name.split(" ")[0]}
        </h2>
        <p className="font-dm text-teal-muted">
          A confirmation has been sent to your email
        </p>
      </div>

      {/* Booking summary */}
      <div className="glass-card p-6 text-left max-w-sm mx-auto space-y-3">
        <div className="flex justify-between">
          <span className="font-dm text-teal-muted text-sm">Date</span>
          <span className="font-dm text-cream-DEFAULT text-sm">
            {format(new Date(date + "T00:00:00"), "EEEE, MMMM do")}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-dm text-teal-muted text-sm">Time</span>
          <span className="font-dm text-cream-DEFAULT text-sm">
            {formatTime(time)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-dm text-teal-muted text-sm">Guests</span>
          <span className="font-dm text-cream-DEFAULT text-sm">
            {partySize} {partySize === 1 ? "person" : "people"}
          </span>
        </div>
      </div>

      <Link
        href="/"
        className="font-dm text-teal-muted text-sm hover:text-cream-DEFAULT transition-colors"
      >
        ← Back to ingri
      </Link>
    </motion.div>
  );
}