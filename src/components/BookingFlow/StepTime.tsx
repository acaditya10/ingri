"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Expanded to cover Ingri's full operating hours (8 AM - 10 PM)
const TIME_SLOTS = {
  Morning: ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30"],
  Afternoon: ["12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"],
  Evening: ["17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"],
};

const MAX_PER_SLOT = 6;

type TimeOfDay = "Morning" | "Afternoon" | "Evening";

interface StepTimeProps {
  selectedDate: string; // expects format 'yyyy-MM-dd'
  selectedTime: string;
  onSelect: (time: string) => void;
}

export default function StepTime({
  selectedDate,
  selectedTime,
  onSelect,
}: StepTimeProps) {
  const [bookedCounts, setBookedCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TimeOfDay>("Evening"); // Default to Evening

  // Format the date nicely for the header (e.g., "Friday, March 6th")
  const formattedHeaderDate = selectedDate
    ? format(new Date(selectedDate + "T00:00:00"), "EEEE, MMMM do")
    : "";

  useEffect(() => {
    async function fetchBookedSlots() {
      setLoading(true);
      try {
        const q = query(
          collection(db, "reservations"),
          where("date", "==", selectedDate),
          where("status", "!=", "cancelled")
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const counts: Record<string, number> = {};
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            counts[data.time] = (counts[data.time] || 0) + 1;
          });
          setBookedCounts(counts);
        }
      } catch (error) {
        console.error("Error fetching slots:", error);
      } finally {
        setLoading(false);
      }
    }

    if (selectedDate) fetchBookedSlots();
  }, [selectedDate]);

  const formatTime = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="space-y-8"
    >
      {/* Header Section */}
      <div>
        <h2 className="font-playfair text-3xl text-cream-DEFAULT mb-2">
          Choose your time
        </h2>
        <p className="font-dm text-teal-muted text-sm flex items-center gap-2">
          {formattedHeaderDate ? `For ${formattedHeaderDate}` : "Select a slot below"}
          {loading && (
            <span className="inline-block w-3 h-3 ml-2 border-2 border-teal-primary border-t-transparent rounded-full animate-spin" />
          )}
        </p>
      </div>

      {/* Elegant Tab Navigation */}
      <div className="flex p-1 bg-cream-DEFAULT/5 rounded-full w-full max-w-sm mx-auto mb-6">
        {(Object.keys(TIME_SLOTS) as TimeOfDay[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-full text-xs font-dm uppercase tracking-widest transition-all duration-300 ${activeTab === tab
                ? "bg-teal-primary text-cream-DEFAULT shadow-md"
                : "text-cream-DEFAULT/50 hover:text-cream-DEFAULT"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Time Slots Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {TIME_SLOTS[activeTab].map((time) => {
          const count = bookedCounts[time] || 0;
          const isFull = count >= MAX_PER_SLOT;
          const isSelected = selectedTime === time;
          const isDisabled = loading || isFull;

          return (
            <motion.button
              key={time}
              whileHover={!isDisabled ? { scale: 1.03, y: -2 } : {}}
              whileTap={!isDisabled ? { scale: 0.97 } : {}}
              onClick={() => !isDisabled && onSelect(time)}
              disabled={isDisabled}
              className={`
                py-4 rounded-pill font-dm text-sm font-medium transition-all duration-300 relative overflow-hidden
                ${isSelected
                  ? "bg-teal-primary text-cream-DEFAULT shadow-lg shadow-teal-primary/30 border border-teal-primary"
                  : isFull && !loading
                    ? "bg-cream-DEFAULT/5 text-cream-DEFAULT/20 cursor-not-allowed line-through border border-transparent"
                    : "glass-card text-cream-DEFAULT/80 hover:text-cream-DEFAULT border border-transparent hover:border-teal-primary/40"
                }
                ${loading && !isSelected ? "opacity-70 cursor-wait" : "opacity-100"}
              `}
            >
              {formatTime(time)}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}