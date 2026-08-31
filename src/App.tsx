import { useEffect, useState, type ReactNode } from 'react';
import { motion, useReducedMotion, useInView } from 'framer-motion';
import {
  ArrowDownRight, ArrowRight, Check, CircleArrowUp,
  Layers3, Network, Package,
  ShieldCheck, Sparkles, Store, Target, TrendingUp, Users, X,
} from 'lucide-react';
import logoPath from '/logo.png';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useRef } from 'react';
import { Route, Switch } from 'wouter';
import ContactPage from '@/pages/contact';
import AdminLogin from '@/pages/admin/login';
import AdminDashboard from '@/pages/admin/index';
import { ProtectedRoute } from '@/components/protected-route';
import { Header, Footer } from '@/components/layout';

const queryClient = new QueryClient();

const navItems = [
  { label: 'Home', id: 'home', href: '/' },
  { label: 'About', id: 'about', href: '/#about' },
  { label: 'Challenges', id: 'challenges', href: '/#challenges' },
  { label: 'Solutions', id: 'solutions', href: '/#solutions' },
  { label: 'Market', id: 'market-size', href: '/#market-size' },
  { label: 'Leadership', id: 'leadership', href: '/#leadership' },
  { label: 'Contact', id: 'contact', href: '/contact' },
];

const challenges = [
  { title: 'Fragmented Supply Chain', text: 'Lack of coordination between fabric suppliers, manufacturers, and buyers leads to delays and inefficiencies in textile operations.', icon: Network },
  { title: 'Rising Raw Material Costs', text: 'Increasing prices of yarn, fabrics, and processing inputs impact profitability and create pricing challenges for textile businesses.', icon: TrendingUp },
  { title: 'Quality & Reliability Issues', text: 'Maintaining consistent fabric quality and ensuring timely supply remains a challenge in a competitive textile market.', icon: ShieldCheck },
  { title: 'Intense Market Competition', text: 'Growing competition among textile suppliers and global sourcing markets creates pressure on pricing and customer retention.', icon: Target },
];

const solutions = [
  { number: '01', title: 'Reliable Fabric Supply', text: 'Providing quality textile materials with consistent availability and timely delivery.', icon: ShieldCheck },
  { number: '02', title: 'Customer-Centric Approach', text: 'Offering tailored fabric solutions to meet the diverse requirements of garment businesses.', icon: Target },
  { number: '03', title: 'Quality & Trust Focus', text: 'Ensuring superior fabric standards through reliable sourcing and strong supplier networks.', icon: Sparkles },
];

const offerings = [
  { title: 'Premium Fabric Supply', text: 'Providing quality textile materials for garment and apparel businesses.', icon: Package },
  { title: 'Diverse Textile Range', text: 'Offering a wide selection of polyester and fabric solutions to meet market demands.', icon: Layers3 },
  { title: 'Reliable Trading Network', text: 'Ensuring smooth sourcing and timely delivery through strong supplier connections.', icon: Network },
  { title: 'Customized Fabric Solutions', text: 'Delivering flexible textile options based on customer requirements.', icon: Store },
];

const uspPoints = [
  { number: '01', title: 'Quality-Driven Approach', text: 'Ensuring premium fabric quality through reliable sourcing and selection.' },
  { number: '02', title: 'Strong Supplier Network', text: 'Building efficient supply channels for consistent availability of textile materials.' },
  { number: '03', title: 'Customer-Focused Solutions', text: 'Providing flexible fabric options aligned with client requirements.' },
  { number: '04', title: 'Timely & Reliable Delivery', text: 'Maintaining strong commitments through efficient order management and service.' },
];

const revenueStreams = [
  { title: 'B2B Fabric Sales', text: 'Generating revenue through bulk fabric supply to garment manufacturers, wholesalers, and apparel businesses.' },
  { title: 'Wholesale Distribution', text: 'Earning through fabric trading and distribution networks by supplying quality textile materials to diverse buyers.' },
  { title: 'Customized Textile Solutions', text: 'Creating value through customer-specific fabric sourcing and reliable supply partnerships for recurring business opportunities.' },
];

const g2mStrategies = ['B2B Customer Acquisition', 'Strong Supplier Partnerships', 'Digital Presence Expansion', 'Market Relationship Building', 'Geographical Expansion'];

function goTo(id: string, close?: () => void) {
  close?.();
  
  // If it's the contact page, navigate to /contact
  if (id === 'contact') {
    window.location.href = '/contact';
    return;
  }
  
  // If we're on the contact page and need to go to home sections
  if (window.location.pathname === '/contact') {
    // Navigate to home with hash
    window.location.href = '/#' + id;
    return;
  }
  
  // Otherwise scroll to section on the same page
  window.setTimeout(() => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 30);
}

function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? undefined : { opacity: 0, y: 22 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] }}
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
         fill="none" stroke="rgba(183,154,104,.78)" strokeWidth="1.1"
      />
       <path d="M4 46 C78 4 114 75 186 35 S303 27 356 50 S427 73 476 16" fill="none" stroke="rgba(74,70,64,.14)" strokeWidth=".6" transform="translate(0,4)" />
    </svg>
  );
}

function Logo({ compact = false }: { compact?: boolean }) {
  return <img src={logoPath} alt="Freya Poly Fab official logo" className={compact ? 'h-10 w-auto object-contain' : 'h-12 w-auto object-contain'} />;
}

function Hero() {
  const reduce = useReducedMotion();
  return (
    <section id="home" className="relative isolate overflow-hidden bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <div className="absolute inset-0 opacity-70" style={{ background: 'radial-gradient(circle at 80% 24%, rgba(229,212,184,.42), transparent 28%), linear-gradient(110deg, rgba(250,248,243,.98) 25%, rgba(245,241,232,.82) 100%)' }} />
      <div className="absolute right-[-10%] top-[13%] h-[78vw] w-[78vw] max-h-[760px] max-w-[760px] rounded-full border border-[hsl(var(--accent)/.22)] max-md:hidden" />
      <div className="absolute right-[8%] top-[27%] h-[48vw] w-[48vw] max-h-[520px] max-w-[520px] rounded-full border border-dashed border-[hsl(var(--accent)/.15)] max-md:hidden" />
      <Thread className="right-[-80px] top-[28%] w-[560px] rotate-[-9deg] opacity-90 max-md:hidden sm:right-[1%] lg:top-[36%]" />
      <div className="relative z-10 mx-auto grid min-h-[580px] max-w-[1240px] items-center gap-10 px-5 pb-12 pt-24 sm:px-8 md:grid-cols-[1.02fr_.98fr] md:gap-8 md:pb-16 md:pt-28 lg:min-h-[680px] lg:gap-20 lg:px-10 lg:pb-16 lg:pt-28">
        <motion.div initial={reduce ? undefined : { opacity: 0, y: 22 }} animate={reduce ? undefined : { opacity: 1, y: 0 }} transition={{ duration: .85, ease: [.22, 1, .36, 1] }} className="relative z-10 max-w-[720px]">
          <h1 className="display max-w-[700px] text-[clamp(2.4rem,6.1vw,5.4rem)] font-semibold leading-[1.02] text-[hsl(var(--foreground))]">Weaving Quality Fabrics,<br /><span className="text-[hsl(var(--accent))]">Building Fashion Futures.</span></h1>
          <p className="mt-5 max-w-[530px] text-[15px] leading-[1.7] text-[hsl(var(--muted-foreground))] sm:text-base sm:leading-[1.75]">Quality fabrics and reliable textile solutions for apparel and garment businesses.</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <button type="button" onClick={() => goTo('contact')} className="group inline-flex min-h-[48px] items-center justify-center gap-3 bg-[hsl(var(--accent))] px-6 py-3.5 text-xs font-semibold uppercase tracking-[.13em] text-[hsl(var(--accent-foreground))] transition hover:bg-[hsl(var(--accent)/.9)]" data-testid="button-hero-contact">Partner With Us <ArrowDownRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:translate-y-1" /></button>
            <button type="button" onClick={() => goTo('offerings')} className="inline-flex min-h-[48px] items-center justify-center gap-3 border border-[hsl(var(--accent)/.7)] px-6 py-3.5 text-xs font-semibold uppercase tracking-[.13em] text-[hsl(var(--foreground))] transition hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))]" data-testid="button-hero-offerings">Our Offerings <ArrowRight size={16} /></button>
          </div>
        </motion.div>
        <motion.div initial={reduce ? undefined : { opacity: 0, scale: .95 }} animate={reduce ? undefined : { opacity: 1, scale: 1 }} transition={{ duration: 1.1, delay: .15 }} className="relative mx-auto w-full max-w-[480px] md:max-w-[400px] lg:max-w-[480px]">
          <div className="relative aspect-[.88] overflow-hidden border border-[hsl(var(--border))] bg-[hsl(var(--secondary))] shadow-2xl shadow-[rgba(74,70,64,.12)]">
            <img src="/fabric-rolls.jpg" alt="Abstract folded and rolled textile materials in muted neutral tones" className="h-full w-full object-cover opacity-95 brightness-110 saturate-[.65]" loading="eager" />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(250,248,243,.76)] via-transparent to-[rgba(229,212,184,.18)]" />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between border-t border-[hsl(var(--foreground)/.18)] pt-4 text-[10px] uppercase tracking-[.17em] text-[hsl(var(--foreground)/.76)]"><span>Material / Texture / Supply</span><span className="text-[hsl(var(--accent))]">01—04</span></div>
          </div>
          <div className="absolute -bottom-5 -left-5 hidden h-24 w-24 border-b border-l border-[hsl(var(--accent)/.7)] sm:block" />
          <div className="absolute -right-4 -top-4 h-20 w-20 border-r border-t border-[hsl(var(--accent)/.65)] sm:-right-5 sm:-top-5" />
        </motion.div>
      </div>
    </section>
  );
}

function About() {
  return <section id="about" className="section-pad bg-[hsl(var(--background))]"><div className="mx-auto grid max-w-[1180px] items-center gap-10 lg:grid-cols-[.96fr_1.04fr] lg:gap-16"><Reveal className="relative"><div className="fabric-panel aspect-[.9] max-w-[480px]"><img src="/fabric-weave.jpg" alt="Close-up of woven textile fibers in warm neutral tones" className="h-full w-full object-cover brightness-110 saturate-[.7]" loading="lazy" /><div className="absolute inset-0 bg-gradient-to-tr from-[rgba(183,154,104,.16)] to-transparent" /><div className="absolute bottom-0 left-0 bg-[hsl(var(--secondary))] px-5 py-4 text-[hsl(var(--foreground))] max-sm:px-4 max-sm:py-3"><span className="block text-[10px] uppercase tracking-[.2em] text-[hsl(var(--accent))]">Our Material Point of View</span><span className="mt-1 block text-sm">Reliable by Design</span></div></div><div className="absolute -bottom-6 right-4 h-16 w-16 border-b border-r border-[hsl(var(--accent))] sm:right-0" /></Reveal><Reveal delay={.12}><div className="eyebrow mb-4">About Freya Poly Fab</div><h2 className="display max-w-[580px] text-[clamp(1.9rem,4vw,3.6rem)] font-semibold leading-[1.05] text-[hsl(var(--primary))]">A Trusted Textile<br />Supply Partner</h2><div className="mt-6 max-w-[570px] space-y-4 text-[15px] leading-[1.75] text-[hsl(var(--muted-foreground))]"><p>Freya Poly Fab is a growing textile trading company specializing in the supply of quality fabrics and textile materials to meet the evolving needs of the apparel industry.</p><p>With a strong focus on reliability, timely delivery, and customer satisfaction, the company aims to become a trusted partner for garment manufacturers and businesses by providing premium textile solutions that support innovation and growth.</p></div><button type="button" onClick={() => goTo('mission')} className="group mt-7 inline-flex items-center gap-3 border-b border-[hsl(var(--accent))] pb-2 text-xs font-semibold uppercase tracking-[.16em] text-[hsl(var(--primary))]" data-testid="button-about-learn">Learn More <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></button></Reveal></div></section>;
}

function Mission() {
  const cards = [{ label: 'Our Mission', text: 'To provide reliable textile solutions with superior quality, timely supply, and customer-focused service.', number: '01' }, { label: 'Our Vision', text: 'To become a trusted textile partner by delivering quality fabrics and building sustainable growth in the apparel industry.', number: '02' }];
  return <section id="mission" className="section-pad textile-grid bg-[hsl(var(--card))]"><div className="mx-auto max-w-[1180px]"><Reveal><div className="eyebrow mb-4">Mission & Vision</div><h2 className="display max-w-[620px] text-[clamp(1.9rem,4vw,3.5rem)] font-semibold leading-[1.05] text-[hsl(var(--primary))]">Built Around the<br />Business Relationship.</h2></Reveal><div className="mt-10 grid items-stretch gap-5 md:grid-cols-2">{cards.map((card, index) => <Reveal key={card.label} delay={index * .1} className="flex"><article className="relative flex flex-1 flex-col overflow-hidden border border-[hsl(var(--border))] bg-[hsl(var(--background)/.65)] p-6 sm:p-8"><span className="absolute right-6 top-5 font-mono text-4xl font-light text-[hsl(var(--accent)/.35)]">{card.number}</span><div className="relative max-w-[460px] flex-1"><div className="eyebrow mb-5">{card.label}</div><p className="text-lg leading-[1.65] text-[hsl(var(--foreground))] sm:text-xl sm:leading-[1.7]">"{card.text}"</p></div></article></Reveal>)}</div></div></section>;
}

function Challenges() {
  const reduce = useReducedMotion();
  return <section id="challenges" className="section-pad bg-[hsl(var(--background))]"><div className="mx-auto max-w-[1180px]"><Reveal><div className="eyebrow mb-4">Market Challenges</div><h2 className="display max-w-[630px] text-[clamp(2rem,4.5vw,3.8rem)] font-semibold leading-[1.05] text-[hsl(var(--primary))]">Challenges in the<br /><span className="text-[hsl(var(--accent))]">Textile Market</span></h2></Reveal><div className="mt-10 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4">{challenges.map((challenge, index) => { const Icon = challenge.icon; return <motion.article key={challenge.title} initial={reduce ? undefined : { opacity: 0, y: 30 }} whileInView={reduce ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }} whileHover={reduce ? undefined : { y: -4 }} className="group relative flex flex-col justify-between border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg" style={{ borderTopWidth: '3px', borderTopColor: index === 0 ? '#0f3d5c' : index === 1 ? '#4a7ba7' : index === 2 ? '#b79a68' : '#d4b883' }}><div className="mb-4"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[hsl(var(--accent)/.15)] to-[hsl(var(--accent)/.05)] transition-transform duration-300 group-hover:scale-110"><Icon size={22} strokeWidth={1.5} className="text-[hsl(var(--accent))]" /></div></div><div className="flex-1"><h3 className="mb-3 text-base font-semibold leading-[1.4] text-[hsl(var(--foreground))]">{challenge.title}</h3><p className="text-sm leading-[1.6] text-[hsl(var(--muted-foreground))]">{challenge.text}</p></div><div className="mt-5 flex items-center justify-between border-t border-[hsl(var(--border))] pt-4"><span className="font-mono text-xs text-[hsl(var(--accent)/.7)]">0{index + 1}</span><ArrowRight size={16} className="text-[hsl(var(--accent))] transition-transform duration-300 group-hover:translate-x-2" /></div></motion.article> })}</div></div></section>;
}

function Solutions() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  return <section id="solutions" className="section-pad bg-[hsl(var(--card))]"><div className="mx-auto max-w-[1180px]"><Reveal><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><div className="eyebrow mb-4">Solution We Offer</div><h2 className="display max-w-[630px] text-[clamp(2rem,4.5vw,3.8rem)] font-semibold leading-[1.05] text-[hsl(var(--primary))]">Bridging Textile<br /><span className="text-[hsl(var(--accent))]">Supply Challenges</span></h2></div><p className="max-w-[280px] text-sm leading-[1.6] text-[hsl(var(--muted-foreground))]">Freya Poly Fab bridges textile supply challenges by delivering quality fabrics, reliable sourcing, and customer-focused solutions.</p></div></Reveal><div ref={ref} className="relative mt-10 grid items-stretch gap-8 md:grid-cols-3"><div className="absolute left-[50%] top-1/2 hidden h-px w-[85%] -translate-x-1/2 -translate-y-1/2 md:block"><motion.div initial={{ scaleX: 0 }} animate={isInView && !reduce ? { scaleX: 1 } : {}} transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }} className="h-full w-full origin-left bg-gradient-to-r from-[hsl(var(--accent)/.3)] via-[hsl(var(--accent)/.6)] to-[hsl(var(--accent)/.3)]" /><ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 text-[hsl(var(--accent)/.6)]" size={18} /></div>{solutions.map((solution, index) => { const Icon = solution.icon; return <motion.article key={solution.number} initial={reduce ? undefined : { opacity: 0, scale: 0.9 }} whileInView={reduce ? undefined : { opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5, delay: 0.8 + index * 0.15, ease: [0.22, 1, 0.36, 1] }} className="group relative flex flex-1 flex-col overflow-hidden rounded-lg border-2 border-[hsl(var(--border))] bg-[hsl(var(--background))] p-6 transition-all duration-300 hover:border-[hsl(var(--accent))] sm:p-7"><div className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(var(--accent)/.1)] font-mono text-sm font-bold text-[hsl(var(--accent))] transition-all duration-300 group-hover:scale-125 group-hover:bg-[hsl(var(--accent))] group-hover:text-[hsl(var(--accent-foreground))]">{solution.number}</div><div className="mb-5"><Icon size={28} strokeWidth={1.5} className="text-[hsl(var(--accent))] transition-transform duration-300 group-hover:scale-110" /></div><h3 className="text-base font-semibold text-[hsl(var(--foreground))] sm:text-lg">{solution.title}</h3><p className="mt-3 text-sm leading-[1.65] text-[hsl(var(--muted-foreground))]">{solution.text}</p><motion.div initial={{ width: 0 }} whileInView={{ width: '100%' }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 1.2 + index * 0.15 }} className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[hsl(var(--accent))] to-transparent" /></motion.article> })}</div></div></section>;
}

function Offerings() {
  const reduce = useReducedMotion();
  return <section id="offerings" className="section-pad bg-[hsl(var(--background))]"><div className="mx-auto max-w-[1180px]"><Reveal><div className="eyebrow mb-4">Our Offerings</div><h2 className="display max-w-[630px] text-[clamp(2rem,4.5vw,3.8rem)] font-semibold leading-[1.05] text-[hsl(var(--primary))]">Complete Textile<br /><span className="text-[hsl(var(--accent))]">Solutions</span></h2></Reveal><div className="mt-10 grid items-stretch gap-6 sm:grid-cols-2">{offerings.map((offering, index) => { const Icon = offering.icon; return <motion.article key={offering.title} initial={reduce ? undefined : { opacity: 0, scale: 0.9 }} whileInView={reduce ? undefined : { opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.4, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }} className="group relative flex flex-col items-center overflow-hidden rounded-2xl bg-gradient-to-br from-[hsl(var(--card))] to-[hsl(var(--secondary)/.3)] p-8 text-center shadow-sm transition-all duration-300 hover:shadow-xl sm:p-10"><motion.div whileHover={reduce ? undefined : { scale: 1.1, rotate: 5 }} transition={{ duration: 0.3 }} className="mb-5 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-[hsl(var(--accent)/.2)] to-[hsl(var(--accent)/.05)] transition-colors duration-300 group-hover:from-[hsl(var(--accent)/.3)] group-hover:to-[hsl(var(--accent)/.15)]"><Icon size={32} strokeWidth={1.5} className="text-[hsl(var(--accent))]" /></motion.div><h3 className="mb-3 text-base font-semibold text-[hsl(var(--foreground))] sm:text-lg">{offering.title}</h3><p className="text-sm leading-[1.65] text-[hsl(var(--muted-foreground))]">{offering.text}</p></motion.article> })}</div></div></section>;
}

function USP() {
  const reduce = useReducedMotion();
  return <section id="usp" className="relative overflow-hidden bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))]"><div className="absolute inset-y-0 right-0 w-1/2 opacity-50" style={{ background: 'radial-gradient(circle at 65% 46%, rgba(229,212,184,.62), transparent 26%)' }} /><Thread className="right-[-100px] top-[28%] hidden w-[620px] opacity-50 lg:block" /><div className="section-pad relative mx-auto max-w-[1180px]"><Reveal><div className="eyebrow mb-4">Unique Selling Proposition (USP)</div><h2 className="display max-w-[630px] text-[clamp(2.1rem,5vw,4.4rem)] font-semibold leading-[1.05] text-[hsl(var(--foreground))]">Why Work With<br /><span className="text-[hsl(var(--accent))]">Freya Poly Fab?</span></h2></Reveal><div className="mt-10 space-y-5">{uspPoints.map((item, index) => { const isEven = index % 2 === 0; return <motion.article key={item.number} initial={reduce ? undefined : { opacity: 0, x: isEven ? -40 : 40 }} whileInView={reduce ? undefined : { opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }} className="group relative flex items-center gap-5 overflow-hidden rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card)/.6)] p-6 backdrop-blur-sm transition-all duration-300 hover:bg-[hsl(var(--card)/.9)] sm:gap-6 sm:p-7"><motion.div className="absolute left-0 top-0 h-full w-1 bg-[hsl(var(--accent))] transition-all duration-300 group-hover:w-2" initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }} /><div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[hsl(var(--accent)/.15)] to-[hsl(var(--accent)/.05)] font-mono text-lg font-bold text-[hsl(var(--accent))]">{item.number}</div><div className="flex-1"><h3 className="mb-2 text-base font-semibold uppercase tracking-[.08em] text-[hsl(var(--foreground))]">{item.title}</h3><p className="text-sm leading-[1.6] text-[hsl(var(--muted-foreground))]">{item.text}</p></div></motion.article> })}</div><Reveal delay={.3}><p className="mx-auto mt-8 max-w-[780px] text-center text-sm leading-[1.65] text-[hsl(var(--muted-foreground))]">Freya Poly Fab stands out through quality fabrics, reliable sourcing, and customer-focused textile solutions that drive long-term business relationships.</p></Reveal></div></section>;
}

function MarketAlignment() {
  const reduce = useReducedMotion();
  const steps = [
    { title: 'Segmentation', text: 'Freya Poly Fab segments the market based on fabric requirements, buyer preferences, order volume, and industry needs, serving garment manufacturers, wholesalers, retailers, and apparel businesses seeking reliable textile suppliers.' },
    { title: 'Targeting', text: 'The company targets garment producers, fashion businesses, textile traders, and bulk buyers who require consistent fabric availability, competitive pricing, and dependable supply partnerships.' },
    { title: 'Positioning', text: 'Freya Poly Fab positions itself as a trusted textile trading partner offering quality fabrics, efficient sourcing, and reliable service to support the growing apparel and fashion ecosystem.' }
  ];
  
  return <section id="market-alignment" className="section-pad bg-[hsl(var(--card))]"><div className="mx-auto max-w-[1180px]"><Reveal><div className="eyebrow mb-4">Market Alignment (STP)</div><h2 className="display max-w-[680px] text-[clamp(2rem,4.5vw,3.8rem)] font-semibold leading-[1.05] text-[hsl(var(--primary))]">Strategic Market<br /><span className="text-[hsl(var(--accent))]">Positioning</span></h2></Reveal><div className="mt-10 relative"><div className="absolute left-6 top-0 hidden h-full w-0.5 bg-gradient-to-b from-[hsl(var(--accent)/.3)] via-[hsl(var(--accent)/.6)] to-[hsl(var(--accent)/.3)] md:block" />{steps.map((step, index) => { const ref = useRef<HTMLDivElement>(null); const isInView = useInView(ref, { once: true, amount: 0.5 }); return <div key={step.title} ref={ref} className="relative mb-8 md:ml-16"><motion.div initial={reduce ? undefined : { scale: 0 }} animate={isInView && !reduce ? { scale: 1 } : {}} transition={{ duration: 0.4, delay: 0.2 }} className="absolute left-[-4.5rem] top-6 hidden h-6 w-6 rounded-full border-4 border-[hsl(var(--accent))] bg-[hsl(var(--background))] md:block"><motion.div initial={{ scale: 0 }} animate={isInView && !reduce ? { scale: [0, 1.2, 1], opacity: [0, 1, 0] } : {}} transition={{ duration: 1, delay: 0.5, repeat: isInView ? 0 : Infinity, repeatDelay: 2 }} className="absolute inset-0 rounded-full bg-[hsl(var(--accent)/.4)]" /></motion.div><motion.article initial={reduce ? undefined : { opacity: 0, x: 30 }} whileInView={reduce ? undefined : { opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }} className="group overflow-hidden rounded-lg border-2 border-[hsl(var(--border))] bg-[hsl(var(--background)/.65)] p-6 shadow-sm transition-all duration-300 hover:border-[hsl(var(--accent)/.5)] hover:shadow-md sm:p-8"><div className="mb-3 flex items-center gap-3"><span className="font-mono text-xs text-[hsl(var(--accent)/.7)]">STEP {index + 1}</span><h3 className="text-sm font-semibold uppercase tracking-[.12em] text-[hsl(var(--accent))]">{step.title}</h3></div><p className="text-[15px] leading-[1.7] text-[hsl(var(--foreground))]">{step.text}</p></motion.article></div> })}</div><Reveal delay={.25}><p className="mt-8 text-center text-sm leading-[1.65] text-[hsl(var(--muted-foreground))]">Freya Poly Fab focuses on identifying textile market opportunities, serving diverse fabric buyers, and building a strong position through quality materials, reliable supply, and customer-focused textile solutions.</p></Reveal></div></section>;
}

function MarketSize() {
  const chartData = [
    { name: 'Indian Market 2025', value: 248.7, fill: '#0f3d5c' },
    { name: 'Indian Market 2034', value: 656.3, fill: '#1a5f8b' },
    { name: 'Global Market 2025', value: 1160, fill: '#b79a68' },
    { name: 'Global Market 2033', value: 1610, fill: '#d4b883' },
  ];
  
  const reduce = useReducedMotion();
  const chartRef = useRef<HTMLDivElement>(null);
  const isChartInView = useInView(chartRef, { once: true, amount: 0.3 });
  
  return <section id="market-size" className="section-pad bg-[hsl(var(--background))]"><div className="mx-auto max-w-[1180px]"><Reveal><div className="eyebrow mb-4">Market Size</div><h2 className="display max-w-[680px] text-[clamp(2rem,4.5vw,3.8rem)] font-semibold leading-[1.05] text-[hsl(var(--primary))]">Growing Textile<br /><span className="text-[hsl(var(--accent))]">Market Opportunity</span></h2></Reveal><div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1fr]"><Reveal delay={.1}><div ref={chartRef} className="h-[340px] w-full overflow-hidden rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-sm"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData} margin={{ top: 15, right: 15, left: 5, bottom: 55 }}><CartesianGrid strokeDasharray="3 3" stroke="rgba(74,70,64,.12)" /><XAxis dataKey="name" angle={-12} textAnchor="end" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} /><YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} label={{ value: 'USD Billion', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} /><RechartsTooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '6px', fontSize: '13px' }} formatter={(value) => [`$${value}B`, '']} /><Bar dataKey="value" radius={[5, 5, 0, 0]} animationBegin={0} animationDuration={isChartInView && !reduce ? 1000 : 0} /></BarChart></ResponsiveContainer></div></Reveal><Reveal delay={.15}><div className="space-y-4"><motion.div initial={reduce ? undefined : { opacity: 0, x: 20 }} whileInView={reduce ? undefined : { opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} className="group relative overflow-hidden rounded-lg border border-[#0f3d5c]/20 bg-gradient-to-br from-[#0f3d5c] to-[#1a5f8b] p-5 text-white shadow-sm transition-shadow duration-300 hover:shadow-md"><div className="relative z-10"><h3 className="mb-3 text-xs font-bold uppercase tracking-[.14em] opacity-95">Indian Textile & Apparel Industry</h3><div className="mb-3 flex items-center gap-3"><div className="flex flex-col"><span className="text-sm font-medium opacity-90">2025</span><span className="text-2xl font-bold"><AnimatedNumber value={248.7} />B</span></div><ArrowRight size={18} className="opacity-75" /><div className="flex flex-col"><span className="text-sm font-medium opacity-90">2034</span><span className="text-2xl font-bold"><AnimatedNumber value={656.3} />B</span></div></div><p className="text-sm leading-[1.6] opacity-90">India's textile and apparel industry is valued at approximately USD 248.7 Billion (2025) and is projected to reach USD 656.3 Billion by 2034.</p></div><div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white opacity-[0.08]" /></motion.div><motion.div initial={reduce ? undefined : { opacity: 0, x: 20 }} whileInView={reduce ? undefined : { opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }} className="group relative overflow-hidden rounded-lg border border-[#b79a68]/20 bg-gradient-to-br from-[#b79a68] to-[#d4b883] p-5 text-white shadow-sm transition-shadow duration-300 hover:shadow-md"><div className="relative z-10"><h3 className="mb-3 text-xs font-bold uppercase tracking-[.14em] opacity-95">Global Textile & Apparel Industry</h3><div className="mb-3 flex items-center gap-3"><div className="flex flex-col"><span className="text-sm font-medium opacity-90">2025</span><span className="text-2xl font-bold"><AnimatedNumber value={1160} />B</span></div><ArrowRight size={18} className="opacity-75" /><div className="flex flex-col"><span className="text-sm font-medium opacity-90">2033</span><span className="text-2xl font-bold"><AnimatedNumber value={1610} />B</span></div></div><p className="text-sm leading-[1.6] opacity-90">The global textile market size was valued at approximately USD 1.16 trillion in 2025 and is projected to reach around USD 1.61 trillion by 2033.</p></div><div className="absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-white opacity-[0.08]" /></motion.div></div></Reveal></div><div className="mt-6 grid gap-4 sm:grid-cols-[2fr_1fr]"><div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--secondary)/.5)] p-4"><h3 className="mb-2 text-xs font-semibold uppercase tracking-[.12em] text-[hsl(var(--accent))]">Market Trend</h3><p className="text-sm leading-[1.6] text-[hsl(var(--foreground))]">The textile industry is growing with rising apparel demand, e-commerce expansion, sustainable fabric adoption, and evolving fashion trends.</p></div><div className="flex items-center justify-center rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-3"><p className="text-center text-xs text-[hsl(var(--muted-foreground))]">Source: imarcgroup, grandviewresearch</p></div></div><Reveal delay={.2}><p className="mt-6 text-center text-sm leading-[1.65] text-[hsl(var(--muted-foreground))]">The growing textile market creates strong opportunities for reliable fabric suppliers like Freya Poly Fab.</p></Reveal></div></section>;
}

function RevenueStreams() {
  const reduce = useReducedMotion();
  const centerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(centerRef, { once: true, amount: 0.3 });
  
  return <section id="revenue" className="section-pad bg-[hsl(var(--card))]"><div className="mx-auto max-w-[1180px]"><Reveal><div className="eyebrow mb-4">Our Revenue Streams</div><h2 className="display max-w-[630px] text-[clamp(2rem,4.5vw,3.8rem)] font-semibold leading-[1.05] text-[hsl(var(--primary))]">Diversified Revenue<br /><span className="text-[hsl(var(--accent))]">Model</span></h2></Reveal><div className="mt-14 hidden lg:block"><div className="relative flex items-center justify-center gap-8"><motion.article initial={reduce ? undefined : { opacity: 0, x: -40 }} whileInView={reduce ? undefined : { opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="group flex w-80 flex-col rounded-xl border-2 border-[hsl(var(--border))] bg-[hsl(var(--background))] p-7 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-[#0f3d5c] hover:shadow-xl"><div className="mb-4 flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0f3d5c]/10 text-base font-bold text-[#0f3d5c]">1</div><Package size={24} className="text-[#0f3d5c]" /></div><h3 className="mb-3 text-lg font-semibold text-[hsl(var(--foreground))]">{revenueStreams[0].title}</h3><p className="text-sm leading-[1.7] text-[hsl(var(--muted-foreground))]">{revenueStreams[0].text}</p></motion.article><div className="flex shrink-0 items-center gap-3"><ArrowRight size={20} className="text-[hsl(var(--accent)/.5)]" /><motion.div ref={centerRef} animate={isInView && !reduce ? { scale: [1, 1.08, 1] } : {}} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} className="relative flex h-40 w-40 items-center justify-center rounded-full border-[5px] border-[hsl(var(--accent))] bg-gradient-to-br from-[hsl(var(--accent)/.15)] via-[hsl(var(--secondary))] to-[hsl(var(--accent)/.08)] shadow-lg"><div className="text-center"><div className="mb-1 text-xs font-bold uppercase tracking-[.15em] text-[hsl(var(--accent))]">Revenue</div><div className="text-base font-bold text-[hsl(var(--primary))]">Model</div></div><motion.div animate={isInView && !reduce ? { scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] } : {}} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} className="absolute inset-0 rounded-full border-2 border-[hsl(var(--accent)/.4)]" /></motion.div><ArrowRight size={20} className="text-[hsl(var(--accent)/.5)]" /></div><motion.article initial={reduce ? undefined : { opacity: 0, x: 40 }} whileInView={reduce ? undefined : { opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="group flex w-80 flex-col rounded-xl border-2 border-[hsl(var(--border))] bg-[hsl(var(--background))] p-7 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-[#4a7ba7] hover:shadow-xl"><div className="mb-4 flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#4a7ba7]/10 text-base font-bold text-[#4a7ba7]">2</div><Package size={24} className="text-[#4a7ba7]" /></div><h3 className="mb-3 text-lg font-semibold text-[hsl(var(--foreground))]">{revenueStreams[1].title}</h3><p className="text-sm leading-[1.7] text-[hsl(var(--muted-foreground))]">{revenueStreams[1].text}</p></motion.article></div><div className="mt-6 flex justify-center"><motion.div initial={reduce ? undefined : { opacity: 0, scale: 0 }} whileInView={reduce ? undefined : { opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.4 }} className="flex items-center gap-2"><div className="h-px w-16 bg-[hsl(var(--accent)/.3)]" /><ArrowDownRight size={28} className="text-[hsl(var(--accent)/.6)]" /><div className="h-px w-16 bg-[hsl(var(--accent)/.3)]" /></motion.div></div><motion.article initial={reduce ? undefined : { opacity: 0, y: 30 }} whileInView={reduce ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.5 }} className="group mx-auto mt-6 flex max-w-3xl flex-col rounded-xl border-2 border-[hsl(var(--border))] bg-[hsl(var(--background))] p-7 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-[#b79a68] hover:shadow-xl"><div className="mb-4 flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#b79a68]/10 text-base font-bold text-[#b79a68]">3</div><Package size={24} className="text-[#b79a68]" /></div><h3 className="mb-3 text-lg font-semibold text-[hsl(var(--foreground))]">{revenueStreams[2].title}</h3><p className="text-sm leading-[1.7] text-[hsl(var(--muted-foreground))]">{revenueStreams[2].text}</p></motion.article></div><div className="mt-10 grid items-stretch gap-6 sm:grid-cols-3 lg:hidden">{revenueStreams.map((stream, index) => { const colors = ['#0f3d5c', '#4a7ba7', '#b79a68']; return <Reveal key={stream.title} delay={index * .08} className="flex"><article className="flex flex-1 flex-col rounded-xl border-2 border-[hsl(var(--border))] bg-[hsl(var(--background))] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-7" style={{ '--hover-color': colors[index] } as any}><div className="mb-3 flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-full text-base font-bold" style={{ backgroundColor: `${colors[index]}15`, color: colors[index] }}>{index + 1}</div><Package size={24} style={{ color: colors[index] }} /></div><h3 className="mb-3 text-base font-semibold text-[hsl(var(--foreground))]">{stream.title}</h3><p className="text-sm leading-[1.65] text-[hsl(var(--muted-foreground))]">{stream.text}</p></article></Reveal> })}</div></div></section>;
}

function CompetitiveLandscape() {
  const reduce = useReducedMotion();
  return <section id="competitive" className="section-pad bg-[hsl(var(--background))]"><div className="mx-auto max-w-[1180px]"><Reveal><div className="eyebrow mb-4">Competitive Landscape & Our Unique Advantage</div><h2 className="display max-w-[680px] text-[clamp(2rem,4.5vw,3.8rem)] font-semibold leading-[1.05] text-[hsl(var(--primary))]">Standing Out in<br /><span className="text-[hsl(var(--accent))]">the Market</span></h2></Reveal><div className="mt-10 grid items-stretch gap-6 lg:grid-cols-2"><motion.div initial={reduce ? undefined : { opacity: 0, x: -30 }} whileInView={reduce ? undefined : { opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, delay: 0.1 }} className="flex flex-col gap-5"><article className="flex-1 rounded-lg border border-[hsl(var(--border)/.6)] bg-gradient-to-br from-[hsl(var(--muted)/.3)] to-[hsl(var(--muted)/.1)] p-6 opacity-85 sm:p-8"><div className="mb-4 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(var(--muted-foreground)/.15)]"><ShieldCheck size={20} className="text-[hsl(var(--muted-foreground)/.6)]" /></div><h3 className="text-base font-semibold uppercase tracking-[.1em] text-[hsl(var(--muted-foreground))]">Existing Solutions</h3></div><p className="text-sm leading-[1.65] text-[hsl(var(--foreground)/.75)]">Surat's textile market offers multiple fabric traders, wholesalers, and manufacturers providing diverse textile materials, bulk supply, and competitive pricing to garment businesses through established local sourcing networks.</p></article><article className="flex-1 rounded-lg border-2 border-[hsl(var(--destructive)/.4)] bg-[hsl(var(--card))] p-6 sm:p-8"><div className="mb-4 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(var(--destructive)/.1)]"><X size={20} className="text-[hsl(var(--destructive))]" /></div><h3 className="text-base font-semibold uppercase tracking-[.1em] text-[hsl(var(--destructive))]">Issues with Existing Solutions</h3></div><p className="text-sm leading-[1.65] text-[hsl(var(--foreground))]">Existing suppliers often face challenges like inconsistent quality, limited customization, delayed deliveries, fragmented supply chains, and difficulty in maintaining reliable long-term partnerships with apparel businesses.</p></article></motion.div><motion.div initial={reduce ? undefined : { opacity: 0, x: 30 }} whileInView={reduce ? undefined : { opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, delay: 0.25 }} className="relative overflow-hidden rounded-xl border-2 border-[hsl(var(--accent)/.6)] bg-gradient-to-br from-[hsl(var(--accent)/.08)] to-[hsl(var(--secondary))] p-6 shadow-lg sm:p-8"><div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-[hsl(var(--accent)/.1)]" /><div className="relative"><div className="mb-5 flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--accent))]"><Sparkles size={24} className="text-[hsl(var(--accent-foreground))]" /></div><h3 className="text-lg font-semibold uppercase tracking-[.1em] text-[hsl(var(--accent))]">Our Edge</h3></div><div className="space-y-5">{[
    { title: 'Quality Assurance:', text: 'Providing reliable and premium fabric solutions with a focus on consistent quality and customer requirements.' },
    { title: 'Efficient Supply Network:', text: 'Building strong supplier relationships to ensure timely availability, smooth sourcing, and dependable delivery.' },
    { title: 'Customer-Centric Approach:', text: 'Offering flexible textile solutions and personalized service to create long-term partnerships with garment businesses.' }
  ].map((item, index) => <motion.div key={item.title} initial={reduce ? undefined : { opacity: 0, y: 10 }} whileInView={reduce ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }} className="group flex gap-3"><div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--accent)/.2)] transition-colors duration-300 group-hover:bg-[hsl(var(--accent))]"><Check size={14} className="text-[hsl(var(--accent))] transition-colors duration-300 group-hover:text-[hsl(var(--accent-foreground))]" /></div><div><h4 className="mb-1 font-semibold text-[hsl(var(--foreground))]">{item.title}</h4><p className="text-sm leading-[1.65] text-[hsl(var(--muted-foreground))]">{item.text}</p></div></motion.div>)}</div></div></motion.div></div></div></section>;
}

function G2MStrategy() {
  const reduce = useReducedMotion();
  const icons = [Users, Network, TrendingUp, Target, Store];
  
  return <section id="g2m" className="section-pad bg-[hsl(var(--card))]"><div className="mx-auto max-w-[1180px]"><Reveal><div className="eyebrow mb-4">Go-To-Market (G2M) Strategy</div><h2 className="display max-w-[680px] text-[clamp(2rem,4.5vw,3.8rem)] font-semibold leading-[1.05] text-[hsl(var(--primary))]">Strategic Market<br /><span className="text-[hsl(var(--accent))]">Expansion</span></h2></Reveal><div className="mt-10 flex gap-3 overflow-x-auto py-2 scrollbar-thin">{g2mStrategies.map((strategy, index) => { const Icon = icons[index]; return <motion.div key={strategy} initial={reduce ? undefined : { opacity: 0, x: -20 }} whileInView={reduce ? undefined : { opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }} className="group relative flex min-w-[200px] flex-col items-center gap-3 rounded-full border-2 border-[hsl(var(--border))] bg-gradient-to-br from-[hsl(var(--background))] to-[hsl(var(--secondary)/.3)] px-6 py-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[hsl(var(--accent)/.6)] hover:shadow-md sm:min-w-[220px]"><Icon size={24} className="text-[hsl(var(--accent))] transition-transform duration-300 group-hover:scale-110" /><span className="text-center text-sm font-semibold uppercase tracking-[.08em] text-[hsl(var(--foreground))]">{strategy}</span><div className="absolute inset-x-0 bottom-0 h-1 rounded-full bg-gradient-to-r from-transparent via-[hsl(var(--accent)/.3)] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" /></motion.div> })}</div><Reveal delay={.35}><p className="mt-8 text-center text-sm leading-[1.65] text-[hsl(var(--muted-foreground))]">Freya Poly Fab aims to accelerate growth through strong customer relationships, reliable sourcing, digital reach, and strategic market expansion.</p></Reveal></div></section>;
}

function GrowthStrategy() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  return <section id="growth" className="section-pad bg-[hsl(var(--background))]"><div className="mx-auto max-w-[1180px]"><Reveal><div className="eyebrow mb-4">Our Growth & Expansion Strategy</div><h2 className="display max-w-[750px] text-[clamp(2rem,4.5vw,3.8rem)] font-semibold leading-[1.05] text-[hsl(var(--primary))]">From Trading to<br /><span className="text-[hsl(var(--accent))]">Manufacturing Excellence</span></h2><p className="mt-5 max-w-[680px] text-[15px] leading-[1.7] text-[hsl(var(--muted-foreground))]"><strong>Goal:</strong> To transform Freya Poly Fab into a leading textile manufacturing and supply company by establishing a manufacturing unit, expanding production capabilities, and building a strong presence in the apparel industry.</p></Reveal><div ref={ref} className="relative mt-16"><div className="absolute left-0 right-0 top-12 hidden h-1 lg:block"><motion.div initial={{ scaleX: 0 }} animate={isInView && !reduce ? { scaleX: 1 } : {}} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} className="h-full w-full origin-left bg-gradient-to-r from-[hsl(var(--accent)/.4)] via-[hsl(var(--accent))] to-[hsl(var(--accent)/.4)]" /></div><div className="grid items-stretch gap-8 lg:grid-cols-2 lg:gap-16">{[
    { title: 'Short-Term Perspective', items: [
      'Establish a textile manufacturing unit with required machinery and infrastructure.',
      'Develop in-house production capabilities to ensure better quality control and efficient supply.',
      'Expand customer base across garment manufacturers, wholesalers, and apparel businesses.'
    ], delay: 0.4 },
    { title: 'Long-Term Perspective', items: [
      'Increase manufacturing capacity and expand into diverse textile product categories.',
      'Build a strong regional and national distribution network for wider market reach.',
      'Position Freya Poly Fab as a recognized textile manufacturing brand in the apparel supply chain.'
    ], delay: 0.6 }
  ].map((phase, phaseIndex) => <div key={phase.title} className="relative flex"><motion.div initial={{ scale: 0 }} animate={isInView && !reduce ? { scale: 1 } : {}} transition={{ duration: 0.5, delay: phase.delay, type: "spring", stiffness: 200 }} className="absolute left-1/2 top-0 z-10 hidden h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border-4 border-[hsl(var(--accent))] bg-[hsl(var(--background))] lg:flex"><motion.div animate={isInView && !reduce ? { scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] } : {}} transition={{ duration: 2, repeat: Infinity, delay: phase.delay + 0.5 }} className="absolute inset-0 rounded-full bg-[hsl(var(--accent))]" /></motion.div><motion.article initial={reduce ? undefined : { opacity: 0, y: 30 }} whileInView={reduce ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6, delay: phase.delay, ease: [0.22, 1, 0.36, 1] }} className="flex flex-1 flex-col overflow-hidden rounded-xl border-2 border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-md transition-all duration-300 hover:border-[hsl(var(--accent)/.6)] hover:shadow-lg lg:mt-16"><div className="border-b border-[hsl(var(--border))] bg-gradient-to-r from-[hsl(var(--accent)/.1)] to-transparent p-6 sm:p-8"><h3 className="flex items-center gap-3 text-base font-semibold uppercase tracking-[.12em] text-[hsl(var(--accent))] sm:text-lg"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--accent))] text-sm font-bold text-[hsl(var(--accent-foreground))]">{phaseIndex + 1}</span>{phase.title}</h3></div><div className="flex-1 p-6 sm:p-8"><ul className="space-y-4">{phase.items.map((item, itemIndex) => <motion.li key={itemIndex} initial={reduce ? undefined : { opacity: 0, x: -10 }} whileInView={reduce ? undefined : { opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: phase.delay + 0.2 + itemIndex * 0.1 }} className="flex gap-3"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[hsl(var(--accent))]" /><span className="text-sm leading-[1.65] text-[hsl(var(--foreground))]">{item}</span></motion.li>)}</ul></div></motion.article></div>)}</div></div></div></section>;
}

function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    
    let startTime: number;
    const duration = 1500;
    const startValue = 0;
    const endValue = value;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(Math.floor(startValue + (endValue - startValue) * easeOutQuart));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, value]);

  return <span ref={ref}>{displayValue}</span>;
}

function FundUtilization() {
  const data = [
    { name: 'Manufacturing Unit Setup', value: 40, color: '#0f3d5c' },
    { name: 'Raw Material & Inventory', value: 30, color: '#4a7ba7' },
    { name: 'Marketing & Market Expansion', value: 15, color: '#b79a68' },
    { name: 'Working Capital & Operations', value: 15, color: '#d4b883' },
  ];

  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={14} fontWeight={700}>
        {`${value}%`}
      </text>
    );
  };

  const reduce = useReducedMotion();
  const chartRef = useRef<HTMLDivElement>(null);
  const isChartInView = useInView(chartRef, { once: true, amount: 0.3 });

  return (
    <section id="fund-utilization" className="section-pad bg-[hsl(var(--card))]">
      <div className="mx-auto max-w-[1180px]">
        <Reveal>
          <div className="eyebrow mb-4">Fund Utilization</div>
          <h2 className="display max-w-[680px] text-[clamp(2rem,4.5vw,3.8rem)] font-semibold leading-[1.05] text-[hsl(var(--primary))]">
            Strategic Investment<br /><span className="text-[hsl(var(--accent))]">Allocation</span>
          </h2>
        </Reveal>

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-2">
          {/* Chart + Legend */}
          <Reveal delay={0.1}>
            <div ref={chartRef} className="rounded-xl border-2 border-[hsl(var(--border))] bg-[hsl(var(--background))] p-5 shadow-md">
              {/* Donut chart */}
              <div className="h-[280px] w-full sm:h-[340px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderLabel}
                      outerRadius="70%"
                      innerRadius="42%"
                      dataKey="value"
                      paddingAngle={2}
                      animationBegin={0}
                      animationDuration={isChartInView && !reduce ? 1000 : 0}
                    >
                      {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <RechartsTooltip
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '6px', fontSize: '13px' }}
                      formatter={(value, name) => [`${value}%`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Legend */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                {data.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <span className="h-3 w-3 shrink-0 rounded-sm" style={{ backgroundColor: item.color }} />
                    <span className="text-xs leading-[1.4] text-[hsl(var(--foreground)/.8)]">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Our Ask */}
          <motion.div
            initial={reduce ? undefined : { opacity: 0, x: 30 }}
            whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="overflow-hidden rounded-xl border-l-4 border-[hsl(var(--accent))] bg-gradient-to-br from-[hsl(var(--accent)/.08)] to-[hsl(var(--background))] p-6 shadow-lg sm:p-8"
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--accent))]">
                <TrendingUp size={24} className="text-[hsl(var(--accent-foreground))]" />
              </div>
              <h3 className="text-base font-semibold uppercase tracking-[.12em] text-[hsl(var(--accent))] sm:text-lg">Our Ask</h3>
            </div>
            <p className="mb-7 text-sm leading-[1.7] text-[hsl(var(--foreground))] sm:text-base">
              Strategic fund allocation will enable Freya Poly Fab to establish manufacturing capabilities, strengthen production, and drive sustainable market expansion.
            </p>
            <div className="space-y-4">
              {data.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={reduce ? undefined : { opacity: 0, x: 10 }}
                  whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="group flex items-center justify-between rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card)/.5)] p-4 transition-all duration-300 hover:border-[hsl(var(--accent)/.5)] hover:bg-[hsl(var(--card))]"
                >
                  <div className="flex items-center gap-3">
                    <motion.span whileHover={{ scale: 1.2, rotate: 5 }} className="h-4 w-4 shrink-0 rounded" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-[hsl(var(--foreground))]">{item.name}</span>
                  </div>
                  <span className="text-xl font-bold text-[hsl(var(--accent))]"><AnimatedNumber value={item.value} />%</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Leadership() {
  const reduce = useReducedMotion();
  return <section id="leadership" className="section-pad bg-[hsl(var(--background))]"><div className="mx-auto max-w-[1180px]"><Reveal><div className="eyebrow mb-4">Leadership & Expertise</div><h2 className="display max-w-[680px] text-[clamp(2rem,4.5vw,3.8rem)] font-semibold leading-[1.05] text-[hsl(var(--primary))]">Driven by Industry<br /><span className="text-[hsl(var(--accent))]">Experience</span></h2></Reveal><div className="mt-10 grid items-center gap-10 lg:grid-cols-[.65fr_1.35fr] lg:gap-12"><motion.div initial={reduce ? undefined : { opacity: 0, scale: 0.9 }} whileInView={reduce ? undefined : { opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }} className="flex justify-center"><div className="relative"><motion.div whileHover={reduce ? undefined : { scale: 1.02 }} className="relative flex h-60 w-60 items-center justify-center overflow-hidden rounded-full border-4 border-[hsl(var(--accent))] bg-gradient-to-br from-[hsl(var(--accent)/.15)] via-[hsl(var(--secondary))] to-[hsl(var(--accent)/.1)] shadow-2xl sm:h-72 sm:w-72"><Users size={100} strokeWidth={1} className="text-[hsl(var(--accent)/.5)] transition-all duration-500 sm:size-[120px]" /></motion.div><div className="absolute -right-3 -top-3 flex h-16 w-16 items-center justify-center rounded-full border-4 border-[hsl(var(--background))] bg-[hsl(var(--accent))] shadow-lg"><Sparkles size={28} className="text-[hsl(var(--accent-foreground))]" /></div></div></motion.div><motion.div initial={reduce ? undefined : { opacity: 0, x: 30 }} whileInView={reduce ? undefined : { opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }} className="relative overflow-hidden rounded-xl border-2 border-[hsl(var(--border))] bg-gradient-to-br from-[hsl(var(--card))] to-[hsl(var(--secondary)/.3)] p-6 shadow-lg sm:p-8"><div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[hsl(var(--accent)/.05)]" /><div className="relative"><h3 className="mb-1 text-xl font-semibold text-[hsl(var(--primary))] sm:text-2xl">Devyani Ramnik Timbadiya</h3><p className="mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-[.16em] text-[hsl(var(--accent))]"><span className="h-1 w-8 bg-[hsl(var(--accent))]" />Proprietor</p><div className="space-y-3.5 text-[15px] leading-[1.7] text-[hsl(var(--foreground))]"><p>Devyani Ramnik Timbadiya, Founder of Freya Poly Fab, holds a Bachelor of Commerce (B.Com) qualification and brings 10–15 years of industry experience in the textile and garment sector.</p><p>With strong understanding of fabric trading, market requirements, customer relationships, and business operations, she has developed expertise in managing textile supply processes.</p><p>Her vision and industry knowledge drive Freya Poly Fab's growth towards becoming a trusted textile manufacturing and supply partner.</p></div></div></motion.div></div></div></section>;
}

function Home() {
  useEffect(() => {
    document.title = 'Freya Poly Fab — Weaving Quality Fabrics, Building Fashion Futures.';
    const description = 'Freya Poly Fab is a growing textile trading company specializing in quality fabrics and textile materials with reliable sourcing, timely delivery, and customer-focused solutions for the apparel industry.';
    const setMeta = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let tag = document.head.querySelector(selector) as HTMLMetaElement | null;
      if (!tag) { tag = document.createElement('meta'); tag.setAttribute(property ? 'property' : 'name', name); document.head.appendChild(tag); }
      tag.content = content;
    };
    setMeta('description', description);
    setMeta('og:title', 'Freya Poly Fab — Weaving Quality Fabrics, Building Fashion Futures.', true);
    setMeta('og:description', description, true);
    setMeta('og:type', 'website', true);
    let icon = document.head.querySelector('link[rel="icon"]') as HTMLLinkElement | null;
    if (!icon) { icon = document.createElement('link'); icon.rel = 'icon'; document.head.appendChild(icon); }
    icon.href = logoPath;

    // Handle hash navigation on page load
    const hash = window.location.hash.slice(1); // Remove the '#'
    if (hash) {
      // Wait for page to render, then scroll to section
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, []);
  return <div className="site-shell"><Header /><main><Hero /><About /><Mission /><Challenges /><Solutions /><Offerings /><USP /><MarketAlignment /><MarketSize /><RevenueStreams /><CompetitiveLandscape /><G2MStrategy /><GrowthStrategy /><FundUtilization /><Leadership /></main><Footer /><button type="button" onClick={() => goTo('home')} className="fixed bottom-5 right-5 z-30 flex h-10 w-10 items-center justify-center border border-[hsl(var(--border))] bg-[hsl(var(--card)/.9)] text-[hsl(var(--primary))] shadow-[var(--shadow-sm)] backdrop-blur transition hover:-translate-y-1" aria-label="Back to top" data-testid="button-back-top"><CircleArrowUp size={17} /></button></div>;
}

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
            <Route component={() => (
              <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
                  <a href="/" className="mt-4 inline-block text-[hsl(var(--accent))]">Go Home</a>
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
