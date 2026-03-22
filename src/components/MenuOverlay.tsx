"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { MenuCategory, MenuItem } from "@/types/menu";

interface PopulatedCategory extends MenuCategory {
    items: MenuItem[];
}

interface MenuOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MenuOverlay({ isOpen, onClose }: MenuOverlayProps) {
    const [data, setData] = useState<PopulatedCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

    // Fetch Menu Data
    useEffect(() => {
        if (isOpen && data.length === 0) {
            setLoading(true);
            fetch('/api/menu')
                .then(res => res.json())
                .then(res => {
                    if (res.menu) {
                        setData(res.menu);
                    }
                })
                .finally(() => setLoading(false));
        }
    }, [isOpen, data.length]);

    // Lock body scroll when overlay is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
            setActiveCategoryId(null); // Reset when closed
        }
    }, [isOpen]);

    // Mouse Tracking Glow Effect setup handled in child component <BentoCard>

    const handleCardClick = (id: string) => {
        setActiveCategoryId(prev => prev === id ? null : id);
    };

    const [baseSizeValue, setBaseSizeValue] = useState(150);
    const containerRef = useRef<HTMLDivElement>(null);

    // Calculate optimal square sizes to fit everything on screen
    useEffect(() => {
        if (!isOpen || data.length === 0 || !containerRef.current) return;

        const updateSize = () => {
            const container = containerRef.current;
            if (!container) return;

            const W = container.clientWidth;
            const H = container.clientHeight;

            // Calculate total area "units" required
            let totalAreaUnits = 0;
            data.forEach(cat => {
                if (cat.layout === "wide" || cat.layout === "tall") {
                    totalAreaUnits += 4; // 2x2 square needs 4 units of area
                } else {
                    totalAreaUnits += 1; // 1x1 base square
                }
            });

            // Target packing area with some slack for flex gaps
            const availableArea = W * H * 0.65;

            // Size of 1 unit square S: S^2 * total = Area -> S = sqrt(Area / total)
            let S = Math.floor(Math.sqrt(availableArea / totalAreaUnits));

            // Clamp sizes bounds
            S = Math.max(60, Math.min(S, Math.min(W, H) / 2));
            setBaseSizeValue(S);
        };

        // Initial update and listeners
        updateSize();
        // small timeout to ensure layout painted un-scaled first
        setTimeout(updateSize, 50);
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, [isOpen, data]);

    const getLayoutStyles = (layout: string) => {
        // We output standard inline styles dictating explicit width based on our base size.
        // Aspect-square will ensure height explicitly matches the width making them perfect squares.
        switch (layout) {
            case "wide":
            case "tall":
                // Size 2 box (width = 2x base size + gap)
                return { width: `calc((var(--base-size) * 2) + 0.5rem)` };
            default:
                // Size 1 box
                return { width: `var(--base-size)` };
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-teal-dark/90 backdrop-blur-xl"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 md:top-6 md:right-6 z-50 p-3 bg-cream-DEFAULT/5 hover:bg-cream-DEFAULT/20 rounded-full text-cream-DEFAULT transition-colors"
                    >
                        <X size={24} />
                    </button>

                    <div className="w-full h-full p-4 md:p-8 pt-20 flex flex-col relative">

                        {loading ? (
                            <div className="flex flex-col items-center justify-center text-teal-muted animate-pulse h-full">
                                <div className="w-8 h-8 rounded-full border-t-2 border-r-2 border-teal-primary animate-spin mb-4" />
                                <p className="font-dm text-sm tracking-widest uppercase">Loading Menu...</p>
                            </div>
                        ) : (
                            <div
                                className={`w-full max-w-7xl h-full flex flex-col transition-all duration-700 ${activeCategoryId ? 'opacity-0 scale-95 pointer-events-none absolute' : 'opacity-100 scale-100 relative'}`}
                            >
                                <div className="text-center mb-6 md:mb-8 flex-shrink-0">
                                    <h2 className="font-playfair text-4xl md:text-5xl text-cream-DEFAULT mb-2 md:mb-4">Our Menu</h2>
                                    <p className="font-dm text-teal-muted text-sm md:text-lg max-w-lg mx-auto line-clamp-2 md:line-clamp-none">Explore our carefully curated selection of modern Indian cuisine, designed to comfort and surprise.</p>
                                </div>

                                {/* Mathematics-based Responsive Flex layout */}
                                <div
                                    ref={containerRef}
                                    className="flex flex-wrap content-center justify-center gap-2 md:gap-3 w-full h-[65vh] md:h-[70vh] flex-grow"
                                    style={{
                                        "--base-size": `${baseSizeValue}px`
                                    } as React.CSSProperties}
                                >
                                    {data.map((cat) => (
                                        <BentoCard
                                            key={cat.id}
                                            category={cat}
                                            className="aspect-square flex-shrink-0"
                                            style={getLayoutStyles(cat.layout)}
                                            onClick={() => handleCardClick(cat.id)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Expanded State Layout Animation */}
                        <AnimatePresence>
                            {activeCategoryId && (
                                <ExpandedCard
                                    category={data.find(c => c.id === activeCategoryId)!}
                                    onClose={() => setActiveCategoryId(null)}
                                />
                            )}
                        </AnimatePresence>

                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// ----------------------------------------------------
// Sub-Components
// ----------------------------------------------------

interface BentoCardProps {
    category: PopulatedCategory;
    className?: string;
    style?: React.CSSProperties;
    onClick: () => void;
}

function BentoCard({ category, className, style, onClick }: BentoCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);

    // Mouse tracking effect for glassmorphism
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        cardRef.current.style.setProperty("--mouse-x", `${x}px`);
        cardRef.current.style.setProperty("--mouse-y", `${y}px`);
    };

    // We assign a premium placeholder graphic representation based on title length/layout just to look diverse
    const hue = (category.title.length * 15) % 360;

    return (
        <motion.div
            layoutId={`bento-card-${category.id}`}
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onClick={onClick}
            style={style}
            className={`relative rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer group bg-black/40 border border-cream-DEFAULT/10 bento-card-glow ${className}`}
            whileHover={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            {/* Background Graphic */}
            <div
                className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-700 bg-cover bg-center"
                style={{
                    backgroundImage: `linear-gradient(to bottom, transparent, rgba(9, 23, 23, 0.9)), radial-gradient(circle at 50% 50%, hsl(${hue}, 40%, 30%), transparent)`
                }}
            />

            {/* Glow Effect Element (CSS injected into global via standard plugin or custom styles) */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                    background: 'radial-gradient(800px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(242, 235, 221, 0.06), transparent 40%)'
                }}
            />

            <div className="absolute inset-0 p-3 md:p-5 lg:p-6 flex flex-col justify-end">
                <motion.h3 layoutId={`bento-title-${category.id}`} className="font-playfair text-lg md:text-xl lg:text-2xl text-cream-DEFAULT mb-1 line-clamp-2 leading-tight">
                    {category.title}
                </motion.h3>
                <motion.p layoutId={`bento-count-${category.id}`} className="font-dm text-teal-muted text-[10px] md:text-xs uppercase tracking-widest hidden sm:block">
                    {category.items.length} {category.items.length === 1 ? 'Item' : 'Items'}
                </motion.p>
            </div>
        </motion.div>
    );
}

interface ExpandedCardProps {
    category: PopulatedCategory;
    onClose: () => void;
}

function ExpandedCard({ category, onClose }: ExpandedCardProps) {
    return (
        <motion.div
            layoutId={`bento-card-${category.id}`}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[80vh] bg-teal-dark border border-teal-primary/20 rounded-3xl overflow-hidden shadow-2xl z-50 flex flex-col"
        >
            <div className="relative h-48 md:h-64 flex-shrink-0 bg-black flex items-end p-8 md:p-12 border-b border-cream-DEFAULT/5">
                {/* Close Expanded Button (inside the modal area as well) */}
                <button
                    onClick={(e) => { e.stopPropagation(); onClose(); }}
                    className="absolute top-6 right-6 p-2 bg-black/40 backdrop-blur-md rounded-full text-cream-DEFAULT/60 hover:text-cream-DEFAULT z-20"
                >
                    <X size={20} />
                </button>

                {/* Backdrop */}
                <div
                    className="absolute inset-0 opacity-40 bg-cover bg-center"
                    style={{
                        backgroundImage: `linear-gradient(to top, rgba(9,23,23,1), transparent), radial-gradient(circle at top right, rgba(0,200,150,0.1), transparent)`
                    }}
                />

                <div className="relative z-10">
                    <motion.h3 layoutId={`bento-title-${category.id}`} className="font-playfair text-4xl md:text-5xl text-cream-DEFAULT mb-2">
                        {category.title}
                    </motion.h3>
                    <motion.p layoutId={`bento-count-${category.id}`} className="font-dm text-teal-primary text-sm uppercase tracking-widest">
                        Curated Selection
                    </motion.p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-12 custom-scrollbar space-y-8 bg-teal-dark">
                {category.items.length === 0 ? (
                    <p className="text-teal-muted font-dm italic">No items available in this category currently.</p>
                ) : (
                    category.items.map((item, idx) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + (idx * 0.05) }}
                            key={item.id}
                            className="group flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-cream-DEFAULT/5 last:border-0"
                        >
                            <div className="max-w-2xl">
                                <h4 className="font-dm text-xl text-cream-DEFAULT mb-2 flex items-center gap-3">
                                    {item.name}
                                    {item.dietaryTags && item.dietaryTags.length > 0 && (
                                        <div className="flex items-center gap-1.5 pt-0.5">
                                            {item.dietaryTags.map(tag => (
                                                <span key={tag} title={tag === 'V' ? 'Vegetarian' : tag === 'VG' ? 'Vegan' : tag === 'GF' ? 'Gluten Free' : tag} className="px-1.5 py-0.5 rounded text-[10px] font-bold tracking-widest border border-teal-primary/30 text-teal-primary/80">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </h4>
                                <p className="font-dm text-teal-muted text-sm leading-relaxed">
                                    {item.description}
                                </p>
                            </div>

                            <div className="font-dm text-cream-DEFAULT text-lg whitespace-nowrap md:mb-1 group-hover:text-teal-primary transition-colors">
                                {typeof item.price === "number" ? `₹${item.price}` : item.price}
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </motion.div>
    );
}
