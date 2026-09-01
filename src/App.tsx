import { useEffect, useState, useRef, type ReactNode } from 'react';
import { motion, useReducedMotion, useInView } from 'framer-motion';
import {
  ArrowRight, Check, CircleArrowUp,
  Layers3, Network, Package,
  ShieldCheck, Sparkles, Store, Target, TrendingUp, Users, X,
} from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { Route, Switch } from 'wouter';
import ContactPage from '@/pages/contact';
import AdminLogin from '@/pages/admin/login';
import AdminDashboard from '@/pages/admin/index';
import { ProtectedRoute } from '@/components/protected-route';
import { Header, Footer } from '@/components/layout';

const queryClient = new QueryClient();

/* ──────────────────────────────────────────────────────────
   DATA
   ────────────────────────────────────────────────────────── */
const challenges = [
  { title: 'Fragmented Supply Chain',    text: 'Lack of coordination between fabric suppliers, manufacturers, and buyers leads to delays and inefficiencies in textile operations.',    icon: Network   },
  { title: 'Rising Raw Material Costs',  text: 'Increasing prices of yarn, fabrics, and processing inputs impact profitability and create pricing challenges for textile businesses.', icon: TrendingUp },
  { title: 'Quality & Reliability Issues', text: 'Maintaining consistent fabric quality and ensuring timely supply remains a challenge in a competitive textile market.',              icon: ShieldCheck},
  { title: 'Intense Market Competition', text: 'Growing competition among textile suppliers and global sourcing markets creates pressure on pricing and customer retention.',           icon: Target    },
];

const solutions = [
  { number: '01', title: 'Reliable Fabric Supply',    text: 'Providing quality textile materials with consistent availability and timely delivery.',                              icon: ShieldCheck },
  { number: '02', title: 'Customer-Centric Approach', text: 'Offering tailored fabric solutions to meet the diverse requirements of garment businesses.',                         icon: Target     },
  { number: '03', title: 'Quality & Trust Focus',     text: 'Ensuring superior fabric standards through reliable sourcing and strong supplier networks.',                          icon: Sparkles   },
];

const offerings = [
  { title: 'Premium Fabric Supply',       text: 'Providing quality textile materials for garment and apparel businesses.',                          icon: Package  },
  { title: 'Diverse Textile Range',       text: 'Offering a wide selection of polyester and fabric solutions to meet market demands.',              icon: Layers3  },
  { title: 'Reliable Trading Network',    text: 'Ensuring smooth sourcing and timely delivery through strong supplier connections.',                icon: Network  },
  { title: 'Customized Fabric Solutions', text: 'Delivering flexible textile options based on customer requirements.',                              icon: Store    },
];

const uspPoints = [
  { number: '01', title: 'Quality-Driven Approach',    text: 'Ensuring premium fabric quality through reliable sourcing and selection.' },
  { number: '02', title: 'Strong Supplier Network',    text: 'Building efficient supply channels for consistent availability of textile materials.' },
  { number: '03', title: 'Customer-Focused Solutions', text: 'Providing flexible fabric options aligned with client requirements.' },
  { number: '04', title: 'Timely & Reliable Delivery', text: 'Maintaining strong commitments through efficient order management and service.' },
];

const revenueStreams = [
  { title: 'B2B Fabric Sales',             text: 'Generating revenue through bulk fabric supply to garment manufacturers, wholesalers, and apparel businesses.' },
  { title: 'Wholesale Distribution',       text: 'Earning through fabric trading and distribution networks by supplying quality textile materials to diverse buyers.' },
  { title: 'Customized Textile Solutions', text: 'Creating value through customer-specific fabric sourcing and reliable supply partnerships for recurring business opportunities.' },
];

const g2mItems = [
  { label: 'B2B Customer Acquisition',     Icon: Users      },
  { label: 'Strong Supplier Partnerships', Icon: Network    },
  { label: 'Digital Presence Expansion',   Icon: TrendingUp },
  { label: 'Market Relationship Building', Icon: Target     },
  { label: 'Geographical Expansion',       Icon: Store      },
];

/* ──────────────────────────────────────────────────────────
   HELPERS
   ────────────────────────────────────────────────────────── */
function goTo(id: string, close?: () => void) {
  close?.();
  if (id === 'contact') { window.location.href = '/contact'; return; }
  if (window.location.pathname === '/contact') { window.location.href = '/#' + id; return; }
  window.setTimeout(() => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 30);
}

function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? undefined : { opacity: 0, y: 20 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.14 }}
      transition={{ duration: 0.68, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Thread({ className = '' }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <svg className={`thread-svg absolute ${className}`} width="480" height="90" viewBox="0 0 480 90" aria-hidden="true">
      <motion.path
        className={reduce ? '' : 'thread-path'}
        d="M4 46 C78 4 114 75 186 35 S303 27 356 50 S427 73 476 16"
        fill="none" stroke="rgba(183,154,104,.70)" strokeWidth="1.1"
      />
      <path d="M4 46 C78 4 114 75 186 35 S303 27 356 50 S427 73 476 16"
        fill="none" stroke="rgba(74,70,64,.09)" strokeWidth=".6" transform="translate(0,4)" />
    </svg>
  );
}

function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start: number;
    const dur = 1400;
    const run = (now: number) => {
      if (!start) start = now;
      const p = Math.min((now - start) / dur, 1);
      setDisplay(Math.floor(value * (1 - Math.pow(1 - p, 4))));
      if (p < 1) requestAnimationFrame(run);
    };
    requestAnimationFrame(run);
  }, [inView, value]);
  return <span ref={ref}>{display}</span>;
}

/* Section heading shorthand */
function SectionHead({ eyebrow, children }: { eyebrow: string; children: ReactNode }) {
  return (
    <Reveal>
      <div className="eyebrow mb-4">{eyebrow}</div>
      <h2 className="display max-w-[600px] font-semibold text-[hsl(var(--primary))]"
        style={{ fontSize: 'clamp(1.75rem, 3.8vw, 3.4rem)' }}>
        {children}
      </h2>
    </Reveal>
  );
}

/* ══════════════════════════════════════════════════════════
   HERO
   ══════════════════════════════════════════════════════════ */
function Hero() {
  const reduce = useReducedMotion();
  return (
    <section id="home" className="relative isolate overflow-hidden bg-[hsl(var(--background))]">
      {/* Warm background tint */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(circle at 78% 22%, rgba(229,212,184,.38), transparent 32%), linear-gradient(110deg, rgba(250,248,243,.99) 30%, rgba(245,241,232,.82) 100%)'
      }} />

      {/* Decorative rings — desktop only */}
      <div className="hero-deco-circle pointer-events-none absolute right-[-7%] top-[8%] h-[70vw] w-[70vw] max-h-[680px] max-w-[680px] rounded-full border border-[hsl(var(--accent)/.16)] max-md:hidden" />
      <div className="hero-deco-circle pointer-events-none absolute right-[11%] top-[24%] h-[44vw] w-[44vw] max-h-[460px] max-w-[460px] rounded-full border border-dashed border-[hsl(var(--accent)/.11)] max-md:hidden" />

      {/* Thread SVG — desktop only */}
      <Thread className="right-[-30px] top-[34%] w-[500px] rotate-[-8deg] opacity-75 max-md:hidden sm:right-[3%]" />

      {/* ── Two-column grid ─────────────────────────────── */}
      <div className="hero-grid relative z-10 mx-auto grid max-w-[var(--max-w)] items-center gap-10 px-[var(--gutter)] pb-14 pt-28 md:grid-cols-[46fr_54fr] md:gap-10 md:pb-16 md:pt-32 lg:gap-16 lg:pb-20 lg:pt-36">

        {/* TEXT */}
        <motion.div
          className="hero-text"
          initial={reduce ? undefined : { opacity: 0, y: 20 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1
            className="display max-w-[580px] font-semibold text-[hsl(var(--foreground))]"
            style={{ fontSize: 'clamp(2rem, 5vw, 4.6rem)', lineHeight: 1.05 }}
          >
            Weaving Quality Fabrics,{' '}
            <span className="text-[hsl(var(--accent))]">Building Fashion Futures.</span>
          </h1>

          <p className="mt-5 max-w-[480px] leading-[1.75] text-[hsl(var(--muted-foreground))]"
            style={{ fontSize: 'clamp(0.875rem, 1.4vw, 1rem)' }}>
            Quality fabrics and reliable textile solutions for apparel and garment businesses.
          </p>

          {/* CTA buttons */}
          <div className="hero-buttons mt-7 flex flex-wrap gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => goTo('contact')}
              className="inline-flex min-h-[48px] min-w-[176px] items-center justify-center gap-3 bg-[hsl(var(--accent))] px-6 py-3 text-xs font-semibold uppercase tracking-[.13em] text-white transition hover:bg-[hsl(var(--accent)/.88)]"
              data-testid="button-hero-contact"
            >
              Partner With Us <ArrowRight size={15} />
            </button>
            <button
              type="button"
              onClick={() => goTo('offerings')}
              className="inline-flex min-h-[48px] min-w-[176px] items-center justify-center gap-3 border border-[hsl(var(--accent)/.62)] px-6 py-3 text-xs font-semibold uppercase tracking-[.13em] text-[hsl(var(--foreground))] transition hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))]"
              data-testid="button-hero-offerings"
            >
              Our Offerings <ArrowRight size={15} />
            </button>
          </div>
        </motion.div>

        {/* IMAGE */}
        <motion.div
          className="hero-image-wrap relative mx-auto w-full"
          style={{ maxWidth: 'min(100%, 500px)' }}
          initial={reduce ? undefined : { opacity: 0, scale: 0.96 }}
          animate={reduce ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: 1.05, delay: 0.14 }}
        >
          <div className="hero-image-inner relative overflow-hidden border border-[hsl(var(--border))] bg-[hsl(var(--secondary))] shadow-2xl shadow-[rgba(74,70,64,.10)]"
            style={{ aspectRatio: '0.88' }}>
            <img
              src="/fabric-rolls.jpg"
              alt="Rolled textile fabrics in warm neutral tones"
              className="h-full w-full object-cover brightness-110 saturate-[.65]"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(250,248,243,.72)] via-transparent to-[rgba(229,212,184,.12)]" />
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between border-t border-[hsl(var(--foreground)/.14)] pt-3 text-[10px] uppercase tracking-[.17em] text-[hsl(var(--foreground)/.68)]">
              <span>Material / Texture / Supply</span>
              <span className="text-[hsl(var(--accent))]">01—04</span>
            </div>
          </div>
          {/* Corner accents */}
          <div className="absolute -bottom-4 -left-4 hidden h-20 w-20 border-b border-l border-[hsl(var(--accent)/.62)] sm:block" />
          <div className="absolute -right-4 -top-4 hidden h-16 w-16 border-r border-t border-[hsl(var(--accent)/.58)] sm:block" />
        </motion.div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   ABOUT
   ══════════════════════════════════════════════════════════ */
function About() {
  return (
    <section id="about" className="section-pad bg-[hsl(var(--background))]">
      <div className="inner-container">
        <div className="about-grid grid items-center gap-10 lg:grid-cols-[48fr_52fr] lg:gap-16">

          <Reveal className="relative">
            <div className="fabric-panel aspect-[0.9] w-full max-w-[480px]">
              <img src="/fabric-weave.jpg" alt="Close-up of woven textile fibers in warm neutral tones"
                className="h-full w-full object-cover brightness-110 saturate-[.7]" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-tr from-[rgba(183,154,104,.13)] to-transparent" />
              <div className="absolute bottom-0 left-0 bg-[hsl(var(--secondary))] px-5 py-4">
                <span className="block text-[10px] uppercase tracking-[.2em] text-[hsl(var(--accent))]">Our Material Point of View</span>
                <span className="mt-1 block text-sm font-medium text-[hsl(var(--foreground))]">Reliable by Design</span>
              </div>
            </div>
            <div className="absolute -bottom-5 right-0 h-14 w-14 border-b border-r border-[hsl(var(--accent))]" />
          </Reveal>

          <Reveal delay={0.12}>
            <div className="eyebrow mb-4">About Freya Poly Fab</div>
            <h2 className="display max-w-[520px] font-semibold text-[hsl(var(--primary))]"
              style={{ fontSize: 'clamp(1.75rem, 3.8vw, 3.4rem)' }}>
              A Trusted Textile<br />Supply Partner
            </h2>
            <div className="mt-6 max-w-[540px] space-y-4 text-[15px] leading-[1.75] text-[hsl(var(--muted-foreground))]">
              <p>Freya Poly Fab is a growing textile trading company specializing in the supply of quality fabrics and textile materials to meet the evolving needs of the apparel industry.</p>
              <p>With a strong focus on reliability, timely delivery, and customer satisfaction, the company aims to become a trusted partner for garment manufacturers and businesses by providing premium textile solutions.</p>
            </div>
            <button type="button" onClick={() => goTo('mission')}
              className="group mt-7 inline-flex items-center gap-2 border-b border-[hsl(var(--accent))] pb-1.5 text-xs font-semibold uppercase tracking-[.15em] text-[hsl(var(--foreground))] transition hover:text-[hsl(var(--accent))]"
              data-testid="button-about-learn">
              Learn More <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   MISSION & VISION  — equal-height cards
   ══════════════════════════════════════════════════════════ */
function Mission() {
  const cards = [
    { label: 'Our Mission', text: 'To provide reliable textile solutions with superior quality, timely supply, and customer-focused service.',                                            number: '01' },
    { label: 'Our Vision',  text: 'To become a trusted textile partner by delivering quality fabrics and building sustainable growth in the apparel industry.',                          number: '02' },
  ];
  return (
    <section id="mission" className="section-pad textile-grid bg-[hsl(var(--card))]">
      <div className="inner-container">
        <SectionHead eyebrow="Mission & Vision">
          Built Around the<br />Business Relationship.
        </SectionHead>
        <div className="mt-10 grid items-stretch gap-5 md:grid-cols-2">
          {cards.map((card, i) => (
            <Reveal key={card.label} delay={i * 0.1} className="flex">
              <article className="relative flex flex-1 flex-col overflow-hidden border border-[hsl(var(--border))] bg-[hsl(var(--background)/.72)] p-6 sm:p-8">
                <span className="absolute right-5 top-4 font-mono text-5xl font-light text-[hsl(var(--accent)/.22)]">{card.number}</span>
                <div className="relative flex flex-1 flex-col">
                  <div className="eyebrow mb-4">{card.label}</div>
                  <p className="flex-1 text-lg leading-[1.65] text-[hsl(var(--foreground))] sm:text-xl sm:leading-[1.7]">
                    &ldquo;{card.text}&rdquo;
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   CHALLENGES  — 4-col desktop | 2×2 everywhere else
   ══════════════════════════════════════════════════════════ */
function Challenges() {
  const reduce = useReducedMotion();
  const topColors = ['#0f3d5c', '#4a7ba7', '#b79a68', '#d4b883'];

  return (
    <section id="challenges" className="section-pad bg-[hsl(var(--background))]">
      <div className="inner-container">
        <SectionHead eyebrow="Market Challenges">
          Challenges in the<br />
          <span className="text-[hsl(var(--accent))]">Textile Market</span>
        </SectionHead>

        {/* Grid: 2-col (default) → 4-col (lg) */}
        <div className="challenges-grid mt-10 grid items-stretch gap-5 grid-cols-2 lg:grid-cols-4">
          {challenges.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.article
                key={c.title}
                initial={reduce ? undefined : { opacity: 0, y: 26 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.16 }}
                transition={{ duration: 0.48, delay: i * 0.07 }}
                className="group flex flex-col border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-6"
                style={{ borderTopWidth: '3px', borderTopColor: topColors[i] }}
              >
                <div className="card-icon mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(var(--accent)/.11)]">
                  <Icon size={18} strokeWidth={1.5} className="text-[hsl(var(--accent))]" />
                </div>
                <h3 className="mb-2 text-sm font-semibold leading-[1.4] text-[hsl(var(--foreground))]">{c.title}</h3>
                <p className="flex-1 text-sm leading-[1.6] text-[hsl(var(--muted-foreground))]">{c.text}</p>
                <div className="mt-4 border-t border-[hsl(var(--border))] pt-3">
                  <span className="font-mono text-xs text-[hsl(var(--accent)/.55)]">0{i + 1}</span>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   SOLUTIONS  — 3-col desktop | 1-col mobile
   ══════════════════════════════════════════════════════════ */
function Solutions() {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const inView = useInView(trackRef, { once: true, amount: 0.28 });

  return (
    <section id="solutions" className="section-pad bg-[hsl(var(--card))]">
      <div className="inner-container">
        <Reveal>
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <div className="eyebrow mb-4">Solution We Offer</div>
              <h2 className="display max-w-[520px] font-semibold text-[hsl(var(--primary))]"
                style={{ fontSize: 'clamp(1.75rem, 3.8vw, 3.4rem)' }}>
                Bridging Textile<br />
                <span className="text-[hsl(var(--accent))]">Supply Challenges</span>
              </h2>
            </div>
            <p className="max-w-[260px] text-sm leading-[1.6] text-[hsl(var(--muted-foreground))]">
              Freya Poly Fab bridges textile supply challenges by delivering quality fabrics, reliable sourcing, and customer-focused solutions.
            </p>
          </div>
        </Reveal>

        <div ref={trackRef} className="relative mt-10">
          {/* Connector line — desktop only */}
          <div className="solutions-connector absolute left-[14%] right-[14%] top-[3.1rem] hidden h-px md:block">
            <motion.div
              initial={{ scaleX: 0 }} animate={inView && !reduce ? { scaleX: 1 } : {}}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="h-full w-full origin-left bg-gradient-to-r from-[hsl(var(--accent)/.22)] via-[hsl(var(--accent)/.52)] to-[hsl(var(--accent)/.22)]"
            />
          </div>

          <div className="solutions-grid grid items-stretch gap-6 md:grid-cols-3">
            {solutions.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.article
                  key={s.number}
                  initial={reduce ? undefined : { opacity: 0, scale: 0.93 }}
                  whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.16 }}
                  transition={{ duration: 0.5, delay: 0.65 + i * 0.13 }}
                  className="group relative flex flex-col overflow-hidden rounded-lg border-2 border-[hsl(var(--border))] bg-[hsl(var(--background))] p-6 transition-all duration-300 hover:border-[hsl(var(--accent))] sm:p-7"
                >
                  <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-[hsl(var(--accent)/.1)] font-mono text-sm font-bold text-[hsl(var(--accent))] transition-all duration-300 group-hover:bg-[hsl(var(--accent))] group-hover:text-white">
                    {s.number}
                  </div>
                  <div className="mb-4 mt-1"><Icon size={26} strokeWidth={1.5} className="text-[hsl(var(--accent))]" /></div>
                  <h3 className="text-base font-semibold text-[hsl(var(--foreground))] sm:text-lg">{s.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-[1.65] text-[hsl(var(--muted-foreground))]">{s.text}</p>
                  <motion.div
                    initial={{ width: 0 }} whileInView={{ width: '100%' }} viewport={{ once: true }}
                    transition={{ duration: 0.55, delay: 1.05 + i * 0.13 }}
                    className="absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-[hsl(var(--accent))] to-transparent"
                  />
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   OFFERINGS  — 2×2 on mobile/tablet | 4-col on large desktop
   ══════════════════════════════════════════════════════════ */
function Offerings() {
  const reduce = useReducedMotion();
  return (
    <section id="offerings" className="section-pad bg-[hsl(var(--background))]">
      <div className="inner-container">
        <SectionHead eyebrow="Our Offerings">
          Complete Textile<br />
          <span className="text-[hsl(var(--accent))]">Solutions</span>
        </SectionHead>

        {/* 2-col default, 4-col at lg */}
        <div className="offerings-grid mt-10 grid items-stretch gap-4 grid-cols-2 lg:grid-cols-4">
          {offerings.map((o, i) => {
            const Icon = o.icon;
            return (
              <motion.article
                key={o.title}
                initial={reduce ? undefined : { opacity: 0, scale: 0.93 }}
                whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.14 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="group flex flex-col items-center overflow-hidden rounded-xl bg-gradient-to-br from-[hsl(var(--card))] to-[hsl(var(--secondary)/.35)] p-5 text-center shadow-sm transition-all duration-300 hover:shadow-lg sm:p-7"
              >
                <div className="mb-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--accent)/.13)] transition-colors duration-300 group-hover:bg-[hsl(var(--accent)/.22)]">
                  <Icon size={24} strokeWidth={1.5} className="text-[hsl(var(--accent))]" />
                </div>
                <h3 className="mb-2 text-sm font-semibold leading-[1.35] text-[hsl(var(--foreground))]">{o.title}</h3>
                <p className="text-xs leading-[1.6] text-[hsl(var(--muted-foreground))] sm:text-sm">{o.text}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   USP — 4-col desktop | 2×2 mobile
   ══════════════════════════════════════════════════════════ */
function USP() {
  const reduce = useReducedMotion();
  return (
    <section id="usp" className="relative overflow-hidden bg-[hsl(var(--secondary))]">
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-40"
        style={{ background: 'radial-gradient(circle at 65% 46%, rgba(229,212,184,.55), transparent 28%)' }} />
      <Thread className="right-[-60px] top-[28%] hidden w-[520px] opacity-40 lg:block" />

      <div className="section-pad relative">
        <div className="inner-container">
          <SectionHead eyebrow="Why Work With Us">
            Why Work With<br />
            <span className="text-[hsl(var(--accent))]">Freya Poly Fab?</span>
          </SectionHead>

          {/* 2-col default → 4-col at lg */}
          <div className="usp-grid mt-10 grid items-stretch gap-4 grid-cols-2 lg:grid-cols-4">
            {uspPoints.map((item, i) => (
              <motion.article
                key={item.number}
                initial={reduce ? undefined : { opacity: 0, y: 22 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.18 }}
                transition={{ duration: 0.48, delay: i * 0.08 }}
                className="group flex flex-col gap-3 overflow-hidden rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card)/.68)] p-5 backdrop-blur-sm transition-all duration-300 hover:bg-[hsl(var(--card)/.92)] hover:shadow-md sm:p-6"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--accent)/.12)] font-mono text-sm font-bold text-[hsl(var(--accent))]">
                  {item.number}
                </div>
                <div>
                  <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-[.07em] text-[hsl(var(--foreground))] sm:text-sm">{item.title}</h3>
                  <p className="text-xs leading-[1.6] text-[hsl(var(--muted-foreground))] sm:text-sm">{item.text}</p>
                </div>
              </motion.article>
            ))}
          </div>

          <Reveal delay={0.3}>
            <p className="mx-auto mt-8 max-w-[700px] text-center text-sm leading-[1.65] text-[hsl(var(--muted-foreground))]">
              Freya Poly Fab stands out through quality fabrics, reliable sourcing, and customer-focused textile solutions that drive long-term business relationships.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   MARKET ALIGNMENT (STP)
   ══════════════════════════════════════════════════════════ */
function MarketAlignment() {
  const reduce = useReducedMotion();
  const steps = [
    { title: 'Segmentation', text: 'Freya Poly Fab segments the market based on fabric requirements, buyer preferences, order volume, and industry needs, serving garment manufacturers, wholesalers, retailers, and apparel businesses seeking reliable textile suppliers.' },
    { title: 'Targeting',    text: 'The company targets garment producers, fashion businesses, textile traders, and bulk buyers who require consistent fabric availability, competitive pricing, and dependable supply partnerships.' },
    { title: 'Positioning',  text: 'Freya Poly Fab positions itself as a trusted textile trading partner offering quality fabrics, efficient sourcing, and reliable service to support the growing apparel and fashion ecosystem.' },
  ];
  return (
    <section id="market-alignment" className="section-pad bg-[hsl(var(--card))]">
      <div className="inner-container">
        <SectionHead eyebrow="Market Alignment (STP)">
          Strategic Market<br />
          <span className="text-[hsl(var(--accent))]">Positioning</span>
        </SectionHead>

        <div className="relative mt-10">
          {/* Vertical timeline line — md+ */}
          <div className="stp-line absolute left-6 top-0 hidden h-full w-px bg-gradient-to-b from-[hsl(var(--accent)/.22)] via-[hsl(var(--accent)/.52)] to-[hsl(var(--accent)/.22)] md:block" />

          {steps.map((step, i) => (
            <div key={step.title} className="stp-indent relative mb-6 last:mb-0 md:ml-16">
              {/* Dot */}
              <div className="stp-dot absolute -left-[4.6rem] top-5 hidden h-5 w-5 rounded-full border-4 border-[hsl(var(--accent))] bg-[hsl(var(--background))] md:block" />
              <motion.article
                initial={reduce ? undefined : { opacity: 0, x: 26 }}
                whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.28 }}
                transition={{ duration: 0.52, delay: i * 0.12 }}
                className="rounded-lg border-2 border-[hsl(var(--border))] bg-[hsl(var(--background)/.72)] p-6 shadow-sm transition-all duration-300 hover:border-[hsl(var(--accent)/.42)] hover:shadow-md sm:p-8"
              >
                <div className="mb-2.5 flex items-center gap-3">
                  <span className="font-mono text-xs text-[hsl(var(--accent)/.6)]">STEP {i + 1}</span>
                  <h3 className="text-sm font-semibold uppercase tracking-[.1em] text-[hsl(var(--accent))]">{step.title}</h3>
                </div>
                <p className="text-[15px] leading-[1.7] text-[hsl(var(--foreground))]">{step.text}</p>
              </motion.article>
            </div>
          ))}
        </div>

        <Reveal delay={0.25}>
          <p className="mt-8 text-center text-sm leading-[1.65] text-[hsl(var(--muted-foreground))]">
            Freya Poly Fab focuses on identifying textile market opportunities, serving diverse fabric buyers, and building a strong position through quality materials, reliable supply, and customer-focused solutions.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   MARKET SIZE
   ══════════════════════════════════════════════════════════ */
function MarketSize() {
  const reduce = useReducedMotion();
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInView = useInView(chartRef, { once: true, amount: 0.28 });

  const barData = [
    { name: 'India 2025',  value: 248.7, fill: '#0f3d5c' },
    { name: 'India 2034',  value: 656.3, fill: '#1a5f8b' },
    { name: 'Global 2025', value: 1160,  fill: '#b79a68' },
    { name: 'Global 2033', value: 1610,  fill: '#d4b883' },
  ];

  return (
    <section id="market-size" className="section-pad bg-[hsl(var(--background))]">
      <div className="inner-container">
        <SectionHead eyebrow="Market Size">
          Growing Textile<br />
          <span className="text-[hsl(var(--accent))]">Market Opportunity</span>
        </SectionHead>

        <div className="market-grid mt-10 grid gap-6 lg:grid-cols-2">
          <Reveal delay={0.1}>
            <div ref={chartRef} className="h-[320px] overflow-hidden rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-sm sm:h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 12, right: 12, left: 4, bottom: 48 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(74,70,64,.09)" />
                  <XAxis dataKey="name" angle={-12} textAnchor="end" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                    label={{ value: 'USD Billion', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '6px', fontSize: '12px' }}
                    formatter={(v) => [`$${v}B`, '']} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}
                    animationBegin={0} animationDuration={chartInView && !reduce ? 900 : 0}>
                    {barData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="flex flex-col gap-4">
              <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-[#0f3d5c] to-[#1a5f8b] p-5 text-white shadow-sm">
                <h3 className="mb-2 text-xs font-bold uppercase tracking-[.12em] opacity-90">Indian Textile &amp; Apparel Industry</h3>
                <div className="mb-2 flex items-center gap-5">
                  <div><span className="text-xs opacity-75">2025</span><br /><span className="text-2xl font-bold"><AnimatedNumber value={248} />B</span></div>
                  <ArrowRight size={16} className="opacity-60 shrink-0" />
                  <div><span className="text-xs opacity-75">2034</span><br /><span className="text-2xl font-bold"><AnimatedNumber value={656} />B</span></div>
                </div>
                <p className="text-sm leading-[1.6] opacity-90">India's textile and apparel industry is projected to reach USD 656.3 Billion by 2034.</p>
                <div className="absolute -right-5 -top-5 h-24 w-24 rounded-full bg-white opacity-[0.06]" />
              </div>
              <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-[#b79a68] to-[#d4b883] p-5 text-white shadow-sm">
                <h3 className="mb-2 text-xs font-bold uppercase tracking-[.12em] opacity-90">Global Textile &amp; Apparel Industry</h3>
                <div className="mb-2 flex items-center gap-5">
                  <div><span className="text-xs opacity-75">2025</span><br /><span className="text-2xl font-bold"><AnimatedNumber value={1160} />B</span></div>
                  <ArrowRight size={16} className="opacity-60 shrink-0" />
                  <div><span className="text-xs opacity-75">2033</span><br /><span className="text-2xl font-bold"><AnimatedNumber value={1610} />B</span></div>
                </div>
                <p className="text-sm leading-[1.6] opacity-90">The global textile market is projected to reach USD 1.61 trillion by 2033.</p>
                <div className="absolute -left-5 -bottom-5 h-24 w-24 rounded-full bg-white opacity-[0.06]" />
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-5 flex flex-col gap-4 sm:flex-row">
          <div className="flex-1 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--secondary)/.5)] p-4">
            <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-[.1em] text-[hsl(var(--accent))]">Market Trend</h3>
            <p className="text-sm leading-[1.6] text-[hsl(var(--foreground))]">The textile industry is growing with rising apparel demand, e-commerce expansion, sustainable fabric adoption, and evolving fashion trends.</p>
          </div>
          <div className="flex shrink-0 items-center justify-center rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-3 sm:self-stretch">
            <p className="text-center text-[10px] text-[hsl(var(--muted-foreground))]">Source: imarcgroup, grandviewresearch</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   REVENUE STREAMS
   ══════════════════════════════════════════════════════════ */
function RevenueStreams() {
  const reduce = useReducedMotion();
  const centerRef = useRef<HTMLDivElement>(null);
  const centerInView = useInView(centerRef, { once: true, amount: 0.28 });
  const colors = ['#0f3d5c', '#4a7ba7', '#b79a68'];

  return (
    <section id="revenue" className="section-pad bg-[hsl(var(--card))]">
      <div className="inner-container">
        <SectionHead eyebrow="Our Revenue Streams">
          Diversified Revenue<br />
          <span className="text-[hsl(var(--accent))]">Model</span>
        </SectionHead>

        {/* Desktop hub layout */}
        <div className="revenue-desktop mt-12 hidden lg:block">
          <div className="flex items-center justify-center gap-5">
            {/* Card 1 */}
            <motion.article initial={reduce ? undefined : { opacity: 0, x: -34 }} whileInView={reduce ? undefined : { opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.52, delay: 0.1 }}
              className="w-[17rem] rounded-xl border-2 border-[hsl(var(--border))] bg-[hsl(var(--background))] p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" style={{ '--hover': '#0f3d5c' } as any}>
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold" style={{ background: '#0f3d5c18', color: '#0f3d5c' }}>1</div>
              <h3 className="mb-2 text-base font-semibold text-[hsl(var(--foreground))]">{revenueStreams[0].title}</h3>
              <p className="text-sm leading-[1.7] text-[hsl(var(--muted-foreground))]">{revenueStreams[0].text}</p>
            </motion.article>

            {/* Hub */}
            <div className="flex shrink-0 items-center gap-3">
              <ArrowRight size={16} className="text-[hsl(var(--accent)/.4)]" />
              <motion.div ref={centerRef}
                animate={centerInView && !reduce ? { scale: [1, 1.07, 1] } : {}}
                transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                className="relative flex h-32 w-32 items-center justify-center rounded-full border-[5px] border-[hsl(var(--accent))] bg-gradient-to-br from-[hsl(var(--accent)/.12)] via-[hsl(var(--secondary))] to-[hsl(var(--accent)/.06)] shadow-lg">
                <div className="text-center">
                  <div className="text-[9px] font-bold uppercase tracking-[.14em] text-[hsl(var(--accent))]">Revenue</div>
                  <div className="text-sm font-bold text-[hsl(var(--primary))]">Model</div>
                </div>
              </motion.div>
              <ArrowRight size={16} className="text-[hsl(var(--accent)/.4)]" />
            </div>

            {/* Card 2 */}
            <motion.article initial={reduce ? undefined : { opacity: 0, x: 34 }} whileInView={reduce ? undefined : { opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.52, delay: 0.2 }}
              className="w-[17rem] rounded-xl border-2 border-[hsl(var(--border))] bg-[hsl(var(--background))] p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold" style={{ background: '#4a7ba718', color: '#4a7ba7' }}>2</div>
              <h3 className="mb-2 text-base font-semibold text-[hsl(var(--foreground))]">{revenueStreams[1].title}</h3>
              <p className="text-sm leading-[1.7] text-[hsl(var(--muted-foreground))]">{revenueStreams[1].text}</p>
            </motion.article>
          </div>

          {/* Card 3 below */}
          <div className="mt-5 flex justify-center">
            <motion.article initial={reduce ? undefined : { opacity: 0, y: 26 }} whileInView={reduce ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.52, delay: 0.32 }}
              className="max-w-[42rem] rounded-xl border-2 border-[hsl(var(--border))] bg-[hsl(var(--background))] p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold" style={{ background: '#b79a6818', color: '#b79a68' }}>3</div>
              <h3 className="mb-2 text-base font-semibold text-[hsl(var(--foreground))]">{revenueStreams[2].title}</h3>
              <p className="text-sm leading-[1.7] text-[hsl(var(--muted-foreground))]">{revenueStreams[2].text}</p>
            </motion.article>
          </div>
        </div>

        {/* Mobile / tablet: simple stacked cards */}
        <div className="revenue-mobile mt-10 grid gap-5 sm:grid-cols-3 lg:hidden">
          {revenueStreams.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08} className="flex">
              <article className="flex flex-1 flex-col rounded-xl border-2 border-[hsl(var(--border))] bg-[hsl(var(--background))] p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:p-6">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold" style={{ background: `${colors[i]}18`, color: colors[i] }}>{i + 1}</div>
                <h3 className="mb-2 text-sm font-semibold text-[hsl(var(--foreground))]">{s.title}</h3>
                <p className="flex-1 text-sm leading-[1.65] text-[hsl(var(--muted-foreground))]">{s.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   COMPETITIVE LANDSCAPE
   ══════════════════════════════════════════════════════════ */
function CompetitiveLandscape() {
  const reduce = useReducedMotion();
  const edgeItems = [
    { title: 'Quality Assurance:',         text: 'Providing reliable and premium fabric solutions with a focus on consistent quality and customer requirements.' },
    { title: 'Efficient Supply Network:',  text: 'Building strong supplier relationships to ensure timely availability, smooth sourcing, and dependable delivery.' },
    { title: 'Customer-Centric Approach:', text: 'Offering flexible textile solutions and personalized service to create long-term partnerships with garment businesses.' },
  ];

  return (
    <section id="competitive" className="section-pad bg-[hsl(var(--background))]">
      <div className="inner-container">
        <SectionHead eyebrow="Competitive Landscape & Our Unique Advantage">
          Standing Out in<br />
          <span className="text-[hsl(var(--accent))]">the Market</span>
        </SectionHead>

        <div className="competitive-grid mt-10 grid items-stretch gap-6 lg:grid-cols-2">
          <motion.div initial={reduce ? undefined : { opacity: 0, x: -26 }} whileInView={reduce ? undefined : { opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.22 }} transition={{ duration: 0.52, delay: 0.1 }}
            className="flex flex-col gap-5">
            <article className="flex-1 rounded-lg border border-[hsl(var(--border)/.6)] bg-[hsl(var(--muted)/.28)] p-6 sm:p-7">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-[hsl(var(--muted-foreground)/.1)]">
                <ShieldCheck size={17} className="text-[hsl(var(--muted-foreground)/.52)]" />
              </div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-[.08em] text-[hsl(var(--muted-foreground))]">Existing Solutions</h3>
              <p className="text-sm leading-[1.65] text-[hsl(var(--foreground)/.68)]">
                Surat's textile market offers multiple fabric traders, wholesalers, and manufacturers providing diverse textile materials, bulk supply, and competitive pricing through established local sourcing networks.
              </p>
            </article>
            <article className="flex-1 rounded-lg border-2 border-[hsl(var(--destructive)/.32)] bg-[hsl(var(--card))] p-6 sm:p-7">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-[hsl(var(--destructive)/.08)]">
                <X size={17} className="text-[hsl(var(--destructive))]" />
              </div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-[.08em] text-[hsl(var(--destructive))]">Issues with Existing Solutions</h3>
              <p className="text-sm leading-[1.65] text-[hsl(var(--foreground))]">
                Existing suppliers often face challenges like inconsistent quality, limited customization, delayed deliveries, fragmented supply chains, and difficulty maintaining reliable long-term partnerships.
              </p>
            </article>
          </motion.div>

          <motion.div initial={reduce ? undefined : { opacity: 0, x: 26 }} whileInView={reduce ? undefined : { opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.22 }} transition={{ duration: 0.52, delay: 0.22 }}
            className="relative overflow-hidden rounded-xl border-2 border-[hsl(var(--accent)/.52)] bg-gradient-to-br from-[hsl(var(--accent)/.07)] to-[hsl(var(--secondary))] p-6 shadow-md sm:p-8">
            <div className="pointer-events-none absolute right-0 top-0 h-28 w-28 rounded-full bg-[hsl(var(--accent)/.07)]" />
            <div className="relative">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[hsl(var(--accent))]">
                  <Sparkles size={21} className="text-white" />
                </div>
                <h3 className="text-base font-semibold uppercase tracking-[.08em] text-[hsl(var(--accent))] sm:text-lg">Our Edge</h3>
              </div>
              <div className="space-y-4">
                {edgeItems.map((item, i) => (
                  <motion.div key={item.title}
                    initial={reduce ? undefined : { opacity: 0, y: 9 }} whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.36, delay: 0.36 + i * 0.09 }}
                    className="flex gap-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--accent)/.18)]">
                      <Check size={11} className="text-[hsl(var(--accent))]" />
                    </div>
                    <div>
                      <h4 className="mb-0.5 text-sm font-semibold text-[hsl(var(--foreground))]">{item.title}</h4>
                      <p className="text-sm leading-[1.65] text-[hsl(var(--muted-foreground))]">{item.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   G2M STRATEGY
   ══════════════════════════════════════════════════════════ */
function G2MStrategy() {
  const reduce = useReducedMotion();
  return (
    <section id="g2m" className="section-pad bg-[hsl(var(--card))]">
      <div className="inner-container">
        <SectionHead eyebrow="Go-To-Market (G2M) Strategy">
          Strategic Market<br />
          <span className="text-[hsl(var(--accent))]">Expansion</span>
        </SectionHead>

        <div className="g2m-track mt-10 flex gap-3 overflow-x-auto pb-3 scrollbar-thin sm:flex-wrap sm:overflow-x-visible sm:pb-0">
          {g2mItems.map(({ label, Icon }, i) => (
            <motion.div key={label}
              initial={reduce ? undefined : { opacity: 0, x: -16 }}
              whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.36, delay: i * 0.06 }}
              className="group relative flex min-w-[185px] shrink-0 flex-col items-center gap-2.5 rounded-full border-2 border-[hsl(var(--border))] bg-gradient-to-br from-[hsl(var(--background))] to-[hsl(var(--secondary)/.35)] px-5 py-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[hsl(var(--accent)/.52)] hover:shadow-md sm:min-w-[195px]"
            >
              <Icon size={21} className="text-[hsl(var(--accent))] transition-transform duration-300 group-hover:scale-110" />
              <span className="text-center text-xs font-semibold uppercase tracking-[.07em] text-[hsl(var(--foreground))]">{label}</span>
            </motion.div>
          ))}
        </div>

        <Reveal delay={0.35}>
          <p className="mt-8 text-center text-sm leading-[1.65] text-[hsl(var(--muted-foreground))]">
            Freya Poly Fab aims to accelerate growth through strong customer relationships, reliable sourcing, digital reach, and strategic market expansion.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   GROWTH STRATEGY
   ══════════════════════════════════════════════════════════ */
function GrowthStrategy() {
  const reduce = useReducedMotion();
  const lineRef = useRef<HTMLDivElement>(null);
  const lineInView = useInView(lineRef, { once: true, amount: 0.28 });

  const phases = [
    {
      title: 'Short-Term Perspective', delay: 0.32,
      items: [
        'Establish a textile manufacturing unit with required machinery and infrastructure.',
        'Develop in-house production capabilities to ensure better quality control and efficient supply.',
        'Expand customer base across garment manufacturers, wholesalers, and apparel businesses.',
      ],
    },
    {
      title: 'Long-Term Perspective', delay: 0.52,
      items: [
        'Increase manufacturing capacity and expand into diverse textile product categories.',
        'Build a strong regional and national distribution network for wider market reach.',
        'Position Freya Poly Fab as a recognized textile manufacturing brand in the apparel supply chain.',
      ],
    },
  ];

  return (
    <section id="growth" className="section-pad bg-[hsl(var(--background))]">
      <div className="inner-container">
        <Reveal>
          <div className="eyebrow mb-4">Our Growth &amp; Expansion Strategy</div>
          <h2 className="display max-w-[660px] font-semibold text-[hsl(var(--primary))]"
            style={{ fontSize: 'clamp(1.75rem, 3.8vw, 3.4rem)' }}>
            From Trading to<br />
            <span className="text-[hsl(var(--accent))]">Manufacturing Excellence</span>
          </h2>
          <p className="mt-5 max-w-[620px] text-[15px] leading-[1.72] text-[hsl(var(--muted-foreground))]">
            <strong className="text-[hsl(var(--foreground))]">Goal:</strong> To transform Freya Poly Fab into a leading textile manufacturing and supply company by establishing a manufacturing unit, expanding production capabilities, and building a strong presence in the apparel industry.
          </p>
        </Reveal>

        <div ref={lineRef} className="relative mt-14">
          {/* Horizontal timeline — desktop only */}
          <div className="growth-line absolute inset-x-0 top-10 hidden h-px lg:block">
            <motion.div initial={{ scaleX: 0 }} animate={lineInView && !reduce ? { scaleX: 1 } : {}}
              transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
              className="h-full w-full origin-left bg-gradient-to-r from-[hsl(var(--accent)/.32)] via-[hsl(var(--accent))] to-[hsl(var(--accent)/.32)]"
            />
          </div>

          <div className="growth-grid grid items-stretch gap-6 lg:grid-cols-2 lg:gap-12">
            {phases.map((phase, pi) => (
              <div key={phase.title} className="relative flex">
                {/* Timeline dot */}
                <div className="growth-dot absolute left-1/2 top-0 z-10 -translate-x-1/2 hidden h-6 w-6 items-center justify-center rounded-full border-4 border-[hsl(var(--accent))] bg-[hsl(var(--background))] lg:flex" />

                <motion.article
                  initial={reduce ? undefined : { opacity: 0, y: 26 }}
                  whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.16 }}
                  transition={{ duration: 0.56, delay: phase.delay }}
                  className="growth-mt flex flex-1 flex-col overflow-hidden rounded-xl border-2 border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-md transition-all duration-300 hover:border-[hsl(var(--accent)/.46)] hover:shadow-lg lg:mt-14"
                >
                  <div className="border-b border-[hsl(var(--border))] bg-gradient-to-r from-[hsl(var(--accent)/.08)] to-transparent p-6 sm:p-7">
                    <h3 className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[.09em] text-[hsl(var(--accent))] sm:text-base">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--accent))] text-xs font-bold text-white">{pi + 1}</span>
                      {phase.title}
                    </h3>
                  </div>
                  <div className="flex-1 p-6 sm:p-7">
                    <ul className="space-y-3.5">
                      {phase.items.map((item, ii) => (
                        <li key={ii} className="flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[hsl(var(--accent))]" />
                          <span className="text-sm leading-[1.65] text-[hsl(var(--foreground))]">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.article>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   FUND UTILIZATION
   ══════════════════════════════════════════════════════════ */
function FundUtilization() {
  const reduce = useReducedMotion();
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInView = useInView(chartRef, { once: true, amount: 0.28 });

  const data = [
    { name: 'Manufacturing Unit Setup',    value: 40, color: '#0f3d5c' },
    { name: 'Raw Material & Inventory',    value: 30, color: '#4a7ba7' },
    { name: 'Marketing & Market Expansion',value: 15, color: '#b79a68' },
    { name: 'Working Capital & Operations',value: 15, color: '#d4b883' },
  ];

  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }: any) => {
    const R = Math.PI / 180;
    const r = innerRadius + (outerRadius - innerRadius) * 0.5;
    return (
      <text x={cx + r * Math.cos(-midAngle * R)} y={cy + r * Math.sin(-midAngle * R)}
        fill="white" textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight={700}>
        {`${value}%`}
      </text>
    );
  };

  return (
    <section id="fund-utilization" className="section-pad bg-[hsl(var(--card))]">
      <div className="inner-container">
        <SectionHead eyebrow="Fund Utilization">
          Strategic Investment<br />
          <span className="text-[hsl(var(--accent))]">Allocation</span>
        </SectionHead>

        <div className="fund-grid mt-10 grid items-start gap-8 lg:grid-cols-2">
          <Reveal delay={0.1}>
            <div ref={chartRef} className="rounded-xl border-2 border-[hsl(var(--border))] bg-[hsl(var(--background))] p-5 shadow-md">
              <div className="h-[250px] sm:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data} cx="50%" cy="50%" labelLine={false} label={renderLabel}
                      outerRadius="68%" innerRadius="40%" dataKey="value" paddingAngle={2}
                      animationBegin={0} animationDuration={chartInView && !reduce ? 900 : 0}>
                      {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <RechartsTooltip
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '6px', fontSize: '12px' }}
                      formatter={(v, n) => [`${v}%`, n]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {data.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <span className="h-3 w-3 shrink-0 rounded-sm" style={{ backgroundColor: item.color }} />
                    <span className="text-xs leading-[1.4] text-[hsl(var(--foreground)/.72)]">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <motion.div initial={reduce ? undefined : { opacity: 0, x: 26 }} whileInView={reduce ? undefined : { opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.26 }} transition={{ duration: 0.56, delay: 0.2 }}
            className="overflow-hidden rounded-xl border-l-4 border-[hsl(var(--accent))] bg-gradient-to-br from-[hsl(var(--accent)/.07)] to-[hsl(var(--background))] p-6 shadow-md sm:p-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[hsl(var(--accent))]">
                <TrendingUp size={22} className="text-white" />
              </div>
              <h3 className="text-base font-semibold uppercase tracking-[.09em] text-[hsl(var(--accent))] sm:text-lg">Our Ask</h3>
            </div>
            <p className="mb-5 text-sm leading-[1.72] text-[hsl(var(--foreground))] sm:text-base">
              Strategic fund allocation will enable Freya Poly Fab to establish manufacturing capabilities, strengthen production, and drive sustainable market expansion.
            </p>
            <div className="space-y-2.5">
              {data.map((item, i) => (
                <motion.div key={item.name}
                  initial={reduce ? undefined : { opacity: 0, x: 9 }} whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.34, delay: 0.26 + i * 0.07 }}
                  className="flex items-center justify-between rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card)/.5)] px-4 py-2.5 transition-all duration-300 hover:border-[hsl(var(--accent)/.42)] hover:bg-[hsl(var(--card))]">
                  <div className="flex items-center gap-2.5">
                    <span className="h-3 w-3 shrink-0 rounded-sm" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-[hsl(var(--foreground))]">{item.name}</span>
                  </div>
                  <span className="text-lg font-bold text-[hsl(var(--accent))]">
                    <AnimatedNumber value={item.value} />%
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   LEADERSHIP
   ══════════════════════════════════════════════════════════ */
function Leadership() {
  const reduce = useReducedMotion();
  return (
    <section id="leadership" className="section-pad bg-[hsl(var(--background))]">
      <div className="inner-container">
        <SectionHead eyebrow="Leadership & Expertise">
          Driven by Industry<br />
          <span className="text-[hsl(var(--accent))]">Experience</span>
        </SectionHead>

        <div className="leadership-grid mt-10 grid items-center gap-10 lg:grid-cols-[38fr_62fr] lg:gap-14">
          <motion.div initial={reduce ? undefined : { opacity: 0, scale: 0.93 }} whileInView={reduce ? undefined : { opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.26 }} transition={{ duration: 0.62, delay: 0.1 }}
            className="leader-avatar flex justify-center">
            <div className="relative">
              <div className="relative flex h-52 w-52 items-center justify-center overflow-hidden rounded-full border-4 border-[hsl(var(--accent))] bg-gradient-to-br from-[hsl(var(--accent)/.13)] via-[hsl(var(--secondary))] to-[hsl(var(--accent)/.07)] shadow-2xl sm:h-60 sm:w-60">
                <Users size={86} strokeWidth={1} className="text-[hsl(var(--accent)/.42)] sm:size-[104px]" />
              </div>
              <div className="absolute -right-2 -top-2 flex h-12 w-12 items-center justify-center rounded-full border-4 border-[hsl(var(--background))] bg-[hsl(var(--accent))] shadow-md">
                <Sparkles size={22} className="text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div initial={reduce ? undefined : { opacity: 0, x: 26 }} whileInView={reduce ? undefined : { opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.26 }} transition={{ duration: 0.62, delay: 0.2 }}
            className="relative overflow-hidden rounded-xl border-2 border-[hsl(var(--border))] bg-gradient-to-br from-[hsl(var(--card))] to-[hsl(var(--secondary)/.3)] p-6 shadow-md sm:p-8">
            <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-[hsl(var(--accent)/.05)]" />
            <div className="relative">
              <h3 className="text-xl font-semibold text-[hsl(var(--primary))] sm:text-2xl">Devyani Ramnik Timbadiya</h3>
              <p className="mb-5 mt-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[.14em] text-[hsl(var(--accent))]">
                <span className="h-px w-6 bg-[hsl(var(--accent))]" />Proprietor
              </p>
              <div className="space-y-3.5 text-[15px] leading-[1.72] text-[hsl(var(--foreground))]">
                <p>Devyani Ramnik Timbadiya, Founder of Freya Poly Fab, holds a Bachelor of Commerce (B.Com) qualification and brings 10–15 years of industry experience in the textile and garment sector.</p>
                <p>With strong understanding of fabric trading, market requirements, customer relationships, and business operations, she has developed expertise in managing textile supply processes.</p>
                <p>Her vision and industry knowledge drive Freya Poly Fab's growth towards becoming a trusted textile manufacturing and supply partner.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   HOME PAGE
   ══════════════════════════════════════════════════════════ */
function Home() {
  useEffect(() => {
    document.title = 'Freya Poly Fab — Weaving Quality Fabrics, Building Fashion Futures.';
    const desc = 'Freya Poly Fab is a growing textile trading company specializing in quality fabrics and textile materials with reliable sourcing, timely delivery, and customer-focused solutions for the apparel industry.';
    const setMeta = (name: string, content: string, property = false) => {
      const attr = property ? 'property' : 'name';
      let tag = document.head.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!tag) { tag = document.createElement('meta'); tag.setAttribute(attr, name); document.head.appendChild(tag); }
      tag.content = content;
    };
    setMeta('description', desc);
    setMeta('og:title', 'Freya Poly Fab — Weaving Quality Fabrics, Building Fashion Futures.', true);
    setMeta('og:description', desc, true);
    setMeta('og:type', 'website', true);
    const hash = window.location.hash.slice(1);
    if (hash) setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
  }, []);

  return (
    <div className="site-shell">
      <Header />
      <main>
        <Hero />
        <About />
        <Mission />
        <Challenges />
        <Solutions />
        <Offerings />
        <USP />
        <MarketAlignment />
        <MarketSize />
        <RevenueStreams />
        <CompetitiveLandscape />
        <G2MStrategy />
        <GrowthStrategy />
        <FundUtilization />
        <Leadership />
      </main>
      <Footer />
      <button
        type="button"
        onClick={() => goTo('home')}
        className="fixed bottom-5 right-5 z-30 flex h-10 w-10 items-center justify-center border border-[hsl(var(--border))] bg-[hsl(var(--card)/.88)] text-[hsl(var(--primary))] shadow-[var(--shadow-sm)] backdrop-blur-sm transition hover:-translate-y-1 hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))]"
        aria-label="Back to top"
        data-testid="button-back-top"
      >
        <CircleArrowUp size={17} />
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   APP ROOT
   ══════════════════════════════════════════════════════════ */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ErrorBoundary>
          <Switch>
            <Route path="/"            component={Home} />
            <Route path="/contact"     component={ContactPage} />
            <Route path="/admin/login" component={AdminLogin} />
            <Route path="/admin">
              {() => (
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              )}
            </Route>
            <Route component={() => (
              <div className="flex min-h-screen items-center justify-center bg-[hsl(var(--background))]">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-[hsl(var(--primary))]">404 — Page Not Found</h1>
                  <a href="/" className="mt-4 inline-block text-[hsl(var(--accent))] underline underline-offset-4">Go Home</a>
                </div>
              </div>
            )} />
          </Switch>
        </ErrorBoundary>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
