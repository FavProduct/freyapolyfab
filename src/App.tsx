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
  { title: 'Fragmented Supply Chain',      text: 'Lack of coordination between fabric suppliers, mills, and buyers leads to delays and inefficiencies in textile operations.',      icon: Network    },
  { title: 'Rising Raw Material Costs',    text: 'Increasing prices of yarn, greige fabrics, and processing inputs impact profitability and create pricing challenges.',            icon: TrendingUp },
  { title: 'Quality & Reliability Issues', text: 'Maintaining consistent fabric specs and ensuring timely supply remains a challenge in a competitive textile market.',             icon: ShieldCheck},
  { title: 'Intense Market Competition',   text: 'Growing competition among textile suppliers creates pressure on pricing, consistency, and customer retention.',                  icon: Target     },
];

const solutions = [
  { number: '01', title: 'Reliable Fabric Supply',    text: 'Providing quality textile materials with consistent availability, stable specifications, and timely delivery.',        icon: ShieldCheck },
  { number: '02', title: 'Customer-Centric Approach', text: 'Offering tailored fabric solutions and responsive order management to meet diverse garment manufacturing requirements.', icon: Target     },
  { number: '03', title: 'Quality & Trust Focus',     text: 'Ensuring superior fabric standards through reliable sourcing channels and strong textile industry networks.',          icon: Sparkles   },
];

const fabricCategories = [
  {
    number: '01',
    title: 'Polyester Blends',
    subtitle: 'High Tensile & Durable',
    text: 'Versatile polyester-cotton and poly-viscose blends engineered for high performance, shrink resistance, and long-lasting garment shape retention.',
    image: '/fabric-rolls.jpg',
    specs: 'GSM 140–280 · High Strength',
  },
  {
    number: '02',
    title: 'Micro & Texture Weaves',
    subtitle: 'Soft Handfeel & Drape',
    text: 'Finely textured micro-weaves and breathable structures tailored for modern shirting, daily wear, and premium garment collections.',
    image: '/fabric-weave.jpg',
    specs: 'Breathable · Smooth Finish',
  },
  {
    number: '03',
    title: 'Twills & Dobbies',
    subtitle: 'Structured Depth',
    text: 'Rich surface textures and high-density weaves designed for formal apparel, uniforms, trousers, and structured outerwear.',
    image: '/fabric-detail.jpg',
    specs: 'High Density · Wrinkle Resistant',
  },
  {
    number: '04',
    title: 'Custom Finished Fabrics',
    subtitle: 'Tailored Sourcing',
    text: 'Client-specific fabric sourcing, customized shades, specialty finishes, and flexible batch volumes for growing garment brands.',
    image: '/fabric-weave.jpg',
    specs: 'Custom Shades · Batch Flexibility',
  },
];

const offerings = [
  { title: 'Premium Fabric Supply',       text: 'Providing quality textile materials for garment manufacturers and apparel businesses.',              icon: Package  },
  { title: 'Diverse Textile Range',       text: 'Offering a wide selection of polyester and specialty fabric solutions to meet market demands.',     icon: Layers3  },
  { title: 'Reliable Trading Network',    text: 'Ensuring smooth sourcing and timely delivery through strong manufacturer and supplier connections.', icon: Network  },
  { title: 'Customized Fabric Solutions', text: 'Delivering flexible textile options based on specific client design and volume requirements.',       icon: Store    },
];

const uspPoints = [
  { number: '01', title: 'Quality-Driven Approach',    text: 'Ensuring premium fabric quality through reliable sourcing, inspection, and material selection.' },
  { number: '02', title: 'Strong Supplier Network',    text: 'Building efficient supply channels for consistent availability of textile materials.' },
  { number: '03', title: 'Customer-Focused Solutions', text: 'Providing flexible fabric options aligned with client requirements and volume needs.' },
  { number: '04', title: 'Timely & Reliable Delivery', text: 'Maintaining strong delivery commitments through efficient order management and service.' },
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
      initial={reduce ? undefined : { opacity: 0, y: 16 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.62, delay, ease: [0.22, 1, 0.36, 1] }}
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
        fill="none" stroke="rgba(183,154,104,.65)" strokeWidth="1.1"
      />
      <path d="M4 46 C78 4 114 75 186 35 S303 27 356 50 S427 73 476 16"
        fill="none" stroke="rgba(74,70,64,.07)" strokeWidth=".6" transform="translate(0,4)" />
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
    const dur = 1200;
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

function SectionHead({ eyebrow, children, description }: { eyebrow: string; children: ReactNode; description?: string }) {
  return (
    <Reveal>
      <div className="eyebrow mb-3.5">{eyebrow}</div>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <h2 className="display max-w-[620px] font-semibold text-[hsl(var(--primary))]"
          style={{ fontSize: 'clamp(1.75rem, 3.6vw, 3rem)' }}>
          {children}
        </h2>
        {description && (
          <p className="max-w-[340px] text-xs leading-[1.65] text-[hsl(var(--muted-foreground))] sm:text-sm">
            {description}
          </p>
        )}
      </div>
    </Reveal>
  );
}

/* ══════════════════════════════════════════════════════════
   HERO SECTION
   ══════════════════════════════════════════════════════════ */
function Hero() {
  const reduce = useReducedMotion();
  return (
    <section id="home" className="relative isolate overflow-hidden bg-[hsl(var(--background))]">
      {/* Warm subtle background lighting */}
      <div className="pointer-events-none absolute inset-0 -z-10" style={{
        background: 'radial-gradient(circle at 75% 25%, rgba(229,212,184,.35), transparent 36%), linear-gradient(110deg, rgba(250,248,243,.98) 25%, rgba(245,241,232,.78) 100%)'
      }} />

      {/* Decorative rings — desktop only */}
      <div className="hero-deco-circle pointer-events-none absolute right-[-5%] top-[8%] h-[64vw] w-[64vw] max-h-[640px] max-w-[640px] rounded-full border border-[hsl(var(--accent)/.14)] max-md:hidden" />
      <div className="hero-deco-circle pointer-events-none absolute right-[12%] top-[22%] h-[40vw] w-[40vw] max-h-[420px] max-w-[420px] rounded-full border border-dashed border-[hsl(var(--accent)/.1)] max-md:hidden" />

      {/* Thread SVG */}
      <Thread className="right-[-20px] top-[32%] hidden w-[480px] rotate-[-7deg] opacity-70 lg:block" />

      {/* ── Two-column grid ─────────────────────────────── */}
      <div className="hero-grid relative z-10 mx-auto grid max-w-[var(--max-w)] items-center gap-10 px-[var(--gutter)] pb-14 pt-28 md:grid-cols-[46fr_54fr] md:gap-10 md:pb-16 md:pt-32 lg:gap-14 lg:pb-20 lg:pt-36">

        {/* TEXT */}
        <motion.div
          className="hero-text flex flex-col items-start"
          initial={reduce ? undefined : { opacity: 0, y: 18 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="eyebrow mb-3.5">Textile Trading &amp; Supply Partner</div>
          <h1
            className="display max-w-[560px] font-semibold text-[hsl(var(--foreground))]"
            style={{ fontSize: 'clamp(2.1rem, 4.8vw, 4.2rem)', lineHeight: 1.08 }}
          >
            Weaving Quality Fabrics,{' '}
            <span className="text-[hsl(var(--accent))]">Building Fashion Futures.</span>
          </h1>

          <p className="mt-5 max-w-[460px] text-sm leading-[1.75] text-[hsl(var(--muted-foreground))] sm:text-[15px]">
            Quality fabrics and dependable textile solutions for garment manufacturers, wholesalers, and fashion businesses.
          </p>

          {/* CTA Buttons: Primary & Secondary */}
          <div className="hero-buttons mt-8 flex flex-wrap items-center gap-3.5 sm:gap-4">
            <button
              type="button"
              onClick={() => goTo('solutions')}
              className="inline-flex min-h-[48px] min-w-[200px] items-center justify-center gap-3 bg-[hsl(var(--accent))] px-6 py-3.5 text-xs font-semibold uppercase tracking-[.13em] text-white shadow-sm transition hover:bg-[hsl(var(--accent)/.88)] active:scale-[.99]"
              data-testid="button-hero-solutions"
            >
              Explore Our Solutions <ArrowRight size={15} />
            </button>
            <button
              type="button"
              onClick={() => goTo('contact')}
              className="inline-flex min-h-[48px] min-w-[176px] items-center justify-center gap-3 border border-[hsl(var(--accent)/.65)] bg-transparent px-6 py-3.5 text-xs font-semibold uppercase tracking-[.13em] text-[hsl(var(--foreground))] transition hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))] hover:bg-[hsl(var(--accent)/.05)] active:scale-[.99]"
              data-testid="button-hero-contact"
            >
              Work With Us <ArrowRight size={15} />
            </button>
          </div>
        </motion.div>

        {/* IMAGE */}
        <motion.div
          className="hero-image-wrap relative mx-auto w-full"
          style={{ maxWidth: 'min(100%, 490px)' }}
          initial={reduce ? undefined : { opacity: 0, scale: 0.96 }}
          animate={reduce ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.12 }}
        >
          <div className="hero-image-inner relative overflow-hidden border border-[hsl(var(--border))] bg-[hsl(var(--secondary))] shadow-xl shadow-[rgba(74,70,64,.08)]"
            style={{ aspectRatio: '0.9' }}>
            <img
              src="/fabric-rolls.jpg"
              alt="Rolled textile fabrics in warm neutral tones"
              className="h-full w-full object-cover brightness-105 saturate-[.75]"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(250,248,243,.75)] via-transparent to-[rgba(229,212,184,.1)] pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between border-t border-[hsl(var(--foreground)/.14)] pt-3 text-[10px] uppercase tracking-[.17em] text-[hsl(var(--foreground)/.75)]">
              <span>Material / Texture / Supply</span>
              <span className="text-[hsl(var(--accent))] font-semibold">01—04</span>
            </div>
          </div>
          {/* Subtle corner accents */}
          <div className="absolute -bottom-3.5 -left-3.5 hidden h-16 w-16 border-b-2 border-l-2 border-[hsl(var(--accent)/.55)] sm:block pointer-events-none" />
          <div className="absolute -right-3.5 -top-3.5 hidden h-14 w-14 border-r-2 border-t-2 border-[hsl(var(--accent)/.5)] sm:block pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   ABOUT SECTION
   ══════════════════════════════════════════════════════════ */
function About() {
  return (
    <section id="about" className="section-pad bg-[hsl(var(--background))] border-t border-[hsl(var(--border)/.6)]">
      <div className="inner-container">
        <div className="about-grid grid items-center gap-10 lg:grid-cols-[46fr_54fr] lg:gap-16">

          <Reveal className="relative">
            <div className="fabric-panel aspect-[0.92] w-full max-w-[460px] border border-[hsl(var(--border))] shadow-md">
              <img src="/fabric-weave.jpg" alt="Close-up of woven textile fibers in warm neutral tones"
                className="h-full w-full object-cover brightness-105 saturate-[.75]" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-tr from-[rgba(183,154,104,.12)] to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 bg-[hsl(var(--secondary)/.95)] px-5 py-4 backdrop-blur-sm">
                <span className="block text-[10px] uppercase tracking-[.2em] font-semibold text-[hsl(var(--accent))]">Our Material Philosophy</span>
                <span className="mt-1 block text-sm font-semibold text-[hsl(var(--foreground))]">Reliable by Design</span>
              </div>
            </div>
            <div className="absolute -bottom-4 right-0 hidden h-12 w-12 border-b-2 border-r-2 border-[hsl(var(--accent))] sm:block pointer-events-none" />
          </Reveal>

          <Reveal delay={0.1}>
            <div className="eyebrow mb-3.5">About Freya Poly Fab</div>
            <h2 className="display max-w-[520px] font-semibold text-[hsl(var(--primary))]"
              style={{ fontSize: 'clamp(1.75rem, 3.6vw, 3.2rem)' }}>
              A Trusted Textile<br />Supply Partner
            </h2>
            <div className="mt-6 max-w-[540px] space-y-4 text-sm leading-[1.75] text-[hsl(var(--muted-foreground))] sm:text-[15px]">
              <p>Freya Poly Fab is a growing textile trading company specializing in the supply of quality fabrics and textile materials to meet the evolving needs of the apparel industry.</p>
              <p>With a strong focus on reliability, timely delivery, and customer satisfaction, the company aims to become a trusted partner for garment manufacturers and fashion businesses by providing dependable textile solutions.</p>
            </div>
            <button type="button" onClick={() => goTo('mission')}
              className="group mt-7 inline-flex items-center gap-2 border-b border-[hsl(var(--accent))] pb-1.5 text-xs font-semibold uppercase tracking-[.15em] text-[hsl(var(--foreground))] transition hover:text-[hsl(var(--accent))]"
              data-testid="button-about-learn">
              Learn Our Mission <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   MISSION & VISION — Strict Equal Height
   ══════════════════════════════════════════════════════════ */
function Mission() {
  const cards = [
    { label: 'Our Mission', text: 'To provide reliable textile solutions with superior quality, timely supply, and customer-focused service.',                                            number: '01' },
    { label: 'Our Vision',  text: 'To become a trusted textile partner by delivering quality fabrics and building sustainable growth in the apparel industry.',                          number: '02' },
  ];
  return (
    <section id="mission" className="section-pad textile-grid bg-[hsl(var(--card))] border-t border-[hsl(var(--border))]">
      <div className="inner-container">
        <SectionHead eyebrow="Mission & Vision">
          Built Around the<br />Business Relationship.
        </SectionHead>
        <div className="mission-grid mt-10 grid items-stretch gap-6 md:grid-cols-2">
          {cards.map((card, i) => (
            <Reveal key={card.label} delay={i * 0.1} className="flex h-full">
              <article className="relative flex flex-1 flex-col justify-between overflow-hidden rounded-sm border border-[hsl(var(--border))] bg-[hsl(var(--background)/.75)] p-6 shadow-sm transition-all hover:border-[hsl(var(--accent)/.5)] sm:p-8">
                <span className="absolute right-5 top-4 font-mono text-5xl font-light text-[hsl(var(--accent)/.2)] select-none">{card.number}</span>
                <div className="relative flex flex-1 flex-col">
                  <div className="eyebrow mb-4">{card.label}</div>
                  <p className="flex-1 text-base leading-[1.65] text-[hsl(var(--foreground))] sm:text-lg sm:leading-[1.7]">
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
   CHALLENGES — 4-col Desktop | 2×2 Mobile
   ══════════════════════════════════════════════════════════ */
function Challenges() {
  const reduce = useReducedMotion();
  const topAccents = ['#0f3d5c', '#4a7ba7', '#b79a68', '#d4b883'];

  return (
    <section id="challenges" className="section-pad bg-[hsl(var(--background))] border-t border-[hsl(var(--border))]">
      <div className="inner-container">
        <SectionHead eyebrow="Market Challenges" description="Addressing the key bottlenecks in current textile supply chains.">
          Challenges in the<br />
          <span className="text-[hsl(var(--accent))]">Textile Market</span>
        </SectionHead>

        {/* Strict 2×2 on Mobile, 4-col at LG */}
        <div className="challenges-grid mt-10 grid items-stretch gap-4 grid-cols-2 lg:grid-cols-4">
          {challenges.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.article
                key={c.title}
                initial={reduce ? undefined : { opacity: 0, y: 18 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.14 }}
                transition={{ duration: 0.44, delay: i * 0.06 }}
                className="group flex flex-col justify-between rounded-sm border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 shadow-sm transition-all duration-300 hover:shadow-md sm:p-6"
                style={{ borderTopWidth: '3px', borderTopColor: topAccents[i] }}
              >
                <div>
                  <div className="card-icon mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-[hsl(var(--accent)/.1)]">
                    <Icon size={17} strokeWidth={1.5} className="text-[hsl(var(--accent))]" />
                  </div>
                  <h3 className="mb-1.5 text-xs font-semibold leading-[1.35] text-[hsl(var(--foreground))] sm:text-sm sm:leading-[1.4]">{c.title}</h3>
                  <p className="text-xs leading-[1.55] text-[hsl(var(--muted-foreground))] sm:text-sm sm:leading-[1.6]">{c.text}</p>
                </div>
                <div className="mt-4 border-t border-[hsl(var(--border)/.6)] pt-2.5">
                  <span className="font-mono text-[11px] font-semibold text-[hsl(var(--accent)/.6)]">0{i + 1}</span>
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
   SOLUTIONS — 3-col Desktop | 1-col Mobile
   ══════════════════════════════════════════════════════════ */
function Solutions() {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const inView = useInView(trackRef, { once: true, amount: 0.28 });

  return (
    <section id="solutions" className="section-pad bg-[hsl(var(--card))] border-t border-[hsl(var(--border))]">
      <div className="inner-container">
        <SectionHead eyebrow="Solution We Offer" description="Freya Poly Fab bridges textile supply challenges by delivering quality fabrics, reliable sourcing, and customer-focused solutions.">
          Bridging Textile<br />
          <span className="text-[hsl(var(--accent))]">Supply Challenges</span>
        </SectionHead>

        <div ref={trackRef} className="relative mt-10">
          {/* Connector line — desktop only */}
          <div className="solutions-connector absolute left-[12%] right-[12%] top-[2.8rem] hidden h-px md:block">
            <motion.div
              initial={{ scaleX: 0 }} animate={inView && !reduce ? { scaleX: 1 } : {}}
              transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="h-full w-full origin-left bg-gradient-to-r from-[hsl(var(--accent)/.2)] via-[hsl(var(--accent)/.5)] to-[hsl(var(--accent)/.2)]"
            />
          </div>

          <div className="solutions-grid grid items-stretch gap-6 md:grid-cols-3">
            {solutions.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.article
                  key={s.number}
                  initial={reduce ? undefined : { opacity: 0, scale: 0.94 }}
                  whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.16 }}
                  transition={{ duration: 0.45, delay: 0.35 + i * 0.1 }}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-lg border-2 border-[hsl(var(--border))] bg-[hsl(var(--background))] p-6 transition-all duration-300 hover:border-[hsl(var(--accent))] sm:p-7 shadow-sm"
                >
                  <div className="absolute right-3.5 top-3.5 flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--accent)/.1)] font-mono text-xs font-bold text-[hsl(var(--accent))] transition-all duration-300 group-hover:bg-[hsl(var(--accent))] group-hover:text-white">
                    {s.number}
                  </div>
                  <div>
                    <div className="mb-4 mt-1"><Icon size={24} strokeWidth={1.5} className="text-[hsl(var(--accent))]" /></div>
                    <h3 className="text-base font-semibold text-[hsl(var(--foreground))] sm:text-lg">{s.title}</h3>
                    <p className="mt-2.5 text-xs leading-[1.65] text-[hsl(var(--muted-foreground))] sm:text-sm">{s.text}</p>
                  </div>
                  <motion.div
                    initial={{ width: 0 }} whileInView={{ width: '100%' }} viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
                    className="mt-6 h-[2px] bg-gradient-to-r from-[hsl(var(--accent))] to-transparent"
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
   FABRIC SUPPLY SHOWCASE — 4-Image Grid
   Desktop: 4 Columns | Mobile: Strict 2×2 (ALL 4 VISIBLE)
   ══════════════════════════════════════════════════════════ */
function FabricSupply() {
  const reduce = useReducedMotion();
  return (
    <section id="fabric-supply" className="section-pad bg-[hsl(var(--background))] border-t border-[hsl(var(--border))]">
      <div className="inner-container">
        <SectionHead eyebrow="Fabric Supply & Materials" description="Explore our core textile categories tailored for apparel manufacturers, wholesalers, and fashion brands.">
          Engineered Fabrics for<br />
          <span className="text-[hsl(var(--accent))]">Apparel Manufacturing</span>
        </SectionHead>

        {/* Strict 2×2 on Mobile, 4-col at LG — ALL 4 IMAGES VISIBLE */}
        <div className="fabric-grid mt-10 grid items-stretch gap-4 grid-cols-2 lg:grid-cols-4">
          {fabricCategories.map((item, i) => (
            <motion.article
              key={item.number}
              initial={reduce ? undefined : { opacity: 0, y: 20 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.14 }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="group flex flex-col overflow-hidden rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-sm transition-all duration-300 hover:shadow-md hover:border-[hsl(var(--accent)/.5)]"
            >
              {/* Image Container with Consistent Aspect Ratio */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[hsl(var(--secondary))] sm:aspect-[4/3.2]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover brightness-105 saturate-[.75] transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,.45)] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white">
                  <span className="text-[10px] font-bold uppercase tracking-[.14em] drop-shadow-sm">{item.subtitle}</span>
                  <span className="font-mono text-xs font-semibold text-white/90">{item.number}</span>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-5">
                <div>
                  <h3 className="text-xs font-semibold text-[hsl(var(--foreground))] sm:text-sm">{item.title}</h3>
                  <p className="mt-1.5 text-[11px] leading-[1.55] text-[hsl(var(--muted-foreground))] sm:text-xs sm:leading-[1.6]">{item.text}</p>
                </div>
                <div className="mt-3.5 border-t border-[hsl(var(--border)/.6)] pt-2.5">
                  <span className="inline-block rounded bg-[hsl(var(--secondary)/.8)] px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[hsl(var(--accent))]">
                    {item.specs}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   OFFERINGS — 4-col Desktop | 2×2 Mobile
   ══════════════════════════════════════════════════════════ */
function Offerings() {
  const reduce = useReducedMotion();
  return (
    <section id="offerings" className="section-pad bg-[hsl(var(--card))] border-t border-[hsl(var(--border))]">
      <div className="inner-container">
        <SectionHead eyebrow="Our Offerings" description="Comprehensive textile trading, fabric sourcing, and customized volume supply.">
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
                initial={reduce ? undefined : { opacity: 0, scale: 0.94 }}
                whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.14 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="group flex flex-col items-center justify-between rounded-xl bg-gradient-to-br from-[hsl(var(--background))] to-[hsl(var(--secondary)/.3)] p-4 text-center shadow-sm transition-all duration-300 hover:shadow-md hover:border-[hsl(var(--accent)/.4)] border border-[hsl(var(--border))] sm:p-6"
              >
                <div>
                  <div className="mb-3.5 mx-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--accent)/.12)] transition-colors duration-300 group-hover:bg-[hsl(var(--accent)/.22)]">
                    <Icon size={22} strokeWidth={1.5} className="text-[hsl(var(--accent))]" />
                  </div>
                  <h3 className="mb-1.5 text-xs font-semibold leading-[1.35] text-[hsl(var(--foreground))] sm:text-sm sm:leading-[1.4]">{o.title}</h3>
                  <p className="text-[11px] leading-[1.55] text-[hsl(var(--muted-foreground))] sm:text-xs sm:leading-[1.6]">{o.text}</p>
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
   WHY WE SERVE / USP — 4-col Desktop | 2×2 Mobile
   ══════════════════════════════════════════════════════════ */
function USP() {
  const reduce = useReducedMotion();
  return (
    <section id="usp" className="relative overflow-hidden bg-[hsl(var(--secondary))] border-t border-[hsl(var(--border))]">
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-35"
        style={{ background: 'radial-gradient(circle at 65% 46%, rgba(229,212,184,.5), transparent 28%)' }} />
      <Thread className="right-[-40px] top-[26%] hidden w-[480px] opacity-35 lg:block" />

      <div className="section-pad relative">
        <div className="inner-container">
          <SectionHead eyebrow="Why We Serve" description="Freya Poly Fab stands out through quality fabrics, dependable sourcing, and customer-focused textile solutions that drive long-term partnerships.">
            Why Work With<br />
            <span className="text-[hsl(var(--accent))]">Freya Poly Fab?</span>
          </SectionHead>

          {/* Strict 2×2 on Mobile, 4-col at LG — ALL 4 ITEMS VISIBLE */}
          <div className="usp-grid mt-10 grid items-stretch gap-4 grid-cols-2 lg:grid-cols-4">
            {uspPoints.map((item, i) => (
              <motion.article
                key={item.number}
                initial={reduce ? undefined : { opacity: 0, y: 18 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.16 }}
                transition={{ duration: 0.44, delay: i * 0.07 }}
                className="group flex flex-col justify-between gap-2.5 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card)/.8)] p-4 backdrop-blur-sm transition-all duration-300 hover:bg-[hsl(var(--card))] hover:shadow-md sm:p-6"
              >
                <div>
                  <div className="mb-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--accent)/.12)] font-mono text-xs font-bold text-[hsl(var(--accent))]">
                    {item.number}
                  </div>
                  <h3 className="mb-1 text-xs font-semibold uppercase tracking-[.06em] text-[hsl(var(--foreground))] sm:text-sm">{item.title}</h3>
                  <p className="text-[11px] leading-[1.55] text-[hsl(var(--muted-foreground))] sm:text-xs sm:leading-[1.6]">{item.text}</p>
                </div>
              </motion.article>
            ))}
          </div>
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
    <section id="market-alignment" className="section-pad bg-[hsl(var(--card))] border-t border-[hsl(var(--border))]">
      <div className="inner-container">
        <SectionHead eyebrow="Market Alignment (STP)">
          Strategic Market<br />
          <span className="text-[hsl(var(--accent))]">Positioning</span>
        </SectionHead>

        <div className="relative mt-10">
          {/* Vertical timeline line — md+ */}
          <div className="stp-line absolute left-6 top-0 hidden h-full w-px bg-gradient-to-b from-[hsl(var(--accent)/.2)] via-[hsl(var(--accent)/.5)] to-[hsl(var(--accent)/.2)] md:block" />

          {steps.map((step, i) => (
            <div key={step.title} className="stp-indent relative mb-5 last:mb-0 md:ml-16">
              {/* Dot */}
              <div className="stp-dot absolute -left-[4.6rem] top-5 hidden h-5 w-5 rounded-full border-4 border-[hsl(var(--accent))] bg-[hsl(var(--background))] md:block" />
              <motion.article
                initial={reduce ? undefined : { opacity: 0, x: 20 }}
                whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.22 }}
                transition={{ duration: 0.48, delay: i * 0.1 }}
                className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background)/.7)] p-5 shadow-sm transition-all duration-300 hover:border-[hsl(var(--accent)/.4)] hover:shadow-md sm:p-7"
              >
                <div className="mb-2 flex items-center gap-3">
                  <span className="font-mono text-xs font-semibold text-[hsl(var(--accent)/.7)]">STEP {i + 1}</span>
                  <h3 className="text-xs font-semibold uppercase tracking-[.1em] text-[hsl(var(--accent))] sm:text-sm">{step.title}</h3>
                </div>
                <p className="text-xs leading-[1.65] text-[hsl(var(--foreground))] sm:text-sm sm:leading-[1.7]">{step.text}</p>
              </motion.article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   MARKET SIZE — Light Premium Neutral Palette
   ══════════════════════════════════════════════════════════ */
function MarketSize() {
  const reduce = useReducedMotion();
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInView = useInView(chartRef, { once: true, amount: 0.28 });

  const barData = [
    { name: 'India 2025',  value: 248.7, fill: '#0f3d5c' },
    { name: 'India 2034',  value: 656.3, fill: '#4a7ba7' },
    { name: 'Global 2025', value: 1160,  fill: '#b79a68' },
    { name: 'Global 2033', value: 1610,  fill: '#d4b883' },
  ];

  return (
    <section id="market-size" className="section-pad bg-[hsl(var(--background))] border-t border-[hsl(var(--border))]">
      <div className="inner-container">
        <SectionHead eyebrow="Market Size & Opportunity">
          Growing Textile<br />
          <span className="text-[hsl(var(--accent))]">Market Opportunity</span>
        </SectionHead>

        <div className="market-grid mt-10 grid gap-6 lg:grid-cols-2">
          {/* Chart */}
          <Reveal delay={0.1}>
            <div ref={chartRef} className="h-[300px] overflow-hidden rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 shadow-sm sm:h-[340px] sm:p-5">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 12, right: 12, left: 4, bottom: 44 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(74,70,64,.08)" />
                  <XAxis dataKey="name" angle={-10} textAnchor="end" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                    label={{ value: 'USD Billion', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '4px', fontSize: '12px' }}
                    formatter={(v) => [`$${v}B`, 'Market Volume']} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}
                    animationBegin={0} animationDuration={chartInView && !reduce ? 900 : 0}>
                    {barData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Reveal>

          {/* Cards */}
          <Reveal delay={0.14}>
            <div className="flex flex-col gap-4">
              <div className="relative overflow-hidden rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-[.1em] text-[hsl(var(--primary))]">Indian Textile &amp; Apparel Market</h3>
                  <span className="rounded bg-[hsl(var(--secondary))] px-2 py-0.5 text-[10px] font-semibold text-[hsl(var(--accent))]">India Growth</span>
                </div>
                <div className="my-2.5 flex items-center gap-4">
                  <div><span className="text-[11px] text-[hsl(var(--muted-foreground))]">2025</span><br /><span className="text-2xl font-bold text-[hsl(var(--primary))]"><AnimatedNumber value={248} />B</span></div>
                  <ArrowRight size={15} className="text-[hsl(var(--accent))] shrink-0" />
                  <div><span className="text-[11px] text-[hsl(var(--muted-foreground))]">2034</span><br /><span className="text-2xl font-bold text-[hsl(var(--accent))]"><AnimatedNumber value={656} />B</span></div>
                </div>
                <p className="text-xs leading-[1.6] text-[hsl(var(--muted-foreground))]">India's textile and apparel industry is projected to reach USD 656.3 Billion by 2034.</p>
              </div>

              <div className="relative overflow-hidden rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-[.1em] text-[hsl(var(--primary))]">Global Textile &amp; Apparel Market</h3>
                  <span className="rounded bg-[hsl(var(--secondary))] px-2 py-0.5 text-[10px] font-semibold text-[hsl(var(--accent))]">Global Growth</span>
                </div>
                <div className="my-2.5 flex items-center gap-4">
                  <div><span className="text-[11px] text-[hsl(var(--muted-foreground))]">2025</span><br /><span className="text-2xl font-bold text-[hsl(var(--primary))]"><AnimatedNumber value={1160} />B</span></div>
                  <ArrowRight size={15} className="text-[hsl(var(--accent))] shrink-0" />
                  <div><span className="text-[11px] text-[hsl(var(--muted-foreground))]">2033</span><br /><span className="text-2xl font-bold text-[hsl(var(--accent))]"><AnimatedNumber value={1610} />B</span></div>
                </div>
                <p className="text-xs leading-[1.6] text-[hsl(var(--muted-foreground))]">The global textile market is projected to reach USD 1.61 trillion by 2033.</p>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <div className="flex-1 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--secondary)/.4)] p-3.5">
            <h3 className="mb-1 text-[11px] font-semibold uppercase tracking-[.1em] text-[hsl(var(--accent))]">Market Trend</h3>
            <p className="text-xs leading-[1.6] text-[hsl(var(--foreground))]">The textile industry is growing steadily with rising apparel demand, e-commerce expansion, and structured supply chain adoption.</p>
          </div>
          <div className="flex shrink-0 items-center justify-center rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-2.5 sm:self-stretch">
            <p className="text-center text-[10px] text-[hsl(var(--muted-foreground))]">Source: imarcgroup, grandviewresearch</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   REVENUE STREAMS — Light Warm Cards
   ══════════════════════════════════════════════════════════ */
function RevenueStreams() {
  const colors = ['#0f3d5c', '#4a7ba7', '#b79a68'];

  return (
    <section id="revenue" className="section-pad bg-[hsl(var(--card))] border-t border-[hsl(var(--border))]">
      <div className="inner-container">
        <SectionHead eyebrow="Our Revenue Streams">
          Diversified Revenue<br />
          <span className="text-[hsl(var(--accent))]">Model</span>
        </SectionHead>

        {/* 3 Equal Cards */}
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {revenueStreams.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08} className="flex h-full">
              <article className="flex flex-1 flex-col justify-between rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-5 shadow-sm transition-all duration-300 hover:border-[hsl(var(--accent)/.5)] hover:shadow-md sm:p-6">
                <div>
                  <div className="mb-3.5 flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold" style={{ background: `${colors[i]}15`, color: colors[i] }}>
                    0{i + 1}
                  </div>
                  <h3 className="mb-2 text-sm font-semibold text-[hsl(var(--foreground))]">{s.title}</h3>
                  <p className="text-xs leading-[1.65] text-[hsl(var(--muted-foreground))] sm:text-sm">{s.text}</p>
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
   COMPETITIVE LANDSCAPE
   ══════════════════════════════════════════════════════════ */
function CompetitiveLandscape() {
  const reduce = useReducedMotion();
  const edgeItems = [
    { title: 'Quality Assurance:',         text: 'Providing reliable and premium fabric solutions with consistent quality standards and strict material inspections.' },
    { title: 'Efficient Supply Network:',  text: 'Building strong supplier relationships to ensure timely availability, smooth sourcing, and dependable delivery.' },
    { title: 'Customer-Centric Approach:', text: 'Offering flexible textile options and responsive order management to create long-term partnerships.' },
  ];

  return (
    <section id="competitive" className="section-pad bg-[hsl(var(--background))] border-t border-[hsl(var(--border))]">
      <div className="inner-container">
        <SectionHead eyebrow="Competitive Landscape & Unique Advantage">
          Standing Out in<br />
          <span className="text-[hsl(var(--accent))]">the Market</span>
        </SectionHead>

        <div className="competitive-grid mt-10 grid items-stretch gap-6 lg:grid-cols-2">
          {/* Left: Market challenges */}
          <motion.div initial={reduce ? undefined : { opacity: 0, x: -20 }} whileInView={reduce ? undefined : { opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-4">
            <article className="flex-1 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 sm:p-6 shadow-sm">
              <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--muted-foreground)/.1)]">
                <ShieldCheck size={16} className="text-[hsl(var(--muted-foreground))]" />
              </div>
              <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-[.08em] text-[hsl(var(--muted-foreground))]">Existing Solutions</h3>
              <p className="text-xs leading-[1.65] text-[hsl(var(--foreground)/.75)] sm:text-sm">
                Surat's textile market offers multiple fabric traders and wholesalers providing bulk supply through established local sourcing networks.
              </p>
            </article>
            <article className="flex-1 rounded-lg border border-[hsl(var(--destructive)/.3)] bg-[hsl(var(--card))] p-5 sm:p-6 shadow-sm">
              <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--destructive)/.08)]">
                <X size={16} className="text-[hsl(var(--destructive))]" />
              </div>
              <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-[.08em] text-[hsl(var(--destructive))]">Issues with Existing Solutions</h3>
              <p className="text-xs leading-[1.65] text-[hsl(var(--foreground))] sm:text-sm">
                Existing suppliers often face challenges like inconsistent quality, delayed deliveries, limited customization, and difficulty maintaining reliable partnerships.
              </p>
            </article>
          </motion.div>

          {/* Right: Our Edge */}
          <motion.div initial={reduce ? undefined : { opacity: 0, x: 20 }} whileInView={reduce ? undefined : { opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5, delay: 0.18 }}
            className="relative flex flex-col justify-between overflow-hidden rounded-xl border-2 border-[hsl(var(--accent)/.45)] bg-gradient-to-br from-[hsl(var(--accent)/.06)] to-[hsl(var(--card))] p-6 shadow-md sm:p-7">
            <div>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(var(--accent))] text-white">
                  <Sparkles size={18} />
                </div>
                <h3 className="text-sm font-semibold uppercase tracking-[.09em] text-[hsl(var(--accent))] sm:text-base">Our Edge</h3>
              </div>
              <div className="space-y-3.5">
                {edgeItems.map((item, i) => (
                  <div key={item.title} className="flex gap-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--accent)/.15)] text-[hsl(var(--accent))]">
                      <Check size={11} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-[hsl(var(--foreground))] sm:text-sm">{item.title}</h4>
                      <p className="mt-0.5 text-xs leading-[1.6] text-[hsl(var(--muted-foreground))] sm:text-sm">{item.text}</p>
                    </div>
                  </div>
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
    <section id="g2m" className="section-pad bg-[hsl(var(--card))] border-t border-[hsl(var(--border))]">
      <div className="inner-container">
        <SectionHead eyebrow="Go-To-Market (G2M) Strategy">
          Strategic Market<br />
          <span className="text-[hsl(var(--accent))]">Expansion</span>
        </SectionHead>

        <div className="g2m-track mt-10 flex gap-3 overflow-x-auto pb-2 scrollbar-thin sm:flex-wrap sm:overflow-x-visible sm:pb-0">
          {g2mItems.map(({ label, Icon }, i) => (
            <motion.div key={label}
              initial={reduce ? undefined : { opacity: 0, y: 14 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.32, delay: i * 0.05 }}
              className="group flex min-w-[170px] shrink-0 flex-col items-center gap-2.5 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-5 py-3.5 shadow-sm transition-all duration-300 hover:border-[hsl(var(--accent))] sm:min-w-[190px]"
            >
              <Icon size={20} className="text-[hsl(var(--accent))] transition-transform duration-300 group-hover:scale-110" />
              <span className="text-center text-[11px] font-semibold uppercase tracking-[.07em] text-[hsl(var(--foreground))]">{label}</span>
            </motion.div>
          ))}
        </div>

        <Reveal delay={0.25}>
          <p className="mt-8 text-center text-xs leading-[1.65] text-[hsl(var(--muted-foreground))] sm:text-sm">
            Freya Poly Fab aims to accelerate growth through strong customer relationships, reliable sourcing, and strategic market expansion.
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
  const phases = [
    {
      title: 'Short-Term Perspective', delay: 0.2,
      items: [
        'Establish a textile manufacturing unit with required machinery and infrastructure.',
        'Develop in-house production capabilities to ensure better quality control and efficient supply.',
        'Expand customer base across garment manufacturers, wholesalers, and apparel businesses.',
      ],
    },
    {
      title: 'Long-Term Perspective', delay: 0.35,
      items: [
        'Increase manufacturing capacity and expand into diverse textile product categories.',
        'Build a strong regional and national distribution network for wider market reach.',
        'Position Freya Poly Fab as a recognized textile manufacturing brand in the apparel supply chain.',
      ],
    },
  ];

  return (
    <section id="growth" className="section-pad bg-[hsl(var(--background))] border-t border-[hsl(var(--border))]">
      <div className="inner-container">
        <SectionHead eyebrow="Our Growth & Expansion Strategy" description="Transforming from textile trading into an integrated manufacturing and supply partner.">
          From Trading to<br />
          <span className="text-[hsl(var(--accent))]">Manufacturing Excellence</span>
        </SectionHead>

        <div className="growth-grid mt-10 grid items-stretch gap-6 lg:grid-cols-2">
          {phases.map((phase, pi) => (
            <motion.article
              key={phase.title}
              initial={reduce ? undefined : { opacity: 0, y: 20 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.16 }}
              transition={{ duration: 0.48, delay: phase.delay }}
              className="flex flex-1 flex-col overflow-hidden rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-sm transition-all duration-300 hover:border-[hsl(var(--accent)/.45)] hover:shadow-md"
            >
              <div className="border-b border-[hsl(var(--border))] bg-[hsl(var(--secondary)/.35)] p-5 sm:p-6">
                <h3 className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[.09em] text-[hsl(var(--accent))] sm:text-sm">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--accent))] text-[11px] font-bold text-white">{pi + 1}</span>
                  {phase.title}
                </h3>
              </div>
              <div className="flex-1 p-5 sm:p-6">
                <ul className="space-y-3">
                  {phase.items.map((item, ii) => (
                    <li key={ii} className="flex gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[hsl(var(--accent))]" />
                      <span className="text-xs leading-[1.65] text-[hsl(var(--foreground))] sm:text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
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
        fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={700}>
        {`${value}%`}
      </text>
    );
  };

  return (
    <section id="fund-utilization" className="section-pad bg-[hsl(var(--card))] border-t border-[hsl(var(--border))]">
      <div className="inner-container">
        <SectionHead eyebrow="Fund Utilization">
          Strategic Investment<br />
          <span className="text-[hsl(var(--accent))]">Allocation</span>
        </SectionHead>

        <div className="fund-grid mt-10 grid items-start gap-6 lg:grid-cols-2">
          <Reveal delay={0.1}>
            <div ref={chartRef} className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-5 shadow-sm">
              <div className="h-[240px] sm:h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data} cx="50%" cy="50%" labelLine={false} label={renderLabel}
                      outerRadius="70%" innerRadius="38%" dataKey="value" paddingAngle={2}
                      animationBegin={0} animationDuration={chartInView && !reduce ? 900 : 0}>
                      {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <RechartsTooltip
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '4px', fontSize: '12px' }}
                      formatter={(v, n) => [`${v}%`, n]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {data.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: item.color }} />
                    <span className="text-[11px] text-[hsl(var(--foreground)/.8)]">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <motion.div initial={reduce ? undefined : { opacity: 0, x: 20 }} whileInView={reduce ? undefined : { opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.24 }} transition={{ duration: 0.5, delay: 0.18 }}
            className="overflow-hidden rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-5 shadow-sm sm:p-7">
            <div className="mb-3.5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[hsl(var(--accent))] text-white">
                <TrendingUp size={18} />
              </div>
              <h3 className="text-xs font-semibold uppercase tracking-[.09em] text-[hsl(var(--accent))] sm:text-sm">Our Ask</h3>
            </div>
            <p className="mb-4 text-xs leading-[1.65] text-[hsl(var(--foreground))] sm:text-sm">
              Strategic fund allocation will enable Freya Poly Fab to establish manufacturing capabilities and expand market reach.
            </p>
            <div className="space-y-2">
              {data.map((item) => (
                <div key={item.name}
                  className="flex items-center justify-between rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3.5 py-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-[hsl(var(--foreground))]">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-[hsl(var(--accent))]">{item.value}%</span>
                </div>
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
    <section id="leadership" className="section-pad bg-[hsl(var(--background))] border-t border-[hsl(var(--border))]">
      <div className="inner-container">
        <SectionHead eyebrow="Leadership & Expertise">
          Driven by Industry<br />
          <span className="text-[hsl(var(--accent))]">Experience</span>
        </SectionHead>

        <div className="leadership-grid mt-10 grid items-center gap-8 lg:grid-cols-[36fr_64fr] lg:gap-12">
          <motion.div initial={reduce ? undefined : { opacity: 0, scale: 0.94 }} whileInView={reduce ? undefined : { opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.22 }} transition={{ duration: 0.55, delay: 0.1 }}
            className="leader-avatar flex justify-center">
            <div className="relative">
              <div className="relative flex h-48 w-48 items-center justify-center overflow-hidden rounded-full border-4 border-[hsl(var(--accent))] bg-gradient-to-br from-[hsl(var(--accent)/.12)] via-[hsl(var(--secondary))] to-[hsl(var(--accent)/.06)] shadow-xl sm:h-56 sm:w-56">
                <Users size={80} strokeWidth={1} className="text-[hsl(var(--accent)/.4)] sm:size-[96px]" />
              </div>
              <div className="absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[hsl(var(--accent))] text-white shadow-md">
                <Sparkles size={18} />
              </div>
            </div>
          </motion.div>

          <motion.div initial={reduce ? undefined : { opacity: 0, x: 20 }} whileInView={reduce ? undefined : { opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.22 }} transition={{ duration: 0.55, delay: 0.18 }}
            className="relative overflow-hidden rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-sm sm:p-8">
            <div className="relative">
              <h3 className="text-lg font-semibold text-[hsl(var(--primary))] sm:text-xl">Devyani Ramnik Timbadiya</h3>
              <p className="mb-4 mt-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[.12em] text-[hsl(var(--accent))]">
                <span className="h-px w-5 bg-[hsl(var(--accent))]" />Proprietor
              </p>
              <div className="space-y-3 text-xs leading-[1.7] text-[hsl(var(--foreground))] sm:text-sm sm:leading-[1.72]">
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
   CALL TO ACTION (PRE-FOOTER)
   ══════════════════════════════════════════════════════════ */
function CTASection() {
  return (
    <section className="section-pad relative overflow-hidden bg-gradient-to-br from-[hsl(var(--card))] to-[hsl(var(--secondary)/.4)] border-t border-[hsl(var(--border))]">
      <div className="inner-container text-center">
        <Reveal>
          <div className="eyebrow mb-3">Partner With Us</div>
          <h2 className="display mx-auto max-w-[680px] font-semibold text-[hsl(var(--primary))]"
            style={{ fontSize: 'clamp(1.85rem, 3.8vw, 3.2rem)' }}>
            Ready to Elevate Your<br />
            <span className="text-[hsl(var(--accent))]">Fabric Sourcing?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[500px] text-xs leading-[1.7] text-[hsl(var(--muted-foreground))] sm:text-sm">
            Connect with Freya Poly Fab for premium fabric supply, stable sourcing, and customized volume partnerships.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => goTo('contact')}
              className="inline-flex min-h-[48px] min-w-[190px] items-center justify-center gap-2.5 bg-[hsl(var(--accent))] px-6 py-3.5 text-xs font-semibold uppercase tracking-[.13em] text-white shadow-sm transition hover:bg-[hsl(var(--accent)/.88)]"
              data-testid="button-cta-partner"
            >
              Partner With Us <ArrowRight size={14} />
            </button>
            <button
              type="button"
              onClick={() => goTo('fabric-supply')}
              className="inline-flex min-h-[48px] min-w-[180px] items-center justify-center gap-2.5 border border-[hsl(var(--accent)/.6)] bg-transparent px-6 py-3.5 text-xs font-semibold uppercase tracking-[.13em] text-[hsl(var(--foreground))] transition hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))]"
              data-testid="button-cta-fabrics"
            >
              View Fabric Range <ArrowRight size={14} />
            </button>
          </div>
        </Reveal>
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
    if (hash) setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
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
        <FabricSupply />
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
        <CTASection />
      </main>
      <Footer />
      <button
        type="button"
        onClick={() => goTo('home')}
        className="fixed bottom-5 right-5 z-30 flex h-10 w-10 items-center justify-center border border-[hsl(var(--border))] bg-[hsl(var(--card)/.9)] text-[hsl(var(--primary))] shadow-md backdrop-blur-sm transition hover:-translate-y-1 hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))]"
        aria-label="Back to top"
        data-testid="button-back-top"
      >
        <CircleArrowUp size={18} />
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
                  <h1 className="text-3xl font-bold text-[hsl(var(--primary))]">404 — Page Not Found</h1>
                  <a href="/" className="mt-4 inline-block text-xs uppercase tracking-wider text-[hsl(var(--accent))] underline underline-offset-4">Return Home</a>
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

