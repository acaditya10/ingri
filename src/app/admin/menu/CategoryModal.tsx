"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { MenuCategory } from "@/types/menu";
import { db } from "@/lib/firebase";
import { doc, setDoc, addDoc, collection, updateDoc } from "firebase/firestore";
import { toast } from "sonner";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    category?: MenuCategory | null;
}

export default function CategoryModal({ isOpen, onClose, category }: Props) {
    const [title, setTitle] = useState("");
    const [layout, setLayout] = useState<"standard" | "tall" | "wide">("standard");
    const [order, setOrder] = useState(0);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (category) {
            setTitle(category.title);
            setLayout(category.layout);
            setOrder(category.order || 0);
        } else {
            setTitle("");
            setLayout("standard");
            setOrder(0);
        }
    }, [category, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        setSaving(true);

        try {
            const parentData = { title, layout, order };
            if (category) {
                await updateDoc(doc(db, "menuCategories", category.id), parentData);
                toast.success("Category updated");
            } else {
                await addDoc(collection(db, "menuCategories"), parentData);
                toast.success("Category created");
            }
            onClose();
        } catch (err) {
            toast.error("Failed to save category");
        } finally {
            setSaving(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-teal-dark border border-cream-DEFAULT/10 shadow-2xl z-50 rounded-2xl overflow-hidden"
                    >
                        <div className="p-6 border-b border-cream-DEFAULT/10 flex items-center justify-between">
                            <h2 className="font-playfair text-2xl text-cream-DEFAULT">
                                {category ? "Edit Category" : "New Category"}
                            </h2>
                            <button onClick={onClose} className="p-2 text-teal-muted hover:text-cream-DEFAULT rounded-full hover:bg-cream-DEFAULT/5 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-teal-muted font-dm">Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    className="w-full bg-cream-DEFAULT/5 border border-cream-DEFAULT/10 rounded-lg px-4 py-2.5 text-cream-DEFAULT font-dm focus:outline-none focus:border-teal-primary/50 transition-colors"
                                    placeholder="e.g. Starters"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-teal-muted font-dm">Grid Layout</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {(["standard", "tall", "wide"] as const).map(l => (
                                        <button
                                            key={l}
                                            type="button"
                                            onClick={() => setLayout(l)}
                                            className={`py-3 px-4 rounded-lg font-dm text-sm capitalize border transition-all ${layout === l ? "border-teal-primary text-teal-primary bg-teal-primary/10" : "border-cream-DEFAULT/10 text-teal-muted hover:bg-cream-DEFAULT/5"}`}
                                        >
                                            {l}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-teal-muted font-dm">Sort Order</label>
                                <input
                                    type="number"
                                    value={order}
                                    onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                                    className="w-full bg-cream-DEFAULT/5 border border-cream-DEFAULT/10 rounded-lg px-4 py-2.5 text-cream-DEFAULT font-dm focus:outline-none focus:border-teal-primary/50 transition-colors"
                                />
                                <p className="text-xs text-teal-muted font-dm mt-1">Lower numbers appear first</p>
                            </div>

                            <div className="pt-4 flex items-center justify-end gap-3">
                                <button type="button" onClick={onClose} className="px-5 py-2.5 font-dm text-sm text-teal-muted hover:text-cream-DEFAULT transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={saving} className="teal-button px-6 py-2.5">
                                    {saving ? "Saving..." : "Save Category"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
