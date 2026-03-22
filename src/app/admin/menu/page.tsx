"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, writeBatch, deleteDoc, addDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, GripVertical, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { MenuCategory, MenuItem } from "@/types/menu";
import Link from "next/link";
import CategoryModal from "./CategoryModal";
import ItemModal from "./ItemModal";

export default function AdminMenuPage() {
    const [categories, setCategories] = useState<MenuCategory[]>([]);
    const [items, setItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal states
    const [categoryModal, setCategoryModal] = useState<{ open: boolean; category?: MenuCategory | null }>({ open: false });
    const [itemModal, setItemModal] = useState<{ open: boolean; item?: MenuItem | null; categoryId?: string }>({ open: false });

    // Listeners
    useEffect(() => {
        const qCats = query(collection(db, "menuCategories"), orderBy("order", "asc"));
        const unsubCats = onSnapshot(qCats, (snap) => {
            setCategories(snap.docs.map(d => ({ id: d.id, ...d.data() } as MenuCategory)));
        });

        const qItems = query(collection(db, "menuItems"), orderBy("order", "asc"));
        const unsubItems = onSnapshot(qItems, (snap) => {
            setItems(snap.docs.map(d => ({ id: d.id, ...d.data() } as MenuItem)));
            setLoading(false);
        });

        return () => { unsubCats(); unsubItems(); };
    }, []);

    const handleDeleteCategory = async (id: string) => {
        if (!confirm("Are you sure? This will delete all items in this category too!")) return;
        try {
            const batch = writeBatch(db);
            batch.delete(doc(db, "menuCategories", id));
            items.filter(i => i.categoryId === id).forEach(i => {
                batch.delete(doc(db, "menuItems", i.id));
            });
            await batch.commit();
            toast.success("Category deleted");
        } catch (e) {
            toast.error("Failed to delete category");
        }
    };

    const handleDeleteItem = async (id: string) => {
        if (!confirm("Delete this item?")) return;
        try {
            await deleteDoc(doc(db, "menuItems", id));
            toast.success("Item deleted");
        } catch (e) {
            toast.error("Failed to delete item");
        }
    };

    return (
        <div className="min-h-screen bg-teal-dark p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div className="space-y-4">
                        <Link href="/admin" className="flex items-center gap-2 text-teal-muted hover:text-cream-DEFAULT transition-colors text-sm font-dm">
                            <ArrowLeft size={16} /> Back to Dashboard
                        </Link>
                        <div className="flex items-center gap-3">
                            <h1 className="font-playfair text-3xl text-cream-DEFAULT">Menu Management</h1>
                            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-dm">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                Live Sync
                            </span>
                        </div>
                        <p className="font-dm text-teal-muted text-sm mt-1">
                            Changes mirror instantly to the frontend app.
                        </p>
                    </div>
                    <button
                        onClick={() => setCategoryModal({ open: true })}
                        className="teal-button flex items-center gap-2 px-5 py-2.5"
                    >
                        <Plus size={18} /> New Category
                    </button>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => <div key={i} className="h-32 rounded-card bg-cream-DEFAULT/5 animate-pulse" />)}
                    </div>
                ) : categories.length === 0 ? (
                    <div className="glass-card p-16 text-center">
                        <p className="font-playfair text-2xl text-cream-DEFAULT/40">No menu categories yet</p>
                        <p className="font-dm text-teal-muted text-sm mt-2 mb-6">
                            Create your first menu category to get started.
                        </p>
                        <button onClick={() => setCategoryModal({ open: true })} className="teal-button mx-auto flex items-center gap-2 px-5 py-2">
                            <Plus size={16} /> Add Category
                        </button>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <AnimatePresence>
                            {categories.map((cat) => (
                                <motion.div
                                    key={cat.id}
                                    layout
                                    className="glass-card overflow-hidden"
                                >
                                    <div className="p-4 bg-cream-DEFAULT/5 border-b border-cream-DEFAULT/10 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <GripVertical className="text-teal-muted cursor-grab" size={20} />
                                            <h2 className="font-playfair text-xl text-cream-DEFAULT">{cat.title} <span className="text-teal-muted text-sm font-dm opacity-50 ml-2">({cat.layout} grid)</span></h2>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => setCategoryModal({ open: true, category: cat })} className="p-2 text-teal-muted hover:text-cream-DEFAULT transition-colors rounded hover:bg-cream-DEFAULT/10">
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => handleDeleteCategory(cat.id)} className="p-2 text-red-400/70 hover:text-red-400 transition-colors rounded hover:bg-red-400/10">
                                                <Trash2 size={16} />
                                            </button>
                                            <div className="w-px h-6 bg-cream-DEFAULT/10 mx-2" />
                                            <button onClick={() => setItemModal({ open: true, categoryId: cat.id })} className="flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-xs font-dm bg-teal-primary/20 text-teal-primary border border-teal-primary/30 hover:bg-teal-primary/30 transition-colors">
                                                <Plus size={14} /> Add Item
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-4 space-y-2">
                                        {items.filter(i => i.categoryId === cat.id).length === 0 ? (
                                            <div className="py-6 text-center text-teal-muted text-sm font-dm italic">No items in this category.</div>
                                        ) : (
                                            items.filter(i => i.categoryId === cat.id).map(item => (
                                                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-cream-DEFAULT/5 group transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <GripVertical className="text-teal-muted/40 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity" size={16} />
                                                        <div>
                                                            <p className="font-dm text-cream-DEFAULT font-medium">{item.name}</p>
                                                            <p className="font-dm text-teal-muted text-xs line-clamp-1 max-w-lg">{item.description}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-6">
                                                        <span className="font-dm text-cream-DEFAULT text-sm text-right min-w-16">
                                                            {typeof item.price === "number" ? `₹${item.price}` : item.price}
                                                        </span>
                                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button onClick={() => setItemModal({ open: true, item, categoryId: cat.id })} className="p-1.5 text-teal-muted hover:text-cream-DEFAULT">
                                                                <Edit2 size={14} />
                                                            </button>
                                                            <button onClick={() => handleDeleteItem(item.id)} className="p-1.5 text-red-400/70 hover:text-red-400">
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            <CategoryModal
                isOpen={categoryModal.open}
                onClose={() => setCategoryModal({ open: false })}
                category={categoryModal.category}
            />
            <ItemModal
                isOpen={itemModal.open}
                onClose={() => setItemModal({ open: false })}
                item={itemModal.item}
                categoryId={itemModal.categoryId}
            />
        </div>
    );
}
