import { useEffect, useRef, type ReactNode } from 'react';
import { motion, useReducedMotion, useInView } from 'framer-motion';
import {
  ArrowRight, Check, CircleArrowUp, Factory,
  Layers3, Mail, MapPin, Network, Package, Phone,
  ShieldCheck, Sparkles, Store, Target, TrendingUp, Users, X, Award, CheckCircle2,
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
   SOURCE OF TRUTH DATA (Strictly from Company PDF)
   ────────────────────────────────────────────────────────── */
const challenges = [
  {
    number: '01',
    title: 'Fragmented Supply Chain',
    text: 'Lack of coordination between fabric suppliers, manufacturers, and buyers leads to delays and inefficiencies in textile operations.',
    icon: Network,
    accent: '#0f3d5c',
  },
  {
    number: '02',
    title: 'Rising Raw Material Costs',
    text: 'Increasing prices of yarn, fabrics, and processing inputs impact profitability and create pricing challenges for textile businesses.',
    icon: TrendingUp,
    accent: '#4a7ba7',
  },
  {
    number: '03',
    title: 'Quality & Reliability Issues',
    text: 'Maintaining consistent fabric quality and ensuring timely supply remains a challenge in a competitive textile market.',
    icon: ShieldCheck,
    accent: '#b79a68',
  },
  {
    number: '04',
    title: 'Intense Market Competition',
    text: 'Growing competition among textile suppliers and global sourcing markets creates pressure on pricing and customer retention.',
    icon: Target,
    accent: '#d4b883',
  },
];

// PDF Page 4: Solutions We Offer
const solutions = [
  {
    number: '01',
    title: 'Reliable Fabric Supply',
    text: 'Providing quality textile materials with consistent availability and timely delivery.',
    icon: ShieldCheck,
  },
  {
    number: '02',
    title: 'Customer-Centric Approach',
    text: 'Offering tailored fabric solutions to meet the diverse requirements of garment businesses.',
    icon: Target,
  },
  {
    number: '03',
    title: 'Quality & Trust Focus',
    text: 'Ensuring superior fabric standards through reliable sourcing and strong supplier networks.',
    icon: Sparkles,
  },
];

// PDF Page 5 & Fabric Supply Showcase (4-Image Grid)
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

// PDF Page 5: Our Offerings
const offerings = [
  {
    number: '01',
    title: 'Premium Fabric Supply',
    text: 'Providing quality textile materials for garment and apparel businesses.',
    icon: Package,
  },
  {
    number: '02',
    title: 'Diverse Textile Range',
    text: 'Offering a wide selection of polyester and fabric solutions to meet market demands.',
    icon: Layers3,
  },
  {
    number: '03',
    title: 'Reliable Trading Network',
    text: 'Ensuring smooth sourcing and timely delivery through strong supplier connections.',
    icon: Network,
  },
  {
    number: '04',
    title: 'Customized Fabric Solutions',
    text: 'Delivering flexible textile options based on customer requirements.',
    icon: Store,
  },
];

// PDF Page 6: Unique Selling Proposition (USP)
const uspPoints = [
  {
    number: '01',
    title: 'Quality-Driven Approach',
    text: 'Ensuring premium fabric quality through reliable sourcing and selection.',
  },
  {
    number: '02',
    title: 'Strong Supplier Network',
    text: 'Building efficient supply channels for consistent availability of textile materials.',
  },
  {
    number: '03',
    title: 'Customer-Focused Solutions',
    text: 'Providing flexible fabric options aligned with client requirements.',
  },
  {
    number: '04',
    title: 'Timely & Reliable Delivery',
    text: 'Maintaining strong commitments through efficient order management and service.',
  },
];

// PDF Page 7: Market Alignment (STP)
const stpSteps = [
  {
    step: '01',
    title: 'Segmentation',
    text: 'Freya Poly Fab segments the market based on fabric requirements, buyer preferences, order volume, and industry needs, serving garment manufacturers, wholesalers, retailers, and apparel businesses seeking reliable textile suppliers.',
  },
  {
    step: '02',
    title: 'Targeting',
    text: 'The company targets garment producers, fashion businesses, textile traders, and bulk buyers who require consistent fabric availability, competitive pricing, and dependable supply partnerships.',
  },
  {
    step: '03',
    title: 'Positioning',
    text: 'Freya Poly Fab positions itself as a trusted textile trading partner offering quality fabrics, efficient sourcing, and reliable service to support the growing apparel and fashion ecosystem.',
  },
];

// PDF Page 9: Revenue Streams
const revenueStreams = [
  {
    number: '01',
    title: 'B2B Fabric Sales',
    text: 'Generating revenue through bulk fabric supply to garment manufacturers, wholesalers, and apparel businesses.',
    color: '#0f3d5c',
  },
  {
    number: '02',
    title: 'Wholesale Distribution',
    text: 'Earning through fabric trading and distribution networks by supplying quality textile materials to diverse buyers.',
    color: '#4a7ba7',
  },
  {
    number: '03',
    title: 'Customized Textile Solutions',
    text: 'Creating value through customer-specific fabric sourcing and reliable supply partnerships for recurring business opportunities.',
    color: '#b79a68',
  },
];

// PDF Page 11: Go-To-Market (G2M) Strategy
const g2mItems = [
  { number: '01', label: 'B2B Customer Acquisition',     Icon: Users      },
  { number: '02', label: 'Strong Supplier Partnerships', Icon: Network    },
  { number: '03', label: 'Digital Presence Expansion',   Icon: TrendingUp },
  { number: '04', label: 'Market Relationship Building', Icon: Target     },
  { number: '05', label: 'Geographical Expansion',       Icon: Store      },
];

// PDF Page 13: Fund Utilization
const fundData = [
  { name: 'Manufacturing Unit Setup',     value: 40, color: '#0f3d5c' },
  { name: 'Raw Material & Inventory',     value: 30, color: '#4a7ba7' },
  { name: 'Marketing & Market Expansion', value: 15, color: '#b79a68' },
  { name: 'Working Capital & Operations', value: 15, color: '#d4b883' },
];

/* ──────────────────────────────────────────────────────────
   NAVIGATION & ANIMATION HELPERS
   ────────────────────────────────────────────────────────── */
function goTo(id: string, close?: () => void) {
  close?.();
  if (id === 'contact') {
    if (window.location.pathname === '/contact') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.href = '/contact';
    }
    return;
  }
  if (window.location.pathname === '/contact') {
    window.location.href = '/#' + id;
    return;
  }
  window.setTimeout(() => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 30);
}

function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? undefined : { opacity: 0, y: 14 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08, margin: '0px 0px -30px 0px' }}
      transition={{ duration: 0.45, delay: Math.min(delay, 0.15), ease: [0.22, 1, 0.36, 1] }}
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
  const inView = useInView(ref, { once: true, amount: 0.2 });
  useEffect(() => {
    if (!inView) return;
    let start: number;
    const dur = 900;
    let frameId: number;
    const run = (now: number) => {
      if (!start) start = now;
      const p = Math.min((now - start) / dur, 1);
      const current = Math.floor(value * (1 - Math.pow(1 - p, 3)));
      if (ref.current) {
        ref.current.textContent = String(current);
      }
      if (p < 1) {
        frameId = requestAnimationFrame(run);
      } else {
        if (ref.current) ref.current.textContent = String(value);
      }
    };
    frameId = requestAnimationFrame(run);
    return () => cancelAnimationFrame(frameId);
  }, [inView, value]);
  return <span ref={ref}>{value}</span>;
}

function SectionHead({
  eyebrow,
  children,
  description,
}: {
  eyebrow: string;
  children: ReactNode;
  description?: string;
}) {
  return (
    <Reveal>
      <div className="eyebrow mb-3">{eyebrow}</div>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <h2
          className="display max-w-[660px] font-semibold text-[hsl(var(--primary))]"
          style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)' }}
        >
          {children}
        </h2>
        {description && (
          <p className="max-w-[380px] text-xs leading-[1.68] text-[hsl(var(--muted-foreground))] sm:text-sm">
            {description}
          </p>
        )}
      </div>
    </Reveal>
  );
}

/* ══════════════════════════════════════════════════════════
   1. HERO SECTION (PDF Page 1 & 2)
   ══════════════════════════════════════════════════════════ */
function Hero() {
  const reduce = useReducedMotion();
  return (
    <section id="home" className="relative isolate overflow-hidden bg-[hsl(var(--background))]">
      {/* Warm subtle background lighting */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(circle at 75% 25%, rgba(229,212,184,.38), transparent 40%), linear-gradient(110deg, rgba(250,248,243,.98) 25%, rgba(245,241,232,.82) 100%)',
        }}
      />

      {/* Decorative rings — desktop only */}
      <div className="hero-deco-circle pointer-events-none absolute right-[-5%] top-[8%] h-[60vw] w-[60vw] max-h-[600px] max-w-[600px] rounded-full border border-[hsl(var(--accent)/.15)] max-md:hidden" />
      <div className="hero-deco-circle pointer-events-none absolute right-[10%] top-[20%] h-[38vw] w-[38vw] max-h-[380px] max-w-[380px] rounded-full border border-dashed border-[hsl(var(--accent)/.12)] max-md:hidden" />

      {/* Thread SVG */}
      <Thread className="right-[-20px] top-[30%] hidden w-[480px] rotate-[-6deg] opacity-70 lg:block" />

      {/* Two-column grid */}
      <div className="hero-grid relative z-10 mx-auto grid max-w-[var(--max-w)] items-center gap-10 px-[var(--gutter)] pb-14 pt-28 md:grid-cols-[48fr_52fr] md:gap-10 md:pb-16 md:pt-32 lg:gap-14 lg:pb-20 lg:pt-36">

        {/* Text */}
        <motion.div
          className="hero-text flex flex-col items-start"
          initial={reduce ? undefined : { opacity: 0, y: 14 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="eyebrow mb-3">Textile Trading &amp; Supply Partner</div>
          <h1
            className="display max-w-[580px] font-semibold text-[hsl(var(--foreground))]"
            style={{ fontSize: 'clamp(2.1rem, 4.6vw, 3.8rem)', lineHeight: 1.08 }}
          >
            Weaving Quality Fabrics,{' '}
            <span className="text-[hsl(var(--accent))]">Building Fashion Futures.</span>
          </h1>

          <p className="mt-5 max-w-[480px] text-sm leading-[1.75] text-[hsl(var(--muted-foreground))] sm:text-[15px]">
            Freya Poly Fab is a growing textile trading company specializing in quality fabrics and dependable textile solutions for garment manufacturers, wholesalers, and fashion businesses.
          </p>

          {/* Value Highlights */}
          <div className="mt-5 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-medium text-[hsl(var(--foreground)/.85)]">
            <span className="flex items-center gap-1.5"><Check size={14} className="text-[hsl(var(--accent))]" /> Reliability</span>
            <span className="flex items-center gap-1.5"><Check size={14} className="text-[hsl(var(--accent))]" /> Timely Delivery</span>
            <span className="flex items-center gap-1.5"><Check size={14} className="text-[hsl(var(--accent))]" /> Customer Satisfaction</span>
          </div>

          {/* CTA Buttons */}
          <div className="hero-buttons mt-8 flex flex-wrap items-center gap-3.5 sm:gap-4">
            <button
              type="button"
              onClick={() => goTo('solutions')}
              className="inline-flex min-h-[48px] min-w-[200px] items-center justify-center gap-3 bg-[hsl(var(--accent))] px-6 py-3.5 text-xs font-semibold uppercase tracking-[.13em] text-white shadow-sm transition-colors hover:bg-[hsl(var(--accent)/.88)] active:scale-[.99]"
              data-testid="button-hero-solutions"
            >
              Explore Solutions <ArrowRight size={15} />
            </button>
            <button
              type="button"
              onClick={() => goTo('contact')}
              className="inline-flex min-h-[48px] min-w-[176px] items-center justify-center gap-3 border border-[hsl(var(--accent)/.65)] bg-transparent px-6 py-3.5 text-xs font-semibold uppercase tracking-[.13em] text-[hsl(var(--foreground))] transition-colors hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))] hover:bg-[hsl(var(--accent)/.05)] active:scale-[.99]"
              data-testid="button-hero-contact"
            >
              Work With Us <ArrowRight size={15} />
            </button>
          </div>
        </motion.div>

        {/* Hero Fabric Image */}
        <motion.div
          className="hero-image-wrap relative mx-auto w-full"
          style={{ maxWidth: 'min(100%, 480px)' }}
          initial={reduce ? undefined : { opacity: 0, scale: 0.98 }}
          animate={reduce ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.08 }}
        >
          <div
            className="hero-image-inner relative overflow-hidden border border-[hsl(var(--border))] bg-[hsl(var(--secondary))] shadow-xl shadow-[rgba(74,70,64,.08)]"
            style={{ aspectRatio: '0.92' }}
          >
            <img
              src="/fabric-rolls.jpg"
              alt="Rolled textile fabrics in warm neutral tones"
              className="h-full w-full object-cover brightness-105 saturate-[.75]"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              width="480"
              height="520"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(250,248,243,.8)] via-transparent to-[rgba(229,212,184,.12)] pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between border-t border-[hsl(var(--foreground)/.14)] pt-3 text-[10px] uppercase tracking-[.17em] text-[hsl(var(--foreground)/.8)]">
              <span>Quality Fabrics · Timely Delivery</span>
              <span className="font-semibold text-[hsl(var(--accent))]">Freya Poly Fab</span>
            </div>
          </div>
          {/* Corner accents */}
          <div className="absolute -bottom-3 -left-3 hidden h-14 w-14 border-b-2 border-l-2 border-[hsl(var(--accent)/.55)] sm:block pointer-events-none" />
          <div className="absolute -right-3 -top-3 hidden h-12 w-12 border-r-2 border-t-2 border-[hsl(var(--accent)/.5)] sm:block pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   2. ABOUT SECTION (PDF Page 2)
   ══════════════════════════════════════════════════════════ */
function About() {
  return (
    <section id="about" className="section-pad bg-[hsl(var(--background))] border-t border-[hsl(var(--border)/.7)]">
      <div className="inner-container">
        <div className="about-grid grid items-center gap-10 lg:grid-cols-[46fr_54fr] lg:gap-14">

          <Reveal className="relative">
            <div className="fabric-panel aspect-[0.94] w-full max-w-[460px] border border-[hsl(var(--border))] shadow-md">
              <img
                src="/fabric-weave.jpg"
                alt="Close-up of woven textile fibers in warm neutral tones"
                className="h-full w-full object-cover brightness-105 saturate-[.75]"
                loading="lazy"
                decoding="async"
                width="460"
                height="490"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[rgba(183,154,104,.15)] to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 bg-[hsl(var(--secondary)/.95)] p-4 sm:p-5 backdrop-blur-sm border-t border-[hsl(var(--border))]">
                <span className="block text-[10px] uppercase tracking-[.2em] font-semibold text-[hsl(var(--accent))]">
                  Textile Trading &amp; Supply
                </span>
                <span className="mt-0.5 block text-xs sm:text-sm font-semibold text-[hsl(var(--foreground))]">
                  Delivering Quality Fabrics for the Apparel Industry
                </span>
              </div>
            </div>
            <div className="absolute -bottom-3.5 right-0 hidden h-12 w-12 border-b-2 border-r-2 border-[hsl(var(--accent))] sm:block pointer-events-none" />
          </Reveal>

          <Reveal delay={0.08}>
            <div className="eyebrow mb-3">About Us</div>
            <h2
              className="display max-w-[540px] font-semibold text-[hsl(var(--primary))]"
              style={{ fontSize: 'clamp(1.75rem, 3.4vw, 2.75rem)' }}
            >
              A Growing Textile<br />
              <span className="text-[hsl(var(--accent))]">Trading &amp; Supply Partner</span>
            </h2>

            <div className="mt-5 max-w-[560px] space-y-3.5 text-sm leading-[1.75] text-[hsl(var(--muted-foreground))] sm:text-[15px]">
              <p>
                Freya Poly Fab is a growing textile trading company specializing in the supply of quality fabrics and textile materials to meet the evolving needs of the apparel industry.
              </p>
              <p>
                With a strong focus on <strong className="font-semibold text-[hsl(var(--foreground))]">reliability</strong>, <strong className="font-semibold text-[hsl(var(--foreground))]">timely delivery</strong>, and <strong className="font-semibold text-[hsl(var(--foreground))]">customer satisfaction</strong>, the company aims to become a trusted partner for garment manufacturers and businesses by providing premium textile solutions that support innovation and growth.
              </p>
            </div>

            {/* Value Pillars List */}
            <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {[
                'Quality Fabric Supply',
                'Reliable Sourcing Channels',
                'Timely Delivery Commitments',
                'Long-Term Business Partnerships',
              ].map((point) => (
                <div key={point} className="flex items-center gap-2 text-xs font-medium text-[hsl(var(--foreground))]">
                  <CheckCircle2 size={15} className="text-[hsl(var(--accent))] shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            <div className="mt-7 flex items-center gap-4">
              <button
                type="button"
                onClick={() => goTo('mission')}
                className="group inline-flex items-center gap-2 border-b border-[hsl(var(--accent))] pb-1.5 text-xs font-semibold uppercase tracking-[.15em] text-[hsl(var(--foreground))] transition-colors hover:text-[hsl(var(--accent))]"
                data-testid="button-about-learn"
              >
                Our Mission &amp; Vision <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   3. MISSION & VISION (PDF Page 2)
   Desktop: 2 Equal-Height Cards | Mobile: Naturally Stacked
   ══════════════════════════════════════════════════════════ */
function Mission() {
  const cards = [
    {
      label: 'Our Mission',
      text: 'To provide reliable textile solutions with superior quality, timely supply, and customer-focused service.',
      number: '01',
    },
    {
      label: 'Our Vision',
      text: 'To become a trusted textile partner by delivering quality fabrics and building sustainable growth in the apparel industry.',
      number: '02',
    },
  ];

  return (
    <section id="mission" className="section-pad textile-grid bg-[hsl(var(--card))] border-t border-[hsl(var(--border))]">
      <div className="inner-container">
        <SectionHead eyebrow="Mission & Vision">
          Built Around Quality,<br />
          <span className="text-[hsl(var(--accent))]">Reliability &amp; Sustainable Growth</span>
        </SectionHead>

        <div className="mission-grid mt-10 grid items-stretch gap-6 md:grid-cols-2">
          {cards.map((card, i) => (
            <Reveal key={card.label} delay={i * 0.08} className="flex h-full">
              <article className="relative flex flex-1 flex-col justify-between overflow-hidden rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background)/.8)] p-6 shadow-sm transition-[border-color,box-shadow] duration-200 hover:border-[hsl(var(--accent)/.6)] hover:shadow-md sm:p-8">
                <span className="absolute right-5 top-4 font-mono text-5xl font-light text-[hsl(var(--accent)/.18)] select-none">
                  {card.number}
                </span>
                <div className="relative flex flex-1 flex-col">
                  <div className="eyebrow mb-3.5">{card.label}</div>
                  <p className="flex-1 text-base leading-[1.68] text-[hsl(var(--foreground))] sm:text-lg sm:leading-[1.72]">
                    &ldquo;{card.text}&rdquo;
                  </p>
                </div>
                <div className="mt-6 border-t border-[hsl(var(--border)/.7)] pt-3 text-[11px] font-semibold uppercase tracking-[.12em] text-[hsl(var(--accent))]">
                  Freya Poly Fab Commitment
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
   4. MARKET CHALLENGES (PDF Page 3)
   Desktop: 4 Columns | Mobile: Strict 2×2 (ALL 4 VISIBLE)
   ══════════════════════════════════════════════════════════ */
function Challenges() {
  const reduce = useReducedMotion();

  return (
    <section id="challenges" className="section-pad bg-[hsl(var(--background))] border-t border-[hsl(var(--border))]">
      <div className="inner-container">
        <SectionHead
          eyebrow="Market Challenges"
          description="Addressing the key bottlenecks, rising costs, and coordination gaps in current textile supply chains."
        >
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
                initial={reduce ? undefined : { opacity: 0, y: 14 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.08 }}
                transition={{ duration: 0.38, delay: Math.min(i * 0.04, 0.12) }}
                className="group flex flex-col justify-between rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 shadow-sm transition-[border-color,box-shadow] duration-200 hover:shadow-md sm:p-5"
                style={{ borderTopWidth: '3px', borderTopColor: c.accent }}
              >
                <div>
                  <div className="card-icon mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-[hsl(var(--accent)/.1)]">
                    <Icon size={17} strokeWidth={1.5} className="text-[hsl(var(--accent))]" />
                  </div>
                  <h3 className="mb-1.5 text-xs font-semibold leading-[1.35] text-[hsl(var(--foreground))] sm:text-sm sm:leading-[1.4]">
                    {c.title}
                  </h3>
                  <p className="text-xs leading-[1.55] text-[hsl(var(--muted-foreground))] sm:text-sm sm:leading-[1.6]">
                    {c.text}
                  </p>
                </div>
                <div className="mt-4 border-t border-[hsl(var(--border)/.6)] pt-2.5">
                  <span className="font-mono text-[11px] font-semibold text-[hsl(var(--accent)/.7)]">{c.number}</span>
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
   5. SOLUTIONS WE OFFER (PDF Page 4)
   Desktop: 3 Columns | Mobile: 1 Column
   ══════════════════════════════════════════════════════════ */
function Solutions() {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const inView = useInView(trackRef, { once: true, amount: 0.15 });

  return (
    <section id="solutions" className="section-pad bg-[hsl(var(--card))] border-t border-[hsl(var(--border))]">
      <div className="inner-container">
        <SectionHead
          eyebrow="Solution We Offer"
          description="Freya Poly Fab bridges textile supply challenges by delivering quality fabrics, reliable sourcing, and customer-focused solutions."
        >
          Bridging Textile<br />
          <span className="text-[hsl(var(--accent))]">Supply Challenges</span>
        </SectionHead>

        <div ref={trackRef} className="relative mt-10">
          {/* Connector line on desktop */}
          <div className="solutions-connector absolute left-[12%] right-[12%] top-[2.8rem] hidden h-px md:block">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={inView && !reduce ? { scaleX: 1 } : {}}
              transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: 'left' }}
              className="h-full w-full origin-left bg-gradient-to-r from-[hsl(var(--accent)/.2)] via-[hsl(var(--accent)/.5)] to-[hsl(var(--accent)/.2)]"
            />
          </div>

          <div className="solutions-grid grid items-stretch gap-6 md:grid-cols-3">
            {solutions.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.article
                  key={s.number}
                  initial={reduce ? undefined : { opacity: 0, y: 14 }}
                  whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.08 }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.06 }}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-lg border-2 border-[hsl(var(--border))] bg-[hsl(var(--background))] p-6 shadow-sm transition-[border-color,box-shadow] duration-200 hover:border-[hsl(var(--accent))] sm:p-7"
                >
                  <div className="absolute right-3.5 top-3.5 flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--accent)/.1)] font-mono text-xs font-bold text-[hsl(var(--accent))] transition-colors duration-200 group-hover:bg-[hsl(var(--accent))] group-hover:text-white">
                    {s.number}
                  </div>
                  <div>
                    <div className="mb-4 mt-1">
                      <Icon size={24} strokeWidth={1.5} className="text-[hsl(var(--accent))]" />
                    </div>
                    <h3 className="text-base font-semibold text-[hsl(var(--foreground))] sm:text-lg">
                      {s.title}
                    </h3>
                    <p className="mt-2.5 text-xs leading-[1.65] text-[hsl(var(--muted-foreground))] sm:text-sm">
                      {s.text}
                    </p>
                  </div>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    style={{ transformOrigin: 'left' }}
                    transition={{ duration: 0.45, delay: 0.25 + i * 0.06 }}
                    className="mt-6 h-[2px] bg-gradient-to-r from-[hsl(var(--accent))] to-transparent origin-left"
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
   6. FABRIC SUPPLY SHOWCASE (4-Image Grid)
   Desktop: 4 Columns | Mobile: Strict 2×2 (ALL 4 VISIBLE)
   ══════════════════════════════════════════════════════════ */
export function FabricSupply() {
  const reduce = useReducedMotion();
  return (
    <section id="fabric-supply" className="section-pad bg-[hsl(var(--background))] border-t border-[hsl(var(--border))]">
      <div className="inner-container">
        <SectionHead
          eyebrow="Fabric Supply & Materials"
          description="Explore our core textile categories tailored for apparel manufacturers, wholesalers, and fashion brands."
        >
          Engineered Fabrics for<br />
          <span className="text-[hsl(var(--accent))]">Apparel Manufacturing</span>
        </SectionHead>

        {/* Strict 2×2 on Mobile, 4-col at LG — ALL 4 IMAGES VISIBLE */}
        <div className="fabric-grid mt-10 grid items-stretch gap-4 grid-cols-2 lg:grid-cols-4">
          {fabricCategories.map((item, i) => (
            <motion.article
              key={item.number}
              initial={reduce ? undefined : { opacity: 0, y: 14 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.08 }}
              transition={{ duration: 0.38, delay: Math.min(i * 0.04, 0.12) }}
              className="group flex flex-col overflow-hidden rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-sm transition-[border-color,box-shadow] duration-200 hover:shadow-md hover:border-[hsl(var(--accent)/.5)]"
            >
              {/* Image Container with Aspect Ratio */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[hsl(var(--secondary))]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover brightness-105 saturate-[.75] transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                  width="320"
                  height="240"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,.5)] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white">
                  <span className="text-[10px] font-bold uppercase tracking-[.14em] drop-shadow-sm">
                    {item.subtitle}
                  </span>
                  <span className="font-mono text-xs font-semibold text-white/90">{item.number}</span>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-4">
                <div>
                  <h3 className="text-xs font-semibold text-[hsl(var(--foreground))] sm:text-sm">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-[11px] leading-[1.55] text-[hsl(var(--muted-foreground))] sm:text-xs sm:leading-[1.6]">
                    {item.text}
                  </p>
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
   7. OUR OFFERINGS (PDF Page 5)
   Desktop: 4 Columns | Mobile: Strict 2×2 (ALL 4 VISIBLE)
   ══════════════════════════════════════════════════════════ */
function Offerings() {
  const reduce = useReducedMotion();
  return (
    <section id="offerings" className="section-pad bg-[hsl(var(--card))] border-t border-[hsl(var(--border))]">
      <div className="inner-container">
        <SectionHead
          eyebrow="Our Offerings"
          description="Providing quality textile materials, diverse polyester fabrics, and flexible solutions based on customer needs."
        >
          Comprehensive Textile<br />
          <span className="text-[hsl(var(--accent))]">Trading &amp; Supply Offerings</span>
        </SectionHead>

        {/* Strict 2×2 on Mobile, 4-col at LG */}
        <div className="offerings-grid mt-10 grid items-stretch gap-4 grid-cols-2 lg:grid-cols-4">
          {offerings.map((o, i) => {
            const Icon = o.icon;
            return (
              <motion.article
                key={o.title}
                initial={reduce ? undefined : { opacity: 0, y: 14 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.08 }}
                transition={{ duration: 0.38, delay: Math.min(i * 0.04, 0.12) }}
                className="group flex flex-col items-center justify-between rounded-lg bg-gradient-to-br from-[hsl(var(--background))] to-[hsl(var(--secondary)/.3)] p-4 text-center shadow-sm transition-[border-color,box-shadow] duration-200 hover:shadow-md hover:border-[hsl(var(--accent)/.5)] border border-[hsl(var(--border))] sm:p-5"
              >
                <div>
                  <div className="mb-3.5 mx-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--accent)/.12)] transition-colors duration-200 group-hover:bg-[hsl(var(--accent)/.22)]">
                    <Icon size={22} strokeWidth={1.5} className="text-[hsl(var(--accent))]" />
                  </div>
                  <h3 className="mb-1.5 text-xs font-semibold leading-[1.35] text-[hsl(var(--foreground))] sm:text-sm sm:leading-[1.4]">
                    {o.title}
                  </h3>
                  <p className="text-[11px] leading-[1.55] text-[hsl(var(--muted-foreground))] sm:text-xs sm:leading-[1.6]">
                    {o.text}
                  </p>
                </div>
                <div className="mt-3.5 border-t border-[hsl(var(--border)/.6)] pt-2 w-full">
                  <span className="font-mono text-[10px] font-semibold text-[hsl(var(--accent))]">
                    {o.number}
                  </span>
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
   8. OUR EDGE / USP (PDF Page 6)
   Desktop: 4 Columns | Mobile: Strict 2×2 (ALL 4 VISIBLE)
   ══════════════════════════════════════════════════════════ */
function USP() {
  const reduce = useReducedMotion();
  return (
    <section id="usp" className="relative overflow-hidden bg-[hsl(var(--secondary)/.45)] border-t border-[hsl(var(--border))]">
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-35"
        style={{ background: 'radial-gradient(circle at 65% 46%, rgba(229,212,184,.5), transparent 28%)' }}
      />
      <Thread className="right-[-40px] top-[26%] hidden w-[480px] opacity-35 lg:block" />

      <div className="section-pad relative">
        <div className="inner-container">
          <SectionHead
            eyebrow="Unique Selling Proposition (USP)"
            description="Freya Poly Fab stands out through quality fabrics, reliable sourcing, and customer-focused textile solutions that drive long-term business relationships."
          >
            Why Work With<br />
            <span className="text-[hsl(var(--accent))]">Freya Poly Fab?</span>
          </SectionHead>

          {/* Strict 2×2 on Mobile, 4-col at LG — ALL 4 ITEMS VISIBLE */}
          <div className="usp-grid mt-10 grid items-stretch gap-4 grid-cols-2 lg:grid-cols-4">
            {uspPoints.map((item, i) => (
              <motion.article
                key={item.number}
                initial={reduce ? undefined : { opacity: 0, y: 14 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.08 }}
                transition={{ duration: 0.38, delay: Math.min(i * 0.04, 0.12) }}
                className="group flex flex-col justify-between rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card)/.9)] p-4 backdrop-blur-sm transition-[border-color,box-shadow] duration-200 hover:bg-[hsl(var(--card))] hover:shadow-md sm:p-5"
              >
                <div>
                  <div className="mb-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--accent)/.12)] font-mono text-xs font-bold text-[hsl(var(--accent))]">
                    {item.number}
                  </div>
                  <h3 className="mb-1 text-xs font-semibold uppercase tracking-[.06em] text-[hsl(var(--foreground))] sm:text-sm">
                    {item.title}
                  </h3>
                  <p className="text-[11px] leading-[1.55] text-[hsl(var(--muted-foreground))] sm:text-xs sm:leading-[1.6]">
                    {item.text}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Supporting takeaway banner from PDF */}
          <Reveal delay={0.15}>
            <div className="mt-8 rounded-lg border border-[hsl(var(--accent)/.3)] bg-[hsl(var(--background))] p-4 text-center sm:p-5">
              <p className="text-xs font-medium leading-[1.65] text-[hsl(var(--foreground))] sm:text-sm">
                &ldquo;Freya Poly Fab stands out through quality fabrics, reliable sourcing, and customer-focused textile solutions that drive long-term business relationships.&rdquo;
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   9. MARKET ALIGNMENT (STP) (PDF Page 7)
   3-Step Process: Segmentation, Targeting, Positioning
   ══════════════════════════════════════════════════════════ */
function MarketAlignment() {
  const reduce = useReducedMotion();

  return (
    <section id="market-alignment" className="section-pad bg-[hsl(var(--card))] border-t border-[hsl(var(--border))]">
      <div className="inner-container">
        <SectionHead
          eyebrow="Market Alignment (STP)"
          description="Freya Poly Fab focuses on identifying textile market opportunities, serving diverse fabric buyers, and building a strong position through quality materials, reliable supply, and customer-focused textile solutions."
        >
          Strategic Market<br />
          <span className="text-[hsl(var(--accent))]">Alignment &amp; Positioning</span>
        </SectionHead>

        <div className="mt-10 grid items-stretch gap-5 md:grid-cols-3">
          {stpSteps.map((step, i) => (
            <motion.article
              key={step.title}
              initial={reduce ? undefined : { opacity: 0, y: 14 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.08 }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.06, 0.12) }}
              className="flex flex-col justify-between rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background)/.7)] p-5 shadow-sm transition-[border-color,box-shadow] duration-200 hover:border-[hsl(var(--accent)/.5)] hover:shadow-md sm:p-6"
            >
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-[hsl(var(--accent))]">STEP {step.step}</span>
                  <span className="rounded bg-[hsl(var(--secondary))] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[hsl(var(--foreground)/.7)]">
                    STP Process
                  </span>
                </div>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-[.08em] text-[hsl(var(--primary))] sm:text-base">
                  {step.title}
                </h3>
                <p className="text-xs leading-[1.68] text-[hsl(var(--foreground))] sm:text-sm sm:leading-[1.7]">
                  {step.text}
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[hsl(var(--border)/.6)]">
                <span className="text-[11px] font-medium text-[hsl(var(--accent))]">
                  {step.title === 'Segmentation' && 'Fabric requirements & volume needs'}
                  {step.title === 'Targeting' && 'Apparel producers & bulk buyers'}
                  {step.title === 'Positioning' && 'Trusted textile trading partner'}
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   10. MARKET SIZE & TRENDS (PDF Page 8)
   ══════════════════════════════════════════════════════════ */
function MarketSize() {
  const reduce = useReducedMotion();
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInView = useInView(chartRef, { once: true, amount: 0.15 });

  const barData = [
    { name: 'India 2025',  value: 248.7, fill: '#0f3d5c' },
    { name: 'India 2034',  value: 656.3, fill: '#4a7ba7' },
    { name: 'Global 2025', value: 1160,  fill: '#b79a68' },
    { name: 'Global 2033', value: 1610,  fill: '#d4b883' },
  ];

  return (
    <section id="market-size" className="section-pad bg-[hsl(var(--background))] border-t border-[hsl(var(--border))]">
      <div className="inner-container">
        <SectionHead
          eyebrow="Market Size & Trends"
          description="The growing textile market, driven by rising apparel demand, sustainability trends, and evolving fashion needs, creates strong opportunities for reliable fabric suppliers like Freya Poly Fab."
        >
          Expanding Textile<br />
          <span className="text-[hsl(var(--accent))]">Market Opportunity</span>
        </SectionHead>

        <div className="market-grid mt-10 grid gap-6 lg:grid-cols-2">
          {/* Chart */}
          <Reveal delay={0.08}>
            <div ref={chartRef} className="h-[300px] overflow-hidden rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 shadow-sm sm:h-[340px] sm:p-5">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 12, right: 12, left: 4, bottom: 44 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(74,70,64,.08)" />
                  <XAxis dataKey="name" angle={-10} textAnchor="end" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                  <YAxis
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                    label={{ value: 'USD Billion', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                  />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '4px', fontSize: '12px' }}
                    formatter={(v) => [`$${v}B`, 'Market Volume']}
                  />
                  <Bar
                    dataKey="value"
                    radius={[4, 4, 0, 0]}
                    animationBegin={0}
                    animationDuration={chartInView && !reduce ? 700 : 0}
                  >
                    {barData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Reveal>

          {/* Stat Cards */}
          <Reveal delay={0.12}>
            <div className="flex flex-col gap-4">
              <div className="relative overflow-hidden rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-[.1em] text-[hsl(var(--primary))]">
                    Indian Textile &amp; Apparel Industry
                  </h3>
                  <span className="rounded bg-[hsl(var(--secondary))] px-2 py-0.5 text-[10px] font-semibold text-[hsl(var(--accent))]">
                    India Growth
                  </span>
                </div>
                <div className="my-2.5 flex items-center gap-4">
                  <div>
                    <span className="text-[11px] text-[hsl(var(--muted-foreground))]">2025</span>
                    <br />
                    <span className="text-2xl font-bold text-[hsl(var(--primary))]">
                      $<AnimatedNumber value={248} />.7B
                    </span>
                  </div>
                  <ArrowRight size={15} className="text-[hsl(var(--accent))] shrink-0" />
                  <div>
                    <span className="text-[11px] text-[hsl(var(--muted-foreground))]">2034 Projected</span>
                    <br />
                    <span className="text-2xl font-bold text-[hsl(var(--accent))]">
                      $<AnimatedNumber value={656} />.3B
                    </span>
                  </div>
                </div>
                <p className="text-xs leading-[1.6] text-[hsl(var(--muted-foreground))]">
                  India’s textile and apparel industry is valued at approximately USD 248.7 Billion (2025) and is projected to reach USD 656.3 Billion by 2034, driven by rising consumption, exports, and fashion demand.
                </p>
              </div>

              <div className="relative overflow-hidden rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-[.1em] text-[hsl(var(--primary))]">
                    Global Textile &amp; Apparel Industry
                  </h3>
                  <span className="rounded bg-[hsl(var(--secondary))] px-2 py-0.5 text-[10px] font-semibold text-[hsl(var(--accent))]">
                    CAGR 4.2%
                  </span>
                </div>
                <div className="my-2.5 flex items-center gap-4">
                  <div>
                    <span className="text-[11px] text-[hsl(var(--muted-foreground))]">2025</span>
                    <br />
                    <span className="text-2xl font-bold text-[hsl(var(--primary))]">
                      $<AnimatedNumber value={1160} />B (1.16T)
                    </span>
                  </div>
                  <ArrowRight size={15} className="text-[hsl(var(--accent))] shrink-0" />
                  <div>
                    <span className="text-[11px] text-[hsl(var(--muted-foreground))]">2033 Projected</span>
                    <br />
                    <span className="text-2xl font-bold text-[hsl(var(--accent))]">
                      $<AnimatedNumber value={1610} />B (1.61T)
                    </span>
                  </div>
                </div>
                <p className="text-xs leading-[1.6] text-[hsl(var(--muted-foreground))]">
                  The global textile market size was valued at approximately USD 1.16 trillion in 2025 and is projected to reach around USD 1.61 trillion by 2033, growing at a CAGR of 4.2%.
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Market Trend Banner & Source */}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <div className="flex-1 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--secondary)/.45)] p-4">
            <h3 className="mb-1 text-[11px] font-semibold uppercase tracking-[.1em] text-[hsl(var(--accent))]">
              Market Trends
            </h3>
            <p className="text-xs leading-[1.6] text-[hsl(var(--foreground))]">
              The textile industry is growing with rising apparel demand, e-commerce expansion, sustainable fabric adoption, and evolving fashion trends, creating strong opportunities for reliable fabric suppliers and textile solution providers.
            </p>
          </div>
          <div className="flex shrink-0 items-center justify-center rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-3 sm:self-stretch">
            <p className="text-center text-[10px] text-[hsl(var(--muted-foreground))]">
              Source: imarcgroup, grandviewresearch
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   11. OUR REVENUE STREAMS (PDF Page 9)
   ══════════════════════════════════════════════════════════ */
function RevenueStreams() {
  return (
    <section id="revenue" className="section-pad bg-[hsl(var(--card))] border-t border-[hsl(var(--border))]">
      <div className="inner-container">
        <SectionHead
          eyebrow="Our Revenue Streams"
          description="A diversified revenue model centered on dependable B2B fabric sales, wholesale distribution, and tailored textile partnerships."
        >
          Diversified Revenue<br />
          <span className="text-[hsl(var(--accent))]">Model</span>
        </SectionHead>

        {/* 3 Equal Cards */}
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {revenueStreams.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.06} className="flex h-full">
              <article className="flex flex-1 flex-col justify-between rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-5 shadow-sm transition-[border-color,box-shadow] duration-200 hover:border-[hsl(var(--accent)/.5)] hover:shadow-md sm:p-6">
                <div>
                  <div
                    className="mb-3.5 flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold"
                    style={{ background: `${s.color}15`, color: s.color }}
                  >
                    {s.number}
                  </div>
                  <h3 className="mb-2 text-sm font-semibold text-[hsl(var(--foreground))] sm:text-base">
                    {s.title}
                  </h3>
                  <p className="text-xs leading-[1.65] text-[hsl(var(--muted-foreground))] sm:text-sm">
                    {s.text}
                  </p>
                </div>
                <div className="mt-5 border-t border-[hsl(var(--border)/.6)] pt-2.5">
                  <span className="text-[11px] font-semibold text-[hsl(var(--accent))]">
                    Freya Poly Fab Revenue Channel
                  </span>
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
   12. COMPETITIVE LANDSCAPE & OUR UNIQUE ADVANTAGE (PDF Page 10)
   ══════════════════════════════════════════════════════════ */
function CompetitiveLandscape() {
  const reduce = useReducedMotion();
  const edgeItems = [
    {
      title: 'Quality Assurance',
      text: 'Providing reliable and premium fabric solutions with a focus on consistent quality and customer requirements.',
    },
    {
      title: 'Efficient Supply Network',
      text: 'Building strong supplier relationships to ensure timely availability, smooth sourcing, and dependable delivery.',
    },
    {
      title: 'Customer-Centric Approach',
      text: 'Offering flexible textile solutions and personalized service to create long-term partnerships with garment businesses.',
    },
  ];

  return (
    <section id="competitive" className="section-pad bg-[hsl(var(--background))] border-t border-[hsl(var(--border))]">
      <div className="inner-container">
        <SectionHead eyebrow="Competitive Landscape & Unique Advantage">
          Standing Out in<br />
          <span className="text-[hsl(var(--accent))]">the Textile Market</span>
        </SectionHead>

        <div className="competitive-grid mt-10 grid items-stretch gap-6 lg:grid-cols-2">
          {/* Left: Existing Solutions & Issues */}
          <motion.div
            initial={reduce ? undefined : { opacity: 0, y: 14 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.08 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="flex flex-col gap-4"
          >
            <article className="flex-1 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 sm:p-6 shadow-sm">
              <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--muted-foreground)/.1)]">
                <ShieldCheck size={16} className="text-[hsl(var(--muted-foreground))]" />
              </div>
              <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-[.08em] text-[hsl(var(--muted-foreground))]">
                Existing Solutions
              </h3>
              <p className="text-xs leading-[1.65] text-[hsl(var(--foreground)/.8)] sm:text-sm">
                Surat’s textile market offers multiple fabric traders, wholesalers, and manufacturers providing diverse textile materials, bulk supply, and competitive pricing to garment businesses through established local sourcing networks.
              </p>
            </article>

            <article className="flex-1 rounded-lg border border-[hsl(var(--destructive)/.3)] bg-[hsl(var(--card))] p-5 sm:p-6 shadow-sm">
              <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--destructive)/.08)]">
                <X size={16} className="text-[hsl(var(--destructive))]" />
              </div>
              <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-[.08em] text-[hsl(var(--destructive))]">
                Issues with Existing Solutions
              </h3>
              <p className="text-xs leading-[1.65] text-[hsl(var(--foreground))] sm:text-sm">
                Existing suppliers often face challenges like inconsistent quality, limited customization, delayed deliveries, fragmented supply chains, and difficulty in maintaining reliable long-term partnerships with apparel businesses.
              </p>
            </article>
          </motion.div>

          {/* Right: Our Edge */}
          <motion.div
            initial={reduce ? undefined : { opacity: 0, y: 14 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.08 }}
            transition={{ duration: 0.45, delay: 0.14 }}
            className="relative flex flex-col justify-between overflow-hidden rounded-xl border-2 border-[hsl(var(--accent)/.45)] bg-gradient-to-br from-[hsl(var(--accent)/.06)] to-[hsl(var(--card))] p-6 shadow-md sm:p-7"
          >
            <div>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(var(--accent))] text-white">
                  <Sparkles size={18} />
                </div>
                <h3 className="text-sm font-semibold uppercase tracking-[.09em] text-[hsl(var(--accent))] sm:text-base">
                  Our Edge
                </h3>
              </div>
              <div className="space-y-4">
                {edgeItems.map((item) => (
                  <div key={item.title} className="flex gap-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--accent)/.15)] text-[hsl(var(--accent))]">
                      <Check size={11} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-[hsl(var(--foreground))] sm:text-sm">
                        {item.title}:
                      </h4>
                      <p className="mt-0.5 text-xs leading-[1.6] text-[hsl(var(--muted-foreground))] sm:text-sm">
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 border-t border-[hsl(var(--border)/.7)] pt-3 text-[11px] font-semibold text-[hsl(var(--accent))]">
              Freya Poly Fab Differentiator
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   13. GO-TO-MARKET (G2M) STRATEGY (PDF Page 11)
   5-Part Visual Strategy
   ══════════════════════════════════════════════════════════ */
function G2MStrategy() {
  const reduce = useReducedMotion();
  return (
    <section id="g2m" className="section-pad bg-[hsl(var(--card))] border-t border-[hsl(var(--border))]">
      <div className="inner-container">
        <SectionHead
          eyebrow="Go-To-Market (G2M) Strategy"
          description="Freya Poly Fab aims to accelerate growth through strong customer relationships, reliable sourcing, digital reach, and strategic market expansion."
        >
          Five-Pillar Market<br />
          <span className="text-[hsl(var(--accent))]">Expansion Strategy</span>
        </SectionHead>

        {/* 5-item responsive grid */}
        <div className="g2m-grid mt-10 grid gap-3.5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {g2mItems.map(({ number, label, Icon }, i) => (
            <motion.div
              key={label}
              initial={reduce ? undefined : { opacity: 0, y: 12 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.08 }}
              transition={{ duration: 0.32, delay: Math.min(i * 0.03, 0.12) }}
              className={`group flex flex-col items-center justify-between rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-4 text-center shadow-sm transition-[border-color,box-shadow] duration-200 hover:border-[hsl(var(--accent))] hover:shadow-md sm:p-5 ${
                i === 4 ? 'col-span-2 sm:col-span-1' : ''
              }`}
            >
              <div className="mb-2 font-mono text-[10px] font-bold text-[hsl(var(--accent))]">
                {number}
              </div>
              <div className="mb-2.5 flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(var(--accent)/.1)] text-[hsl(var(--accent))] transition-transform duration-200 group-hover:scale-110">
                <Icon size={18} />
              </div>
              <span className="text-xs font-semibold uppercase tracking-[.06em] text-[hsl(var(--foreground))]">
                {label}
              </span>
            </motion.div>
          ))}
        </div>

        <Reveal delay={0.15}>
          <div className="mt-8 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--secondary)/.4)] p-4 text-center">
            <p className="text-xs leading-[1.68] text-[hsl(var(--foreground))] sm:text-sm">
              &ldquo;Freya Poly Fab aims to accelerate growth through strong customer relationships, reliable sourcing, digital reach, and strategic market expansion.&rdquo;
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   14. OUR GROWTH & EXPANSION STRATEGY (PDF Page 12)
   Short-Term vs Long-Term Perspective
   ══════════════════════════════════════════════════════════ */
function GrowthStrategy() {
  const reduce = useReducedMotion();
  const phases = [
    {
      title: 'Short-Term Perspective',
      subtitle: 'Establishing Manufacturing Foundation',
      icon: Factory,
      items: [
        'Establish a textile manufacturing unit with required machinery and infrastructure.',
        'Develop in-house production capabilities to ensure better quality control and efficient supply.',
        'Expand customer base across garment manufacturers, wholesalers, and apparel businesses.',
      ],
    },
    {
      title: 'Long-Term Perspective',
      subtitle: 'Scaling Capacity & Brand Positioning',
      icon: Award,
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
        <SectionHead
          eyebrow="Our Growth & Expansion Strategy"
          description="Transforming from textile trading into an integrated textile manufacturing and supply partner."
        >
          From Trading to<br />
          <span className="text-[hsl(var(--accent))]">Manufacturing Excellence</span>
        </SectionHead>

        {/* Goal Banner from PDF */}
        <Reveal delay={0.08}>
          <div className="mt-8 rounded-xl border border-[hsl(var(--accent)/.4)] bg-gradient-to-r from-[hsl(var(--card))] via-[hsl(var(--secondary)/.4)] to-[hsl(var(--card))] p-5 sm:p-6 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-[.18em] text-[hsl(var(--accent))]">
              Strategic Vision Goal
            </span>
            <p className="mt-1 text-sm font-medium leading-[1.7] text-[hsl(var(--foreground))] sm:text-base">
              &ldquo;To transform Freya Poly Fab into a leading textile manufacturing and supply company by establishing a manufacturing unit, expanding production capabilities, and building a strong presence in the apparel industry.&rdquo;
            </p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[hsl(var(--muted-foreground))]">
              <span><strong>Current Phase:</strong> Textile Trading &amp; Supply</span>
              <span>•</span>
              <span><strong>Future Phase:</strong> In-House Manufacturing + National Supply Network</span>
            </div>
          </div>
        </Reveal>

        {/* 2-Column Perspective Cards */}
        <div className="growth-grid mt-6 grid items-stretch gap-6 lg:grid-cols-2">
          {phases.map((phase, pi) => {
            const Icon = phase.icon;
            return (
              <motion.article
                key={phase.title}
                initial={reduce ? undefined : { opacity: 0, y: 14 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.08 }}
                transition={{ duration: 0.4, delay: pi * 0.08 }}
                className="flex flex-1 flex-col overflow-hidden rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-sm transition-[border-color,box-shadow] duration-200 hover:border-[hsl(var(--accent)/.45)] hover:shadow-md"
              >
                <div className="border-b border-[hsl(var(--border))] bg-[hsl(var(--secondary)/.35)] p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[.09em] text-[hsl(var(--accent))] sm:text-sm">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--accent))] text-[11px] font-bold text-white">
                        {pi + 1}
                      </span>
                      {phase.title}
                    </h3>
                    <Icon size={18} className="text-[hsl(var(--accent))]" />
                  </div>
                  <p className="mt-1 text-[11px] text-[hsl(var(--muted-foreground))]">
                    {phase.subtitle}
                  </p>
                </div>
                <div className="flex-1 p-5 sm:p-6">
                  <ul className="space-y-3.5">
                    {phase.items.map((item, ii) => (
                      <li key={ii} className="flex gap-3">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[hsl(var(--accent))]" />
                        <span className="text-xs leading-[1.68] text-[hsl(var(--foreground))] sm:text-sm">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
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
   15. OUR ASK / FUND UTILIZATION (PDF Page 13)
   ══════════════════════════════════════════════════════════ */
function FundUtilization() {
  const reduce = useReducedMotion();
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInView = useInView(chartRef, { once: true, amount: 0.15 });

  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }: any) => {
    const R = Math.PI / 180;
    const r = innerRadius + (outerRadius - innerRadius) * 0.5;
    return (
      <text
        x={cx + r * Math.cos(-midAngle * R)}
        y={cy + r * Math.sin(-midAngle * R)}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
        fontWeight={700}
      >
        {`${value}%`}
      </text>
    );
  };

  return (
    <section id="fund-utilization" className="section-pad bg-[hsl(var(--card))] border-t border-[hsl(var(--border))]">
      <div className="inner-container">
        <SectionHead
          eyebrow="Our Ask / Fund Utilization"
          description="Strategic fund allocation will enable Freya Poly Fab to establish manufacturing capabilities, strengthen production, and drive sustainable market expansion."
        >
          Strategic Fund<br />
          <span className="text-[hsl(var(--accent))]">Utilization Allocation</span>
        </SectionHead>

        <div className="fund-grid mt-10 grid items-start gap-6 lg:grid-cols-2">
          {/* Donut Chart */}
          <Reveal delay={0.08}>
            <div ref={chartRef} className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-5 shadow-sm">
              <div className="h-[240px] sm:h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={fundData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderLabel}
                      outerRadius="72%"
                      innerRadius="40%"
                      dataKey="value"
                      paddingAngle={2}
                      animationBegin={0}
                      animationDuration={chartInView && !reduce ? 700 : 0}
                    >
                      {fundData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '4px', fontSize: '12px' }}
                      formatter={(v, n) => [`${v}%`, n]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-[hsl(var(--border))] pt-3">
                {fundData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: item.color }} />
                    <span className="text-[11px] text-[hsl(var(--foreground)/.85)]">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Our Ask Breakdown */}
          <motion.div
            initial={reduce ? undefined : { opacity: 0, y: 14 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.08 }}
            transition={{ duration: 0.45, delay: 0.12 }}
            className="overflow-hidden rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-5 shadow-sm sm:p-7"
          >
            <div className="mb-3.5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[hsl(var(--accent))] text-white">
                <TrendingUp size={18} />
              </div>
              <h3 className="text-xs font-semibold uppercase tracking-[.09em] text-[hsl(var(--accent))] sm:text-sm">
                Our Ask
              </h3>
            </div>
            <p className="mb-4 text-xs leading-[1.68] text-[hsl(var(--foreground))] sm:text-sm">
              Strategic fund allocation will enable Freya Poly Fab to establish manufacturing capabilities, strengthen production, and drive sustainable market expansion.
            </p>
            <div className="space-y-2.5">
              {fundData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-2.5"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="h-3 w-3 shrink-0 rounded-sm" style={{ backgroundColor: item.color }} />
                    <span className="text-xs font-medium text-[hsl(var(--foreground))] sm:text-sm">{item.name}</span>
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
   16. LEADERSHIP & EXPERTISE (PDF Page 14)
   ══════════════════════════════════════════════════════════ */
function Leadership() {
  const reduce = useReducedMotion();
  return (
    <section id="leadership" className="section-pad bg-[hsl(var(--background))] border-t border-[hsl(var(--border))]">
      <div className="inner-container">
        <SectionHead
          eyebrow="Leadership & Expertise"
          description="Experienced industry leadership guiding Freya Poly Fab's growth in textile trading and manufacturing."
        >
          Driven by Industry<br />
          <span className="text-[hsl(var(--accent))]">Experience &amp; Vision</span>
        </SectionHead>

        <div className="leadership-grid mt-10 grid items-center gap-8 lg:grid-cols-[34fr_66fr] lg:gap-12">
          <motion.div
            initial={reduce ? undefined : { opacity: 0, scale: 0.96 }}
            whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.08 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="leader-avatar flex justify-center"
          >
            <div className="relative">
              <div className="relative flex h-48 w-48 items-center justify-center overflow-hidden rounded-full border-4 border-[hsl(var(--accent))] bg-gradient-to-br from-[hsl(var(--accent)/.12)] via-[hsl(var(--secondary))] to-[hsl(var(--accent)/.06)] shadow-xl sm:h-56 sm:w-56">
                <Users size={80} strokeWidth={1} className="text-[hsl(var(--accent)/.4)] sm:size-[96px]" />
              </div>
              <div className="absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[hsl(var(--accent))] text-white shadow-md">
                <Sparkles size={18} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={reduce ? undefined : { opacity: 0, y: 14 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.08 }}
            transition={{ duration: 0.45, delay: 0.12 }}
            className="relative overflow-hidden rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-sm sm:p-8"
          >
            <div className="relative">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-lg font-semibold text-[hsl(var(--primary))] sm:text-xl">
                  Devyani Ramnik Timbadiya
                </h3>
                <span className="rounded bg-[hsl(var(--secondary))] px-2.5 py-1 text-[11px] font-semibold text-[hsl(var(--accent))]">
                  Bachelor of Commerce (B.Com)
                </span>
              </div>
              <p className="mb-4 mt-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[.12em] text-[hsl(var(--accent))]">
                <span className="h-px w-5 bg-[hsl(var(--accent))]" />Founder / Proprietor
              </p>

              <div className="space-y-3 text-xs leading-[1.72] text-[hsl(var(--foreground))] sm:text-sm sm:leading-[1.75]">
                <p>
                  Devyani Ramnik Timbadiya, Founder of Freya Poly Fab, holds a <strong>Bachelor of Commerce (B.Com)</strong> qualification and brings <strong>10–15 years of industry experience</strong> in the textile and garment sector.
                </p>
                <p>
                  With strong understanding of fabric trading, market requirements, customer relationships, and business operations, she has developed expertise in managing textile supply processes.
                </p>
                <p>
                  Her vision and industry knowledge drive Freya Poly Fab’s growth towards becoming a trusted textile manufacturing and supply partner.
                </p>
              </div>

              {/* Core Expertise Tags */}
              <div className="mt-5 flex flex-wrap gap-2 border-t border-[hsl(var(--border))] pt-4">
                {[
                  'Fabric Trading',
                  'Market Requirements',
                  'Customer Relationships',
                  'Business Operations',
                  'Textile Supply Processes',
                ].map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-[hsl(var(--accent)/.3)] bg-[hsl(var(--background))] px-3 py-1 text-[11px] font-medium text-[hsl(var(--foreground))]"
                  >
                    {skill}
                  </span>
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
   17. PARTNER WITH US / PRE-FOOTER CTA (PDF Page 15)
   ══════════════════════════════════════════════════════════ */
function CTASection() {
  return (
    <section className="section-pad relative overflow-hidden bg-gradient-to-br from-[hsl(var(--card))] to-[hsl(var(--secondary)/.4)] border-t border-[hsl(var(--border))]">
      <div className="inner-container text-center">
        <Reveal>
          <div className="eyebrow mb-3">Partner With Us</div>
          <h2
            className="display mx-auto max-w-[680px] font-semibold text-[hsl(var(--primary))]"
            style={{ fontSize: 'clamp(1.85rem, 3.8vw, 3.2rem)' }}
          >
            Partner With<br />
            <span className="text-[hsl(var(--accent))]">Freya Poly Fab</span>
          </h2>
          <p className="mx-auto mt-2 text-xs font-semibold uppercase tracking-[.15em] text-[hsl(var(--accent))]">
            Weaving Quality Fabrics, Building Fashion Futures.
          </p>
          <p className="mx-auto mt-4 max-w-[520px] text-xs leading-[1.7] text-[hsl(var(--muted-foreground))] sm:text-sm">
            Connect with Freya Poly Fab for premium fabric supply, dependable sourcing, and customized volume textile partnerships.
          </p>

          {/* Quick Contact Bar */}
          <div className="mx-auto mt-8 max-w-[720px] rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-4 shadow-sm sm:p-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <a
                href="tel:+919879296213"
                className="flex items-center justify-center gap-2.5 text-xs font-semibold text-[hsl(var(--foreground))] hover:text-[hsl(var(--accent))]"
              >
                <Phone size={15} className="text-[hsl(var(--accent))]" /> +91 9879296213
              </a>
              <a
                href="mailto:devr8155@gmail.com"
                className="flex items-center justify-center gap-2.5 text-xs font-semibold text-[hsl(var(--foreground))] hover:text-[hsl(var(--accent))]"
              >
                <Mail size={15} className="text-[hsl(var(--accent))]" /> devr8155@gmail.com
              </a>
              <span className="flex items-center justify-center gap-2.5 text-xs text-[hsl(var(--muted-foreground))]">
                <MapPin size={15} className="text-[hsl(var(--accent))] shrink-0" /> Surat, Gujarat
              </span>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => goTo('contact')}
              className="inline-flex min-h-[48px] min-w-[200px] items-center justify-center gap-2.5 bg-[hsl(var(--accent))] px-6 py-3.5 text-xs font-semibold uppercase tracking-[.13em] text-white shadow-sm transition-colors hover:bg-[hsl(var(--accent)/.88)] active:scale-[.99]"
              data-testid="button-cta-partner"
            >
              Partner With Us <ArrowRight size={14} />
            </button>
            {/* <button
              type="button"
              onClick={() => goTo('fabric-supply')}
              className="inline-flex min-h-[48px] min-w-[190px] items-center justify-center gap-2.5 border border-[hsl(var(--accent)/.6)] bg-transparent px-6 py-3.5 text-xs font-semibold uppercase tracking-[.13em] text-[hsl(var(--foreground))] transition hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))] active:scale-[.99]"
              data-testid="button-cta-fabrics"
            >
              View Fabric Range <ArrowRight size={14} />
            </button> */}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   HOME PAGE CONTAINER
   ══════════════════════════════════════════════════════════ */
function Home() {
  useEffect(() => {
    document.title = 'Freya Poly Fab — Weaving Quality Fabrics, Building Fashion Futures.';
    const desc =
      'Freya Poly Fab is a growing textile trading company specializing in quality fabrics and textile materials with reliable sourcing, timely delivery, and customer-focused solutions for the apparel industry.';
    const setMeta = (name: string, content: string, property = false) => {
      const attr = property ? 'property' : 'name';
      let tag = document.head.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attr, name);
        document.head.appendChild(tag);
      }
      tag.content = content;
    };
    setMeta('description', desc);
    setMeta('og:title', 'Freya Poly Fab — Weaving Quality Fabrics, Building Fashion Futures.', true);
    setMeta('og:description', desc, true);
    setMeta('og:type', 'website', true);
    const hash = window.location.hash.slice(1);
    if (hash) {
      setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
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
        {/* <FabricSupply /> */}
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
        className="fixed bottom-5 right-5 z-30 flex h-10 w-10 items-center justify-center border border-[hsl(var(--border))] bg-[hsl(var(--card)/.95)] text-[hsl(var(--primary))] shadow-md backdrop-blur-md transition-colors hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))]"
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
            <Route path="/" component={Home} />
            <Route path="/contact" component={ContactPage} />
            <Route path="/admin/login" component={AdminLogin} />
            <Route path="/admin">
              {() => (
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              )}
            </Route>
            <Route
              component={() => (
                <div className="flex min-h-screen items-center justify-center bg-[hsl(var(--background))] px-4">
                  <div className="text-center">
                    <h1 className="text-3xl font-bold text-[hsl(var(--primary))]">404 — Page Not Found</h1>
                    <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
                      The page you are looking for does not exist.
                    </p>
                    <a
                      href="/"
                      className="mt-4 inline-block text-xs uppercase tracking-wider text-[hsl(var(--accent))] underline underline-offset-4"
                    >
                      Return Home
                    </a>
                  </div>
                </div>
              )}
            />
          </Switch>
        </ErrorBoundary>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

