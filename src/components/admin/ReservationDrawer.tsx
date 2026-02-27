import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, Users, Mail, Phone, MessageSquare, Tag } from "lucide-react";
import { STATUS_CONFIG, formatTime, safeFormatDate, safeIsToday } from "@/app/admin/utils";
import type { Reservation, ReservationStatus } from "@/app/admin/page";

interface DrawerProps {
    reservation: Reservation | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdateStatus: (id: string, status: ReservationStatus) => void;
    updatingId: string | null;
}

export function ReservationDrawer({ reservation, isOpen, onClose, onUpdateStatus, updatingId }: DrawerProps) {
    if (!reservation) return null;

    const statusConfig = STATUS_CONFIG[reservation.status];
    const isUpdating = updatingId === reservation.id;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-teal-dark/80 backdrop-blur-sm z-40 transition-opacity"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%", opacity: 0.5 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "100%", opacity: 0.5 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 bottom-0 w-full sm:w-[500px] bg-teal-dark/95 border-l border-cream-DEFAULT/10 shadow-2xl z-50 overflow-y-auto"
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-teal-dark/95 backdrop-blur-xl border-b border-cream-DEFAULT/10 p-6 flex items-start justify-between z-10">
                            <div className="flex gap-4 items-center">
                                <div className="w-14 h-14 rounded-full bg-teal-primary/20 flex items-center justify-center flex-shrink-0 border border-teal-primary/30 shadow-[0_0_15px_rgba(45,212,191,0.15)]">
                                    <span className="font-playfair text-teal-primary text-2xl">
                                        {reservation.name?.charAt(0).toUpperCase() || "?"}
                                    </span>
                                </div>
                                <div>
                                    <h2 className="font-playfair text-2xl text-cream-DEFAULT">{reservation.name}</h2>
                                    <div className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-dm ${statusConfig.bg} ${statusConfig.color} border border-current/20`}>
                                        <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
                                        {statusConfig.label}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-cream-DEFAULT/40 hover:text-cream-DEFAULT hover:bg-cream-DEFAULT/5 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-8">

                            {/* Timing Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="glass-card p-4 rounded-xl relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-teal-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="flex items-center gap-2 text-teal-muted mb-1 text-sm font-dm">
                                        <Calendar size={14} className="text-teal-primary/70" /> Date
                                    </div>
                                    <div className="font-dm text-cream-DEFAULT font-medium">
                                        {safeFormatDate(reservation.date)}
                                        {safeIsToday(reservation.date) && (
                                            <span className="ml-2 text-[10px] uppercase tracking-wider text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">Today</span>
                                        )}
                                    </div>
                                </div>
                                <div className="glass-card p-4 rounded-xl relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-teal-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="flex items-center gap-2 text-teal-muted mb-1 text-sm font-dm">
                                        <Clock size={14} className="text-teal-primary/70" /> Time
                                    </div>
                                    <div className="font-dm text-cream-DEFAULT font-medium">{formatTime(reservation.time)}</div>
                                </div>
                                <div className="col-span-2 glass-card p-4 rounded-xl relative overflow-hidden flex justify-between items-center group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-teal-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="flex items-center gap-2 text-teal-muted text-sm font-dm">
                                        <Users size={14} className="text-teal-primary/70" /> Party Size
                                    </div>
                                    <div className="font-playfair text-xl text-teal-primary">
                                        {reservation.party_size} {reservation.party_size === 1 ? 'Guest' : 'Guests'}
                                    </div>
                                </div>
                            </div>

                            {/* Contact Details */}
                            <div>
                                <h3 className="text-sm font-dm text-cream-DEFAULT/40 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <Tag size={12} /> Contact Details
                                </h3>
                                <div className="space-y-3 glass-card p-5 rounded-xl">
                                    {reservation.phone ? (
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-cream-DEFAULT/5 flex items-center justify-center text-teal-muted">
                                                <Phone size={14} />
                                            </div>
                                            <a href={`tel:${reservation.phone}`} className="font-dm text-cream-DEFAULT text-sm hover:text-teal-primary transition-colors">
                                                {reservation.phone}
                                            </a>
                                        </div>
                                    ) : null}

                                    {reservation.email ? (
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-cream-DEFAULT/5 flex items-center justify-center text-teal-muted">
                                                <Mail size={14} />
                                            </div>
                                            <a href={`mailto:${reservation.email}`} className="font-dm text-cream-DEFAULT text-sm hover:text-teal-primary transition-colors">
                                                {reservation.email}
                                            </a>
                                        </div>
                                    ) : null}
                                </div>
                            </div>

                            {/* Special Requests */}
                            {reservation.special_requests && (
                                <div>
                                    <h3 className="text-sm font-dm text-cream-DEFAULT/40 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <MessageSquare size={12} /> Special Requests
                                    </h3>
                                    <div className="glass-card p-5 rounded-xl bg-orange-500/5 relative overflow-hidden">
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500/50" />
                                        <p className="font-dm text-cream-DEFAULT/90 italic text-sm leading-relaxed">
                                            &quot;{reservation.special_requests}&quot;
                                        </p>
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Bottom Actions Sticky */}
                        <div className="sticky bottom-0 bg-teal-dark/95 backdrop-blur-xl border-t border-cream-DEFAULT/10 p-6 flex flex-col gap-3">
                            {reservation.status === "pending" && (
                                <button
                                    onClick={() => onUpdateStatus(reservation.id, "confirmed")}
                                    disabled={isUpdating}
                                    className="w-full py-3 rounded-xl bg-blue-500/10 text-blue-400 font-dm font-medium hover:bg-blue-500/20 transition-colors border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)] flex justify-center disabled:opacity-50"
                                >
                                    {isUpdating ? "Updating..." : "Confirm Reservation"}
                                </button>
                            )}
                            {reservation.status === "confirmed" && (
                                <button
                                    onClick={() => onUpdateStatus(reservation.id, "seated")}
                                    disabled={isUpdating}
                                    className="w-full py-3 rounded-xl bg-teal-primary text-teal-dark font-dm font-medium hover:brightness-110 transition-all shadow-[0_0_15px_rgba(45,212,191,0.3)] flex justify-center disabled:opacity-50"
                                >
                                    {isUpdating ? "Updating..." : "Seat Guests"}
                                </button>
                            )}
                            {reservation.status === "seated" && (
                                <button
                                    onClick={() => onUpdateStatus(reservation.id, "completed")}
                                    disabled={isUpdating}
                                    className="w-full py-3 rounded-xl bg-green-500/10 text-green-400 font-dm font-medium hover:bg-green-500/20 transition-colors border border-green-500/30 flex justify-center disabled:opacity-50"
                                >
                                    {isUpdating ? "Updating..." : "Mark Completed"}
                                </button>
                            )}

                            {/* Negative Actions */}
                            {(reservation.status === "pending" || reservation.status === "confirmed" || reservation.status === "seated") && (
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => onUpdateStatus(reservation.id, "no_show")}
                                        disabled={isUpdating}
                                        className="flex-1 py-2.5 rounded-xl bg-cream-DEFAULT/5 text-yellow-500 font-dm text-sm hover:bg-yellow-500/10 transition-colors flex justify-center disabled:opacity-50"
                                    >
                                        No Show
                                    </button>
                                    <button
                                        onClick={() => onUpdateStatus(reservation.id, "cancelled")}
                                        disabled={isUpdating}
                                        className="flex-1 py-2.5 rounded-xl bg-cream-DEFAULT/5 text-red-400 font-dm text-sm hover:bg-red-400/10 transition-colors flex justify-center disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
