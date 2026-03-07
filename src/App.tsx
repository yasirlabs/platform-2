/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * LearnX — Warm Editorial Redesign
 * ─────────────────────────────────
 * Aesthetic : Human-crafted, warm editorial — like a premium course catalogue
 * Fonts     : Fraunces (expressive serif display) + Plus Jakarta Sans (clean body)
 * Palette   : Warm cream #FAF7F2, Ink #1C1917, Coral #E85D3F, Sage #6B7B6A, Sand #E8DDD0
 * Motion    : Scroll-triggered stagger reveals, organic hover lifts
 */

import React from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef, FormEvent } from "react";
import {
  Routes, Route, Link, useNavigate, useParams,
  useLocation, useSearchParams,
} from "react-router-dom";
import {
  BookOpen, Award, Users, ChevronRight, Star, Twitter,
  Linkedin, Instagram, Layout, Code, Terminal, ArrowRight,
  Search, Play, CheckCircle, Download, Plus, Trash2, Edit,
  Mail, Phone, MessageSquare, Eye, EyeOff, Filter, Clock,
  BarChart, Menu, X, ArrowUpRight, Sparkles, TrendingUp,
  Globe, Quote,
} from "lucide-react";
import { COURSES, TRAINERS, BLOG_POSTS, MOCK_USER } from "./data";
import { Course, Trainer, BlogPost, Lesson } from "./types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

/* ─── Font & CSS injection ──────────────────────────────────────────────────── */
(() => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap";
  document.head.appendChild(link);

  const s = document.createElement("style");
  s.textContent = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: #FAF7F2;
      color: #1C1917;
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }
    ::selection { background: rgba(232,93,63,0.18); color: #1C1917; }
    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--coral); border-radius: 99px; }

    /* ── Scroll progress bar ── */
    #scroll-progress {
      position: fixed; top: 0; left: 0; right: 0; height: 2px; z-index: 9999;
      background: linear-gradient(90deg, var(--coral), var(--coral-lt));
      transform-origin: left center;
      transform: scaleX(0);
      pointer-events: none;
    }

    /* ── Page transition ── */
    .page-enter { animation: pageEnter 0.55s cubic-bezier(0.22,1,0.36,1) both; }
    @keyframes pageEnter {
      from { opacity: 0; transform: translateY(18px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* ── Section divider ── */
    .section-fade { position: relative; }
    .section-fade::before {
      content: '';
      position: absolute; top: 0; left: 0; right: 0; height: 1px;
      background: linear-gradient(90deg, transparent, var(--border) 30%, var(--border) 70%, transparent);
      pointer-events: none;
    }

    /* ── Button press effect ── */
    .btn-primary, .btn-ghost { position: relative; overflow: hidden; }
    .btn-primary::after, .btn-ghost::after {
      content: ''; position: absolute; inset: 0; border-radius: inherit;
      background: rgba(255,255,255,0.15); opacity: 0;
      transition: opacity 0.2s; pointer-events: none;
    }
    .btn-primary:active::after, .btn-ghost:active::after { opacity: 1; }

    /* ── Card glow variant ── */
    .card { will-change: transform; }
    .card-glow:hover {
      box-shadow: 0 8px 32px rgba(232,93,63,0.10), 0 2px 8px rgba(28,25,23,0.05) !important;
      border-color: rgba(232,93,63,0.18) !important;
    }

    /* ── Parallax image ── */
    .parallax-img { will-change: transform; }

    :root {
      --coral:      #E85D3F;
      --coral-lt:   #FF7A5C;
      --coral-pale: #FEF0EC;
      --ink:        #1C1917;
      --ink-2:      #44403C;
      --ink-3:      #78716C;
      --cream:      #FAF7F2;
      --cream-2:    #F5F0E8;
      --sand:       #E8DDD0;
      --border:     #EDE8E0;
      --shadow-sm:  0 1px 3px rgba(28,25,23,0.06), 0 1px 2px rgba(28,25,23,0.04);
      --shadow-md:  0 4px 16px rgba(28,25,23,0.09), 0 2px 6px rgba(28,25,23,0.05);
      --shadow-lg:  0 16px 48px rgba(28,25,23,0.13), 0 4px 16px rgba(28,25,23,0.06);
      --shadow-coral: 0 8px 32px rgba(232,93,63,0.28);
    }

    body::before {
      content: '';
      position: fixed; inset: 0; pointer-events: none; z-index: 0;
      background-image:
        radial-gradient(ellipse 80% 40% at 10% 0%, rgba(232,93,63,0.04) 0%, transparent 60%),
        radial-gradient(ellipse 60% 50% at 90% 100%, rgba(107,123,106,0.05) 0%, transparent 60%);
    }

    .card {
      background: #fff;
      border: 1px solid var(--border);
      border-radius: 20px;
      box-shadow: var(--shadow-sm);
      transition: box-shadow 0.3s ease, transform 0.3s ease, border-color 0.3s ease;
    }
    .card:hover { box-shadow: var(--shadow-md); border-color: var(--sand); }

    .btn-primary {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 13px 28px;
      background: var(--coral); color: #fff;
      border: none; border-radius: 100px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 0.875rem; font-weight: 600; letter-spacing: 0.01em;
      cursor: pointer; text-decoration: none;
      box-shadow: 0 2px 8px rgba(232,93,63,0.3);
      transition: background 0.2s, transform 0.2s, box-shadow 0.3s;
      white-space: nowrap;
    }
    .btn-primary:hover {
      background: var(--coral-lt);
      transform: translateY(-2px);
      box-shadow: var(--shadow-coral);
    }
    .btn-primary:active { transform: translateY(0); }

    .btn-ghost {
      display: inline-flex; align-items: center; gap: 7px;
      padding: 12px 26px;
      background: transparent; color: var(--ink-2);
      border: 1.5px solid var(--border); border-radius: 100px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 0.875rem; font-weight: 500;
      cursor: pointer; text-decoration: none;
      transition: border-color 0.2s, color 0.2s, background 0.2s;
    }
    .btn-ghost:hover {
      border-color: var(--coral); color: var(--coral);
      background: var(--coral-pale);
    }

    .input {
      width: 100%; padding: 13px 18px;
      background: var(--cream-2); border: 1.5px solid var(--border); border-radius: 14px;
      font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.9rem; color: var(--ink);
      outline: none; transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    }
    .input::placeholder { color: var(--ink-3); }
    .input:focus {
      border-color: var(--coral); box-shadow: 0 0 0 3px rgba(232,93,63,0.1);
      background: #fff;
    }

    .pill {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 5px 13px; background: var(--coral-pale); color: var(--coral);
      border: 1px solid rgba(232,93,63,0.15); border-radius: 100px;
      font-size: 0.72rem; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase;
    }

    .overline {
      font-size: 0.72rem; font-weight: 700;
      letter-spacing: 0.12em; text-transform: uppercase; color: var(--coral);
    }

    .progress-track { height: 5px; border-radius: 99px; background: var(--cream-2); overflow: hidden; }
    .progress-fill {
      height: 100%; border-radius: 99px;
      background: linear-gradient(90deg, var(--coral), var(--coral-lt));
      transition: width 0.6s cubic-bezier(0.4,0,0.2,1);
    }

    .arrow-link {
      display: inline-flex; align-items: center; gap: 6px;
      color: var(--coral); font-weight: 600; font-size: 0.875rem;
      cursor: pointer; border: none; background: none;
      font-family: 'Plus Jakarta Sans', sans-serif; transition: gap 0.2s;
    }
    .arrow-link:hover { gap: 11px; }

    @media (max-width: 768px) {
      .hide-mobile { display: none !important; }
      .show-mobile { display: flex !important; }
      .col-2 { grid-template-columns: 1fr !important; }
      .col-3 { grid-template-columns: 1fr !important; }
    }
    @media (min-width: 769px) { .show-mobile { display: none !important; } }
  `;
  document.head.appendChild(s);
})();

/* ─── Motion constants ──────────────────────────────────────────────────────── */
const EASE_EXPO = [0.16, 1, 0.3, 1] as const;

/* ─── Scroll-triggered reveal ───────────────────────────────────────────────── */
const Reveal: React.FC<{
  delay?: number; y?: number; scale?: boolean;
  className?: string; style?: React.CSSProperties;
}> = ({ children, delay = 0, y = 28, scale = false, className = "", style = {} }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y, scale: scale ? 0.97 : 1 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.72, delay, ease: EASE_EXPO }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
};

/* ─── Stagger list ──────────────────────────────────────────────────────────── */
const StaggerGrid: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; className?: string }> = ({ children, style = {}, className = "" }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } } }}
      style={style}
      className={className}
    >
      {children}
    </motion.div>
  );
};
const StaggerItem: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 26, scale: 0.98 },
      show:   { opacity: 1, y: 0, scale: 1, transition: { duration: 0.65, ease: EASE_EXPO } },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

/* ─── Scroll progress bar ───────────────────────────────────────────────────── */
const ScrollProgress = () => {
  useEffect(() => {
    const bar = document.getElementById("scroll-progress");
    if (!bar) return;
    const update = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${total > 0 ? window.scrollY / total : 0})`;
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return <div id="scroll-progress" />;
};

/* ─── Parallax hook ─────────────────────────────────────────────────────────── */
const useParallax = (factor = 0.15) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * factor;
      const img = el.querySelector(".parallax-img") as HTMLElement | null;
      if (img) img.style.transform = `translateY(${offset}px)`;
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, [factor]);
  return ref;
};

/* ═══════════════════════════════════════════════════════════ NAVBAR */
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const user = MOCK_USER;

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (q.trim()) { navigate(`/courses?search=${q}`); setMobileOpen(false); }
  };

  const links = [
    { to: "/", label: "Home" }, { to: "/courses", label: "Courses" },
    { to: "/blog", label: "Blog" }, { to: "/contact", label: "Contact" },
  ];

  const navLinkStyle = (base: React.CSSProperties = {}): React.CSSProperties => ({
    textDecoration: "none", color: "var(--ink-2)", fontSize: "0.875rem",
    fontWeight: 500, transition: "color 0.2s", ...base,
  });

  return (
    <>
      <motion.nav
        initial={{ y: -72 }} animate={{ y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          padding: scrolled ? "10px 0" : "16px 0",
          background: scrolled ? "rgba(250,247,242,0.93)" : "transparent",
          backdropFilter: scrolled ? "blur(18px)" : "none",
          borderBottom: scrolled ? "1px solid var(--border)" : "none",
          transition: "all 0.3s ease",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "baseline", gap: 2 }}>
            <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "1.45rem", color: "var(--coral)", letterSpacing: "-0.02em" }}>Learn</span>
            <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 400, fontStyle: "italic", fontSize: "1.45rem", color: "var(--ink)", letterSpacing: "-0.02em" }}>X</span>
          </Link>

          <div className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: 32 }}>
            {links.map(l => (
              <Link key={l.to} to={l.to} style={navLinkStyle()}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--coral)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--ink-2)")}
              >{l.label}</Link>
            ))}
          </div>

          <div className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <form onSubmit={handleSearch} style={{ position: "relative" }}>
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search courses…"
                style={{ padding: "9px 18px 9px 38px", background: "var(--cream-2)", border: "1.5px solid var(--border)", borderRadius: 100, fontSize: "0.83rem", color: "var(--ink)", fontFamily: "'Plus Jakarta Sans',sans-serif", outline: "none", width: 200, transition: "border-color 0.2s, width 0.3s" }}
                onFocus={e => { e.currentTarget.style.borderColor = "var(--coral)"; e.currentTarget.style.width = "240px"; }}
                onBlur={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.width = "200px"; }}
              />
              <Search style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, color: "var(--ink-3)" }} />
            </form>
            {user ? (
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <Link to="/dashboard" style={navLinkStyle()}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--coral)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "var(--ink-2)")}
                >Dashboard</Link>
                <Link to="/profile">
                  <img src={user.avatar} alt={user.name} style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--coral)", display: "block" }} />
                </Link>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 10 }}>
                <Link to="/login" className="btn-ghost" style={{ padding: "9px 22px" }}>Log in</Link>
                <Link to="/register" className="btn-primary" style={{ padding: "9px 22px" }}>Get started</Link>
              </div>
            )}
          </div>

          <button className="show-mobile" onClick={() => setMobileOpen(o => !o)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink)", padding: 4 }}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.22 }}
            style={{ position: "fixed", top: 60, left: 0, right: 0, zIndex: 99, background: "rgba(250,247,242,0.98)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)", padding: "18px 24px 26px" }}
          >
            <form onSubmit={handleSearch} style={{ position: "relative", marginBottom: 18 }}>
              <input className="input" placeholder="Search courses…" value={q} onChange={e => setQ(e.target.value)} />
              <Search style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "var(--ink-3)", width: 15, height: 15 }} />
            </form>
            {links.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)}
                style={{ display: "block", padding: "13px 0", color: "var(--ink)", textDecoration: "none", fontSize: "1rem", fontWeight: 500, borderBottom: "1px solid var(--border)" }}
              >{l.label}</Link>
            ))}
            <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
              <Link to="/login" className="btn-ghost" onClick={() => setMobileOpen(false)} style={{ flex: 1, justifyContent: "center" }}>Log in</Link>
              <Link to="/register" className="btn-primary" onClick={() => setMobileOpen(false)} style={{ flex: 1, justifyContent: "center" }}>Sign up</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

/* ═══════════════════════════════════════════════════════════ HERO */
const Hero = () => {
  const parallaxRef = useParallax(0.12);
  const stats = [
    { n: "250+", label: "Active learners" },
    { n: "40+",  label: "Expert trainers" },
    { n: "98%",  label: "Satisfaction rate" },
  ];
  return (
    <section style={{ position: "relative", paddingTop: 96, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 70% 60% at 75% 40%, rgba(232,93,63,0.07) 0%, transparent 65%)" }} />
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>

        <Reveal delay={0} style={{ display: "flex", justifyContent: "center", marginBottom: 38 }}>
          
        </Reveal>

        <Reveal delay={0.07} y={30} style={{ textAlign: "center" }}>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(2.8rem, 6vw, 5rem)", fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.03em", color: "var(--ink)", maxWidth: 780, margin: "0 auto 26px" }}>
            Learning new{" "}
            <em style={{ color: "var(--coral)", fontStyle: "italic", fontWeight: 600 }}>skills</em>
            {" "}online<br />is now much easier
          </h1>
        </Reveal>

        <Reveal delay={0.13} style={{ textAlign: "center" }}>
          <p style={{ maxWidth: 500, margin: "0 auto 38px", color: "var(--ink-3)", fontSize: "1.05rem", lineHeight: 1.75 }}>
            We believe in skills over knowledge. Every course is built around practical mastery — not just theory.
          </p>
        </Reveal>

        <Reveal delay={0.18} style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap", marginBottom: 54 }}>
          <Link to="/courses" className="btn-primary" style={{ fontSize: "0.95rem", padding: "14px 32px" }}>
            Explore courses <ChevronRight size={16} />
          </Link>
          <Link to="/dashboard" className="btn-ghost" style={{ fontSize: "0.95rem", padding: "14px 32px" }}>
            <Play size={14} /> Watch preview
          </Link>
        </Reveal>

        <Reveal delay={0.23} style={{ display: "flex", justifyContent: "center", gap: 48, flexWrap: "wrap", marginBottom: 60 }}>
          {stats.map((s, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.28 + i * 0.1, ease: EASE_EXPO }}
              style={{ textAlign: "center" }}
            >
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: "2rem", fontWeight: 700, color: "var(--ink)", lineHeight: 1 }}>{s.n}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--ink-3)", marginTop: 5, fontWeight: 500 }}>{s.label}</div>
            </motion.div>
          ))}
        </Reveal>

        <Reveal delay={0.28} y={40}>
          <div ref={parallaxRef} style={{ position: "relative", borderRadius: "28px 28px 0 0", overflow: "hidden", maxHeight: 520 }}>
            <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1400"
              alt="Students learning" className="parallax-img" style={{ width: "100%", height: 560, objectFit: "cover", objectPosition: "center 30%", display: "block", willChange: "transform", marginBottom: -40 }} referrerPolicy="no-referrer" />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 160, background: "linear-gradient(to top, var(--cream) 0%, transparent 100%)" }} />

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75, duration: 0.45 }}
              className="card" style={{ position: "absolute", top: 24, right: 24, padding: "15px 18px", borderRadius: 18, display: "flex", alignItems: "center", gap: 11 }}
            >
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--coral-pale)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <TrendingUp size={17} style={{ color: "var(--coral)" }} />
              </div>
              <div>
                <div style={{ fontSize: "0.68rem", color: "var(--ink-3)" }}>Avg. completion</div>
                <div style={{ fontSize: "1rem", fontWeight: 700 }}>94.3%</div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.88, duration: 0.45 }}
              className="card" style={{ position: "absolute", bottom: 36, left: 24, padding: "13px 17px", borderRadius: 18, display: "flex", alignItems: "center", gap: 10 }}
            >
              <div style={{ display: "flex" }}>
                {[1,2,3].map(i => <img key={i} src={`https://i.pravatar.cc/40?u=${i+20}`}
                  style={{ width: 27, height: 27, borderRadius: "50%", border: "2px solid #fff", marginLeft: i > 1 ? -8 : 0, objectFit: "cover" }} referrerPolicy="no-referrer" />)}
              </div>
              <div>
                <div style={{ fontSize: "0.68rem", color: "var(--ink-3)" }}>Joined this week</div>
                <div style={{ fontSize: "0.83rem", fontWeight: 600 }}>+47 new learners</div>
              </div>
            </motion.div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════ CATEGORIES */
const Categories = () => {
  const cats = [
    { name: "Programming", icon: Code, count: 120 },
    { name: "Design", icon: Layout, count: 85 },
    { name: "Business", icon: BarChart, count: 45 },
    { name: "Marketing", icon: Users, count: 60 },
    { name: "Data Science", icon: Terminal, count: 30 },
    { name: "Global Skills", icon: Globe, count: 28 },
  ];
  return (
    <section className="section-fade" style={{ padding: "80px 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <Reveal style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 40, flexWrap: "wrap", gap: 12 }}>
          <div>
            <div className="overline" style={{ marginBottom: 8 }}>Browse by topic</div>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.6rem, 2.5vw, 2.1rem)", fontWeight: 700, letterSpacing: "-0.02em" }}>
              Top <em style={{ color: "var(--coral)" }}>categories</em>
            </h2>
          </div>
          <Link to="/courses" className="arrow-link">All courses <ArrowRight size={15} /></Link>
        </Reveal>
        <StaggerGrid style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 14 }}>
          {cats.map((cat, i) => (
            <StaggerItem key={i}>
              <motion.div whileHover={{ y: -5, scale: 1.015 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }} className="card card-glow"
                style={{ padding: "24px 18px", textAlign: "center", cursor: "pointer", borderRadius: 18 }}
              >
                <div style={{ width: 46, height: 46, borderRadius: 13, background: "var(--coral-pale)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                  <cat.icon size={20} style={{ color: "var(--coral)" }} />
                </div>
                <div style={{ fontWeight: 600, fontSize: "0.875rem", marginBottom: 4 }}>{cat.name}</div>
                <div style={{ fontSize: "0.74rem", color: "var(--ink-3)" }}>{cat.count} courses</div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════ AREAS */
const AreasOfInvolvement = () => {
  const areas = [
    { n: "01", title: "Expert Courses", icon: BookOpen, desc: "Access pre-recorded courses built by industry professionals. Develop practical skills at your own pace." },
    { n: "02", title: "Certification", icon: Award, desc: "Earn verified certificates after completing courses and exams. Demonstrate your skills to the world." },
    { n: "03", title: "Industrial Training", icon: Users, desc: "Hands-on programs developed with real companies. The practical edge that sets you apart." },
  ];
  return (
    <section className="section-fade" style={{ background: "var(--cream-2)", padding: "96px 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <Reveal style={{ textAlign: "center", marginBottom: 60 }}>
          <div className="overline" style={{ marginBottom: 12 }}>What we offer</div>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.9rem, 3vw, 2.6rem)", fontWeight: 700, letterSpacing: "-0.02em", maxWidth: 520, margin: "0 auto 16px" }}>
            Areas of <em style={{ color: "var(--coral)" }}>involvement</em>
          </h2>
          <p style={{ color: "var(--ink-3)", maxWidth: 480, margin: "0 auto", lineHeight: 1.75 }}>
            LearnX gives you multiple pathways to grow — choose the one that fits your ambition.
          </p>
        </Reveal>
        <StaggerGrid style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 20 }}>
          {areas.map((a, i) => (
            <StaggerItem key={i}>
              <motion.div whileHover={{ y: -6, scale: 1.012 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }} className="card card-glow"
                style={{ padding: "36px 32px", borderRadius: 22, position: "relative", height: "100%" }}
              >
                <span style={{ position: "absolute", top: 18, right: 22, fontFamily: "'Fraunces', serif", fontSize: "3.2rem", fontWeight: 700, color: "var(--sand)", lineHeight: 1, userSelect: "none" }}>{a.n}</span>
                <div style={{ width: 52, height: 52, borderRadius: 15, background: "var(--coral-pale)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                  <a.icon size={22} style={{ color: "var(--coral)" }} />
                </div>
                <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.2rem", fontWeight: 700, marginBottom: 12, letterSpacing: "-0.01em" }}>{a.title}</h3>
                <p style={{ color: "var(--ink-3)", fontSize: "0.9rem", lineHeight: 1.75 }}>{a.desc}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════ MENTORSHIP */
const Mentorship = () => {
  const parallaxRef = useParallax(0.1);
  return (
  <section className="section-fade" style={{ padding: "96px 24px" }}>
    <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }} className="col-2">
      <Reveal>
        <div style={{ position: "relative" }}>
          <div ref={parallaxRef} style={{ borderRadius: 28, overflow: "hidden", aspectRatio: "4/3" }}>
            <img src="src/public/images/team.png"
              alt="Mentorship" className="parallax-img" style={{ width: "100%", height: "115%", objectFit: "cover", display: "block", willChange: "transform", marginTop: "-7.5%" }} referrerPolicy="no-referrer" />
          </div>
          <div style={{ position: "absolute", bottom: -20, right: -20, width: 130, height: 130, borderRadius: 20, background: "var(--coral-pale)", border: "1px solid rgba(232,93,63,0.15)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3 }}>
            <span style={{ fontFamily: "'Fraunces', serif", fontSize: "2.2rem", fontWeight: 700, color: "var(--coral)", lineHeight: 1 }}>3×</span>
            <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--ink-2)", textAlign: "center", lineHeight: 1.4 }}>Live sessions<br />per week</span>
          </div>
        </div>
      </Reveal>
      <Reveal delay={0.14}>
        <div>
          <div className="overline" style={{ marginBottom: 14 }}>Mentorship program</div>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(2rem, 3vw, 2.8rem)", fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: 20 }}>
            The best 1-on-1<br /><em style={{ color: "var(--coral)" }}>mentorship</em> you can get
          </h2>
          <p style={{ color: "var(--ink-3)", lineHeight: 1.8, fontSize: "0.95rem", marginBottom: 28 }}>
            Placements near? No worries. LearnX prepares you with algorithms, system design, and real-world problem solving. Our mentors give you the edge you need.
          </p>
          {["Personalised learning roadmap","Weekly 1-on-1 sessions","Mock interviews with real feedback"].map((item, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: EASE_EXPO }}
              style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 13 }}
            >
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--coral-pale)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <CheckCircle size={13} style={{ color: "var(--coral)" }} />
              </div>
              <span style={{ fontSize: "0.9rem", color: "var(--ink-2)" }}>{item}</span>
            </motion.div>
          ))}
          <Link to="/contact" className="btn-primary" style={{ marginTop: 30, textDecoration: "none" }}>
            Book a mentor <ArrowRight size={16} />
          </Link>
        </div>
      </Reveal>
    </div>
  </section>
  );
};

/* ═══════════════════════════════════════════════════════════ MASTERY BUNDLES */
const MasteryBundles = () => {
  const bundles = [
    { title: "Graphic Design", icon: Layout, bg: "#EFF6FF", ic: "#3B82F6", tag: "Most popular" },
    { title: "Web Development", icon: Code, bg: "#F5F3FF", ic: "#8B5CF6", tag: "Best value" },
    { title: "Python Mastery", icon: Terminal, bg: "#FFF7ED", ic: "#F97316", tag: "Career-ready" },
  ];
  return (
    <section className="section-fade" style={{ background: "var(--cream-2)", padding: "96px 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <Reveal style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 52, flexWrap: "wrap", gap: 16 }}>
          <div>
            <div className="overline" style={{ marginBottom: 12 }}>Bundles</div>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.9rem, 3vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.02em" }}>
              Our <em style={{ color: "var(--coral)" }}>mastery</em> bundles
            </h2>
          </div>
          <Link to="/courses" className="btn-ghost" style={{ textDecoration: "none" }}>Browse all <ArrowUpRight size={14} /></Link>
        </Reveal>
        <StaggerGrid style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 22 }}>
          {bundles.map((b, i) => (
            <StaggerItem key={i}>
              <motion.div whileHover={{ y: -7, scale: 1.015 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }} className="card card-glow"
                style={{ padding: "32px", borderRadius: 22, position: "relative", overflow: "hidden" }}
              >
                <div style={{ position: "absolute", top: 18, right: 18 }}>
                  <span style={{ fontSize: "0.68rem", fontWeight: 700, padding: "4px 10px", background: "var(--cream-2)", color: "var(--ink-3)", borderRadius: 100, border: "1px solid var(--border)" }}>{b.tag}</span>
                </div>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: b.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                  <b.icon size={24} style={{ color: b.ic }} />
                </div>
                <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.15rem", fontWeight: 700, marginBottom: 8, letterSpacing: "-0.01em" }}>{b.title}</h3>
                <p style={{ color: "var(--ink-3)", fontSize: "0.875rem", lineHeight: 1.7, marginBottom: 22 }}>
                  A complete programme covering all fundamentals and advanced techniques. Certificate included.
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 22 }}>
                  {[1,2,3,4].map(j => <div key={j} style={{ height: 4, flex: 1, borderRadius: 99, background: j <= 3 ? "var(--coral)" : "var(--sand)", opacity: j <= 3 ? 1 : 0.5 }} />)}
                  <span style={{ fontSize: "0.7rem", color: "var(--ink-3)", marginLeft: 3, whiteSpace: "nowrap" }}>12 modules</span>
                </div>
                <Link to="/courses" className="btn-primary" style={{ width: "100%", justifyContent: "center", textDecoration: "none" }}>Enroll now</Link>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════ TRAINERS */
const TrainerList = () => (
  <section className="section-fade" style={{ padding: "96px 24px" }}>
    <div style={{ maxWidth: 1280, margin: "0 auto" }}>
      <Reveal style={{ textAlign: "center", marginBottom: 56 }}>
        <div className="overline" style={{ marginBottom: 12 }}>The team</div>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.9rem, 3vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.02em" }}>
          Meet our <em style={{ color: "var(--coral)" }}>trainers</em>
        </h2>
      </Reveal>
      <StaggerGrid style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
        {TRAINERS.map(trainer => (
          <StaggerItem key={trainer.id}>
            <motion.div whileHover={{ y: -6, scale: 1.012 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }} className="card card-glow" style={{ padding: "32px 24px", borderRadius: 22, textAlign: "center" }}>
              <motion.div
                style={{ position: "relative", width: 80, height: 80, margin: "0 auto 18px" }}
                whileInView={{ scale: [0.85, 1.05, 1] }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: EASE_EXPO }}
              >
                <img src={trainer.avatar} alt={trainer.name} style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: "3px solid var(--sand)" }} />
                <div style={{ position: "absolute", bottom: 0, right: 0, width: 20, height: 20, borderRadius: "50%", background: "var(--coral)", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <CheckCircle size={11} style={{ color: "#fff" }} />
                </div>
              </motion.div>
              <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.05rem", fontWeight: 700, marginBottom: 5, letterSpacing: "-0.01em" }}>{trainer.name}</h3>
              <p style={{ fontSize: "0.8rem", color: "var(--coral)", fontWeight: 600, marginBottom: 12 }}>{trainer.specialty}</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, color: "var(--ink-3)", fontSize: "0.78rem", marginBottom: 20 }}>
                <BookOpen size={13} /><span>{trainer.coursesCount} courses</span>
              </div>
              <Link to={`/trainer/${trainer.id}`} className="btn-ghost" style={{ textDecoration: "none", fontSize: "0.8rem", padding: "9px 20px" }}>View profile</Link>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerGrid>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════ TESTIMONIALS */
const Testimonials = () => {
  const reviews = [
    { name: "Sarah Jenkins", role: "UX Designer", avatar: "https://i.pravatar.cc/150?u=2", rating: 5, quote: "LearnX genuinely transformed my career. The design course gave me the real-world skills I needed — I landed my dream role within three months." },
    { name: "Michael Chen", role: "Backend Engineer", avatar: "https://i.pravatar.cc/150?u=2", rating: 5, quote: "The Python mastery bundle is exceptional. Real projects, real mentors, real outcomes. Hired at a Series B startup shortly after completing it." },
    { name: "Priya Sharma", role: "Data Analyst", avatar: "https://i.pravatar.cc/150?u=2", rating: 5, quote: "1-on-1 mentorship sets LearnX apart. My mentor helped me build a portfolio that got me interviews at top companies across the country." },
  ];
  return (
    <section className="section-fade" style={{ background: "var(--cream-2)", padding: "96px 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <Reveal style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="overline" style={{ marginBottom: 12 }}>Student stories</div>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.9rem, 3vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.02em" }}>
            What our <em style={{ color: "var(--coral)" }}>students say</em>
          </h2>
        </Reveal>
        <StaggerGrid style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 20 }}>
          {reviews.map((r, i) => (
            <StaggerItem key={i}>
              <motion.div whileHover={{ y: -5, scale: 1.012 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }} className="card card-glow" style={{ padding: "30px 26px", borderRadius: 22, height: "100%", display: "flex", flexDirection: "column" }}>
                <Quote size={26} style={{ color: "var(--sand)", marginBottom: 16, flexShrink: 0 }} />
                <p style={{ color: "var(--ink-2)", lineHeight: 1.8, fontSize: "0.9rem", flex: 1, marginBottom: 22 }}>{r.quote}</p>
                <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
                  {Array.from({ length: r.rating }).map((_, j) => <Star key={j} size={13} style={{ color: "#F59E0B", fill: "#F59E0B" }} />)}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                  <img src={r.avatar} style={{ width: 42, height: 42, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--sand)" }} referrerPolicy="no-referrer" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.875rem" }}>{r.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--coral)", fontWeight: 500 }}>{r.role}</div>
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════ CTA */
const CTA = () => (
  <section className="section-fade" style={{ padding: "80px 24px 96px" }}>
    <div style={{ maxWidth: 1280, margin: "0 auto" }}>
      <Reveal scale>
        <div style={{ background: "var(--ink)", borderRadius: 32, padding: "clamp(48px,6vw,80px) clamp(28px,5vw,80px)", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-30%", right: "-5%", width: "40%", paddingBottom: "40%", borderRadius: "50%", background: "radial-gradient(circle, rgba(232,93,63,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "-30%", left: "-5%", width: "35%", paddingBottom: "35%", borderRadius: "50%", background: "radial-gradient(circle, rgba(107,123,106,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--coral)", marginBottom: 16 }}>Still not sure?</div>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 700, color: "#fff", lineHeight: 1.18, letterSpacing: "-0.02em", maxWidth: 540, margin: "0 auto 16px" }}>
              Let us <em style={{ color: "var(--coral)" }}>reach out</em><br />and guide you
            </h2>
            <p style={{ color: "rgba(255,255,255,0.5)", maxWidth: 440, margin: "0 auto 38px", lineHeight: 1.75, fontSize: "0.95rem" }}>
              Our advisors will personally walk you through the right courses and help you make the best choice for your career.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/contact" className="btn-primary" style={{ textDecoration: "none", fontSize: "0.95rem", padding: "14px 32px" }}>
                Request a call <Phone size={15} />
              </Link>
              <Link to="/courses" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 30px", borderRadius: 100, textDecoration: "none", border: "1.5px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)", fontSize: "0.95rem", fontWeight: 500, fontFamily: "'Plus Jakarta Sans',sans-serif", transition: "border-color 0.2s, color 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
              >Browse courses</Link>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════ FOOTER */
const Footer = () => (
  <motion.footer
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.6, ease: EASE_EXPO }}
    style={{ background: "var(--ink)", color: "rgba(255,255,255,0.5)", paddingTop: 68, paddingBottom: 32 }}
  >
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 52 }} className="col-2">
        <div>
          <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "baseline", gap: 2, marginBottom: 16 }}>
            <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "1.4rem", color: "var(--coral)" }}>Learn</span>
            <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 400, fontStyle: "italic", fontSize: "1.4rem", color: "#fff" }}>X</span>
          </Link>
          <p style={{ fontSize: "0.875rem", lineHeight: 1.75, maxWidth: 260, marginBottom: 26 }}>
            Empowering careers through practical, expert-led education. Skills that matter — taught by people who've built real things.
          </p>
          <div style={{ display: "flex", gap: 11 }}>
            {[Instagram, Twitter, Linkedin].map((Icon, i) => (
              <motion.div key={i} whileHover={{ y: -3 }}
                style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "border-color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(232,93,63,0.5)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
              >
                <Icon size={15} style={{ color: "rgba(255,255,255,0.5)" }} />
              </motion.div>
            ))}
          </div>
        </div>
        {[
          { title: "Explore", links: [{ to: "/courses", l: "All Courses" }, { to: "/blog", l: "Blog & News" }, { to: "/contact", l: "Contact Us" }] },
          { title: "Categories", links: [{ to: "/courses", l: "Programming" }, { to: "/courses", l: "Design" }, { to: "/courses", l: "Business" }, { to: "/courses", l: "Marketing" }] },
          { title: "Legal", links: [{ to: "#", l: "Terms of Service" }, { to: "#", l: "Privacy Policy" }, { to: "#", l: "Join as Trainer" }] },
        ].map((col, i) => (
          <div key={i}>
            <h4 style={{ fontWeight: 700, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#fff", marginBottom: 20 }}>{col.title}</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
              {col.links.map((l, j) => (
                <li key={j}>
                  <Link to={l.to} style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: "0.875rem", transition: "color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
                  >{l.l}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 26, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
        <p style={{ fontSize: "0.78rem" }}>© 2025 LearnX. All rights reserved.</p>
        <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" style={{ height: 13, opacity: 0.2, filter: "invert(1)" }} />
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" style={{ height: 10, opacity: 0.2, filter: "invert(1)" }} />
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" style={{ height: 13, opacity: 0.2 }} />
        </div>
      </div>
    </div>
  </motion.footer>
);

/* ═══════════════════════════════════════════════════════════ HOME */
const Home = () => (
  <>
    <Hero />
    <Categories />
    <AreasOfInvolvement />
    <Mentorship />
    <MasteryBundles />
    <TrainerList />
    <Testimonials />
    <CTA />
  </>
);

/* ═══════════════════════════════════════════════════════════ COURSES PAGE */
const CoursesPage = () => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search")?.toLowerCase() || "";
  const filtered = COURSES.filter(c =>
    c.title.toLowerCase().includes(search) ||
    c.category.toLowerCase().includes(search) ||
    c.trainer.toLowerCase().includes(search)
  );
  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 24px 80px" }}>
      <Reveal style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48, flexWrap: "wrap", gap: 16 }}>
        <div>
          <div className="overline" style={{ marginBottom: 10 }}>Library</div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 700, letterSpacing: "-0.02em" }}>
            Explore <em style={{ color: "var(--coral)" }}>courses</em>
          </h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: "0.85rem", color: "var(--ink-3)" }}>{filtered.length} courses</span>
          <button className="btn-ghost" style={{ padding: "9px 18px", fontSize: "0.82rem" }}>
            <Filter size={13} /> Filter
          </button>
        </div>
      </Reveal>
      <StaggerGrid style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 22 }}>
        {filtered.map(course => (
          <StaggerItem key={course.id}>
            <Link to={`/courses/${course.id}`} style={{ textDecoration: "none", display: "block", height: "100%" }}>
              <motion.div whileHover={{ y: -7, scale: 1.015 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }} className="card card-glow"
                style={{ borderRadius: 22, overflow: "hidden", height: "100%", display: "flex", flexDirection: "column" }}
              >
                <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
                  <motion.img src={course.image} alt={course.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    whileHover={{ scale: 1.05 }} transition={{ duration: 0.4 }} />
                  <div style={{ position: "absolute", top: 14, left: 14 }}><span className="pill">{course.level}</span></div>
                </div>
                <div style={{ padding: "22px 24px 24px", flex: 1, display: "flex", flexDirection: "column" }}>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--coral)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{course.category}</div>
                  <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: "1rem", fontWeight: 700, lineHeight: 1.45, color: "var(--ink)", marginBottom: "auto" }}>{course.title}</h3>
                  <div style={{ borderTop: "1px solid var(--border)", marginTop: 18, paddingTop: 15, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Star size={12} style={{ color: "#F59E0B", fill: "#F59E0B" }} />
                      <span style={{ fontSize: "0.78rem", fontWeight: 700 }}>{course.rating}</span>
                      <span style={{ fontSize: "0.72rem", color: "var(--ink-3)" }}>({course.studentsCount})</span>
                    </div>
                    <span style={{ fontSize: "1rem", fontWeight: 700, color: "var(--coral)" }}>${course.price}</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          </StaggerItem>
        ))}
      </StaggerGrid>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════ COURSE DETAIL */
const CourseDetails = () => {
  const { id } = useParams();
  const course = COURSES.find(c => c.id === id);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(course?.curriculum[0] || null);

  if (!course) return <div style={{ paddingTop: 120, textAlign: "center", color: "var(--ink-3)" }}>Course not found.</div>;

  return (
    <div style={{ paddingTop: 80 }}>
      <div style={{ background: "var(--cream-2)", padding: "52px 24px 48px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 340px", gap: 52, alignItems: "start" }} className="col-2">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
              <span className="pill">{course.category}</span>
              <ChevronRight size={14} style={{ color: "var(--ink-3)" }} />
              <span style={{ fontSize: "0.8rem", color: "var(--ink-3)" }}>{course.level}</span>
            </div>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: 18 }}>{course.title}</h1>
            <p style={{ color: "var(--ink-3)", lineHeight: 1.78, fontSize: "0.95rem", marginBottom: 24, maxWidth: 560 }}>{course.description}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 18, alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <img src={TRAINERS.find(t => t.id === course.trainerId)?.avatar} style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} />
                <span style={{ fontWeight: 500, fontSize: "0.875rem" }}>{course.trainer}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Star size={14} style={{ color: "#F59E0B", fill: "#F59E0B" }} />
                <span style={{ fontWeight: 700, fontSize: "0.875rem" }}>{course.rating}</span>
                <span style={{ color: "var(--ink-3)", fontSize: "0.8rem" }}>({course.studentsCount})</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--ink-3)", fontSize: "0.85rem" }}>
                <Clock size={14} /><span>{course.duration}</span>
              </div>
            </div>
          </div>
          <div className="card" style={{ borderRadius: 24, overflow: "hidden", position: "sticky", top: 96 }}>
            <img src={course.image} style={{ width: "100%", height: 185, objectFit: "cover" }} />
            <div style={{ padding: "20px 22px 24px" }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.9rem", fontWeight: 700, marginBottom: 16 }}>${course.price}</div>
              <Link to="#" className="btn-primary" style={{ width: "100%", justifyContent: "center", textDecoration: "none", fontSize: "0.95rem", padding: "14px", marginBottom: 10, display: "flex" }}>
                Enroll now <ArrowRight size={16} />
              </Link>
              <p style={{ textAlign: "center", fontSize: "0.73rem", color: "var(--ink-3)" }}>30-Day Money-Back Guarantee</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "52px 24px" }}>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.5rem", fontWeight: 700, marginBottom: 24 }}>Course Curriculum</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 9, maxWidth: 700 }}>
          {course.curriculum.map((lesson, idx) => (
            <motion.div key={lesson.id} onClick={() => setActiveLesson(lesson)} whileHover={{ x: 4 }} className="card"
              style={{ padding: "14px 18px", borderRadius: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", borderColor: activeLesson?.id === lesson.id ? "var(--coral)" : "var(--border)", background: activeLesson?.id === lesson.id ? "var(--coral-pale)" : "#fff" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
                <div style={{ width: 33, height: 33, borderRadius: "50%", flexShrink: 0, background: activeLesson?.id === lesson.id ? "var(--coral)" : "var(--cream-2)", color: activeLesson?.id === lesson.id ? "#fff" : "var(--ink-3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 700 }}>
                  {idx + 1}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>{lesson.title}</div>
                  <div style={{ fontSize: "0.73rem", color: "var(--ink-3)" }}>{lesson.duration}</div>
                </div>
              </div>
              <Play size={14} style={{ color: activeLesson?.id === lesson.id ? "var(--coral)" : "var(--sand)", flexShrink: 0 }} />
            </motion.div>
          ))}
        </div>
        {activeLesson && (
          <div style={{ marginTop: 40, maxWidth: 700 }}>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.25rem", fontWeight: 700, marginBottom: 16 }}>{activeLesson.title}</h2>
            <div style={{ borderRadius: 20, overflow: "hidden", background: "#000", aspectRatio: "16/9", marginBottom: 16 }}>
              <video src={activeLesson.videoUrl} controls style={{ width: "100%", height: "100%" }} />
            </div>
            <p style={{ color: "var(--ink-3)", lineHeight: 1.75, fontSize: "0.9rem" }}>{activeLesson.description || "No description available."}</p>
          </div>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════ DASHBOARD */
const Dashboard = () => {
  const user = MOCK_USER;
  const enrolled = user.enrolledCourses.map(ec => ({
    ...COURSES.find(c => c.id === ec.courseId)!,
    progress: ec.completedLessons.length,
  }));
  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 24px 80px" }}>
      <Reveal style={{ marginBottom: 44 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20 }}>
          <div>
            <div className="overline" style={{ marginBottom: 8 }}>Dashboard</div>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 700, letterSpacing: "-0.02em" }}>
              Welcome back, <em style={{ color: "var(--coral)" }}>{user.name.split(" ")[0]}</em>
            </h1>
            <p style={{ color: "var(--ink-3)", marginTop: 6, fontSize: "0.9rem" }}>Track your progress and keep learning.</p>
          </div>
          <div style={{ display: "flex", gap: 14 }}>
            {[{ v: enrolled.length, l: "Enrolled", c: "var(--coral)" }, { v: user.certificates.length, l: "Certificates", c: "#16A34A" }].map((s, i) => (
              <div key={i} className="card" style={{ padding: "17px 26px", textAlign: "center", borderRadius: 18 }}>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.7rem", fontWeight: 700, color: s.c }}>{s.v}</div>
                <div style={{ fontSize: "0.7rem", color: "var(--ink-3)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.07em" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal><h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.3rem", fontWeight: 700, marginBottom: 22 }}>Your courses</h2></Reveal>
      <StaggerGrid style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20, marginBottom: 48 }}>
        {enrolled.map(course => {
          const pct = Math.round((course.progress / course.lessonsCount) * 100);
          return (
            <StaggerItem key={course.id}>
              <div className="card" style={{ borderRadius: 20, overflow: "hidden" }}>
                <img src={course.image} style={{ width: "100%", height: 148, objectFit: "cover" }} />
                <div style={{ padding: "18px 20px 20px" }}>
                  <h3 style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: 13, lineHeight: 1.4 }}>{course.title}</h3>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.73rem", color: "var(--ink-3)", marginBottom: 6 }}>
                    <span>{course.progress}/{course.lessonsCount} lessons</span>
                    <span style={{ color: "var(--coral)", fontWeight: 700 }}>{pct}%</span>
                  </div>
                  <div className="progress-track" style={{ marginBottom: 17 }}>
                    <div className="progress-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <Link to={`/courses/${course.id}`} className="btn-primary" style={{ textDecoration: "none", width: "100%", justifyContent: "center", fontSize: "0.82rem", padding: "10px" }}>
                    Continue <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerGrid>

      <Reveal><h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.3rem", fontWeight: 700, marginBottom: 22 }}>Certificates</h2></Reveal>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
        {user.certificates.map((cert, i) => (
          <Reveal key={cert.id} delay={i * 0.07}>
            <div className="card" style={{ padding: "17px 20px", borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Award size={19} style={{ color: "#16A34A" }} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.875rem", marginBottom: 3 }}>{cert.courseName}</div>
                  <div style={{ fontSize: "0.73rem", color: "var(--ink-3)" }}>Issued {cert.issueDate}</div>
                </div>
              </div>
              <button className="btn-ghost" style={{ padding: "7px 12px" }}><Download size={13} /></button>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════ PROFILE */
const Profile = () => {
  const user = MOCK_USER;
  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "100px 24px 80px" }}>
      <Reveal>
        <div className="card" style={{ borderRadius: 28, overflow: "hidden" }}>
          <div style={{ height: 110, background: "linear-gradient(135deg, var(--coral-pale) 0%, var(--cream-2) 100%)" }} />
          <div style={{ padding: "0 34px 36px", textAlign: "center", marginTop: -50 }}>
            <img src={user.avatar} style={{ width: 100, height: 100, borderRadius: "50%", border: "4px solid #fff", objectFit: "cover", display: "block", margin: "0 auto 16px", boxShadow: "var(--shadow-md)" }} />
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.6rem", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 5 }}>{user.name}</h1>
            <p style={{ color: "var(--ink-3)", fontSize: "0.875rem", marginBottom: 26 }}>{user.email}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 26 }}>
              {[{ v: user.enrolledCourses.length, l: "Courses" }, { v: user.certificates.length, l: "Certificates" }].map((s, i) => (
                <div key={i} style={{ background: "var(--cream-2)", borderRadius: 16, padding: "16px" }}>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.8rem", fontWeight: 700, color: "var(--coral)" }}>{s.v}</div>
                  <div style={{ fontSize: "0.7rem", color: "var(--ink-3)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.07em" }}>{s.l}</div>
                </div>
              ))}
            </div>
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 18 }}>
              {[{ l: "Member since", v: user.joinDate }, { l: "Account status", v: "Active ✓", vColor: "#16A34A" }].map((row, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "11px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ color: "var(--ink-3)", fontSize: "0.875rem" }}>{row.l}</span>
                  <span style={{ fontWeight: 600, fontSize: "0.875rem", color: (row as any).vColor || "var(--ink)" }}>{row.v}</span>
                </div>
              ))}
            </div>
            <Link to="#" className="btn-primary" style={{ marginTop: 26, textDecoration: "none" }}>
              Edit profile <Edit size={14} />
            </Link>
          </div>
        </div>
      </Reveal>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════ LOGIN */
const LoginPage = () => {
  const [showPw, setShowPw] = useState(false);
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 24px", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(232,93,63,0.06) 0%, transparent 60%)", pointerEvents: "none" }} />
      <Reveal style={{ maxWidth: 430, width: "100%", position: "relative", zIndex: 1 }}>
        <div className="card" style={{ padding: "42px 34px", borderRadius: 28 }}>
          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "baseline", gap: 2, marginBottom: 18 }}>
              <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "1.4rem", color: "var(--coral)" }}>Learn</span>
              <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 400, fontStyle: "italic", fontSize: "1.4rem", color: "var(--ink)" }}>X</span>
            </div>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.65rem", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 7 }}>Welcome back</h1>
            <p style={{ color: "var(--ink-3)", fontSize: "0.875rem" }}>Sign in to continue your learning journey</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 17 }}>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: 7, color: "var(--ink-2)" }}>Email address</label>
              <input className="input" type="email" placeholder="name@example.com" />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: 7, color: "var(--ink-2)" }}>Password</label>
              <div style={{ position: "relative" }}>
                <input className="input" type={showPw ? "text" : "password"} placeholder="••••••••" style={{ paddingRight: 46 }} />
                <button onClick={() => setShowPw(v => !v)} style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--ink-3)" }}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <Link to="/forgot-password" style={{ fontSize: "0.82rem", color: "var(--coral)", textDecoration: "none", fontWeight: 600 }}>Forgot password?</Link>
            </div>
            <button className="btn-primary" style={{ width: "100%", justifyContent: "center", fontSize: "0.95rem", padding: "14px" }}>
              Sign in <ArrowRight size={16} />
            </button>
          </div>
          <div style={{ margin: "22px 0", borderTop: "1px solid var(--border)" }} />
          <p style={{ textAlign: "center", fontSize: "0.85rem", color: "var(--ink-3)" }}>
            No account?{" "}
            <Link to="/register" style={{ color: "var(--coral)", fontWeight: 700, textDecoration: "none" }}>Create one free</Link>
          </p>
        </div>
      </Reveal>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════ ADMIN */
const AdminPanel = () => {
  const [courses, setCourses] = useState(COURSES);
  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 24px 80px" }}>
      <Reveal style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40 }}>
        <div>
          <div className="overline" style={{ marginBottom: 8 }}>Administration</div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.02em" }}>Course Manager</h1>
        </div>
        <button className="btn-primary"><Plus size={14} /> Add course</button>
      </Reveal>
      <Reveal>
        <div className="card" style={{ borderRadius: 22, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--cream-2)", borderBottom: "1px solid var(--border)" }}>
                  {["Course","Trainer","Students","Price","Actions"].map(h => (
                    <th key={h} style={{ padding: "13px 18px", textAlign: "left", fontSize: "0.71rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-3)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {courses.map((course, i) => (
                  <motion.tr key={course.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                    style={{ borderBottom: "1px solid var(--border)", transition: "background 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "var(--cream)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding: "12px 18px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                        <img src={course.image} style={{ width: 36, height: 36, borderRadius: 9, objectFit: "cover" }} />
                        <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>{course.title}</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 18px", fontSize: "0.85rem", color: "var(--ink-3)" }}>{course.trainer}</td>
                    <td style={{ padding: "12px 18px", fontSize: "0.85rem", color: "var(--ink-3)" }}>{course.studentsCount}</td>
                    <td style={{ padding: "12px 18px", fontWeight: 700, color: "var(--coral)", fontSize: "0.9rem" }}>${course.price}</td>
                    <td style={{ padding: "12px 18px" }}>
                      <div style={{ display: "flex", gap: 7 }}>
                        <button className="btn-ghost" style={{ padding: "7px 11px" }}><Edit size={13} /></button>
                        <button style={{ padding: "7px 11px", borderRadius: 10, background: "#FEF2F2", border: "1px solid #FECACA", color: "#EF4444", cursor: "pointer", display: "flex", alignItems: "center" }}><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════ BLOG */
const BlogPage = () => (
  <div style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 24px 80px" }}>
    <Reveal style={{ textAlign: "center", marginBottom: 56 }}>
      <div className="overline" style={{ marginBottom: 12 }}>Insights</div>
      <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(2.2rem, 4vw, 3rem)", fontWeight: 700, letterSpacing: "-0.02em" }}>
        Our <em style={{ color: "var(--coral)" }}>blog</em>
      </h1>
      <p style={{ color: "var(--ink-3)", marginTop: 13, maxWidth: 440, margin: "13px auto 0", lineHeight: 1.75, fontSize: "0.95rem" }}>
        Trends in design, programming, and business — curated weekly.
      </p>
    </Reveal>
    <StaggerGrid style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 26 }}>
      {BLOG_POSTS.map(post => (
        <StaggerItem key={post.id}>
          <motion.div whileHover={{ y: -7, scale: 1.012 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }} className="card card-glow" style={{ borderRadius: 24, overflow: "hidden" }}>
            <div style={{ position: "relative", overflow: "hidden", height: 225 }}>
              <motion.img src={post.image} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                whileHover={{ scale: 1.05 }} transition={{ duration: 0.4 }} />
            </div>
            <div style={{ padding: "24px 26px 28px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.73rem", color: "var(--coral)", fontWeight: 700, marginBottom: 10 }}>
                <span>{post.date}</span>
                <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--sand)", display: "inline-block" }} />
                <span>By {post.author}</span>
              </div>
              <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.12rem", fontWeight: 700, lineHeight: 1.4, letterSpacing: "-0.01em", marginBottom: 9 }}>{post.title}</h3>
              <p style={{ color: "var(--ink-3)", fontSize: "0.875rem", lineHeight: 1.75, marginBottom: 18 }}>{post.excerpt}</p>
              <button className="arrow-link">Read article <ArrowRight size={14} /></button>
            </div>
          </motion.div>
        </StaggerItem>
      ))}
    </StaggerGrid>
  </div>
);

/* ═══════════════════════════════════════════════════════════ CONTACT */
const ContactPage = () => (
  <div style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 24px 80px" }}>
    <Reveal style={{ textAlign: "center", marginBottom: 64 }}>
      <div className="overline" style={{ marginBottom: 12 }}>Get in touch</div>
      <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(2.2rem, 4vw, 3rem)", fontWeight: 700, letterSpacing: "-0.02em" }}>
        We'd love to <em style={{ color: "var(--coral)" }}>hear from you</em>
      </h1>
    </Reveal>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 60, alignItems: "start" }} className="col-2">
      <Reveal>
        <p style={{ color: "var(--ink-3)", lineHeight: 1.8, fontSize: "0.95rem", marginBottom: 40 }}>
          Have questions about our courses or mentorship programs? Our team is here to guide you.
        </p>
        {[
          { icon: Mail, title: "Email us", v: "support@learnx.com" },
          { icon: Phone, title: "Call us", v: "+91 234 567 8910" },
          { icon: MessageSquare, title: "Live chat", v: "Available 24/7" },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 15, marginBottom: 24 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: "var(--coral-pale)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <item.icon size={19} style={{ color: "var(--coral)" }} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.875rem", marginBottom: 2 }}>{item.title}</div>
              <div style={{ color: "var(--ink-3)", fontSize: "0.85rem" }}>{item.v}</div>
            </div>
          </div>
        ))}
      </Reveal>
      <Reveal delay={0.12}>
        <div className="card" style={{ padding: "36px 32px", borderRadius: 28 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 17, marginBottom: 17 }}>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: 7, color: "var(--ink-2)" }}>Full name</label>
              <input className="input" type="text" placeholder="Yasir Alrawi" />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: 7, color: "var(--ink-2)" }}>Email</label>
              <input className="input" type="email" placeholder="yasir7alrawi23@gmail.com" />
            </div>
          </div>
          <div style={{ marginBottom: 17 }}>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: 7, color: "var(--ink-2)" }}>Phone</label>
            <input className="input" type="tel" placeholder="+1 234 567 890" />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: 7, color: "var(--ink-2)" }}>Message</label>
            <textarea className="input" placeholder="How can we help you?" style={{ height: 128, resize: "none" }} />
          </div>
          <button className="btn-primary" style={{ width: "100%", justifyContent: "center", fontSize: "0.95rem", padding: "14px" }}>
            Send message <ArrowRight size={16} />
          </button>
        </div>
      </Reveal>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════ APP */
export default function App() {
  const { pathname } = useLocation();
  const [pageKey, setPageKey] = useState(pathname);

  useEffect(() => {
    // Smooth scroll to top on route change with a slight delay for feel
    const t = setTimeout(() => window.scrollTo({ top: 0, behavior: "instant" }), 10);
    setPageKey(pathname);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)", position: "relative" }}>
      <ScrollProgress />
      <Navbar />
      <main key={pageKey} className="page-enter">
        <Routes>
          <Route path="/"            element={<Home />} />
          <Route path="/courses"     element={<CoursesPage />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/dashboard"   element={<Dashboard />} />
          <Route path="/profile"     element={<Profile />} />
          <Route path="/login"       element={<LoginPage />} />
          <Route path="/register"    element={<LoginPage />} />
          <Route path="/admin"       element={<AdminPanel />} />
          <Route path="/blog"        element={<BlogPage />} />
          <Route path="/contact"     element={<ContactPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}