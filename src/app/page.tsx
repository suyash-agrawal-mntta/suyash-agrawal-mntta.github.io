"use client";

import {
  useEffect,
  useState,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════
   CONSTANTS — Exact Stitch hex codes
   ═══════════════════════════════════════════════════ */
const THEMES = ["default", "lavender", "terracotta"] as const;
type Theme = (typeof THEMES)[number];

const ACCENT_HEX: Record<Theme, string> = {
  default: "#f3ffca",
  lavender: "#f3e8ff",
  terracotta: "#2d3748",
};

const GEAR_IMG =
  "https://lh3.googleusercontent.com/aida/ADBb0ugy3JLjoWQ_oCIfr-BgKZq_DK3IIwhPSN3z3s7WDLsyfR-DhgVD2LRXcxJ9c1UcX40e7W99NDca-q2mGZMd9KNDawK4f5YjGgRUy3CZO0di2rwBe-H_3CpozBMjKyVietuM4xcS8jVBcfC-hAkHDml_97XOpc_sXomdd8i-T21rkmcAnpq8CEdH_cYUcMr2-p2jrjcX1wgCQFYCgRcVS-QxPR2PQrnvngCuCYMsgcZgzSGjO8wZwRjbZI3avw_lUylI0LWozuMO-w";
const CURSOR_IMG =
  "https://lh3.googleusercontent.com/aida/ADBb0ugBrHTDnn47dwLzkZDMKNc--bWExqWT-q2DftNed9HEKvPTRHHg4qKzJz6lPpZ3Wkz4_53FtX0SFohfkmgrlL9ftachF0ysImPHZL_NB_FwndGR3alJxlCLZY7SZMbCO6lnarqDnhulEr8osuek0U7mFlloXLSwCqdfK43kZA3UHqw8_E_ZuGECnwYs4YHxevwYVf5SKN3o8JDFQ6WRlxzYiZT8Ve5utW0NZsSrhtxwxjhSpRsNA8-HJJHQBgcswMMoLqbehFTa3A";
const HERO_IMG =
  "https://lh3.googleusercontent.com/aida/ADBb0ujQac-DUspTADqW5CNhSBgPDCDEAWWqvgbcPpgDUK6buvWS-MNTrutLlmzO17LT26fB97I6yzEW_y8rpuThH8RwLn2NTF0YltlnGcYs9N7nYDxzl7ru5CoFiZpbcYeVD5Zf9lTicwvbpZZOTiYDNYNgqlF8Poe-4i3OXhP8zKNo8PFqOtTQzlxl69mL6NL1rMyLAQ6OScafh-69tZMt2W43NmrrrvY-oxsE4t9mWmWko2ytADTqe-py-aSST4Irb07QEhDeNBpB9A";
const PROJECT_IMGS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuARgG9ISLJI9yFCskESVmqjyw-L-1JJmnD0jpc2fCZUUzsgdEHNyYN_JZa5Ij5HrpFlsc6xZTTquOebim2YBCW5r7YwBq0JmuXBjWN7sR2OzRc9SpSOAfYxNUXkWOW3s5yrXFWvHTpf_MAKeKqtgwwvsICVe4B2KrORA6VMgL_bzKENbsAB5DaTw1HgTsbnpSEoVYr2o3JdQO8IBY-w2uBrMIGU9wRN0jICLY7uPFJv9SLuumXIO7G3InqjoKsLAB9YDj_BfqYTey8",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBO-Fotswg_2rY9lgPPggsuydazGacK0-iV_b8d3jdUf4h44PrwYjEjEkrKjN0nLJMzu6YosHkuK4bzQwAO85_bWOeJNHZD_ybTtiFeu7SgowvuXB5SUeD1E9FVuzyvQZwED4aovAF9NUdq26EKvRH_eM9gBbC3qa8Gwu4BUu6a7e_KGSTB9FxAnYq8C8NW3hSqFe7G1s_62jpKN-DXasQQAjPnjsqMKjcGEs0TShCjpRvb_jhgFgEjfTWrfN2F_7Fi1gJaIosnXg8",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBwK3xo5b_GQYEQ-wrJTFIg0ICxFWlqv7tmhw1ByOUWkK7R9_tDcDEwLRnBTdNni9x36ykxlrcmVlI4jTVBe4u-NM1A4BBPO8FA-wUXK0aNK5QEE-lSMn2BpxEeEqe9NxKhlfx4NOAYNuRvqEIk-_EJQN3wI5Z1KDNOMHac76XLqlThddY0vuJ4S1XH71pWM-qM9VlxkNYaxLXC3zumBvVwp1iwTNjnCQ5aU7LWRMTl0sBnWJm1gRrHPsjalRE0-uvUWzRRxyBdqXo",
];

/* ═══════════════════════════════════════════════════
   TypingText — Exact Stitch: 80ms/char, threshold 0.2
   ═══════════════════════════════════════════════════ */
function TypingText({
  text,
  className,
  speed = 80,
}: {
  text: string;
  className?: string;
  speed?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [display, setDisplay] = useState("");
  const typed = useRef(false);

  useEffect(() => {
    if (isInView && !typed.current) {
      typed.current = true;
      let i = 0;
      const iv = setInterval(() => {
        if (i < text.length) {
          setDisplay(text.slice(0, i + 1));
          i++;
        } else clearInterval(iv);
      }, speed);
      return () => clearInterval(iv);
    }
  }, [isInView, text, speed]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}

/* ═══════════════════════════════════════════════════
   Reveal wrapper — Exact Stitch: 0.8s ease-out, Y:30,
   threshold 0.1
   ═══════════════════════════════════════════════════ */
function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0, 0, 0.58, 1] }}
      viewport={{ once: true, amount: 0.1 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   R3F Scene — Theme-reactive wireframe icosahedron
   ═══════════════════════════════════════════════════ */
function SceneContent({ accentColor }: { accentColor: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const color = useRef(new THREE.Color(accentColor));

  useEffect(() => {
    color.current.set(accentColor);
  }, [accentColor]);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.15;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.25;
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    mat.color.lerp(color.current, 0.05);
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[2.2, 1]} />
      <meshBasicMaterial wireframe color={accentColor} />
    </mesh>
  );
}

/* ═══════════════════════════════════════════════════
   PROJECT MODAL — Exact Stitch structure
   ═══════════════════════════════════════════════════ */
function ProjectModal({
  title,
  desc,
  onClose,
}: {
  title: string;
  desc: string;
  onClose: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-[100]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 modal-backdrop" onClick={onClose} />
      <div className="relative w-full h-full flex items-center justify-center p-8">
        <div className="bg-[var(--surface-variant)] border border-white/10 w-full max-w-6xl h-[85vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl">
          <div className="flex justify-between items-center p-8 border-b border-white/5">
            <h3 className="text-3xl font-headline font-bold text-themed">
              {title}
            </h3>
            <div className="flex gap-4">
              <button className="nav-link px-6 py-2 bg-white/10 text-white text-xs font-bold uppercase rounded-lg hover:bg-white/20 transition-all flex items-center gap-2">
                Open In New Tab{" "}
                <span className="material-symbols-outlined text-sm">
                  open_in_new
                </span>
              </button>
              <button
                className="nav-link w-10 h-10 flex items-center justify-center bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-all"
                onClick={onClose}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>
          <div className="flex-1 p-12 overflow-y-auto">
            <p className="text-xl text-neutral-400 mb-12 max-w-3xl leading-relaxed">
              {desc}
            </p>
            <div className="aspect-video bg-black/40 rounded-2xl border border-white/5 flex items-center justify-center text-neutral-600 italic">
              <div className="text-center">
                <span className="material-symbols-outlined text-6xl mb-4 block">
                  terminal
                </span>
                <p>Interactive Emulator Placeholder</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════ */
export default function Page() {
  /* ── Theme ── */
  const [theme, setTheme] = useState<Theme>("default");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    if (saved && THEMES.includes(saved)) {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    }
  }, []);

  const cycleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = THEMES[(THEMES.indexOf(prev) + 1) % THEMES.length];
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
      return next;
    });
  }, []);

  /* ── Modal ── */
  const [modal, setModal] = useState<{
    title: string;
    desc: string;
  } | null>(null);

  /* ── Refs for imperative scroll logic (exact Stitch JS) ── */
  const progressBarRef = useRef<HTMLDivElement>(null);
  const gearRef = useRef<HTMLImageElement>(null);
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const timelineProgressRef = useRef<HTMLDivElement>(null);
  const horizontalSectionRef = useRef<HTMLElement>(null);
  const projectTrackRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  /* ── Scroll handler: EXACT reproduction of Stitch JS ── */
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const globalPercent = Math.min(Math.max(scrolled / totalHeight, 0), 1);

      /* Top progress bar width */
      if (progressBarRef.current) {
        progressBarRef.current.style.width = globalPercent * 100 + "%";
      }

      /* Gear rotation: scrolled * 2.5 degrees (exact Stitch) */
      if (gearRef.current) {
        gearRef.current.style.transform = `rotate(${scrolled * 2.5}deg)`;
      }

      /* Timeline progress + active nodes */
      const tc = timelineContainerRef.current;
      const tp = timelineProgressRef.current;
      if (tc && tp) {
        const rect = tc.getBoundingClientRect();
        const vc = window.innerHeight / 2;
        if (rect.top < vc) {
          const progress = Math.min(Math.max(vc - rect.top, 0), rect.height);
          tp.style.height = progress + "px";
          const nodes = tc.querySelectorAll(".milestone-node");
          const rows = tc.querySelectorAll(".timeline-row");
          rows.forEach((row, idx) => {
            const rr = row.getBoundingClientRect();
            const rc = rr.top + rr.height / 2;
            if (rc < vc + 50 && rc > vc - 250) {
              nodes[idx]?.classList.add("active");
              row.classList.add("active");
            } else {
              nodes[idx]?.classList.remove("active");
              row.classList.remove("active");
            }
          });
        }
      }

      /* Horizontal project scroll (exact Stitch formula) */
      const hs = horizontalSectionRef.current;
      const pt = projectTrackRef.current;
      if (hs && pt) {
        const hr = hs.getBoundingClientRect();
        if (hr.top <= 0 && hr.bottom >= window.innerHeight) {
          const percent = -hr.top / (hr.height - window.innerHeight);
          const total =
            pt.scrollWidth - window.innerWidth + window.innerWidth * 0.2;
          pt.style.transform = `translateX(-${percent * total}px)`;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ── Custom cursor (exact Stitch) ── */
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const move = (e: MouseEvent) => {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    };

    const hover = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest(
        ".nav-link, a, button, .hover-green, .project-card, .theme-pill"
      );
      if (t) cursor.classList.add("hovering");
      else cursor.classList.remove("hovering");
    };

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseover", hover);
    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", hover);
    };
  }, []);

  /* ═══════════════ JSX ═══════════════ */
  return (
    <>
      {/* ── Custom Cursor ── */}
      <div id="custom-cursor" ref={cursorRef}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="Crosshair" id="cursor-img" src={CURSOR_IMG} />
        <div id="cursor-dot-inner" />
      </div>

      {/* ── Top Progress Bar ── */}
      <div id="top-progress-container">
        <div id="top-progress-bar" ref={progressBarRef}>
          <div id="scroll-gear-container">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Progress Gear"
              id="scroll-gear-img"
              ref={gearRef}
              src={GEAR_IMG}
            />
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════
          HEADER — Exact Stitch:
          px-8 md:px-16 py-6, glass bg, blur-lg
          ════════════════════════════════════ */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-8 md:px-16 py-6 glass-header border-b border-white/5">
        <div className="text-lg font-headline font-bold tracking-tighter text-white uppercase hover-green transition-colors cursor-pointer">
          Suyash.
        </div>
        <nav className="hidden md:flex gap-10 text-[11px] font-bold uppercase tracking-[0.2em] items-center">
          <a
            className="nav-link text-neutral-400 hover:text-accent transition-colors"
            href="#about"
          >
            About
          </a>
          <a
            className="nav-link text-neutral-400 hover:text-accent transition-colors"
            href="#skills"
          >
            Skills
          </a>
          <a
            className="nav-link text-neutral-400 hover:text-accent transition-colors"
            href="#experience"
          >
            Experience
          </a>
          <a
            className="nav-link text-neutral-400 hover:text-accent transition-colors"
            href="#projects"
          >
            Projects
          </a>
        </nav>
        {/* Theme Pill — Exact Stitch HTML: 3 dots, 18×18, border-radius 50% */}
        <div className="flex items-center gap-6">
          <div className="theme-pill nav-link" onClick={cycleTheme}>
            <div
              className={`theme-dot theme-dot-1 ${theme === "default" ? "opacity-100 shadow-[0_0_8px_#f3ffca]" : "opacity-40"}`}
            />
            <div
              className={`theme-dot theme-dot-2 ${theme === "lavender" ? "opacity-100 shadow-[0_0_8px_#e0e7ff]" : "opacity-40"}`}
            />
            <div
              className={`theme-dot theme-dot-3 ${theme === "terracotta" ? "opacity-100 shadow-[0_0_8px_#fca5a5]" : "opacity-40"}`}
            />
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════
          MAIN CONTENT
          ════════════════════════════════════ */}
      <main>
        {/* ── HERO ── min-h-screen, pt-20=80px, px-8=32px */}
        <section
          className="min-h-screen flex items-center justify-center pt-20 px-8"
          id="about"
        >
          <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              {/* Badge: px-3=12px py-1=4px text-[10px] tracking-[0.3em] rounded=4px */}
              <Reveal className="mb-6 inline-block px-3 py-1 bg-accent-10 border border-accent-20 rounded text-[10px] font-bold tracking-[0.3em] text-accent uppercase">
                AI Engineer &amp; Researcher
              </Reveal>

              <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-primary-neon leading-none mb-8 hover-green transition-colors">
                <TypingText text="SUYASH AGRAWAL" />
                <span className="typing-cursor">|</span>
              </h1>

              <Reveal>
                <p className="text-lg md:text-xl text-neutral-400 max-w-xl leading-relaxed">
                  Building resilient{" "}
                  <span className="text-white font-medium">LLM systems</span>{" "}
                  and{" "}
                  <span className="text-white font-medium">
                    Autonomous Agents
                  </span>
                  . Currently architecting intelligent workflows for
                  international scale.
                </p>
              </Reveal>

              {/* Buttons: px-8=32px py-4=16px text-xs=12px gap-6=24px mt-12=48px rounded-lg=8px */}
              <Reveal className="flex gap-6 mt-12">
                <button className="nav-link px-8 py-4 border border-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-white/5 transition-all">
                  Download CV
                </button>
                <button className="nav-link px-8 py-4 bg-[var(--primary)] text-black text-xs font-bold uppercase tracking-widest rounded-lg hover:shadow-[0_0_30px_rgba(243,255,202,0.2)] transition-all">
                  Get in Touch
                </button>
              </Reveal>
            </div>

            {/* Hero image/3D: max-w-md=448px aspect-[3/4] rounded-[2.5rem]=40px */}
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <Reveal className="relative w-full max-w-md aspect-[3/4] rounded-[2.5rem] overflow-hidden hero-img-float hero-img-container">
                <Canvas
                  style={{ position: "absolute", inset: 0 }}
                  camera={{ position: [0, 0, 6] }}
                >
                  <SceneContent accentColor={ACCENT_HEX[theme]} />
                </Canvas>
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-transparent to-transparent pointer-events-none" />
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── SKILLS ── py-32=128px px-8=32px bg-[#080808] */}
        <section
          className="py-32 px-8 border-t border-white/5 bg-surface-dark"
          id="skills"
        >
          <div className="max-w-7xl mx-auto">
            <h2 className="font-headline text-4xl md:text-6xl font-bold text-primary-neon mb-20 hover-green transition-colors">
              <TypingText text="TECHNICAL SKILLS" />
              <span className="typing-cursor">|</span>
            </h2>

            {/* Grid: p-10=40px, border-white/10, text-sm=14px, text-xs=12px, space-y-2=8px */}
            <Reveal>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-white/10">
                {/* AI & Automation */}
                <div className="p-10 border-r border-b border-white/10 hover:bg-accent-5 transition-colors group">
                  <span className="material-symbols-outlined text-accent text-4xl mb-6 block">
                    psychology
                  </span>
                  <h3 className="text-sm font-bold text-white mb-4 tracking-[0.2em] uppercase">
                    AI &amp; Automation
                  </h3>
                  <ul className="space-y-2 text-xs text-neutral-400 font-medium">
                    <li>LLM Orchestration</li>
                    <li>AI Agents</li>
                    <li>Generative AI</li>
                    <li>Prompt Engineering</li>
                    <li>Vercel AI SDK</li>
                    <li>Hugging Face</li>
                  </ul>
                </div>
                {/* Languages */}
                <div className="p-10 border-r border-b border-white/10 hover:bg-accent-5 transition-colors group">
                  <span className="material-symbols-outlined text-accent text-4xl mb-6 block">
                    code
                  </span>
                  <h3 className="text-sm font-bold text-white mb-4 tracking-[0.2em] uppercase">
                    Languages
                  </h3>
                  <ul className="space-y-2 text-xs text-neutral-400 font-medium">
                    <li>TypeScript / JavaScript</li>
                    <li>Python</li>
                    <li>Java</li>
                    <li>SQL</li>
                    <li>HTML / CSS</li>
                  </ul>
                </div>
                {/* Frameworks */}
                <div className="p-10 border-r border-b border-white/10 hover:bg-accent-5 transition-colors group">
                  <span className="material-symbols-outlined text-accent text-4xl mb-6 block">
                    layers
                  </span>
                  <h3 className="text-sm font-bold text-white mb-4 tracking-[0.2em] uppercase">
                    Frameworks
                  </h3>
                  <ul className="space-y-2 text-xs text-neutral-400 font-medium">
                    <li>Next.js / Node.js</li>
                    <li>React</li>
                    <li>Express.js</li>
                    <li>NumPy / Pandas</li>
                    <li>OpenCV</li>
                  </ul>
                </div>
                {/* APIs & Services */}
                <div className="p-10 border-r border-b border-white/10 hover:bg-accent-5 transition-colors group">
                  <span className="material-symbols-outlined text-accent text-4xl mb-6 block">
                    api
                  </span>
                  <h3 className="text-sm font-bold text-white mb-4 tracking-[0.2em] uppercase">
                    APIs &amp; Services
                  </h3>
                  <ul className="space-y-2 text-xs text-neutral-400 font-medium">
                    <li>OpenAI / Anthropic</li>
                    <li>ElevenLabs</li>
                    <li>Spotify / WABA API</li>
                    <li>OAuth 2.0 / REST</li>
                  </ul>
                </div>
                {/* Tools & Cloud — lg:col-span-2 */}
                <div className="p-10 border-r border-b border-white/10 hover:bg-accent-5 transition-colors group lg:col-span-2">
                  <span className="material-symbols-outlined text-accent text-4xl mb-6 block">
                    cloud
                  </span>
                  <h3 className="text-sm font-bold text-white mb-4 tracking-[0.2em] uppercase">
                    Tools &amp; Cloud
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <ul className="space-y-2 text-xs text-neutral-400 font-medium">
                      <li>Git / GitHub</li>
                      <li>Vercel / Render</li>
                      <li>MySQL / Postman</li>
                    </ul>
                    <ul className="space-y-2 text-xs text-neutral-400 font-medium">
                      <li>VS Code</li>
                      <li>Azure AI</li>
                      <li>AWS</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── EXPERIENCE & EDUCATION ── py-32=128px, timeline with cubic-bezier */}
        <section
          className="py-32 px-8 bg-surface overflow-hidden"
          id="experience"
        >
          <div className="max-w-7xl mx-auto relative">
            <div className="flex items-center justify-center mb-32">
              <Reveal className="w-full text-center">
                <h2 className="font-headline text-4xl md:text-6xl font-bold text-primary-neon uppercase">
                  <TypingText text="EXPERIENCE & EDUCATION" />
                  <span className="typing-cursor">|</span>
                </h2>
              </Reveal>
            </div>

            {/* Timeline container — min-h-[1200px] */}
            <div
              className="relative min-h-[1200px]"
              id="timeline-container"
              ref={timelineContainerRef}
            >
              <div className="timeline-line">
                <div id="timeline-progress" ref={timelineProgressRef} />
              </div>

              {/* Item 1: Experience — gap-24=96px mb-48=192px pr-16=64px */}
              <div className="relative grid md:grid-cols-2 gap-24 items-center mb-48 timeline-row group">
                <Reveal className="md:text-right md:pr-16">
                  <div className="text-xs font-bold text-accent tracking-[0.3em] mb-4">
                    JAN 2026 - PRESENT
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-2 hover-green transition-colors">
                    AI Developer Intern
                  </h4>
                  <p className="text-neutral-400 font-medium mb-4">
                    Appiness Interactive Private Limited
                  </p>
                  <p className="text-sm text-neutral-500 leading-relaxed max-w-md md:ml-auto">
                    Developing enterprise-grade agentic workflows and LLM
                    orchestration layers. Focused on improving retrieval accuracy
                    and multi-step reasoning capabilities.
                  </p>
                </Reveal>
                {/* Node: w-4=16px h-4=16px border-2 */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-[var(--primary)] bg-[var(--surface)] milestone-node" />
                <div className="hidden md:block" />
              </div>

              {/* Item 2: B.Tech — p-6=24px rounded-2xl=16px text-xl=20px */}
              <div className="relative grid md:grid-cols-2 gap-24 items-center mb-48 timeline-row group">
                <div className="hidden md:block" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-[var(--primary)] bg-[var(--surface)] milestone-node" />
                <Reveal className="md:pl-16">
                  <div className="text-xs font-bold text-accent tracking-[0.3em] mb-4">
                    2022 - 2026
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-2 hover-green transition-colors">
                    B.Tech CSE (Core)
                  </h4>
                  <p className="text-neutral-400 font-medium mb-4">
                    VIT-AP University
                  </p>
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/5 inline-block">
                    <span className="text-accent font-bold text-xl">
                      8.5 / 10.0
                    </span>{" "}
                    <span className="text-neutral-500 ml-2">CGPA</span>
                  </div>
                </Reveal>
              </div>

              {/* Item 3: Higher Secondary — p-4=16px rounded-xl=12px */}
              <div className="relative grid md:grid-cols-2 gap-24 items-center mb-48 timeline-row group">
                <div className="hidden md:block" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-[var(--primary)] bg-[var(--surface)] milestone-node" />
                <Reveal className="md:pl-16">
                  <div className="text-xs font-bold text-accent tracking-[0.3em] mb-4">
                    2020 - 2022
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-2 hover-green transition-colors">
                    Higher Secondary (CBSE)
                  </h4>
                  <p className="text-neutral-400 font-medium mb-4">
                    Deens Academy
                  </p>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-center gap-4">
                    <span className="text-accent font-bold">92.8%</span>
                    <div className="h-4 w-px bg-white/10" />
                    <span className="text-xs text-neutral-500 uppercase tracking-widest">
                      Graduated with Distinction
                    </span>
                  </div>
                </Reveal>
              </div>

              {/* Item 4: Secondary */}
              <div className="relative grid md:grid-cols-2 gap-24 items-center timeline-row group">
                <div className="hidden md:block" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-[var(--primary)] bg-[var(--surface)] milestone-node" />
                <Reveal className="md:pl-16">
                  <div className="text-xs font-bold text-accent tracking-[0.3em] mb-4">
                    2008 - 2020
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-2 hover-green transition-colors">
                    Secondary (CBSE)
                  </h4>
                  <p className="text-neutral-400 font-medium mb-4">
                    Deens Academy
                  </p>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-center gap-4">
                    <span className="text-accent font-bold">94.4%</span>
                    <div className="h-4 w-px bg-white/10" />
                    <span className="text-xs text-neutral-500 uppercase tracking-widest">
                      Academic Excellence
                    </span>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ── PROJECTS ── horizontal-scroll-container: 350vh, mt: 10vh */}
        <section
          className="horizontal-scroll-container"
          id="projects"
          ref={horizontalSectionRef}
        >
          <div className="sticky-wrapper">
            {/* Title overlay */}
            <div className="absolute top-0 md:top-20 left-0 w-full px-8 md:px-16 z-20">
              <h2 className="font-headline text-5xl md:text-7xl font-bold text-primary-neon uppercase hover-green transition-colors text-left pt-12 md:pt-0">
                <TypingText text="PROJECTS" />
                <span className="typing-cursor">|</span>
              </h2>
            </div>
            {/* Background watermark: text-[20vw] text-white/[0.02] */}
            <div className="absolute left-0 w-full flex justify-center pointer-events-none overflow-hidden">
              <h3 className="font-headline text-[20vw] font-black text-white/[0.02] whitespace-nowrap leading-none select-none">
                FEATURED WORK
              </h3>
            </div>
            {/* Track: gap 3rem=48px, padding 0 10vw, mt-40=160px md:mt-20=80px */}
            <div
              className="project-track mt-40 md:mt-20"
              ref={projectTrackRef}
            >
              {/* Card 1: Music Maestro — 450×600, rounded-2rem=32px, duration-700 */}
              <div
                className="project-card nav-link group"
                onClick={() =>
                  setModal({
                    title: "Music Maestro",
                    desc: "AI-curated adaptive music experience engine.",
                  })
                }
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={PROJECT_IMGS[0]}
                  alt="Music Maestro"
                />
                <div className="project-overlay">
                  <h4 className="text-4xl font-headline font-bold text-white mb-2 group-hover:text-accent transition-colors">
                    Music Maestro
                  </h4>
                  <p className="text-neutral-300 mb-8 text-sm">
                    AI-curated adaptive music experience engine.
                  </p>
                  <div className="flex items-center gap-2 text-accent text-[10px] font-bold uppercase tracking-[0.3em]">
                    Click to Interact{" "}
                    <span className="material-symbols-outlined text-sm">
                      north_east
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 2: Summarix */}
              <div
                className="project-card nav-link group"
                onClick={() =>
                  setModal({
                    title: "Summarix",
                    desc: "LLM-powered executive information distillation tool.",
                  })
                }
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={PROJECT_IMGS[1]}
                  alt="Summarix"
                />
                <div className="project-overlay">
                  <h4 className="text-4xl font-headline font-bold text-white mb-2 group-hover:text-accent transition-colors">
                    Summarix
                  </h4>
                  <p className="text-neutral-300 mb-8 text-sm">
                    LLM-powered executive information distillation tool.
                  </p>
                  <div className="flex items-center gap-2 text-accent text-[10px] font-bold uppercase tracking-[0.3em]">
                    Click to Interact{" "}
                    <span className="material-symbols-outlined text-sm">
                      north_east
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 3: Lane Detection */}
              <div
                className="project-card nav-link group"
                onClick={() =>
                  setModal({
                    title: "Lane Detection",
                    desc: "Computer vision pipeline for navigation.",
                  })
                }
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={PROJECT_IMGS[2]}
                  alt="Lane Detection"
                />
                <div className="project-overlay">
                  <h4 className="text-4xl font-headline font-bold text-white mb-2 group-hover:text-accent transition-colors">
                    Lane Detection
                  </h4>
                  <p className="text-neutral-300 mb-8 text-sm">
                    Computer vision pipeline for navigation.
                  </p>
                  <div className="flex items-center gap-2 text-accent text-[10px] font-bold uppercase tracking-[0.3em]">
                    Click to Interact{" "}
                    <span className="material-symbols-outlined text-sm">
                      north_east
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CERTIFICATIONS ── py-32=128px, w-80=320px, p-8=32px, rounded-2xl=16px */}
        <section className="py-32 px-8 bg-surface border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <Reveal>
              <h2 className="font-headline text-3xl md:text-5xl font-bold tracking-[0.2em] text-primary-neon uppercase mb-16 hover-green transition-colors inline-block">
                <TypingText text="INDUSTRY CERTIFICATIONS" />
                <span className="typing-cursor">|</span>
              </h2>
            </Reveal>
            <Reveal>
              <div
                className="flex gap-8 overflow-x-auto pb-12 scroll-smooth"
                id="cert-container"
              >
                <a
                  className="nav-link flex-shrink-0 w-80 p-8 bg-white/5 border border-white/5 rounded-2xl hover:border-accent-40 transition-all"
                  href="#"
                >
                  <div className="text-[10px] font-bold text-accent mb-4 tracking-[0.2em]">
                    MICROSOFT
                  </div>
                  <h4 className="text-white font-bold mb-2">
                    Azure AI Fundamentals (AI-900)
                  </h4>
                  <p className="text-xs text-neutral-500">
                    Credential ID: AZ-AI900-SUY
                  </p>
                </a>
                <a
                  className="nav-link flex-shrink-0 w-80 p-8 bg-white/5 border border-white/5 rounded-2xl hover:border-accent-40 transition-all"
                  href="#"
                >
                  <div className="text-[10px] font-bold text-accent mb-4 tracking-[0.2em]">
                    AWS
                  </div>
                  <h4 className="text-white font-bold mb-2">
                    AWS Cloud Practitioner
                  </h4>
                  <p className="text-xs text-neutral-500">
                    Amazon Web Services Foundations
                  </p>
                </a>
                <a
                  className="nav-link flex-shrink-0 w-80 p-8 bg-white/5 border border-white/5 rounded-2xl hover:border-accent-40 transition-all"
                  href="#"
                >
                  <div className="text-[10px] font-bold text-accent mb-4 tracking-[0.2em]">
                    GOOGLE
                  </div>
                  <h4 className="text-white font-bold mb-2">
                    Project Management Foundations
                  </h4>
                  <p className="text-xs text-neutral-500">
                    Agile &amp; Waterfall Methodologies
                  </p>
                </a>
                <a
                  className="nav-link flex-shrink-0 w-80 p-8 bg-white/5 border border-white/5 rounded-2xl hover:border-accent-40 transition-all"
                  href="#"
                >
                  <div className="text-[10px] font-bold text-accent mb-4 tracking-[0.2em]">
                    U. OF ILLINOIS
                  </div>
                  <h4 className="text-white font-bold mb-2">
                    Digital Media &amp; Marketing
                  </h4>
                  <p className="text-xs text-neutral-500">
                    Analytics and Consumer Behavior
                  </p>
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ════════════════════════════════════
          FOOTER — bg-[#050505], py-40=160px
          ════════════════════════════════════ */}
      <footer
        className="bg-surface-darker py-40 px-8 border-t border-white/5"
        id="contact"
      >
        <div className="max-w-7xl mx-auto">
          {/* mb-24=96px gap-12=48px */}
          <Reveal className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-24 gap-12">
            <div>
              <h3 className="text-accent font-bold tracking-[0.4em] uppercase mb-4">
                Ready for impact
              </h3>
              <p className="text-neutral-400 font-medium mb-8 max-w-md">
                I&apos;m currently open to full-time roles, contracts, and
                collaborations.
              </p>
              {/* text-7xl=72px md:text-9xl=128px leading-[0.9] */}
              <h2 className="font-headline text-7xl md:text-9xl font-black text-white leading-[0.9] hover-green transition-colors">
                LET&apos;S
                <br />
                CONNECT.
              </h2>
            </div>

            {/* Contact grid: p-6=24px rounded-xl=12px gap-4=16px lg:max-w-xl=576px */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:max-w-xl">
              <a
                className="nav-link p-6 bg-white/5 border border-white/10 rounded-xl hover:border-[var(--primary)] transition-all flex flex-col gap-4 group"
                href="https://linkedin.com/in/suyash-agrawal-mntta"
                target="_blank"
              >
                <svg
                  className="w-6 h-6 fill-accent"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                <span className="text-sm font-bold text-white uppercase tracking-widest group-hover:text-accent transition-colors">
                  LinkedIn
                </span>
              </a>
              <a
                className="nav-link p-6 bg-white/5 border border-white/10 rounded-xl hover:border-[var(--primary)] transition-all flex flex-col gap-4 group"
                href="https://github.com/suyash-agrawal-mntta"
                target="_blank"
              >
                <svg
                  className="w-6 h-6 fill-accent"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <span className="text-sm font-bold text-white uppercase tracking-widest group-hover:text-accent transition-colors">
                  GitHub
                </span>
              </a>
              <a
                className="nav-link p-6 bg-white/5 border border-white/10 rounded-xl hover:border-[var(--primary)] transition-all flex flex-col gap-4 group"
                href="mailto:suyash.mntta@gmail.com"
              >
                <span className="material-symbols-outlined text-accent text-3xl">
                  mail
                </span>
                <span className="text-sm font-bold text-white uppercase tracking-widest group-hover:text-accent transition-colors">
                  Email
                </span>
              </a>
              <a
                className="nav-link p-6 bg-white/5 border border-white/10 rounded-xl hover:border-[var(--primary)] transition-all flex flex-col gap-4 group"
                href="tel:+919981046888"
              >
                <span className="material-symbols-outlined text-accent text-3xl">
                  call
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white uppercase tracking-widest group-hover:text-accent transition-colors">
                    Phone
                  </span>
                  <span className="text-[10px] text-neutral-500 mt-1">
                    (+91) 99810 46888
                  </span>
                </div>
              </a>
            </div>
          </Reveal>

          {/* Bottom bar: mt-32=128px pt-12=48px text-[10px] tracking-[0.4em] */}
          <div className="mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] tracking-[0.4em] text-neutral-600 uppercase">
            <div>© 2026 SUYASH AGRAWAL. ALL RIGHTS RESERVED.</div>
            <div className="mt-4 md:mt-0 hover-green transition-colors">
              DESIGNED FOR INNOVATION &amp; SCALE.
            </div>
          </div>
        </div>
      </footer>

      {/* ── Project Modal ── */}
      <AnimatePresence>
        {modal && (
          <ProjectModal
            title={modal.title}
            desc={modal.desc}
            onClose={() => setModal(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
