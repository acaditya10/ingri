"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
        ? "bg-teal-dark/90 backdrop-blur-md border-b border-cream-DEFAULT/5 py-4"
        : "py-6"
        }`}
    >
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center"
        >
          <Image
            src="/images/logo.png"
            alt="Ingri Logo"
            width={120}
            height={40}
            className="h-8 w-auto object-contain"
            priority
            unoptimized
          />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a
            href="#story"
            className="font-dm text-sm text-cream-DEFAULT/60 hover:text-cream-DEFAULT transition-colors tracking-wide"
          >
            Our Story
          </a>
          <a
            href="#menu"
            className="font-dm text-sm text-cream-DEFAULT/60 hover:text-cream-DEFAULT transition-colors tracking-wide"
          >
            Menu
          </a>
          <Link href="/reserve" className="teal-button py-2.5 px-6 text-sm">
            Reserve
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}