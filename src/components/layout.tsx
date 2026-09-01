import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronRight, Menu, X, PhoneCall } from 'lucide-react';
import logoPath from '/logo.png';
import { useLocation } from 'wouter';

const navItems = [
  { label: 'Home',              id: 'home',              href: '/'                },
  { label: 'About Us',          id: 'about',             href: '/#about'          },
  { label: 'Market Challenges', id: 'challenges',        href: '/#challenges'     },
  { label: 'Solutions',         id: 'solutions',         href: '/#solutions'      },
  { label: 'Offerings',         id: 'offerings',         href: '/#offerings'      },
  // { label: 'USP',               id: 'usp',               href: '/#usp'            },
  // { label: 'Market Alignment',  id: 'market-alignment',   href: '/#market-alignment'},
  // { label: 'Market Size',       id: 'market-size',       href: '/#market-size'    },
  // { label: 'Revenue Streams',   id: 'revenue',           href: '/#revenue'        },
  // { label: 'Our Edge',          id: 'competitive',       href: '/#competitive'    },
  // { label: 'G2M Strategy',      id: 'g2m',               href: '/#g2m'            },
  // { label: 'Growth Strategy',   id: 'growth',            href: '/#growth'         },
  // { label: 'Fund Utilization',  id: 'fund-utilization',   href: '/#fund-utilization'},
  { label: 'Leadership',        id: 'leadership',        href: '/#leadership'     },
  { label: 'Partner With Us',   id: 'contact',           href: '/contact'         },
];

function goTo(id: string, close?: () => void) {
  close?.();
  if (id === 'contact') { window.location.href = '/contact'; return; }
  if (window.location.pathname === '/contact') { window.location.href = '/#' + id; return; }
  window.setTimeout(() => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 30);
}

export function Header() {
  const [scrolled, setScrolled]       = useState(false);
  const [open, setOpen]               = useState(false);
  const [activeSection, setActive]    = useState('home');
  const [location]                    = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (location === '/contact') { setActive('contact'); return; }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { root: null, rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    );
    navItems.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [location]);

  /* Close mobile menu on resize to desktop */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1280) setOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b border-[hsl(var(--foreground)/.07)] transition-all duration-300 ${
        scrolled
          ? 'bg-[rgba(255,255,255,0.82)] shadow-sm shadow-[rgba(74,70,64,.04)] backdrop-blur-[18px] backdrop-saturate-150'
          : 'bg-[rgba(255,255,255,0.68)] backdrop-blur-[14px] backdrop-saturate-150'
      }`}
      data-testid="header-site"
    >
      {/* ── Main Bar ──────────────────────────────────────── */}
      <div className="relative mx-auto flex h-[68px] max-w-[var(--max-w)] items-center justify-between px-[var(--gutter)] xl:h-[72px]">

        {/* Desktop Left: Logo */}
        <div className="hidden items-center xl:flex">
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
            />
          </a>
        </div>

        {/* Mobile Viewport-Centered Bar Structure (< xl) */}
        <div className="flex w-full items-center justify-between xl:hidden">
          {/* Mobile Left: Hamburger */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-sm text-[hsl(var(--foreground))] transition hover:bg-[hsl(var(--secondary)/.6)] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            aria-expanded={open}
            aria-controls="mobile-nav"
            data-testid="button-mobile-menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Mobile Center: Logo (Strictly centered to the viewport) */}
          <a
            href="/"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]"
            aria-label="Freya Poly Fab home"
            data-testid="button-logo-mobile"
          >
            <img
              src={logoPath}
              alt="Freya Poly Fab logo"
              className="h-8 w-auto object-contain sm:h-9"
              loading="eager"
              fetchPriority="high"
            />
          </a>

          {/* Mobile Right: Quick Action Contact */}
          <a
            href="/contact"
            className="flex h-10 items-center justify-center gap-1.5 rounded-sm bg-[hsl(var(--accent))] px-3 text-[11px] font-semibold uppercase tracking-[.1em] text-white transition hover:bg-[hsl(var(--accent)/.9)]"
            aria-label="Contact Freya Poly Fab"
            data-testid="button-mobile-quick-contact"
          >
            <PhoneCall size={13} />
            <span className="hidden sm:inline">Partner</span>
          </a>
        </div>

        {/* Desktop Center Nav — hidden below xl */}
        <nav className="hidden items-center gap-5 xl:flex 2xl:gap-7" aria-label="Primary navigation">
          {navItems.map(({ id, label, href }) => {
            const active = location === '/contact' ? id === 'contact' : activeSection === id;
            return (
              <a
                key={id}
                href={href}
                onClick={(e) => {
                  if (id !== 'contact' && location === '/') { e.preventDefault(); goTo(id); }
                }}
                className={`group relative py-2.5 text-[11px] font-semibold uppercase tracking-[.12em] transition-colors hover:text-[hsl(var(--accent))] ${
                  active ? 'text-[hsl(var(--accent))]' : 'text-[hsl(var(--foreground)/.8)]'
                }`}
                data-testid={`nav-${id}`}
              >
                <span>{label}</span>
                <span
                  className={`absolute bottom-0.5 left-0 h-px bg-[hsl(var(--accent))] transition-all duration-300 ${
                    active ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </a>
            );
          })}
        </nav>

        {/* Desktop Right CTA */}
        <div className="hidden items-center xl:flex">
          <a
            href="/contact"
            className="inline-flex min-h-[42px] items-center gap-2 bg-[hsl(var(--accent))] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[.13em] text-[hsl(var(--accent-foreground))] transition hover:-translate-y-0.5 hover:bg-[hsl(var(--accent)/.88)] shadow-sm"
            data-testid="button-header-work"
          >
            Partner With Us <ArrowRight size={13} />
          </a>
        </div>
      </div>

      {/* ── Mobile Nav Drawer ────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-[hsl(var(--foreground)/.08)] bg-[rgba(255,255,255,0.92)] shadow-xl backdrop-blur-[20px] backdrop-saturate-150 xl:hidden"
            aria-label="Mobile navigation"
          >
            <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)] pb-6 pt-2">
              {navItems.map(({ id, label, href }, i) => {
                const active = location === '/contact' ? id === 'contact' : activeSection === id;
                return (
                  <motion.a
                    key={id}
                    href={href}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.025 }}
                    onClick={(e) => {
                      if (id !== 'contact' && location === '/') {
                        e.preventDefault();
                        goTo(id, () => setOpen(false));
                      } else {
                        setOpen(false);
                      }
                    }}
                    className={`flex w-full items-center justify-between border-b border-[hsl(var(--border))] py-3.5 text-xs font-semibold uppercase tracking-[.12em] ${
                      active ? 'text-[hsl(var(--accent))]' : 'text-[hsl(var(--foreground))]'
                    }`}
                    data-testid={`mobile-nav-${id}`}
                  >
                    {label}
                    <ChevronRight size={14} className="text-[hsl(var(--accent))]" />
                  </motion.a>
                );
              })}
              <a
                href="/contact"
                onClick={() => setOpen(false)}
                className="mt-5 flex min-h-[48px] w-full items-center justify-center gap-2 bg-[hsl(var(--accent))] py-3.5 text-xs font-semibold uppercase tracking-[.14em] text-[hsl(var(--accent-foreground))] shadow-sm"
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
    <footer className="px-[var(--gutter)] pb-8 pt-12 sm:pt-16">
      <div className="mx-auto max-w-[var(--max-w)]">
        {/* Main grid */}
        <div className="footer-grid grid gap-10 border-b border-[hsl(var(--border))] pb-10 sm:gap-12 sm:pb-12 md:grid-cols-[1.2fr_.8fr_.9fr]">
          {/* Brand */}
          <div>
            <a
              href="/"
              className="inline-block rounded-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]"
              data-testid="button-footer-logo"
            >
              <img src={logoPath} alt="Freya Poly Fab logo" className="h-10 w-auto object-contain" />
            </a>
            <p className="mt-4 max-w-[320px] text-sm leading-[1.68] text-[hsl(var(--muted-foreground))]">
              Weaving Quality Fabrics, Building Fashion Futures. Reliable textile supply partner for the apparel industry.
            </p>
          </div>

          {/* Explore */}
          <div>
            <div className="eyebrow mb-4">Explore</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
              {navItems.map(({ id, label, href }) => (
                <a
                  key={id}
                  href={href}
                  onClick={(e) => {
                    if (id !== 'contact' && location === '/') { e.preventDefault(); goTo(id); }
                  }}
                  className="text-left text-xs text-[hsl(var(--muted-foreground))] transition hover:text-[hsl(var(--accent))]"
                  data-testid={`footer-nav-${id}`}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <div className="eyebrow mb-4">Contact</div>
            <a
              href="tel:+919879296213"
              className="block text-sm font-medium text-[hsl(var(--foreground))] transition hover:text-[hsl(var(--accent))]"
              data-testid="footer-phone"
            >
              +91 9879296213
            </a>
            <a
              href="mailto:devr8155@gmail.com"
              className="mt-2 block text-sm text-[hsl(var(--muted-foreground))] transition hover:text-[hsl(var(--accent))]"
              data-testid="footer-email"
            >
              devr8155@gmail.com
            </a>
            <p className="mt-2.5 max-w-[260px] text-xs leading-[1.65] text-[hsl(var(--muted-foreground)/.75)]">
              36, Jash Market, Sahara Darwaja, Ring Road, Surat, Gujarat, India – 395002
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col justify-between gap-3 pt-6 text-[11px] uppercase tracking-[.12em] text-[hsl(var(--muted-foreground)/.65)] sm:flex-row">
          <span>© 2026 Freya Poly Fab. All Rights Reserved.</span>
          <span>Quality · Reliability · Trust</span>
        </div>
      </div>
    </footer>
  );
}
