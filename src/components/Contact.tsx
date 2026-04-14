"use client";

import { motion } from "framer-motion";

export default function Contact() {
  return (
    <footer className="footer-gradient py-40 px-8 border-t border-white/5 relative overflow-hidden" style={{ backgroundColor: 'color-mix(in srgb, var(--bg-primary) 98%, black)' }}>
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-24 gap-12"
        >
          <div>
            <h3 className="text-[var(--accent-primary)] font-bold tracking-[0.4em] uppercase mb-4 text-xs">Ready for impact?</h3>
            <p className="text-text-main/70 font-medium mb-8 max-w-md">I'm currently open to full-time roles, contracts, and collaborations.</p>
            <h2 className="font-headline text-6xl md:text-8xl lg:text-9xl font-black text-text-main leading-[0.9] hover:text-[var(--accent-primary)] transition-colors duration-500">LET'S<br/>CONNECT.</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:max-w-xl">
            {['LinkedIn', 'GitHub', 'Email', 'Phone'].map((platform) => (
              <a key={platform} href="#" className="p-6 bg-white/5 border border-white/10 rounded-xl hover:border-[var(--accent-primary)] transition-all flex flex-col gap-4 group">
                <span className="text-sm font-bold text-text-main uppercase tracking-widest group-hover:text-[var(--accent-primary)] transition-colors">{platform}</span>
              </a>
            ))}
          </div>
        </motion.div>
        
        <div className="pt-12 border-t border-white/5 text-[10px] tracking-[0.4em] text-text-main/40 uppercase flex flex-col md:flex-row justify-between items-center gap-4">
          <span>© 2026 SUYASH AGRAWAL. ALL RIGHTS RESERVED.</span>
          <span className="text-center md:text-right hover:text-text-main transition-colors duration-300">DESIGNED FOR INNOVATION & SCALE.</span>
        </div>
      </div>
    </footer>
  );
}
