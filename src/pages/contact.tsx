import { useState, useRef, useEffect, type FormEvent } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check, ChevronDown, CircleArrowUp, Mail, MapPin, Phone } from 'lucide-react';
import logoPath from '/logo.png';
import { Header, Footer } from '@/components/layout';
import { supabase } from '@/lib/supabase';

const businessTypes = ['Garment Manufacturer', 'Wholesaler', 'Retailer', 'Apparel Business', 'Textile Trader', 'Bulk Buyer', 'Other'];
const requirements = ['Fabric Requirement', 'Bulk Fabric Supply', 'Polyester Fabric', 'Customized Fabric Requirement', 'Business Enquiry', 'Partnership Enquiry', 'Other'];

type FormState = {
  fullName: string; company: string; email: string; phone: string; businessType: string; requirement: string; message: string;
};
type FormErrors = Partial<Record<keyof FormState, string>>;

const initialForm: FormState = { fullName: '', company: '', email: '', phone: '', businessType: '', requirement: '', message: '' };

function Field({ label, id, value, onChange, error, required = false, placeholder = '', type = 'text' }: { label: string; id: keyof FormState; value: string; onChange: (value: string) => void; error?: string; required?: boolean; placeholder?: string; type?: string }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-xs font-semibold uppercase tracking-[.12em] text-[hsl(var(--foreground))]">
        {label}{required && <span className="ml-1 text-[hsl(var(--accent))]" aria-hidden="true">*</span>}
      </label>
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className={`w-full min-h-[46px] border bg-[hsl(var(--card))] px-4 py-3 text-sm text-[hsl(var(--foreground))] outline-none transition placeholder:text-[hsl(var(--muted-foreground)/.6)] focus:border-[hsl(var(--accent))] focus:ring-1 focus:ring-[hsl(var(--accent)/.3)] ${error ? 'border-[hsl(var(--destructive))]' : 'border-[hsl(var(--border))]'}`}
        data-testid={`input-${id}`}
      />
      {error && <p className="mt-1.5 text-xs text-[hsl(var(--destructive))]" role="alert">{error}</p>}
    </div>
  );
}

function SelectField({ label, id, value, onChange, error, options }: { label: string; id: keyof FormState; value: string; onChange: (value: string) => void; error?: string; options: string[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selected = value || '';

  return (
    <div ref={ref} className="relative">
      <label className="mb-2 block text-xs font-semibold uppercase tracking-[.12em] text-[hsl(var(--foreground))]">
        {label}<span className="ml-1 text-[hsl(var(--accent))]" aria-hidden="true">*</span>
      </label>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex w-full min-h-[46px] items-center justify-between border bg-[hsl(var(--card))] px-4 py-3 text-left text-sm outline-none transition focus:border-[hsl(var(--accent))] focus:ring-1 focus:ring-[hsl(var(--accent)/.3)] ${error ? 'border-[hsl(var(--destructive))]' : open ? 'border-[hsl(var(--accent))]' : 'border-[hsl(var(--border))]'}`}
        data-testid={`select-${id}`}
      >
        <span className={selected ? 'text-[hsl(var(--foreground))]' : 'text-[hsl(var(--muted-foreground)/.6)]'}>
          {selected || 'Select option'}
        </span>
        <ChevronDown
          size={16}
          className={`ml-2 shrink-0 text-[hsl(var(--muted-foreground))] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full z-50 mt-1 max-h-56 overflow-y-auto border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-lg rounded-sm"
          >
            {options.map((option) => (
              <li
                key={option}
                role="option"
                aria-selected={selected === option}
                onClick={() => { onChange(option); setOpen(false); }}
                className={`flex cursor-pointer items-center justify-between px-4 py-3 text-xs sm:text-sm transition-colors hover:bg-[hsl(var(--accent)/.08)] hover:text-[hsl(var(--accent))] ${selected === option ? 'bg-[hsl(var(--accent)/.12)] font-semibold text-[hsl(var(--accent))]' : 'text-[hsl(var(--foreground))]'}`}
              >
                {option}
                {selected === option && <Check size={14} className="shrink-0 text-[hsl(var(--accent))]" />}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      {error && <p className="mt-1.5 text-xs text-[hsl(var(--destructive))]" role="alert">{error}</p>}
    </div>
  );
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
    if (!form.message.trim()) next.message = 'Please tell us about your fabric requirement.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) { setStatus('error'); return; }
    setStatus('loading');
    const { error } = await supabase.from('contact_enquiries').insert([{
      full_name: form.fullName,
      company: form.company,
      email: form.email,
      phone: form.phone,
      business_type: form.businessType,
      requirement: form.requirement,
      message: form.message,
    }]);
    if (error) {
      console.error('Supabase insert error:', error);
      setStatus('error');
      setErrors({ message: 'Failed to submit your enquiry. Please try again.' });
    } else {
      setStatus('success');
    }
  };
  if (status === 'success') return (
    <div className="border border-[hsl(var(--accent)/.5)] bg-[hsl(var(--card))] p-6 sm:p-10 shadow-sm" role="status" data-testid="status-enquiry-success">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--accent))] text-white">
        <Check size={22} />
      </div>
      <h3 className="mt-6 text-xl font-semibold text-[hsl(var(--primary))] sm:text-2xl">Thank you for contacting Freya Poly Fab.</h3>
      <p className="mt-3 max-w-[480px] text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">We will get in touch with you regarding your fabric requirement enquiry.</p>
      <p className="mt-6 border-t border-[hsl(var(--border))] pt-4 text-xs leading-6 text-[hsl(var(--muted-foreground))]">Your enquiry has been securely saved. Our team will review it and get back to you within 24 business hours.</p>
      <button type="button" onClick={() => { setForm(initialForm); setStatus('idle'); }} className="mt-6 text-xs font-semibold uppercase tracking-[.15em] text-[hsl(var(--primary))] underline decoration-[hsl(var(--accent))] underline-offset-4" data-testid="button-new-enquiry">Send another enquiry</button>
    </div>
  );
  return (
    <form onSubmit={submit} noValidate className="border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-sm sm:p-7 lg:p-8" data-testid="form-enquiry">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" id="fullName" value={form.fullName} onChange={update('fullName')} error={errors.fullName} required placeholder="Your full name" />
        <Field label="Company name" id="company" value={form.company} onChange={update('company')} error={errors.company} required placeholder="Your company name" />
        <Field label="Email address" id="email" value={form.email} onChange={update('email')} error={errors.email} required type="email" placeholder="you@company.com" />
        <Field label="Phone number" id="phone" value={form.phone} onChange={update('phone')} error={errors.phone} required type="tel" placeholder="+91" />
        <SelectField label="Business type" id="businessType" value={form.businessType} onChange={update('businessType')} error={errors.businessType} options={businessTypes} />
        <SelectField label="Fabric Requirement" id="requirement" value={form.requirement} onChange={update('requirement')} error={errors.requirement} options={requirements} />
      </div>
      <div className="mt-4">
        <label htmlFor="message" className="mb-2 block text-xs font-semibold uppercase tracking-[.12em] text-[hsl(var(--foreground))]">
          Fabric Requirement / Message<span className="ml-1 text-[hsl(var(--accent))]" aria-hidden="true">*</span>
        </label>
        <textarea id="message" name="message" rows={4} value={form.message} onChange={(event) => update('message')(event.target.value)} placeholder="Tell us about your fabric requirements, quantities, specifications…" aria-invalid={Boolean(errors.message)} className={`w-full resize-y border bg-[hsl(var(--card))] px-4 py-3 text-sm text-[hsl(var(--foreground))] outline-none transition placeholder:text-[hsl(var(--muted-foreground)/.6)] focus:border-[hsl(var(--accent))] focus:ring-1 focus:ring-[hsl(var(--accent)/.3)] ${errors.message ? 'border-[hsl(var(--destructive))]' : 'border-[hsl(var(--border))]'}`} data-testid="input-message" />
        {errors.message && <p className="mt-1.5 text-xs text-[hsl(var(--destructive))]" role="alert">{errors.message}</p>}
      </div>
      <div className="mt-6 flex flex-col items-start justify-between gap-4 border-t border-[hsl(var(--border))] pt-5 sm:flex-row sm:items-center">
        <p className="max-w-[320px] text-xs leading-5 text-[hsl(var(--muted-foreground))]">Your inquiry details will be securely processed by our team.</p>
        <button type="submit" disabled={status === 'loading'} className="inline-flex min-h-[46px] w-full items-center justify-center gap-2.5 bg-[hsl(var(--accent))] px-6 py-3 text-xs font-semibold uppercase tracking-[.14em] text-white shadow-sm transition hover:bg-[hsl(var(--accent)/.9)] disabled:cursor-wait disabled:opacity-70 sm:w-auto" data-testid="button-submit-enquiry">
          {status === 'loading' ? 'Submitting…' : <>Send Enquiry <ArrowRight size={15} /></>}
        </button>
      </div>
      {status === 'error' && Object.keys(errors).length === 0 && <p className="mt-4 text-xs text-[hsl(var(--destructive))]" role="alert">Something went wrong. Please review your details and try again.</p>}
    </form>
  );
}

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
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

export function ContactPageContent() {
  const reduce = useReducedMotion();
  
  return (
    <div id="contact-page" className="min-h-screen bg-[hsl(var(--background))] pt-[68px] xl:pt-[72px]">
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-[hsl(var(--card))] to-[hsl(var(--background))] px-[var(--gutter)] pb-10 pt-10 sm:pb-12 sm:pt-12 border-b border-[hsl(var(--border))]">
        <div className="pointer-events-none absolute inset-0 opacity-35" style={{ background: 'radial-gradient(circle at 80% 24%, rgba(229,212,184,.3), transparent 38%)' }} />
        <div className="relative z-10 mx-auto max-w-[var(--max-w)]">
          <Reveal>
            <div className="eyebrow mb-3">Partner With Us</div>
            <h1 className="display max-w-[640px] font-semibold text-[hsl(var(--foreground))]"
              style={{ fontSize: 'clamp(1.85rem, 4.8vw, 4rem)', lineHeight: 1.08 }}>
              Partner With Us for<br />
              <span className="text-[hsl(var(--accent))]">Quality Fabrics</span>
            </h1>
            <p className="mt-4 max-w-[500px] text-xs leading-[1.72] text-[hsl(var(--muted-foreground))] sm:text-sm">
              Have a fabric requirement or business enquiry? Send us your details and our team will get in touch to discuss your textile sourcing needs.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Form + Info */}
      <section className="px-[var(--gutter)] py-10 sm:py-12 lg:py-14">
        <div className="mx-auto max-w-[var(--max-w)]">
          <div className="contact-grid grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-12">
            <Reveal>
              <div>
                <div className="eyebrow mb-3">Contact Information</div>
                <h2 className="display max-w-[480px] text-[clamp(1.5rem,3.4vw,2.8rem)] font-semibold leading-[1.08] text-[hsl(var(--primary))]">
                  Let's Discuss Your<br />
                  <span className="text-[hsl(var(--accent))]">Fabric Requirements</span>
                </h2>
                <p className="mt-4 max-w-[380px] text-xs leading-[1.7] text-[hsl(var(--muted-foreground))] sm:text-sm">
                  Fill out the form and our team will respond to your enquiry within 24 business hours.
                </p>
              </div>
            </Reveal>
            
            <Reveal delay={0.08}>
              <div id="contact-form">
                <ContactForm />
              </div>
            </Reveal>
          </div>

          {/* Contact Cards */}
          <div className="contact-cards mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { icon: <Phone size={20} />, title: 'Call Us', text: '+91 9879296213', href: 'tel:+919879296213', testId: 'link-call', color: '#0f3d5c' },
              { icon: <Mail size={20} />, title: 'Email Us', text: 'devr8155@gmail.com', href: 'mailto:devr8155@gmail.com', testId: 'link-email', color: '#4a7ba7' },
              { icon: <MapPin size={20} />, title: 'Get Directions', text: '36, Jash Market, Sahara Darwaja, Ring Road, Surat, Gujarat, India – 395002', href: 'https://www.google.com/maps/search/?api=1&query=36%2C%20Jash%20Market%2C%20Sahara%20Darwaja%2C%20Ring%20Road%2C%20Surat%2C%20Gujarat%2C%20India%20%E2%80%93%20395002', testId: 'link-directions', color: '#b79a68' }
            ].map((item, index) => (
              <motion.a
                key={item.testId}
                href={item.href}
                target={item.title === 'Get Directions' ? '_blank' : undefined}
                rel={item.title === 'Get Directions' ? 'noreferrer' : undefined}
                initial={reduce ? undefined : { opacity: 0, y: 14 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.08 }}
                transition={{ duration: 0.38, delay: index * 0.06 }}
                className="group flex flex-col items-center gap-3.5 overflow-hidden rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 text-center shadow-sm transition-[border-color,box-shadow] duration-200 hover:border-[hsl(var(--accent)/.6)] hover:shadow-md sm:p-6"
                data-testid={item.testId}
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full transition-colors duration-200 group-hover:bg-[hsl(var(--accent)/.15)]"
                  style={{ backgroundColor: `${item.color}15`, color: item.color }}
                >
                  {item.icon}
                </div>
                <div className="flex-1">
                  <span className="block text-xs font-semibold uppercase tracking-[.12em] text-[hsl(var(--primary))]">
                    {item.title}
                  </span>
                  <span className="mt-1.5 block text-xs leading-[1.6] text-[hsl(var(--muted-foreground))] transition-colors group-hover:text-[hsl(var(--foreground))] sm:text-sm">
                    {item.text}
                  </span>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ContactPage() {
  useEffect(() => {
    document.title = 'Contact Us — Freya Poly Fab';
    const description = 'Get in touch with Freya Poly Fab for quality fabric requirements and textile supply inquiries. Contact our team for partnerships and business enquiries.';
    const setMeta = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let tag = document.head.querySelector(selector) as HTMLMetaElement | null;
      if (!tag) { tag = document.createElement('meta'); tag.setAttribute(property ? 'property' : 'name', name); document.head.appendChild(tag); }
      tag.content = content;
    };
    setMeta('description', description);
    setMeta('og:title', 'Contact Us — Freya Poly Fab', true);
    setMeta('og:description', description, true);
    setMeta('og:type', 'website', true);
    let icon = document.head.querySelector('link[rel="icon"]') as HTMLLinkElement | null;
    if (!icon) { icon = document.createElement('link'); icon.rel = 'icon'; document.head.appendChild(icon); }
    icon.href = logoPath;
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Header />
      <main>
        <ContactPageContent />
      </main>
      <Footer />
      <button 
        type="button" 
        onClick={scrollToTop} 
        className="fixed bottom-5 right-5 z-30 flex h-10 w-10 items-center justify-center border border-[hsl(var(--border))] bg-[hsl(var(--card)/.95)] text-[hsl(var(--primary))] shadow-md backdrop-blur-md transition-colors hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))]" 
        aria-label="Back to top" 
        data-testid="button-back-top"
      >
        <CircleArrowUp size={17} />
      </button>
    </>
  );
}
