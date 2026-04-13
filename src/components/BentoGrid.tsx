"use client";

import { motion } from "framer-motion";

export default function BentoGrid() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="py-32 px-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-headline text-4xl md:text-5xl font-bold text-[var(--accent-primary)] mb-20 uppercase tracking-wide"
        >
          Technical Capabilities
        </motion.h2>
        
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Bento Box 1 */}
          <motion.div variants={item} className="md:col-span-2 p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <h3 className="text-sm font-bold text-text-main mb-6 tracking-[0.2em] uppercase">AI & Automation</h3>
            <ul className="grid grid-cols-2 gap-4 text-sm text-text-main opacity-80">
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]"/>LLM Orchestration</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]"/>AI Agents</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]"/>Generative AI</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]"/>Prompt Engineering</li>
            </ul>
          </motion.div>
          
          {/* Bento Box 2 */}
          <motion.div variants={item} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <h3 className="text-sm font-bold text-text-main mb-6 tracking-[0.2em] uppercase">Languages</h3>
            <ul className="space-y-4 text-sm text-text-main opacity-80">
              <li>TypeScript / JavaScript</li>
              <li>Python</li>
              <li>Java & SQL</li>
            </ul>
          </motion.div>

          {/* Bento Box 3 */}
          <motion.div variants={item} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <h3 className="text-sm font-bold text-text-main mb-6 tracking-[0.2em] uppercase">Frameworks</h3>
            <ul className="space-y-4 text-sm text-text-main opacity-80">
              <li>Next.js / Node.js</li>
              <li>React / Express.js</li>
              <li>NumPy / Pandas</li>
            </ul>
          </motion.div>

          {/* Bento Box 4 */}
          <motion.div variants={item} className="md:col-span-2 p-8 rounded-3xl border border-[var(--accent-primary)]/30 hover:border-[var(--accent-primary)]/60 transition-colors text-[var(--accent-primary)]" style={{ backgroundColor: 'color-mix(in srgb, var(--accent-primary) 5%, transparent)' }}>
            <h3 className="text-sm font-bold mb-6 tracking-[0.2em] uppercase">Cloud & Tools</h3>
            <div className="grid grid-cols-3 gap-4 text-sm opacity-90">
              <div>Vercel / Render</div>
              <div>AWS / Azure AI</div>
              <div>Git / Postman</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
