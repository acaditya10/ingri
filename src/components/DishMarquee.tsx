"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function DishMarquee({ images }: { images: string[] }) {
  const [shuffledImages, setShuffledImages] = useState<string[]>([]);

  useEffect(() => {
    // A quick function to randomly shuffle the array
    const shuffleArray = (array: string[]) => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    setShuffledImages(shuffleArray(images));
  }, [images]);

  // Wait until the images are shuffled on the client to prevent Next.js hydration errors
  if (shuffledImages.length === 0) return null;

  // Duplicate to ensure a seamless infinite loop
  const duplicatedDishes = [...shuffledImages, ...shuffledImages];

  return (
    <section className="py-24 overflow-hidden relative">
      <div className="mb-16 text-center px-4">
        <p className="section-subtitle mb-4">From the Kitchen</p>
        <h2 className="font-playfair text-3xl md:text-4xl text-cream-DEFAULT">
          A Taste of Ingri
        </h2>
      </div>

      <div className="relative w-full flex items-center">
        {/* Edge Gradients */}
        <div className="absolute inset-y-0 left-0 w-16 md:w-48 bg-gradient-to-r from-teal-dark to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 md:w-48 bg-gradient-to-l from-teal-dark to-transparent z-10 pointer-events-none" />

        {/* The Sliding Track */}
        <motion.div
          className="flex gap-6 md:gap-8 w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 40, 
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {duplicatedDishes.map((src, index) => (
            <div
              key={index}
              className="relative aspect-square w-64 md:w-80 flex-shrink-0 rounded-card overflow-hidden border border-cream-DEFAULT/5 shadow-2xl group"
            >
              <Image
                src={src}
                alt={`Ingri signature dish ${index + 1}`}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                sizes="(max-width: 768px) 256px, 320px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}