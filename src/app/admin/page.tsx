"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  orderBy,
  where,
  onSnapshot,
  doc,
  updateDoc
} from "firebase/firestore";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Calendar, CheckCircle, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { ReservationDrawer } from "@/components/admin/ReservationDrawer";
import {
  STATUS_CONFIG,
  formatTime,
  safeFormatDate,
  safeIsToday
} from "./utils";

export type ReservationStatus = "pending" | "confirmed" | "seated" | "completed" | "cancelled" | "no_show";

export interface Reservation {
  id: string;
  name: string;
  email: string;
  phone?: string;
  date: string;
  time: string;
  party_size: number;
  special_requests?: string;
  status: ReservationStatus;
}

export default function AdminPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "today">("today");
  const [updating, setUpdating] = useState<string | null>(null);
  const [selectedResId, setSelectedResId] = useState<string | null>(null);

  // Firebase Real-time Subscription
  useEffect(() => {
    setLoading(true);

    let q = query(
      collection(db, "reservations"),
      orderBy("date", "asc"),
      orderBy("time", "asc")
    );

    if (filter === "today") {
      const todayStr = format(new Date(), "yyyy-MM-dd");
      q = query(q, where("date", "==", todayStr));
    }

    // onSnapshot automatically listens for changes and updates the UI instantly
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Reservation[];

      setReservations(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching reservations:", error);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [filter]);

  // Update status directly in Firestore
  const updateStatus = async (id: string, status: ReservationStatus) => {
    setUpdating(id);
    const reservationToUpdate = reservations.find(r => r.id === id);
    const guestName = reservationToUpdate?.name || "Guest";

    try {
      const docRef = doc(db, "reservations", id);
      await updateDoc(docRef, { status });

      // Beautiful sonner toasts based on action
      if (status === "confirmed") {
        toast.success(`Reservation confirmed for ${guestName}`);
      } else if (status === "seated") {
        toast.success(`${guestName}'s party has been seated`);
      } else if (status === "completed") {
        toast.success(`Marked ${guestName}'s visit as completed`);
      } else if (status === "cancelled" || status === "no_show") {
        toast.error(`Reservation for ${guestName} marked as ${status.replace("_", " ")}`);
        // if the drawer is open and we cancel/no-show, we probably want to close it
        setSelectedResId(null);
      }

    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update status. Please try again.");
    } finally {
      setUpdating(null);
    }
  };

  const todayCount = reservations.filter((r) => safeIsToday(r.date)).length;
  const confirmedCount = reservations.filter((r) => r.status === "confirmed" || r.status === "pending").length;
  const totalCovers = reservations
    .filter((r) => r.status !== "cancelled" && r.status !== "no_show")
    .reduce((acc, r) => acc + (r.party_size || 0), 0);

  return (
    <div className="min-h-screen bg-teal-dark p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-playfair text-3xl text-cream-DEFAULT">Dashboard</h1>
              {/* Live Indicator */}
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-dm">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Live
              </span>
            </div>
            <p className="font-dm text-teal-muted text-sm mt-1">
              {format(new Date(), "EEEE, MMMM do")}
            </p>
          </div>
          <Image
            src="/images/logo.png"
            alt="Ingri Logo"
            width={100}
            height={33}
            className="h-8 w-auto object-contain hidden sm:block opacity-40 hover:opacity-100 transition-opacity"
            priority
            unoptimized
          />
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard icon={<Calendar size={18} />} label="Today's Reservations" value={todayCount} />
          <StatCard icon={<Users size={18} />} label="Total Covers" value={totalCovers} />
          <StatCard icon={<CheckCircle size={18} />} label="Awaiting Seating" value={confirmedCount} />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {(["today", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`font-dm text-sm px-5 py-2 rounded-pill transition-all duration-200 capitalize ${filter === f
                ? "bg-teal-primary text-cream-DEFAULT"
                : "glass-card text-cream-DEFAULT/40 hover:text-cream-DEFAULT/70"
                }`}
            >
              {f === "today" ? "Today" : "All Reservations"}
            </button>
          ))}
        </div>

        {/* Reservations list */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 rounded-card bg-cream-DEFAULT/5 animate-pulse" />
            ))}
          </div>
        ) : reservations.length === 0 ? (
          <div className="glass-card p-16 text-center">
            <p className="font-playfair text-2xl text-cream-DEFAULT/40">No reservations</p>
            <p className="font-dm text-teal-muted text-sm mt-2">
              {filter === "today" ? "No bookings for today" : "No reservations found"}
            </p>
          </div>
        ) : (
          <AnimatePresence>
            <div className="space-y-3">
              {reservations.map((r, i) => (
                <motion.div
                  key={r.id}
                  layoutId={r.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.05, 0.5) }}
                  onClick={() => setSelectedResId(r.id)}
                  className={`glass-card p-5 flex items-center justify-between gap-6 cursor-pointer hover:bg-cream-DEFAULT/5 transition-colors group ${r.status === "cancelled" || r.status === "no_show" ? "opacity-60" : ""
                    }`}
                >
                  {/* Guest Info Concise */}
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${r.status === "pending" ? "bg-orange-500/10 text-orange-400" :
                      r.status === "seated" ? "bg-teal-400/10 text-teal-400" :
                        "bg-teal-primary/20 text-teal-primary"
                      }`}>
                      <span className="font-dm text-lg font-medium">
                        {r.name?.charAt(0).toUpperCase() || "?"}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-dm text-cream-DEFAULT font-medium text-lg">
                          {r.name}
                        </p>
                        {r.status === "pending" && (
                          <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 font-dm text-sm">
                        <span className="text-teal-primary">
                          {r.party_size} {r.party_size === 1 ? 'Guest' : 'Guests'} at {formatTime(r.time)}
                        </span>
                        <span className="text-teal-muted hidden sm:inline-block">•</span>
                        <span className="text-teal-muted hidden sm:inline-block">
                          {safeFormatDate(r.date)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status & Chevron indicator */}
                  <div className="flex items-center gap-4">
                    <span className={`hidden sm:inline-block font-dm text-xs px-3 py-1.5 rounded-pill border ${STATUS_CONFIG[r.status]?.bg} ${STATUS_CONFIG[r.status]?.color} border-current/20`}>
                      {STATUS_CONFIG[r.status]?.label}
                    </span>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-teal-muted group-hover:text-cream-DEFAULT group-hover:bg-cream-DEFAULT/10 transition-all">
                      <ChevronRight size={18} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>

      <ReservationDrawer
        reservation={reservations.find(r => r.id === selectedResId) || null}
        isOpen={!!selectedResId}
        onClose={() => setSelectedResId(null)}
        onUpdateStatus={updateStatus}
        updatingId={updating}
      />
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="glass-card p-5 relative overflow-hidden group">
      <div className="flex items-center gap-2 text-teal-muted mb-3 relative z-10">
        {icon}
        <span className="font-dm text-xs uppercase tracking-wider">{label}</span>
      </div>
      <p className="font-playfair text-4xl text-cream-DEFAULT relative z-10">{value}</p>
      {/* Subtle hover gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}

