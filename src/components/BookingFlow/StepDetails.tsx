"use client";

import { motion } from "framer-motion";

interface FormData {
  name: string;
  email: string;
  phone: string;
  special_requests: string;
}

interface StepDetailsProps {
  formData: FormData;
  onChange: (field: keyof FormData, value: string) => void;
}

// UPGRADED: Better border contrast and a beautiful, premium focus state
const inputClass = `
  w-full bg-transparent border border-cream-DEFAULT/20 rounded-card px-4 py-3
  font-dm text-cream-DEFAULT text-sm placeholder:text-cream-DEFAULT/40
  focus:outline-none focus:border-teal-primary focus:bg-teal-primary/5 focus:ring-1 focus:ring-teal-primary/50
  transition-all duration-300
`;

export default function StepDetails({ formData, onChange }: StepDetailsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="space-y-6"
    >
      <div>
        <h2 className="font-playfair text-3xl text-cream-DEFAULT mb-2">
          Your details
        </h2>
        <p className="font-dm text-teal-muted text-sm">
          We'll send your confirmation to this email
        </p>
      </div>

      <div className="space-y-4">
        <input
          type="text"
          aria-label="Full name"
          autoComplete="name"
          placeholder="Full name *"
          value={formData.name}
          onChange={(e) => onChange("name", e.target.value)}
          className={inputClass}
          required
        />
        <input
          type="email"
          aria-label="Email address"
          autoComplete="email"
          placeholder="Email address *"
          value={formData.email}
          onChange={(e) => onChange("email", e.target.value)}
          className={inputClass}
          required
        />
        <input
          type="tel"
          aria-label="Phone number"
          autoComplete="tel"
          // UPGRADED: Strongly recommend making this required for a restaurant!
          placeholder="Phone number *" 
          value={formData.phone}
          onChange={(e) => onChange("phone", e.target.value)}
          className={inputClass}
          required
        />
        <textarea
          aria-label="Special requests"
          placeholder="Special requests — dietary needs, celebrations, seating preferences..."
          value={formData.special_requests}
          onChange={(e) => onChange("special_requests", e.target.value)}
          rows={4}
          className={`${inputClass} resize-none`}
        />
      </div>
    </motion.div>
  );
}