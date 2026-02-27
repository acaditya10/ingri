"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Static Background Image */}
      <Image
        src="/images/hero-bg.jpg"
        alt="Ingri cafe interior"
        fill
        className="object-cover"
        priority
      />

      {/* FIX: Flat Neutral Black Overlay 
        60% opacity provides enough contrast for the text without 
        distorting the yellow/white colors into a murky green.
      */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Grain texture overlay for depth */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content - Added drop-shadow-lg to the wrapper to force text to pop */}
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto drop-shadow-lg">
        {/* ingri Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8 flex justify-center"
        >
          <Image
            src="/images/logo.png"
            alt="Ingri Logo"
            width={240}
            height={80}
            className="h-16 md:h-24 w-auto object-contain drop-shadow-md"
            priority
            unoptimized
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="section-subtitle mb-6 tracking-widest uppercase text-sm font-medium text-white"
        >
          Global Comfort & Craft Coffee
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="font-playfair text-3xl md:text-5xl text-cream-DEFAULT/90 leading-relaxed mb-12 font-semibold"
        >
          Where art, nature, and
          <br />exceptional food converge
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/reserve" className="teal-button">
            Reserve a Table
          </Link>
          <a href="#story" className="outline-button">
            Our Story
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 drop-shadow-md"
      >
        <span className="section-subtitle text-xs text-white">Scroll</span>
        <div className="w-px h-12 bg-cream-DEFAULT/40 animate-pulse-soft" />
      </motion.div>
    </section>
  );
}