import fs from "fs";
import path from "path";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import OurStory from "@/components/OurStory";
import DishMarquee from "@/components/DishMarquee";

export default function HomePage() {
  // Read the images directly from the folder on the server
  const imagesDir = path.join(process.cwd(), "public/images/dishes");
  let dishImages: string[] = [];

  try {
    // Get all files in the folder and filter out anything that isn't an image
    const files = fs.readdirSync(imagesDir);
    dishImages = files
      .filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file))
      .map((file) => `/images/dishes/${file}`);
  } catch (error) {
    console.error("Could not read the dishes directory", error);
  }

  return (
    <main className="bg-teal-dark min-h-screen">
      <Navbar />
      <Hero />
      <OurStory />

      {/* The dynamically generated sliding filmstrip */}
      <DishMarquee images={dishImages} />

      {/* CTA section */}
      <section className="py-32 text-center px-4">
        <p className="section-subtitle mb-6">Join Us</p>
        <h2 className="section-title mb-8 max-w-xl mx-auto">
          Ready for a comforting pause?
        </h2>
        {/* Updated to Next.js Link to prevent page reloads and keep music playing */}
        <Link href="/reserve" className="teal-button inline-block">
          Make a Reservation
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-cream-DEFAULT/5 py-16 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left font-dm text-teal-muted text-sm">
          
          {/* Location */}
          <div className="space-y-2">
            <h4 className="text-cream-DEFAULT tracking-widest uppercase text-xs mb-4 font-medium">
              Location
            </h4>
            <p>Museo Camera Centre</p>
            <p>Sector 28, DLF Phase IV</p>
            <p>Gurugram, Haryana 122009</p>
            {/* Google Maps Link */}
            <div className="pt-2">
              <a 
                href="https://www.google.com/maps/dir/?api=1&destination=Museo+Camera+Centre,+Sector+28,+Gurugram" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-teal-muted hover:text-cream-DEFAULT border-b border-teal-muted/30 hover:border-cream-DEFAULT pb-0.5 transition-all duration-300"
              >
                Get Directions
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>

          {/* Hours */}
          <div className="space-y-2">
            <h4 className="text-cream-DEFAULT tracking-widest uppercase text-xs mb-4 font-medium">
              Hours
            </h4>
            <p>Open Daily</p>
            <p>8:00 AM – 10:00 PM</p>
          </div>

          {/* Contact */}
          <div className="space-y-2">
            <h4 className="text-cream-DEFAULT tracking-widest uppercase text-xs mb-4 font-medium">
              Contact
            </h4>
            <p>
              <a 
                href="mailto:contact@ingri.com" 
                className="hover:text-cream-DEFAULT transition-colors duration-300"
              >
                contact@ingri.com
              </a>
            </p>
            <p>
              <a 
                href="tel:+919311415282" 
                className="hover:text-cream-DEFAULT transition-colors duration-300"
              >
                +91 93114 15282
              </a>
            </p> 
          </div>

        </div>

        {/* Copyright */}
        <div className="mt-16 text-center font-dm text-teal-muted/50 text-xs">
          <p>© 2026 ingri. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}