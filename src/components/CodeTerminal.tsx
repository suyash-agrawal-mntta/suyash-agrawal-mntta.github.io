"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const lines = [
  "Initializing AI Engineer Environment...",
  "> Loading modules...",
  "[OK] Python, TypeScript, Node.js loaded.",
  "> Connecting to LLMs...",
  "[OK] OpenAI, Anthropic endpoints secured.",
  "> Booting multi-agent systems.",
  "> Orchestrating Retrieval-Augmented Generation workflows.",
  "[System Ready]. Welcome, User."
];

export default function CodeTerminal() {
  const [displayedText, setDisplayedText] = useState("");
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    if (lineIndex >= lines.length) return;

    let i = 0;
    const currentLine = lines[lineIndex];
    const typingInterval = setInterval(() => {
      if (i <= currentLine.length) {
        setDisplayedText(currentLine.slice(0, i));
        i++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => setLineIndex((prev) => prev + 1), 600); // Wait before next line
      }
    }, 40);

    return () => clearInterval(typingInterval);
  }, [lineIndex]);

  const allPreviousLines = lines.slice(0, lineIndex).join("\n");
  const fullText = allPreviousLines + (allPreviousLines ? "\n" : "") + displayedText;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="w-full max-w-4xl rounded-2xl overflow-hidden bg-black/60 border border-white/10 shadow-2xl font-mono text-sm leading-relaxed backdrop-blur-md"
    >
      {/* Terminal Title Bar */}
      <div className="bg-white/5 px-6 py-4 flex items-center border-b border-white/10">
        <div className="flex gap-2">
          <div className="w-3.5 h-3.5 rounded-full bg-red-500/80"></div>
          <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/80"></div>
          <div className="w-3.5 h-3.5 rounded-full bg-green-500/80"></div>
        </div>
        <div className="mx-auto text-text-muted text-xs tracking-widest uppercase">suyash@ai-core-terminal</div>
      </div>
      
      {/* Terminal Content */}
      <div className="p-8 h-[280px] overflow-y-auto w-full">
        <pre className="whitespace-pre-wrap text-[var(--accent-primary)] drop-shadow-[0_0_8px_color-mix(in_srgb,var(--accent-primary)_60%,transparent)]">
          {fullText}
          <span className="inline-block w-2.5 h-4 align-middle bg-[var(--accent-primary)] animate-pulse ml-1" />
        </pre>
      </div>
    </motion.div>
  );
}
