"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { format, addDays, isBefore, startOfToday, isToday, startOfWeek } from "date-fns";

interface StepDateProps {
  selectedDate: string;
  onSelect: (date: string) => void;
}

export default function StepDate({ selectedDate, onSelect }: StepDateProps) {
  // Evaluates exactly at midnight local time
  const today = startOfToday();

  // 1. Get the Sunday of the current week (weekStartsOn: 0 means Sunday)
  const gridStartDate = startOfWeek(today, { weekStartsOn: 0 });

  // 2. Generate exactly 28 continuous days (4 weeks) starting from that Sunday
  const days = Array.from({ length: 28 }, (_, i) => addDays(gridStartDate, i));

  const formatDateKey = (date: Date) => format(date, "yyyy-MM-dd");

  // --- NEW: Auto-select today's date on initial load ---
  useEffect(() => {
    if (!selectedDate) {
      onSelect(formatDateKey(today));
    }
    // We only want this to run once when the component mounts or if the date gets cleared
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="space-y-6"
    >
      <div>
        <h2 className="font-playfair text-3xl text-cream-DEFAULT mb-2">
          When would you like to dine?
        </h2>
        <p className="font-dm text-teal-muted text-sm">
          We are open daily from 8:00 AM to 10:00 PM
        </p>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {/* Render the Day Headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center font-dm text-xs text-teal-muted uppercase tracking-wider py-2"
          >
            {day}
          </div>
        ))}

        {/* Render the 28-Day Grid */}
        {days.map((date) => {
          const key = formatDateKey(date);
          const isSelected = selectedDate === key;
          const isPast = isBefore(date, today);

          return (
            <button
              key={key}
              onClick={() => !isPast && onSelect(key)}
              disabled={isPast}
              className={`
                aspect-square rounded-card flex items-center justify-center
                font-dm text-sm transition-all duration-200
                ${isSelected
                  ? "bg-teal-primary text-cream-DEFAULT scale-105 shadow-lg shadow-teal-primary/30"
                  : isPast
                    ? "text-cream-DEFAULT/20 cursor-not-allowed" 
                    : "text-cream-DEFAULT/80 hover:bg-teal-primary/20 hover:text-cream-DEFAULT cursor-pointer" 
                }
                ${isToday(date) && !isSelected ? "border border-teal-primary/40" : ""}
              `}
            >
              {format(date, "d")}
            </button>
          );
        })}
      </div>

      {/* The selected date text will now show up instantly! */}
      {selectedDate && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-playfair text-cream-DEFAULT/70 italic text-center"
        >
          {format(new Date(selectedDate + "T00:00:00"), "EEEE, MMMM do")}
        </motion.p>
      )}
    </motion.div>
  );
}