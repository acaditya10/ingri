import { format, isToday, parseISO } from "date-fns";
import type { ReservationStatus, Reservation } from "./page";

export const STATUS_CONFIG: Record<ReservationStatus, { label: string; color: string; bg: string }> = {
    pending: { label: "Pending", color: "text-orange-400", bg: "bg-orange-400/10" },
    confirmed: { label: "Confirmed", color: "text-blue-400", bg: "bg-blue-400/10" },
    seated: { label: "Seated", color: "text-teal-400", bg: "bg-teal-400/10" },
    completed: { label: "Completed", color: "text-green-400", bg: "bg-green-400/10" },
    cancelled: { label: "Cancelled", color: "text-red-400/60", bg: "bg-red-400/5" },
    no_show: { label: "No Show", color: "text-yellow-500", bg: "bg-yellow-500/10" },
};

// Format time beautifully for the host (e.g., 18:30 -> 6:30 PM)
export const formatTime = (t: string) => {
    if (!t || !t.includes(":")) return t || "";
    const [h, m] = t.split(":").map(Number);
    if (isNaN(h) || isNaN(m)) return t;
    const hour = h % 12 || 12;
    return `${hour}:${m.toString().padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
};

export const safeFormatDate = (d: string) => {
    if (!d) return "Unknown Date";
    try {
        const parsed = parseISO(d);
        if (isNaN(parsed.getTime())) return d;
        return format(parsed, "MMM do");
    } catch {
        return d;
    }
};

export const safeIsToday = (d: string) => {
    if (!d) return false;
    try {
        const parsed = parseISO(d);
        if (isNaN(parsed.getTime())) return false;
        return isToday(parsed);
    } catch {
        return false;
    }
};
