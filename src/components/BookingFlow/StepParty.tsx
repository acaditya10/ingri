"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus } from "lucide-react";

interface StepPartyProps {
  partySize: number;
  onChange: (size: number) => void;
}

export default function StepParty({ partySize, onChange }: StepPartyProps) {
  const isMin = partySize <= 1;
  const isMax = partySize >= 10;

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
          How many guests?
        </h2>
        <p className="font-dm text-teal-muted text-sm">
          For parties larger than 10, please contact us directly
        </p>
      </div>

      {/* Main Counter Section */}
      <div className="flex items-center justify-center gap-8 py-8">
        {/* Decrement Button */}
        <motion.button
          whileTap={!isMin ? { scale: 0.9 } : {}}
          onClick={() => !isMin && onChange(partySize - 1)}
          disabled={isMin}
          className={`
            w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300
            ${
              isMin
                ? "bg-cream-DEFAULT/5 text-cream-DEFAULT/20 cursor-not-allowed border border-transparent"
                : "glass-card text-cream-DEFAULT/80 hover:text-cream-DEFAULT hover:border-teal-primary/40 cursor-pointer"
            }
          `}
        >
          <Minus size={20} />
        </motion.button>

        {/* Animated Number Display */}
        <div className="text-center w-24">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={partySize}
              initial={{ scale: 0.8, opacity: 0, y: -10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="font-playfair text-7xl text-cream-DEFAULT block"
            >
              {partySize}
            </motion.span>
          </AnimatePresence>
          <span className="font-dm text-teal-muted text-sm mt-1 block uppercase tracking-widest">
            {partySize === 1 ? "Guest" : "Guests"}
          </span>
        </div>

        {/* Increment Button */}
        <motion.button
          whileTap={!isMax ? { scale: 0.9 } : {}}
          onClick={() => !isMax && onChange(partySize + 1)}
          disabled={isMax}
          className={`
            w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300
            ${
              isMax
                ? "bg-cream-DEFAULT/5 text-cream-DEFAULT/20 cursor-not-allowed border border-transparent"
                : "glass-card text-cream-DEFAULT/80 hover:text-cream-DEFAULT hover:border-teal-primary/40 cursor-pointer"
            }
          `}
        >
          <Plus size={20} />
        </motion.button>
      </div>

      {/* Quick Select Row */}
      <div className="flex justify-center gap-2 flex-wrap px-4">
        {/* Expanded to 10 to match the max limits */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={`
              w-10 h-10 sm:w-8 sm:h-8 rounded-full text-sm sm:text-xs font-dm transition-all duration-300
              ${
                partySize === n
                  ? "bg-teal-primary text-cream-DEFAULT shadow-lg shadow-teal-primary/30"
                  : "glass-card text-cream-DEFAULT/40 hover:text-cream-DEFAULT/80 hover:border-teal-primary/30"
              }
            `}
          >
            {n}
          </button>
        ))}
      </div>
    </motion.div>
  );
}