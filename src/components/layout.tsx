import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronRight, Menu, X, PhoneCall, ExternalLink } from 'lucide-react';
import logoPath from '/logo.png';
import { useLocation } from 'wouter';

export const desktopNavItems = [
  { label: 'About',       id: 'about',       href: '/#about'       },
  { label: 'Challenges',  id: 'challenges',  href: '/#challenges'  },
  { label: 'Solutions',   id: 'solutions',   href: '/#solutions'   },
  { label: 'Offerings',   id: 'offerings',   href: '/#offerings'   },
  { label: 'Why Us',      id: 'usp',         href: '/#usp'         },
  { label: 'Market',      id: 'market-size', href: '/#market-size' },
  { label: 'Strategy',    id: 'growth',      href: '/#growth'      },
  { label: 'Leadership',  id: 'leadership',  href: '/#leadership'  },
];

export const allSections = [
  { label: 'Home',                     id: 'home',              href: '/'                 },
  { label: 'About Freya Poly Fab',     id: 'about',             href: '/#about'           },
  { label: 'Mission & Vision',         id: 'mission',           href: '/#mission'         },
  { label: 'Market Challenges',        id: 'challenges',        href: '/#challenges'      },
  { label: 'Solutions We Offer',       id: 'solutions',         href: '/#solutions'       },
  { label: 'Our Offerings',            id: 'offerings',         href: '/#offerings'       },
  // { label: 'Our Edge / USP',           id: 'usp',               href: '/#usp'             },
  // { label: 'Market Alignment (STP)',   id: 'market-alignment',  href: '/#market-alignment'},
  // { label: 'Market Size & Trends',     id: 'market-size',       href: '/#market-size'     },
  // { label: 'Revenue Streams',          id: 'revenue',           href: '/#revenue'         },
  // { label: 'Competitive Landscape',    id: 'competitive',       href: '/#competitive'     },
  // { label: 'Go-To-Market Strategy',    id: 'g2m',               href: '/#g2m'             },
  { label: 'Growth & Expansion',       id: 'growth',            href: '/#growth'          },
  // { label: 'Fund Utilization / Ask',   id: 'fund-utilization',  href: '/#fund-utilization'},
  { label: 'Leadership & Expertise',   id: 'leadership',        href: '/#leadership'      },
];

export const sectionToNavMap: Record<string, string> = {
  home: 'home',
  about: 'about',
  mission: 'about',
  challenges: 'challenges',
  solutions: 'solutions',
  'fabric-supply': 'offerings',
  offerings: 'offerings',
  usp: 'usp',
  'market-alignment': 'market-size',
  'market-size': 'market-size',
  revenue: 'market-size',
  competitive: 'market-size',
  g2m: 'growth',
  growth: 'growth',
  'fund-utilization': 'growth',
  leadership: 'leadership',
};

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

export function Header() {
  const [scrolled, setScrolled]       = useState(false);
  const [open, setOpen]               = useState(false);
  const [activeSection, setActive]    = useState('home');
  const [location]                    = useLocation();

  // Scroll listener with requestAnimationFrame hysteresis (prevents rapid toggle near threshold)
  useEffect(() => {
    let ticking = false;
    let isScrolled = false;

    const updateScroll = () => {
      const y = window.scrollY;
      const nextScrolled = y > (isScrolled ? 12 : 24);
      if (nextScrolled !== isScrolled) {
        isScrolled = nextScrolled;
        setScrolled(nextScrolled);
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // IntersectionObserver for tracking active section without DOM offset layout queries
  useEffect(() => {
    if (location === '/contact') {
      setActive('contact');
      return;
    }

    const sectionIds = allSections.map((s) => s.id);
    const elements: HTMLElement[] = [];

    const observer = new IntersectionObserver(
      (entries) => {
        // Find visible sections
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      {
        rootMargin: '-15% 0px -70% 0px',
        threshold: 0,
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        elements.push(el);
        observer.observe(el);
      }
    });

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [location]);

  /* Close mobile menu on resize to desktop */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1280) setOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-200 ${
        scrolled
          ? 'border-[hsl(var(--foreground)/.09)] bg-[rgba(255,255,255,0.92)] shadow-sm shadow-[rgba(74,70,64,.04)] backdrop-blur-md'
          : 'border-[hsl(var(--foreground)/.05)] bg-[rgba(255,255,255,0.85)] backdrop-blur-md'
      }`}
      data-testid="header-site"
    >
      {/* ── Main Bar Container ─────────────────────────────── */}
      <div className="mx-auto flex h-[68px] w-full max-w-[var(--max-w)] items-center px-[var(--gutter)] xl:h-[74px]">

        {/* ── Desktop Header Layout (xl: 1280px+) ──────────── */}
        <div className="hidden h-full w-full items-center justify-between xl:flex">
          {/* 1. Brand Logo */}
          <div className="flex shrink-0 items-center pr-6">
            <a
              href="/"
              className="shrink-0 rounded-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]"
              aria-label="Freya Poly Fab home"
              data-testid="button-logo-home"
            >
              <img
                src={logoPath}
                alt="Freya Poly Fab logo"
                className="h-9 w-auto object-contain xl:h-10"
                loading="eager"
                fetchPriority="high"
                width="140"
                height="40"
              />
            </a>
          </div>

          {/* 2. Primary Navigation Links */}
          <nav className="flex flex-1 items-center justify-center gap-3.5 xl:gap-5 2xl:gap-7 px-4" aria-label="Primary navigation">
            {desktopNavItems.map(({ id, label, href }) => {
              const activeNavId = sectionToNavMap[activeSection] || activeSection;
              const active = location === '/' && activeNavId === id;
              return (
                <a
                  key={id}
                  href={href}
                  onClick={(e) => {
                    if (location === '/') {
                      e.preventDefault();
                      setActive(id);
                      goTo(id);
                    }
                  }}
                  className={`group relative whitespace-nowrap py-2 text-[11px] font-semibold uppercase tracking-[.12em] transition-colors hover:text-[hsl(var(--accent))] ${
                    active ? 'text-[hsl(var(--accent))]' : 'text-[hsl(var(--foreground)/.82)]'
                  }`}
                  data-testid={`nav-${id}`}
                >
                  <span>{label}</span>
                  <span
                    className={`absolute bottom-0 left-0 h-[2px] bg-[hsl(var(--accent))] transition-[width] duration-200 ${
                      active ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          {/* 3. Partner CTA Button */}
          <div className="flex shrink-0 items-center pl-6">
            <a
              href="/contact"
              className="whitespace-nowrap inline-flex min-h-[42px] items-center gap-2 bg-[hsl(var(--accent))] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[.13em] text-[hsl(var(--accent-foreground))] transition-[transform,background-color] hover:-translate-y-0.5 hover:bg-[hsl(var(--accent)/.88)] shadow-sm active:scale-[.99]"
              data-testid="button-header-work"
            >
              Partner With Us <ArrowRight size={13} />
            </a>
          </div>
        </div>

        {/* ── Mobile & Tablet Header Layout (< xl: 1280px) ───── */}
        <div className="grid h-full w-full grid-cols-[1fr_auto_1fr] items-center xl:hidden">
          {/* Left: Hamburger Button */}
          <div className="flex items-center justify-start">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="flex h-11 w-11 items-center justify-center rounded-sm text-[hsl(var(--foreground))] transition-colors hover:bg-[hsl(var(--secondary)/.6)] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]"
              aria-label={open ? 'Close navigation' : 'Open navigation'}
              aria-expanded={open}
              aria-controls="mobile-nav"
              data-testid="button-mobile-menu"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* Center: Logo */}
          <div className="flex items-center justify-center">
            <a
              href="/"
              className="flex items-center justify-center rounded-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]"
              aria-label="Freya Poly Fab home"
              data-testid="button-logo-mobile"
            >
              <img
                src={logoPath}
                alt="Freya Poly Fab logo"
                className="h-8 w-auto object-contain sm:h-9"
                loading="eager"
                fetchPriority="high"
                width="120"
                height="36"
              />
            </a>
          </div>

          {/* Right: Quick Action Partner CTA */}
          <div className="flex items-center justify-end">
            <a
              href="/contact"
              className="whitespace-nowrap flex h-10 items-center justify-center gap-1.5 rounded-sm bg-[hsl(var(--accent))] px-3 text-[11px] font-semibold uppercase tracking-[.1em] text-white transition-colors hover:bg-[hsl(var(--accent)/.9)]"
              aria-label="Contact Freya Poly Fab"
              data-testid="button-mobile-quick-contact"
            >
              <PhoneCall size={13} />
              <span className="hidden sm:inline">Partner</span>
            </a>
          </div>
        </div>

      </div>

      {/* ── Mobile Nav Drawer (GPU-Optimized) ────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="max-h-[calc(100vh-68px)] overflow-y-auto border-t border-[hsl(var(--foreground)/.08)] bg-[rgba(255,255,255,0.98)] shadow-xl backdrop-blur-xl xl:hidden scrollbar-thin"
            aria-label="Mobile navigation"
          >
            <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)] pb-8 pt-3">
              <div className="mb-2 text-[10px] font-bold uppercase tracking-[.18em] text-[hsl(var(--accent))]">
                Sections Directory
              </div>
              <div className="divide-y divide-[hsl(var(--border))]">
                {allSections.map(({ id, label, href }) => {
                  const active = location === '/contact' ? id === 'contact' : activeSection === id;
                  return (
                    <a
                      key={id}
                      href={href}
                      onClick={(e) => {
                        if (id !== 'contact' && location === '/') {
                          e.preventDefault();
                          setActive(id);
                          goTo(id, () => setOpen(false));
                        } else {
                          setOpen(false);
                        }
                      }}
                      className={`flex w-full items-center justify-between py-3 text-xs font-semibold uppercase tracking-[.11em] transition-colors hover:text-[hsl(var(--accent))] ${
                        active ? 'text-[hsl(var(--accent))] font-bold' : 'text-[hsl(var(--foreground))]'
                      }`}
                      data-testid={`mobile-nav-${id}`}
                    >
                      <span>{label}</span>
                      <ChevronRight size={14} className="text-[hsl(var(--accent))]" />
                    </a>
                  );
                })}
              </div>

              <a
                href="/contact"
                onClick={() => setOpen(false)}
                className="mt-6 flex min-h-[48px] w-full items-center justify-center gap-2 bg-[hsl(var(--accent))] py-3.5 text-xs font-semibold uppercase tracking-[.14em] text-[hsl(var(--accent-foreground))] shadow-sm active:scale-[.99]"
                data-testid="button-mobile-work"
              >
                Partner With Us <ArrowRight size={14} />
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

export function Footer() {
  const [location] = useLocation();

  return (
    <footer className="px-[var(--gutter)] pb-8 pt-12 sm:pt-16 border-t border-[hsl(var(--border))] bg-[hsl(var(--background))]">
      <div className="mx-auto max-w-[var(--max-w)]">
        {/* Main 4-column grid */}
        <div className="footer-grid grid gap-10 border-b border-[hsl(var(--border))] pb-10 sm:gap-10 sm:pb-12 md:grid-cols-2 lg:grid-cols-[1.3fr_0.9fr_1fr_1.1fr]">
          
          {/* Col 1: Brand & Slogan */}
          <div className="space-y-4">
            <a
              href="/"
              className="inline-block rounded-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]"
              data-testid="button-footer-logo"
            >
              <img src={logoPath} alt="Freya Poly Fab logo" className="h-10 w-auto object-contain" />
            </a>
            <p className="max-w-[320px] text-xs font-medium uppercase tracking-[.1em] text-[hsl(var(--accent))]">
              Weaving Quality Fabrics, Building Fashion Futures.
            </p>
            <p className="max-w-[320px] text-xs leading-[1.7] text-[hsl(var(--muted-foreground))]">
              Freya Poly Fab is a growing textile trading and supply company specializing in quality fabrics and textile materials for garment manufacturers and fashion businesses.
            </p>
          </div>

          {/* Col 2: Solutions & Offerings */}
          <div>
            <div className="eyebrow mb-4 text-[hsl(var(--accent))]">Offerings & Solutions</div>
            <ul className="space-y-2.5">
              {[
                { label: 'About Freya Poly Fab', id: 'about' },
                { label: 'Mission & Vision', id: 'mission' },
                { label: 'Market Challenges', id: 'challenges' },
                { label: 'Solutions We Offer', id: 'solutions' },
                { label: 'Fabric Supply Range', id: 'fabric-supply' },
                { label: 'Our Offerings', id: 'offerings' },
                { label: 'Our Edge / USP', id: 'usp' },
              ].map(({ id, label }) => (
                <li key={id}>
                  <a
                    href={`/#${id}`}
                    onClick={(e) => {
                      if (location === '/') { e.preventDefault(); goTo(id); }
                    }}
                    className="text-xs text-[hsl(var(--muted-foreground))] transition hover:text-[hsl(var(--accent))]"
                    data-testid={`footer-nav-${id}`}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Strategy & Market */}
          <div>
            <div className="eyebrow mb-4 text-[hsl(var(--accent))]">Strategy & Market</div>
            <ul className="space-y-2.5">
              {[
                { label: 'Market Alignment (STP)', id: 'market-alignment' },
                { label: 'Market Size & Trends', id: 'market-size' },
                { label: 'Revenue Streams', id: 'revenue' },
                { label: 'Competitive Landscape', id: 'competitive' },
                { label: 'Go-To-Market Strategy', id: 'g2m' },
                { label: 'Growth & Expansion', id: 'growth' },
                { label: 'Fund Utilization / Ask', id: 'fund-utilization' },
                { label: 'Leadership & Expertise', id: 'leadership' },
              ].map(({ id, label }) => (
                <li key={id}>
                  <a
                    href={`/#${id}`}
                    onClick={(e) => {
                      if (location === '/') { e.preventDefault(); goTo(id); }
                    }}
                    className="text-xs text-[hsl(var(--muted-foreground))] transition hover:text-[hsl(var(--accent))]"
                    data-testid={`footer-nav-${id}`}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact & Office */}
          <div className="space-y-3">
            <div className="eyebrow mb-4 text-[hsl(var(--accent))]">Contact & Office</div>
            <div>
              <span className="block text-[10px] uppercase tracking-[.14em] text-[hsl(var(--muted-foreground))]">Direct Phone</span>
              <a
                href="tel:+919879296213"
                className="mt-0.5 inline-block text-sm font-semibold text-[hsl(var(--foreground))] transition hover:text-[hsl(var(--accent))]"
                data-testid="footer-phone"
              >
                +91 9879296213
              </a>
            </div>

            <div>
              <span className="block text-[10px] uppercase tracking-[.14em] text-[hsl(var(--muted-foreground))]">Email Address</span>
              <a
                href="mailto:devr8155@gmail.com"
                className="mt-0.5 inline-block text-sm text-[hsl(var(--foreground))] transition hover:text-[hsl(var(--accent))]"
                data-testid="footer-email"
              >
                devr8155@gmail.com
              </a>
            </div>

            <div>
              <span className="block text-[10px] uppercase tracking-[.14em] text-[hsl(var(--muted-foreground))]">Registered Address</span>
              <p className="mt-0.5 text-xs leading-[1.65] text-[hsl(var(--muted-foreground))]">
                36, Jash Market, Sahara Darwaja, Ring Road, Surat, Gujarat, India – 395002
              </p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=36%2C%20Jash%20Market%2C%20Sahara%20Darwaja%2C%20Ring%20Road%2C%20Surat%2C%20Gujarat%2C%20India%20%E2%80%93%20395002"
                target="_blank"
                rel="noreferrer"
                className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[.1em] text-[hsl(var(--accent))] hover:underline"
              >
                View on Google Maps <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col justify-between gap-3 pt-6 text-[11px] uppercase tracking-[.12em] text-[hsl(var(--muted-foreground)/.75)] sm:flex-row">
          <span>© 2026 Freya Poly Fab. All Rights Reserved.</span>
          <span>Reliability · Timely Delivery · Quality Textile Solutions</span>
        </div>
      </div>
    </footer>
  );
}
