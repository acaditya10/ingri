"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export default function OurStory() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="story" ref={ref} className="py-32 px-4 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="aspect-[3/4] relative rounded-card overflow-hidden">
            {/* Make sure to place a photo of Chef Sunil Chauhan 
              at public/images/chef.jpg
            */}
            <Image
              src="/images/chef.jpg"
              alt="Chef Sunil Chauhan at Ingri"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          {/* Accent border */}
          <div className="absolute -bottom-4 -right-4 w-full h-full border border-teal-primary/30 rounded-card -z-10" />
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-8"
        >
          <div>
            <p className="section-subtitle mb-4">Our Story</p>
            <h2 className="section-title">
              A New Chapter
              <br />
              in Global Comfort
            </h2>
          </div>

          <div className="space-y-4 text-cream-DEFAULT/70 font-dm leading-relaxed">
            <p>
              Ingri represents a bold new culinary vision by renowned Chef Sunil Chauhan. Nestled within the creative atmosphere of the Museo Camera Centre, it was born from a desire to create a relaxed, comforting sanctuary where art and exceptional food naturally converge.
            </p>
            <p>
              Stepping away from his celebrated legacy in modern Indian cuisine, Chef Chauhan brings a meticulously crafted European and international cafe experience to life. From authentic wood-fired pizzas to artisanal coffees and naturally sweetened treats, our kitchen combines the warmth of a premium casual dining experience with unparalleled, process-driven precision. Every meal is an invitation to slow down and savor the moment.
            </p>
          </div>

          {/* Pull quote */}
          <blockquote className="border-l-2 border-teal-primary pl-6 italic font-playfair text-xl text-cream-DEFAULT/80">
            &quot;Great food should feel effortless—a comforting pause in your day, crafted with precision and served with warmth.&quot;
          </blockquote>

          <div className="pt-4">
            <p className="font-playfair text-cream-DEFAULT/60 italic">
              — Chef Sunil Chauhan, Founder
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}