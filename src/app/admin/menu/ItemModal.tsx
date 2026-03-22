"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2 } from "lucide-react";
import { MenuItem } from "@/types/menu";
import { db } from "@/lib/firebase";
import { doc, addDoc, collection, updateDoc } from "firebase/firestore";
import { toast } from "sonner";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    item?: MenuItem | null;
    categoryId?: string;
}

export default function ItemModal({ isOpen, onClose, item, categoryId }: Props) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState<number | string>("");
    const [order, setOrder] = useState(0);
    const [dietaryTags, setDietaryTags] = useState<string[]>([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (item) {
            setName(item.name);
            setDescription(item.description);
            setPrice(item.price);
            setOrder(item.order || 0);
            setDietaryTags(item.dietaryTags || []);
        } else {
            setName("");
            setDescription("");
            setPrice("");
            setOrder(0);
            setDietaryTags([]);
        }
    }, [item, isOpen]);

    const toggleTag = (tag: string) => {
        setDietaryTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !categoryId) return;
        setSaving(true);

        try {
            const itemData = {
                name,
                description,
                price: typeof price === 'string' ? parseFloat(price) || price : price,
                order,
                dietaryTags,
                categoryId
            };

            if (item) {
                await updateDoc(doc(db, "menuItems", item.id), itemData);
                toast.success("Item updated");
            } else {
                await addDoc(collection(db, "menuItems"), itemData);
                toast.success("Item created");
            }
            onClose();
        } catch (err) {
            toast.error("Failed to save item");
        } finally {
            setSaving(false);
        }
    };

    const COMMON_TAGS = ["V", "VG", "GF", "DF", "N"];

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
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg max-h-[90vh] overflow-y-auto bg-teal-dark border border-cream-DEFAULT/10 shadow-2xl z-50 rounded-2xl custom-scrollbar"
                    >
                        <div className="p-6 border-b border-cream-DEFAULT/10 flex items-center justify-between sticky top-0 bg-teal-dark/90 backdrop-blur z-10">
                            <h2 className="font-playfair text-2xl text-cream-DEFAULT">
                                {item ? "Edit Item" : "New Item"}
                            </h2>
                            <button onClick={onClose} className="p-2 text-teal-muted hover:text-cream-DEFAULT rounded-full hover:bg-cream-DEFAULT/5 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs uppercase tracking-widest text-teal-muted font-dm">Name</label>
                                    <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-cream-DEFAULT/5 border border-cream-DEFAULT/10 rounded-lg px-4 py-2.5 text-cream-DEFAULT font-dm focus:outline-none focus:border-teal-primary/50 transition-colors" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-teal-muted font-dm">Price</label>
                                    <input required type="text" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full bg-cream-DEFAULT/5 border border-cream-DEFAULT/10 rounded-lg px-4 py-2.5 text-cream-DEFAULT font-dm focus:outline-none focus:border-teal-primary/50 transition-colors" placeholder="e.g. 500" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-teal-muted font-dm">Description</label>
                                <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-cream-DEFAULT/5 border border-cream-DEFAULT/10 rounded-lg px-4 py-2.5 text-cream-DEFAULT font-dm focus:outline-none focus:border-teal-primary/50 transition-colors resize-none" />
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs uppercase tracking-widest text-teal-muted font-dm">Dietary Tags</label>
                                <div className="flex flex-wrap gap-2">
                                    {COMMON_TAGS.map(tag => (
                                        <button
                                            key={tag}
                                            type="button"
                                            onClick={() => toggleTag(tag)}
                                            className={`px-3 py-1 text-xs font-dm rounded-pill transition-colors border ${dietaryTags.includes(tag) ? "border-teal-primary bg-teal-primary/20 text-teal-primary" : "border-cream-DEFAULT/20 text-teal-muted hover:border-cream-DEFAULT/40 hover:text-cream-DEFAULT"}`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2 w-1/3">
                                <label className="text-xs uppercase tracking-widest text-teal-muted font-dm">Sort Order</label>
                                <input type="number" value={order} onChange={(e) => setOrder(parseInt(e.target.value) || 0)} className="w-full bg-cream-DEFAULT/5 border border-cream-DEFAULT/10 rounded-lg px-4 py-2.5 text-cream-DEFAULT font-dm focus:outline-none focus:border-teal-primary/50 transition-colors" />
                            </div>

                            <div className="pt-6 flex items-center justify-end gap-3 sticky bottom-0 bg-teal-dark pb-2">
                                <button type="button" onClick={onClose} className="px-5 py-2.5 font-dm text-sm text-teal-muted hover:text-cream-DEFAULT transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={saving} className="teal-button px-6 py-2.5">
                                    {saving ? "Saving..." : "Save Item"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
