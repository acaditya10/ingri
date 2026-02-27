"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import StepDate from "@/components/BookingFlow/StepDate";
import StepTime from "@/components/BookingFlow/StepTime";
import StepParty from "@/components/BookingFlow/StepParty";
import StepDetails from "@/components/BookingFlow/StepDetails";
import SuccessScreen from "@/components/BookingFlow/SuccessScreen";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const STEPS = ["Date", "Time", "Guests", "Details"];

export default function ReservePage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [partySize, setPartySize] = useState(2);
  const [details, setDetails] = useState({
    name: "",
    email: "",
    phone: "",
    special_requests: "",
  });

  const canAdvance = () => {
    if (step === 0) return !!date;
    if (step === 1) return !!time;
    if (step === 2) return partySize >= 1;
    if (step === 3) return !!details.name && !!details.email;
    return false;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...details,
          date,
          time,
          party_size: partySize,
        }),
      });

      if (!res.ok) throw new Error("Failed to create reservation");
      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-teal-dark flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <SuccessScreen
            name={details.name}
            date={date}
            time={time}
            partySize={partySize}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-teal-dark flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-6 border-b border-cream-DEFAULT/5">
        <Link
          href="/"
          className="flex items-center"
        >
          <Image
            src="/images/logo.png"
            alt="Ingri Logo"
            width={120}
            height={40}
            className="h-8 w-auto object-contain"
            priority
            unoptimized
          />
        </Link>
        <span className="font-dm text-teal-muted text-sm">
          Reserve a Table
        </span>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-lg">
          {/* Progress bar */}
          <div className="flex gap-2 mb-10">
            {STEPS.map((s, i) => (
              <div key={s} className="flex-1">
                <div
                  className={`h-0.5 rounded-full transition-all duration-500 ${i <= step ? "bg-teal-primary" : "bg-cream-DEFAULT/10"
                    }`}
                />
                <p
                  className={`font-dm text-xs mt-2 transition-colors ${i === step
                    ? "text-teal-primary"
                    : i < step
                      ? "text-cream-DEFAULT/40"
                      : "text-cream-DEFAULT/20"
                    }`}
                >
                  {s}
                </p>
              </div>
            ))}
          </div>

          {/* Step content */}
          <div className="glass-card p-8 min-h-[400px] flex flex-col">
            <div className="flex-1">
              <AnimatePresence mode="wait">
                <div key={step}>
                  {step === 0 && (
                    <StepDate selectedDate={date} onSelect={setDate} />
                  )}
                  {step === 1 && (
                    <StepTime
                      selectedDate={date}
                      selectedTime={time}
                      onSelect={setTime}
                    />
                  )}
                  {step === 2 && (
                    <StepParty partySize={partySize} onChange={setPartySize} />
                  )}
                  {step === 3 && (
                    <StepDetails
                      formData={details}
                      onChange={(field, value) =>
                        setDetails((prev) => ({ ...prev, [field]: value }))
                      }
                    />
                  )}
                </div>
              </AnimatePresence>
            </div>

            {error && (
              <p className="font-dm text-red-400 text-sm text-center mt-4">
                {error}
              </p>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-cream-DEFAULT/5">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className={`flex items-center gap-2 font-dm text-sm text-cream-DEFAULT/40 
                           hover:text-cream-DEFAULT transition-colors ${step === 0 ? "invisible" : ""}`}
              >
                <ChevronLeft size={16} />
                Back
              </button>

              <motion.button
                whileHover={{ scale: canAdvance() ? 1.02 : 1 }}
                whileTap={{ scale: canAdvance() ? 0.98 : 1 }}
                onClick={() => {
                  if (step < 3) setStep((s) => s + 1);
                  else handleSubmit();
                }}
                disabled={!canAdvance() || loading}
                className={`teal-button py-3 px-8 text-sm ${!canAdvance() ? "opacity-30 cursor-not-allowed" : ""
                  }`}
              >
                {loading
                  ? "Confirming..."
                  : step === 3
                    ? "Confirm Reservation"
                    : "Continue"}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}