import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  ArrowDownRight, ArrowRight, Check, ChevronDown, ChevronRight, CircleArrowUp,
  Clock3, Compass, Layers3, Mail, MapPin, Menu, Network, Phone,
  ShieldCheck, Sparkles, Target, X,
} from 'lucide-react';
import logoPath from '/logo.png';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

const queryClient = new QueryClient();

const navItems = [
  { label: 'Home', id: 'home' },
  { label: 'About', id: 'about' },
  { label: 'Solutions', id: 'solutions' },
  { label: 'Fabric Supply', id: 'fabric-supply' },
  { label: 'Why Us', id: 'why-us' },
  { label: 'Contact', id: 'contact' },
];

const values = [
  { title: 'Quality fabrics', text: 'Quality textile materials for apparel and garment businesses.', icon: Layers3 },
  { title: 'Reliable supply', text: 'Reliable textile sourcing and supply.', icon: ShieldCheck },
  { title: 'Customer focus', text: 'Solutions based around customer requirements.', icon: Target },
  { title: 'Timely service', text: 'Focus on dependable and timely supply.', icon: Clock3 },
];

const solutions = [
  { number: '01', title: 'Premium Fabric Supply', text: 'Providing quality textile materials for garment and apparel businesses.', icon: Layers3 },
  { number: '02', title: 'Diverse Textile Range', text: 'Offering polyester and fabric solutions according to market requirements.', icon: Sparkles },
  { number: '03', title: 'Reliable Trading Network', text: 'Supporting smooth sourcing and timely supply through supplier connections.', icon: Network },
  { number: '04', title: 'Customized Fabric Solutions', text: 'Providing flexible textile options based on customer requirements.', icon: Compass },
];

const focusAreas = [
  { title: 'Quality', text: 'Focus on quality textile materials and reliable sourcing.' },
  { title: 'Reliability', text: 'Supporting consistent availability and timely supply.' },
  { title: 'Customer requirements', text: 'Providing flexible textile options aligned with customer needs.' },
];

const whyUs = [
  { number: '01', title: 'Quality-driven approach', text: 'Focus on quality fabrics through reliable sourcing and selection.' },
  { number: '02', title: 'Strong supplier network', text: 'Building supply channels for consistent textile availability.' },
  { number: '03', title: 'Customer-focused solutions', text: 'Providing fabric options aligned with client requirements.' },
  { number: '04', title: 'Timely & reliable delivery', text: 'Maintaining dependable order management and service.' },
];

const audiences = ['Garment Manufacturers', 'Wholesalers', 'Retailers', 'Apparel Businesses', 'Textile Traders', 'Bulk Buyers', 'Fashion Businesses'];

const flow = [
  { title: 'Requirement', text: 'Customer shares fabric requirement.' },
  { title: 'Sourcing', text: 'Textile options are sourced through supplier connections.' },
  { title: 'Fabric solution', text: 'Suitable options are provided according to requirements.' },
  { title: 'Supply', text: 'Order is handled with focus on reliable and timely supply.' },
];

const businessTypes = ['Garment Manufacturer', 'Wholesaler', 'Retailer', 'Apparel Business', 'Textile Trader', 'Bulk Buyer', 'Other'];
const requirements = ['Fabric Requirement', 'Bulk Fabric Supply', 'Polyester Fabric', 'Customized Fabric Requirement', 'Business Enquiry', 'Partnership Enquiry', 'Other'];

type FormState = {
  fullName: string; company: string; email: string; phone: string; businessType: string; requirement: string; message: string;
};
type FormErrors = Partial<Record<keyof FormState, string>>;

const initialForm: FormState = { fullName: '', company: '', email: '', phone: '', businessType: '', requirement: '', message: '' };

function goTo(id: string, close?: () => void) {
  close?.();
  window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 30);
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

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <header className={`fixed inset-x-0 top-0 z-50 border-b border-[hsl(var(--foreground)/.08)] bg-[hsl(var(--card)/.68)] backdrop-blur-[16px] backdrop-saturate-150 transition-colors duration-500 ${scrolled ? 'bg-[hsl(var(--card)/.76)]' : ''}`} data-testid="header-site">
      <div className="relative mx-auto flex h-[72px] max-w-[1240px] items-center px-5 sm:px-8 xl:h-[76px] xl:px-10">
        <button type="button" onClick={() => goTo('home')} className="shrink-0 rounded-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))] max-xl:absolute max-xl:left-1/2 max-xl:-translate-x-1/2" aria-label="Freya Poly Fab home" data-testid="button-logo-home"><Logo compact /></button>
        <nav className="hidden items-center gap-7 xl:ml-10 xl:flex" aria-label="Primary navigation">
          {navItems.map((item) => <button key={item.id} type="button" onClick={() => goTo(item.id)} className="group relative py-3 text-[11px] font-semibold uppercase tracking-[.12em] text-[hsl(var(--foreground)/.8)] transition-colors hover:text-[hsl(var(--accent))]" data-testid={`nav-${item.id}`}><span>{item.label}</span><span className="absolute bottom-1 left-0 h-px w-0 bg-[hsl(var(--accent))] transition-all duration-300 group-hover:w-full" /></button>)}
        </nav>
        <button type="button" onClick={() => goTo('contact')} className="ml-auto hidden items-center gap-2 rounded-sm bg-[hsl(var(--accent))] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[.13em] text-[hsl(var(--accent-foreground))] transition hover:-translate-y-0.5 hover:bg-[hsl(var(--accent)/.9)] xl:flex" data-testid="button-header-work">Work With Us <ArrowRight size={14} /></button>
        <button type="button" onClick={() => setOpen((value) => !value)} className="order-first flex h-11 w-11 items-center justify-center rounded-sm text-[hsl(var(--foreground))] transition hover:bg-[hsl(var(--secondary)/.55)] xl:hidden" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} data-testid="button-mobile-menu">{open ? <X size={24} /> : <Menu size={24} />}</button>
      </div>
      <AnimatePresence>
        {open && <motion.nav initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="border-t border-[hsl(var(--foreground)/.08)] bg-[hsl(var(--card)/.74)] px-5 pb-5 backdrop-blur-[16px] backdrop-saturate-150 xl:hidden" aria-label="Mobile navigation">
          <div className="mx-auto max-w-[1240px] pt-2">
            {navItems.map((item, index) => <motion.button initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * .035 }} key={item.id} type="button" onClick={() => goTo(item.id, () => setOpen(false))} className="flex w-full items-center justify-between border-b border-[hsl(var(--border))] py-4 text-left text-sm font-semibold uppercase tracking-[.12em] text-[hsl(var(--foreground))]" data-testid={`mobile-nav-${item.id}`}>{item.label}<ChevronRight size={15} className="text-[hsl(var(--accent))]" /></motion.button>)}
            <button type="button" onClick={() => goTo('contact', () => setOpen(false))} className="mt-5 flex w-full items-center justify-center gap-2 bg-[hsl(var(--accent))] py-3.5 text-xs font-semibold uppercase tracking-[.16em] text-[hsl(var(--accent-foreground))]" data-testid="button-mobile-work">Work With Us <ArrowRight size={15} /></button>
          </div>
        </motion.nav>}
      </AnimatePresence>
    </header>
  );
}

function Hero() {
  const reduce = useReducedMotion();
  return (
    <section id="home" className="relative isolate overflow-hidden bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <div className="absolute inset-0 opacity-70" style={{ background: 'radial-gradient(circle at 80% 24%, rgba(229,212,184,.42), transparent 28%), linear-gradient(110deg, rgba(250,248,243,.98) 25%, rgba(245,241,232,.82) 100%)' }} />
      <div className="absolute right-[-10%] top-[13%] h-[78vw] w-[78vw] max-h-[760px] max-w-[760px] rounded-full border border-[hsl(var(--accent)/.22)]" />
      <div className="absolute right-[8%] top-[27%] h-[48vw] w-[48vw] max-h-[520px] max-w-[520px] rounded-full border border-dashed border-[hsl(var(--accent)/.15)]" />
      <Thread className="right-[-80px] top-[28%] w-[560px] rotate-[-9deg] opacity-90 sm:right-[1%] lg:top-[36%]" />
      <div className="relative z-10 mx-auto grid min-h-[680px] max-w-[1240px] items-center gap-12 px-5 pb-14 pt-28 sm:px-8 md:grid-cols-[1.02fr_.98fr] md:gap-8 md:pb-16 md:pt-28 lg:min-h-[min(790px,100svh)] lg:gap-20 lg:px-10 lg:pb-0 lg:pt-24">
        <motion.div initial={reduce ? undefined : { opacity: 0, y: 22 }} animate={reduce ? undefined : { opacity: 1, y: 0 }} transition={{ duration: .85, ease: [.22, 1, .36, 1] }} className="relative z-10 max-w-[720px]">
          <div className="mb-6 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[.24em] text-[hsl(var(--accent))]"><span className="h-px w-10 bg-[hsl(var(--accent))]" /> Textile supply, Surat</div>
          <h1 className="display max-w-[700px] text-[clamp(2.65rem,6.1vw,5.8rem)] font-semibold text-[hsl(var(--foreground))]">Weaving Quality Fabrics,<br /><span className="text-[hsl(var(--accent))]">Building Fashion Futures.</span></h1>
          <p className="mt-7 max-w-[530px] text-base leading-8 text-[hsl(var(--muted-foreground))] sm:text-lg">Quality fabrics and reliable textile solutions for apparel and garment businesses.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={() => goTo('solutions')} className="group inline-flex items-center justify-center gap-3 bg-[hsl(var(--accent))] px-5 py-3.5 text-xs font-semibold uppercase tracking-[.13em] text-[hsl(var(--accent-foreground))] transition hover:bg-[hsl(var(--accent)/.9)]" data-testid="button-hero-solutions">Explore Our Solutions <ArrowDownRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:translate-y-1" /></button>
            <button type="button" onClick={() => goTo('contact')} className="inline-flex items-center justify-center gap-3 border border-[hsl(var(--accent)/.7)] px-5 py-3.5 text-xs font-semibold uppercase tracking-[.13em] text-[hsl(var(--foreground))] transition hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))]" data-testid="button-hero-contact">Work With Us <ArrowRight size={16} /></button>
          </div>
        </motion.div>
        <motion.div initial={reduce ? undefined : { opacity: 0, scale: .95 }} animate={reduce ? undefined : { opacity: 1, scale: 1 }} transition={{ duration: 1.1, delay: .15 }} className="relative mx-auto w-full max-w-[530px] md:max-w-[430px] lg:mt-12 lg:max-w-[530px]">
          <div className="relative aspect-[.88] overflow-hidden border border-[hsl(var(--border))] bg-[hsl(var(--secondary))] shadow-2xl shadow-[rgba(74,70,64,.12)]">
            <img src="/fabric-rolls.jpg" alt="Abstract folded and rolled textile materials in muted neutral tones" className="h-full w-full object-cover opacity-95 brightness-110 saturate-[.65]" loading="eager" />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(250,248,243,.76)] via-transparent to-[rgba(229,212,184,.18)]" />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between border-t border-[hsl(var(--foreground)/.18)] pt-4 text-[10px] uppercase tracking-[.17em] text-[hsl(var(--foreground)/.76)]"><span>Material / texture / supply</span><span className="text-[hsl(var(--accent))]">01—04</span></div>
          </div>
          <div className="absolute -bottom-5 -left-5 hidden h-28 w-28 border-b border-l border-[hsl(var(--accent)/.7)] sm:block" />
          <div className="absolute -right-4 -top-4 h-24 w-24 border-r border-t border-[hsl(var(--accent)/.65)] sm:-right-6 sm:-top-6" />
        </motion.div>
      </div>
    </section>
  );
}

function Values() {
  return <section id="values" className="border-b border-[hsl(var(--border))] bg-[hsl(var(--card))]"><div className="mx-auto grid max-w-[1240px] grid-cols-2 items-stretch">{values.map((value, index) => { const Icon = value.icon; return <Reveal key={value.title} delay={index * .07} className="flex h-[232px] min-h-0 flex-col border-b border-[hsl(var(--border))] p-5 nth-[odd]:border-r last:border-b-0 sm:h-auto sm:min-h-[196px] sm:p-7 lg:border-b-0 lg:border-r lg:p-9 lg:last:border-r-0"><div className="mb-6 flex items-center justify-between sm:mb-8"><span className="font-mono text-[10px] tracking-[.16em] text-[hsl(var(--muted-foreground))]">0{index + 1}</span><Icon size={18} strokeWidth={1.35} className="text-[hsl(var(--accent))]" /></div><h2 className="text-sm font-semibold uppercase tracking-[.09em] text-[hsl(var(--foreground))]">{value.title}</h2><p className="mt-3 max-w-[230px] text-sm leading-6 text-[hsl(var(--muted-foreground))]">{value.text}</p></Reveal> })}</div></section>;
}

function About() {
  return <section id="about" className="section-pad bg-[hsl(var(--background))]"><div className="mx-auto grid max-w-[1180px] items-center gap-14 lg:grid-cols-[.96fr_1.04fr] lg:gap-24"><Reveal className="relative"><div className="fabric-panel aspect-[.9] max-w-[510px]"><img src="/fabric-weave.jpg" alt="Close-up of woven textile fibers in warm neutral tones" className="h-full w-full object-cover brightness-110 saturate-[.7]" loading="lazy" /><div className="absolute inset-0 bg-gradient-to-tr from-[rgba(183,154,104,.16)] to-transparent" /><div className="absolute bottom-0 left-0 bg-[hsl(var(--secondary))] px-6 py-5 text-[hsl(var(--foreground))]"><span className="block text-[10px] uppercase tracking-[.2em] text-[hsl(var(--accent))]">Our material point of view</span><span className="mt-1 block text-sm">Reliable by design</span></div></div><div className="absolute -bottom-7 right-4 h-20 w-20 border-b border-r border-[hsl(var(--accent))] sm:right-0" /></Reveal><Reveal delay={.12}><div className="eyebrow mb-5">About Freya Poly Fab</div><h2 className="display max-w-[580px] text-[clamp(2rem,4vw,4rem)] font-semibold text-[hsl(var(--primary))]">A Reliable Textile<br />Supply Partner</h2><div className="mt-7 max-w-[570px] space-y-5 text-[15px] leading-8 text-[hsl(var(--muted-foreground))]"><p>Freya Poly Fab is a growing textile trading company specializing in the supply of quality fabrics and textile materials to meet the evolving needs of the apparel industry.</p><p>With a strong focus on reliability, timely delivery, and customer satisfaction, the company aims to provide textile solutions that support garment and apparel businesses.</p></div><button type="button" onClick={() => goTo('mission')} className="group mt-9 inline-flex items-center gap-3 border-b border-[hsl(var(--accent))] pb-2 text-xs font-semibold uppercase tracking-[.16em] text-[hsl(var(--primary))]" data-testid="button-about-learn">Learn More <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></button></Reveal></div></section>;
}

function Mission() {
  const cards = [{ label: 'Our mission', text: 'To provide reliable textile solutions with superior quality, timely supply, and customer-focused service.', number: '01' }, { label: 'Our vision', text: 'To become a trusted textile partner by delivering quality fabrics and building sustainable growth in the apparel industry.', number: '02' }];
  return <section id="mission" className="section-pad textile-grid bg-[hsl(var(--card))]"><div className="mx-auto max-w-[1180px]"><Reveal><div className="eyebrow mb-4">A clear direction</div><h2 className="display max-w-[620px] text-[clamp(2rem,4vw,3.8rem)] font-semibold text-[hsl(var(--primary))]">Built around the<br />business relationship.</h2></Reveal><div className="mt-12 grid items-stretch gap-5 md:grid-cols-2">{cards.map((card, index) => <Reveal key={card.label} delay={index * .1} className="h-full"><article className="relative flex h-full flex-col overflow-hidden border border-[hsl(var(--border))] bg-[hsl(var(--background)/.65)] p-7 sm:p-10"><span className="absolute right-7 top-6 font-mono text-5xl font-light text-[hsl(var(--accent)/.4)]">{card.number}</span><div className="relative max-w-[460px]"><div className="eyebrow mb-7">{card.label}</div><p className="text-xl leading-9 text-[hsl(var(--foreground))] sm:text-2xl sm:leading-10">“{card.text}”</p></div></article></Reveal>)}</div></div></section>;
}

function Solutions() {
  return <section id="solutions" className="section-pad bg-[hsl(var(--background))]"><div className="mx-auto max-w-[1180px]"><Reveal><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><div className="eyebrow mb-5">What we do</div><h2 className="display max-w-[630px] text-[clamp(2.2rem,4.5vw,4.3rem)] font-semibold text-[hsl(var(--primary))]">Textile Solutions<br /><span className="text-[hsl(var(--accent))]">for Your Business</span></h2></div><p className="max-w-[250px] text-sm leading-6 text-[hsl(var(--muted-foreground))]">Focused supply support for the needs of apparel and garment businesses.</p></div></Reveal><div className="mt-10 grid items-stretch gap-px border border-[hsl(var(--border))] bg-[hsl(var(--border))] sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">{solutions.map((solution, index) => { const Icon = solution.icon; return <Reveal key={solution.number} delay={index * .06} className="h-full"><article className="group flex h-full min-h-[280px] flex-col justify-between bg-[hsl(var(--card))] p-4 transition-colors duration-300 hover:bg-[hsl(var(--secondary))] sm:min-h-[290px] sm:p-8"><div className="flex items-start justify-between"><span className="font-mono text-sm text-[hsl(var(--accent))]">{solution.number}</span><Icon size={19} strokeWidth={1.25} className="text-[hsl(var(--accent))]" /></div><div><h3 className="max-w-[200px] text-base font-semibold leading-6 text-[hsl(var(--foreground))] sm:text-lg sm:leading-7">{solution.title}</h3><p className="mt-3 text-sm leading-6 text-[hsl(var(--muted-foreground))]">{solution.text}</p><ArrowRight size={16} className="mt-5 text-[hsl(var(--accent))] transition-transform group-hover:translate-x-2 sm:mt-7" /></div></article></Reveal> })}</div></div></section>;
}

function FabricSupply() {
  const fabrics = [{ title: 'Woven texture', cls: 'fabric-panel', src: '/fabric-weave.jpg', alt: 'Woven textile texture detail' }, { title: 'Material in motion', cls: 'fabric-neutral', src: '/fabric-rolls.jpg', alt: 'Folded textile material in muted tones' }, { title: 'Thread detail', cls: 'fabric-cream', src: '/fabric-detail.jpg', alt: 'Interlaced thread detail' }, { title: 'Quiet tactility', cls: 'fabric-rose', src: '/fabric-rolls.jpg', alt: 'Textile surface with soft tonal variation' }];
  return <section id="fabric-supply" className="section-pad overflow-hidden bg-[hsl(var(--card))]"><div className="mx-auto max-w-[1180px]"><Reveal><div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between"><div><div className="eyebrow mb-5">Fabric supply</div><h2 className="display max-w-[660px] text-[clamp(2.2rem,5vw,4.8rem)] font-semibold text-[hsl(var(--primary))]">Quality Fabrics.<br /><span className="text-[hsl(var(--accent))]">Reliable Supply.</span></h2></div><p className="max-w-[285px] text-sm leading-7 text-[hsl(var(--muted-foreground))]">A visual look at the material world we work within. Imagery is representative only.</p></div></Reveal><div className="mt-10 grid grid-cols-2 gap-3 sm:mt-14 sm:gap-4 lg:flex lg:snap-x lg:snap-mandatory lg:overflow-x-auto lg:pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{fabrics.map((fabric, index) => <Reveal key={fabric.title} delay={index * .05} className="min-w-0 snap-start lg:min-w-0 lg:flex-1"><figure className={`group relative aspect-[.82] overflow-hidden ${fabric.cls}`}><img src={fabric.src} alt={fabric.alt} className="h-full w-full object-cover brightness-110 saturate-[.7] transition-transform duration-700 group-hover:scale-105" loading="lazy" /><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(250,248,243,.9)] to-transparent p-3 pt-10 sm:p-5 sm:pt-16"><figcaption className="text-[10px] font-semibold uppercase leading-4 tracking-[.12em] text-[hsl(var(--foreground))] sm:text-xs sm:tracking-[.15em]">{fabric.title}</figcaption><span className="mt-1 block text-[9px] uppercase tracking-[.08em] text-[hsl(var(--muted-foreground))] sm:text-[10px] sm:tracking-[.12em]">Visual representation only</span></div></figure></Reveal>)}</div></div></section>;
}

function Approach() {
  return <section id="approach" className="section-pad bg-[hsl(var(--background))]"><div className="mx-auto max-w-[1180px]"><Reveal><div className="eyebrow mb-5">Our approach</div><h2 className="display max-w-[620px] text-[clamp(2.2rem,4.5vw,4.3rem)] font-semibold text-[hsl(var(--primary))]">What We Focus On</h2></Reveal><div className="relative mt-16 grid gap-10 md:grid-cols-3 md:gap-8"><Thread className="left-[5%] top-[-44px] hidden w-[92%] md:block" />{focusAreas.map((area, index) => <Reveal key={area.title} delay={index * .1} className="relative"><div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-[hsl(var(--accent))] bg-[hsl(var(--background))] font-mono text-xs text-[hsl(var(--accent))]">0{index + 1}</div><h3 className="text-lg font-semibold capitalize text-[hsl(var(--primary))]">{area.title}</h3><p className="mt-3 max-w-[270px] text-sm leading-7 text-[hsl(var(--muted-foreground))]">{area.text}</p></Reveal>)}</div></div></section>;
}

function WhyUs() {
  return <section id="why-us" className="relative overflow-hidden bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))]"><div className="absolute inset-y-0 right-0 w-1/2 opacity-50" style={{ background: 'radial-gradient(circle at 65% 46%, rgba(229,212,184,.62), transparent 26%)' }} /><Thread className="right-[-100px] top-[28%] hidden w-[620px] opacity-50 lg:block" /><div className="section-pad relative mx-auto grid max-w-[1180px] gap-14 lg:grid-cols-[.72fr_1.28fr] lg:gap-24"><Reveal><div className="eyebrow mb-5">Why Freya Poly Fab</div><h2 className="display max-w-[530px] text-[clamp(2.3rem,5vw,4.8rem)] font-semibold text-[hsl(var(--foreground))]">Why Work With<br /><span className="text-[hsl(var(--accent))]">Freya Poly Fab?</span></h2><p className="mt-7 max-w-[380px] text-sm leading-7 text-[hsl(var(--muted-foreground))]">Quality, reliability and customer-focused service shape the way we support textile requirements.</p></Reveal><div className="border-t border-[hsl(var(--border))]">{whyUs.map((item, index) => <Reveal key={item.number} delay={index * .06}><article className="group grid gap-4 border-b border-[hsl(var(--border))] py-6 sm:grid-cols-[70px_1fr_1.3fr] sm:items-center"><span className="font-mono text-sm text-[hsl(var(--accent))]">{item.number}</span><h3 className="text-base font-semibold uppercase tracking-[.08em] text-[hsl(var(--foreground))]">{item.title}</h3><p className="text-sm leading-6 text-[hsl(var(--muted-foreground))] sm:text-right">{item.text}</p></article></Reveal>)}</div></div></section>;
}

function WhoServe() {
  return <section id="serve" className="section-pad textile-grid bg-[hsl(var(--card))]"><div className="mx-auto max-w-[1180px]"><Reveal><div className="eyebrow mb-5">Who we serve</div><h2 className="display max-w-[680px] text-[clamp(2.2rem,4.5vw,4.2rem)] font-semibold text-[hsl(var(--primary))]">Serving Textile &<br /><span className="text-[hsl(var(--accent))]">Apparel Businesses</span></h2></Reveal><div className="mt-14 grid grid-cols-1 border-l border-t border-[hsl(var(--border))] sm:grid-cols-2 lg:grid-cols-4">{audiences.map((audience, index) => <Reveal key={audience} delay={index * .04} className="border-b border-r border-[hsl(var(--border))]"><div className="group flex min-h-[116px] items-center justify-between bg-[hsl(var(--card)/.55)] px-6 transition-colors hover:bg-[hsl(var(--background))]"><span className="text-sm font-medium text-[hsl(var(--foreground))]">{audience}</span><ArrowUpRightIcon /></div></Reveal>)}</div></div></section>;
}

function ArrowUpRightIcon() { return <ArrowDownRight size={17} className="rotate-[-90deg] text-[hsl(var(--accent))] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />; }

function BusinessFlow() {
  return <section id="flow" className="section-pad bg-[hsl(var(--background))]"><div className="mx-auto max-w-[1180px]"><Reveal><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><div className="eyebrow mb-5">A simple business flow</div><h2 className="display max-w-[650px] text-[clamp(2.2rem,4.5vw,4.1rem)] font-semibold text-[hsl(var(--primary))]">From requirement<br />to reliable supply.</h2></div><p className="max-w-[260px] text-sm leading-7 text-[hsl(var(--muted-foreground))]">A straightforward path built around listening, sourcing and dependable service.</p></div></Reveal><div className="relative mt-16 grid gap-10 md:grid-cols-4 md:gap-5">{flow.map((item, index) => <Reveal key={item.title} delay={index * .08} className="relative"><article className="flex gap-5 md:block"><div className="flex shrink-0 flex-col items-center md:mb-7 md:block"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(var(--accent))] font-mono text-xs text-[hsl(var(--accent-foreground))]">{String(index + 1).padStart(2, '0')}</span>{index < flow.length - 1 && <span className="mt-2 h-full w-px bg-[hsl(var(--accent)/.4)] md:hidden" />}</div><div className="pb-3 md:border-t md:border-[hsl(var(--accent)/.5)] md:pt-5"><h3 className="text-base font-semibold uppercase tracking-[.1em] text-[hsl(var(--primary))]">{item.title}</h3><p className="mt-3 max-w-[220px] text-sm leading-7 text-[hsl(var(--muted-foreground))]">{item.text}</p></div>{index < flow.length - 1 && <ChevronRight className="absolute right-[-10px] top-[-5px] hidden text-[hsl(var(--accent))] md:block" size={18} />}</article></Reveal>)}</div></div></section>;
}

function CTA() {
  return <section className="relative overflow-hidden bg-[#EDE4D4]"><Thread className="right-[-90px] top-[34%] w-[550px] opacity-60" /><div className="section-pad relative mx-auto flex max-w-[1180px] flex-col items-start justify-between gap-10 md:flex-row md:items-end"><Reveal><div className="eyebrow mb-5">Work with us</div><h2 className="display max-w-[700px] text-[clamp(2.4rem,5vw,5rem)] font-semibold text-[hsl(var(--foreground))]">Looking for Quality<br /><span className="text-[hsl(var(--accent))]">Fabric Supply?</span></h2><p className="mt-6 max-w-[490px] text-base leading-8 text-[hsl(var(--muted-foreground))]">Tell us about your textile requirement and connect with Freya Poly Fab.</p></Reveal><Reveal delay={.12} className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row"><button type="button" onClick={() => goTo('contact')} className="inline-flex items-center justify-center gap-3 bg-[hsl(var(--accent))] px-6 py-4 text-xs font-semibold uppercase tracking-[.15em] text-[hsl(var(--accent-foreground))] transition hover:-translate-y-1" data-testid="button-cta-contact">Contact Us <ArrowRight size={16} /></button><button type="button" onClick={() => goTo('contact-form')} className="inline-flex items-center justify-center gap-3 border border-[hsl(var(--foreground)/.28)] px-6 py-4 text-xs font-semibold uppercase tracking-[.15em] text-[hsl(var(--foreground))] transition hover:-translate-y-1 hover:border-[hsl(var(--accent))]" data-testid="button-cta-work">Work With Us <ArrowRight size={16} /></button></Reveal></div></section>;
}

function Field({ label, id, value, onChange, error, type = 'text', required = false, placeholder = '' }: { label: string; id: keyof FormState; value: string; onChange: (value: string) => void; error?: string; type?: string; required?: boolean; placeholder?: string }) {
  return <div><label htmlFor={id} className="mb-2 block text-xs font-semibold uppercase tracking-[.12em] text-[hsl(var(--foreground))]">{label}{required && <span className="ml-1 text-[hsl(var(--accent))]" aria-hidden="true">*</span>}</label><input id={id} name={id} type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} className={`w-full border bg-[hsl(var(--card))] px-4 py-3.5 text-base text-[hsl(var(--foreground))] outline-none transition placeholder:text-[hsl(var(--muted-foreground)/.65)] focus:border-[hsl(var(--accent))] focus:ring-1 focus:ring-[hsl(var(--accent)/.32)] ${error ? 'border-[hsl(var(--destructive))]' : 'border-[hsl(var(--border))]'}`} data-testid={`input-${id}`} />{error && <p id={`${id}-error`} className="mt-1.5 text-xs text-[hsl(var(--destructive))]" role="alert">{error}</p>}</div>;
}

function ContactForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const update = (key: keyof FormState) => (value: string) => { setForm((old) => ({ ...old, [key]: value })); setErrors((old) => ({ ...old, [key]: undefined })); setStatus('idle'); };
  const validate = () => {
    const next: FormErrors = {};
    if (!form.fullName.trim()) next.fullName = 'Please enter your full name.';
    if (!form.company.trim()) next.company = 'Please enter your company name.';
    if (!form.email.trim()) next.email = 'Please enter your email address.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Please enter a valid email address.';
    if (!form.phone.trim()) next.phone = 'Please enter your phone number.';
    else if (!/^[+]?[\d\s().-]{7,}$/.test(form.phone)) next.phone = 'Please enter a valid phone number.';
    if (!form.businessType) next.businessType = 'Please select a business type.';
    if (!form.requirement) next.requirement = 'Please select a requirement.';
    if (!form.message.trim()) next.message = 'Please tell us about your requirement.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) { setStatus('error'); return; }
    setStatus('loading');
    window.setTimeout(() => setStatus('success'), 850);
  };
  if (status === 'success') return <div className="border border-[hsl(var(--accent)/.5)] bg-[hsl(var(--card))] p-8 sm:p-12" role="status" data-testid="status-enquiry-success"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]"><Check size={22} /></div><h3 className="mt-7 text-2xl font-semibold text-[hsl(var(--primary))]">Thank you for contacting Freya Poly Fab.</h3><p className="mt-4 max-w-[480px] text-sm leading-7 text-[hsl(var(--muted-foreground))]">We will get in touch with you regarding your enquiry.</p><p className="mt-7 border-t border-[hsl(var(--border))] pt-5 text-xs leading-6 text-[hsl(var(--muted-foreground))]">This is a UI confirmation only. No email has been sent because no backend or email service is connected.</p><button type="button" onClick={() => { setForm(initialForm); setStatus('idle'); }} className="mt-7 text-xs font-semibold uppercase tracking-[.15em] text-[hsl(var(--primary))] underline decoration-[hsl(var(--accent))] underline-offset-4" data-testid="button-new-enquiry">Send another enquiry</button></div>;
  return <form onSubmit={submit} noValidate className="border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 sm:p-8 lg:p-10" data-testid="form-enquiry"><div className="grid gap-5 md:grid-cols-2"><Field label="Full name" id="fullName" value={form.fullName} onChange={update('fullName')} error={errors.fullName} required placeholder="Your full name" /><Field label="Company name" id="company" value={form.company} onChange={update('company')} error={errors.company} required placeholder="Your company name" /><Field label="Email address" id="email" value={form.email} onChange={update('email')} error={errors.email} required type="email" placeholder="you@company.com" /><Field label="Phone number" id="phone" value={form.phone} onChange={update('phone')} error={errors.phone} required type="tel" placeholder="+91" /><SelectField label="Business type" id="businessType" value={form.businessType} onChange={update('businessType')} error={errors.businessType} options={businessTypes} /><SelectField label="Requirement" id="requirement" value={form.requirement} onChange={update('requirement')} error={errors.requirement} options={requirements} /></div><div className="mt-5"><label htmlFor="message" className="mb-2 block text-xs font-semibold uppercase tracking-[.12em] text-[hsl(var(--foreground))]">Message<span className="ml-1 text-[hsl(var(--accent))]" aria-hidden="true">*</span></label><textarea id="message" name="message" rows={5} value={form.message} onChange={(event) => update('message')(event.target.value)} placeholder="Tell us about your fabric requirement…" aria-invalid={Boolean(errors.message)} className={`w-full resize-y border bg-[hsl(var(--card))] px-4 py-3.5 text-base text-[hsl(var(--foreground))] outline-none transition placeholder:text-[hsl(var(--muted-foreground)/.65)] focus:border-[hsl(var(--accent))] focus:ring-1 focus:ring-[hsl(var(--accent)/.32)] ${errors.message ? 'border-[hsl(var(--destructive))]' : 'border-[hsl(var(--border))]'}`} data-testid="input-message" />{errors.message && <p className="mt-1.5 text-xs text-[hsl(var(--destructive))]" role="alert">{errors.message}</p>}</div><div className="mt-7 flex flex-col items-start justify-between gap-5 border-t border-[hsl(var(--border))] pt-6 sm:flex-row sm:items-center"><p className="max-w-[330px] text-xs leading-5 text-[hsl(var(--muted-foreground))]">Your details stay in this form. No email is sent — an email service is not connected yet.</p><button type="submit" disabled={status === 'loading'} className="inline-flex w-full items-center justify-center gap-3 bg-[hsl(var(--primary))] px-6 py-4 text-xs font-semibold uppercase tracking-[.15em] text-[hsl(var(--primary-foreground))] transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70 sm:w-auto" data-testid="button-submit-enquiry">{status === 'loading' ? 'Preparing enquiry…' : <>Send Enquiry <ArrowRight size={16} /></>}</button></div>{status === 'error' && Object.keys(errors).length === 0 && <p className="mt-4 text-xs text-[hsl(var(--destructive))]" role="alert">Something went wrong. Please review your details and try again.</p>}</form>;
}

function SelectField({ label, id, value, onChange, error, options }: { label: string; id: keyof FormState; value: string; onChange: (value: string) => void; error?: string; options: string[] }) {
  return <div><label htmlFor={id} className="mb-2 block text-xs font-semibold uppercase tracking-[.12em] text-[hsl(var(--foreground))]">{label}<span className="ml-1 text-[hsl(var(--accent))]" aria-hidden="true">*</span></label><div className="relative"><select id={id} name={id} value={value} onChange={(event) => onChange(event.target.value)} aria-invalid={Boolean(error)} className={`w-full appearance-none border bg-[hsl(var(--card))] px-4 py-3.5 pr-10 text-base text-[hsl(var(--foreground))] outline-none transition focus:border-[hsl(var(--accent))] focus:ring-1 focus:ring-[hsl(var(--accent)/.32)] ${error ? 'border-[hsl(var(--destructive))]' : 'border-[hsl(var(--border))]'} ${value ? '' : 'text-[hsl(var(--muted-foreground)/.65)]'}`} data-testid={`select-${id}`}><option value="">Select one</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select><ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" /></div>{error && <p className="mt-1.5 text-xs text-[hsl(var(--destructive))]" role="alert">{error}</p>}</div>;
}

function Contact() {
  return <section id="contact" className="section-pad bg-[hsl(var(--background))]"><div className="mx-auto max-w-[1180px]"><div className="grid gap-14 lg:grid-cols-[.74fr_1.26fr] lg:gap-20"><Reveal><div className="eyebrow mb-5">Let’s work together</div><h2 className="display max-w-[510px] text-[clamp(2.2rem,4.8vw,4.5rem)] font-semibold text-[hsl(var(--primary))]">Have a fabric<br /><span className="text-[hsl(var(--accent))]">requirement?</span></h2><p className="mt-7 max-w-[390px] text-sm leading-7 text-[hsl(var(--muted-foreground))]">Have a fabric requirement or business enquiry? Send us your details and our team will get in touch.</p><div className="mt-10 flex items-center gap-4"><div className="flex h-14 w-14 items-center justify-center border border-[hsl(var(--border))]"><Logo compact /></div><div><span className="block text-sm font-semibold text-[hsl(var(--primary))]">FREYA POLY FAB</span><span className="mt-1 block text-xs text-[hsl(var(--muted-foreground))]">Textile supply partner</span></div></div></Reveal><Reveal delay={.1}><div id="contact-form"><ContactForm /></div></Reveal></div><Reveal className="mt-24 border-t border-[hsl(var(--border))] pt-8"><div className="grid gap-7 sm:grid-cols-3"><ContactAction icon={<Phone size={19} />} title="Call Us" text="+91 9879296213" href="tel:+919879296213" testId="link-call" /><ContactAction icon={<Mail size={19} />} title="Email Us" text="devr8155@gmail.com" href="mailto:devr8155@gmail.com" testId="link-email" /><ContactAction icon={<MapPin size={19} />} title="Get Directions" text="36, Jash Market, Sahara Darwaja, Ring Road, Surat, Gujarat, India – 395002" href="https://www.google.com/maps/search/?api=1&query=36%2C%20Jash%20Market%2C%20Sahara%20Darwaja%2C%20Ring%20Road%2C%20Surat%2C%20Gujarat%2C%20India%20%E2%80%93%20395002" testId="link-directions" /></div></Reveal></div></section>;
}

function ContactAction({ icon, title, text, href, testId }: { icon: ReactNode; title: string; text: string; href: string; testId: string }) {
  return <a href={href} target={title === 'Get Directions' ? '_blank' : undefined} rel={title === 'Get Directions' ? 'noreferrer' : undefined} className="group flex gap-4 border-t border-[hsl(var(--border))] pt-5 transition hover:border-[hsl(var(--accent))]" data-testid={testId}><span className="text-[hsl(var(--accent))]">{icon}</span><span><span className="block text-xs font-semibold uppercase tracking-[.14em] text-[hsl(var(--primary))]">{title}</span><span className="mt-2 block max-w-[280px] text-sm leading-6 text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--foreground))]">{text}</span></span></a>;
}

function Footer() {
  return <footer className="bg-[hsl(var(--primary))] px-5 pb-7 pt-14 text-[hsl(var(--primary-foreground))] sm:px-8 lg:px-10"><div className="mx-auto max-w-[1180px]"><div className="grid gap-12 border-b border-[hsl(var(--primary-foreground)/.18)] pb-12 md:grid-cols-[1.15fr_.85fr_.9fr]"><div><button type="button" onClick={() => goTo('home')} className="rounded-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]" data-testid="button-footer-logo"><Logo /></button><p className="mt-6 max-w-[310px] text-sm leading-7 text-[hsl(var(--primary-foreground)/.62)]">Weaving Quality Fabrics, Building Fashion Futures.</p></div><div><div className="mb-5 text-[10px] font-semibold uppercase tracking-[.2em] text-[hsl(var(--accent))]">Explore</div><div className="grid grid-cols-2 gap-y-4">{navItems.map((item) => <button key={item.id} type="button" onClick={() => goTo(item.id)} className="text-left text-xs text-[hsl(var(--primary-foreground)/.68)] transition hover:text-[hsl(var(--accent))]" data-testid={`footer-nav-${item.id}`}>{item.label}</button>)}</div></div><div><div className="mb-5 text-[10px] font-semibold uppercase tracking-[.2em] text-[hsl(var(--accent))]">Contact</div><a href="tel:+919879296213" className="block text-sm text-[hsl(var(--primary-foreground)/.72)] hover:text-[hsl(var(--accent))]" data-testid="footer-phone">+91 9879296213</a><a href="mailto:devr8155@gmail.com" className="mt-3 block text-sm text-[hsl(var(--primary-foreground)/.72)] hover:text-[hsl(var(--accent))]" data-testid="footer-email">devr8155@gmail.com</a><p className="mt-3 max-w-[240px] text-xs leading-6 text-[hsl(var(--primary-foreground)/.54)]">36, Jash Market, Sahara Darwaja, Ring Road, Surat, Gujarat, India – 395002</p></div></div><div className="flex flex-col justify-between gap-4 pt-6 text-[10px] uppercase tracking-[.13em] text-[hsl(var(--primary-foreground)/.45)] sm:flex-row"><span>© 2026 Freya Poly Fab. All Rights Reserved.</span><span>Quality · Reliability · Trust</span></div></div></footer>;
}

function Home() {
  useEffect(() => {
    document.title = 'Freya Poly Fab | Quality Fabrics & Textile Supply';
    const description = 'Freya Poly Fab provides quality fabrics and textile materials with reliable sourcing, timely supply and customer-focused textile solutions for apparel and garment businesses.';
    const setMeta = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let tag = document.head.querySelector(selector) as HTMLMetaElement | null;
      if (!tag) { tag = document.createElement('meta'); tag.setAttribute(property ? 'property' : 'name', name); document.head.appendChild(tag); }
      tag.content = content;
    };
    setMeta('description', description);
    setMeta('og:title', 'Freya Poly Fab | Quality Fabrics & Textile Supply', true);
    setMeta('og:description', description, true);
    setMeta('og:type', 'website', true);
    let icon = document.head.querySelector('link[rel="icon"]') as HTMLLinkElement | null;
    if (!icon) { icon = document.createElement('link'); icon.rel = 'icon'; document.head.appendChild(icon); }
    icon.href = logoPath;
  }, []);
  return <div className="site-shell"><Header /><main><Hero /><Values /><About /><Mission /><Solutions /><FabricSupply /><Approach /><WhyUs /><WhoServe /><BusinessFlow /><CTA /><Contact /></main><Footer /><button type="button" onClick={() => goTo('home')} className="fixed bottom-5 right-5 z-30 flex h-10 w-10 items-center justify-center border border-[hsl(var(--border))] bg-[hsl(var(--card)/.9)] text-[hsl(var(--primary))] shadow-[var(--shadow-sm)] backdrop-blur transition hover:-translate-y-1" aria-label="Back to top" data-testid="button-back-top"><CircleArrowUp size={17} /></button></div>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><ErrorBoundary><Home /></ErrorBoundary><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;