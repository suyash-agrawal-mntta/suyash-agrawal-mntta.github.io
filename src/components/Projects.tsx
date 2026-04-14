"use client";

import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";

const projects = [
  { title: "Music Maestro", desc: "An AI-powered app that turns your mood or prompt into a Spotify playlist automatically." },
  { title: "Summarix", desc: "LLM-powered executive information distillation tool." },
  { title: "Lane Detection", desc: "Computer vision pipeline for navigation." }
];

export default function Projects() {
  return (
    <section className="py-32 px-8 border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="font-headline text-4xl md:text-6xl font-bold text-[var(--accent-primary)] mb-20 uppercase tracking-wide"
        >
          Featured Work
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {projects.map((project, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
              className="group relative h-[450px] rounded-3xl overflow-hidden bg-white/5 border border-white/10"
            >
              {/* 3D Canvas Placeholder for each project */}
              <div className="absolute inset-0 z-0 bg-black/20">
                <Canvas>
                </Canvas>
                <div className="absolute inset-0 flex items-center justify-center text-text-main/20 text-xs tracking-[0.3em] uppercase pointer-events-none font-bold">
                  3D Scene
                </div>
              </div>

              {/* Overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg-primary via-bg-primary/80 to-transparent p-8 flex flex-col justify-end z-10 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                <h4 className="text-2xl font-headline font-bold text-text-main mb-2 group-hover:text-[var(--accent-primary)] transition-colors">
                  {project.title}
                </h4>
                <p className="text-text-main/70 text-sm">{project.desc}</p>
                <div className="mt-6 flex items-center gap-2 text-[var(--accent-primary)] text-[10px] font-bold uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  Click to Interact ↗
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
