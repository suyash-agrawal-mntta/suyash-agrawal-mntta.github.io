"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const themes = ["default", "lavender", "terracotta"];

export default function ThemeToggle() {
  const [themeIndex, setThemeIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme && themes.includes(savedTheme)) {
      const idx = themes.indexOf(savedTheme);
      setThemeIndex(idx);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      document.documentElement.setAttribute("data-theme", "default");
    }
  }, []);

  const cycleTheme = () => {
    const nextIdx = (themeIndex + 1) % themes.length;
    const nextTheme = themes[nextIdx];
    setThemeIndex(nextIdx);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
  };

  if (!mounted) return null;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={cycleTheme}
      className="fixed bottom-8 right-8 z-50 px-6 py-3 rounded-full backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl group flex items-center justify-center gap-3 overflow-hidden"
    >
      <div 
        className="w-3 h-3 rounded-full shadow-[0_0_10px_currentColor] transition-colors duration-500"
        style={{ 
          backgroundColor: 'var(--accent-primary)',
          color: 'var(--accent-primary)'
        }} 
      />
      <div className="relative w-20 h-5 overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={themes[themeIndex]}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute left-0 text-xs font-bold uppercase tracking-widest text-text-main group-hover:text-accent-primary transition-colors"
          >
            {themes[themeIndex]}
          </motion.span>
        </AnimatePresence>
      </div>
    </motion.button>
  );
}
