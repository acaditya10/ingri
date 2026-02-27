"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

export default function AmbientToggle() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Free ambient sound: download from https://freesound.org
    // Search "restaurant ambience" or "jazz cafe" — filter by Creative Commons
    // Place at public/audio/ambient.mp3
    audioRef.current = new Audio("/audio/ambient.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.15;

    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const toggle = () => {
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2 }}
      onClick={toggle}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full glass-card 
                 flex items-center justify-center text-cream-DEFAULT/40 
                 hover:text-cream-DEFAULT hover:border-teal-primary/40 
                 transition-all duration-300"
      title={playing ? "Mute ambient sound" : "Play ambient sound"}
    >
      <motion.div
        key={playing ? "on" : "off"}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {playing ? <Volume2 size={16} /> : <VolumeX size={16} />}
      </motion.div>

      {/* Pulse ring when playing */}
      {playing && (
        <motion.div
          className="absolute inset-0 rounded-full border border-teal-primary/30"
          animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
}