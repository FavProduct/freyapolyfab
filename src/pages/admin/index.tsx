import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { supabase } from '@/lib/supabase';
import {
  LogOut, Mail, Phone, Building2,
  RefreshCw, ChevronDown, ChevronUp, Search, Inbox,
  User, X, SlidersHorizontal, Trash2, CalendarDays,
} from 'lucide-react';
import logoPath from '/logo.png';

// ─── Types ────────────────────────────────────────────────────────────────────

type Enquiry = {
  id: string;
  full_name: string;
  company: string;
  email: string;
  phone: string;
  business_type: string;
  requirement: string;
  message: string;
  created_at: string;
};

type SortKey = 'created_at' | 'full_name' | 'company';
type SortDir = 'asc' | 'desc';
type DatePreset = 'all' | 'today' | 'yesterday' | 'last7' | 'last30' | 'thisMonth' | 'lastMonth' | 'custom';

// ─── Date helpers ─────────────────────────────────────────────────────────────

function startOfDay(d: Date) { const c = new Date(d); c.setHours(0,0,0,0); return c; }
function endOfDay(d: Date)   { const c = new Date(d); c.setHours(23,59,59,999); return c; }
function toInputVal(d: Date) { return d.toISOString().slice(0,10); }

function presetRange(p: DatePreset): { from: Date|null; to: Date|null } {
  const now = new Date();
  switch (p) {
    case 'today':     return { from: startOfDay(now), to: endOfDay(now) };
    case 'yesterday': { const y=new Date(now); y.setDate(y.getDate()-1); return { from: startOfDay(y), to: endOfDay(y) }; }
    case 'last7':     { const f=new Date(now); f.setDate(f.getDate()-6); return { from: startOfDay(f), to: endOfDay(now) }; }
    case 'last30':    { const f=new Date(now); f.setDate(f.getDate()-29); return { from: startOfDay(f), to: endOfDay(now) }; }
    case 'thisMonth': return { from: new Date(now.getFullYear(),now.getMonth(),1,0,0,0,0), to: endOfDay(now) };
    case 'lastMonth': return { from: new Date(now.getFullYear(),now.getMonth()-1,1,0,0,0,0), to: new Date(now.getFullYear(),now.getMonth(),0,23,59,59,999) };
    default:          return { from: null, to: null };
  }
}

const DATE_PRESETS: { key: DatePreset; label: string }[] = [
  { key: 'all',       label: 'All Time' },
  { key: 'today',     label: 'Today' },
  { key: 'yesterday', label: 'Yesterday' },
  { key: 'last7',     label: 'Last 7 Days' },
  { key: 'last30',    label: 'Last 30 Days' },
  { key: 'thisMonth', label: 'This Month' },
  { key: 'lastMonth', label: 'Last Month' },
  { key: 'custom',    label: 'Custom' },
];

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('en-IN', {
    day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit', hour12:true,
  }).format(new Date(iso));
}

// ─── Badge ────────────────────────────────────────────────────────────────────

function Badge({ text, color='accent' }: { text:string; color?:'accent'|'blue' }) {
  return (
    <span className={`inline-flex items-center max-w-full truncate rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wide border ${
      color==='blue'
        ? 'bg-sky-50 text-sky-700 border-sky-200'
        : 'bg-amber-50 text-amber-700 border-amber-200'
    }`}>{text}</span>
  );
}

// ─── Enquiry Card ─────────────────────────────────────────────────────────────

function EnquiryCard({ enquiry, selected, onSelect }: {
  enquiry: Enquiry; selected: boolean; onSelect: (id:string)=>void;
}) {
  return (
    <div className={`group overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-200 ${
      selected
        ? 'border-[hsl(var(--accent))] shadow-[0_0_0_3px_hsl(var(--accent)/.12)]'
        : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
    }`}>

      {/* ── Header ── */}
      <div className={`flex items-start gap-3 px-4 py-3 ${selected ? 'bg-amber-50/60' : 'bg-slate-50/60'}`}>
        {/* Checkbox */}
        <button
          type="button"
          onClick={() => onSelect(enquiry.id)}
          aria-label="Select"
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all ${
            selected
              ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent))]'
              : 'border-slate-300 hover:border-[hsl(var(--accent)/.7)]'
          }`}
        >
          {selected && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4L3.8 7L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>

        {/* Identity block */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
            <div className="min-w-0">
              <h3 className="truncate text-[15px] font-bold leading-tight text-slate-800">
                {enquiry.full_name}
              </h3>
              <div className="mt-0.5 flex items-center gap-1.5 text-[12px] text-slate-500">
                <Building2 size={11} className="shrink-0 text-slate-400"/>
                <span className="truncate">{enquiry.company}</span>
              </div>
            </div>
            <span className="shrink-0 rounded-full bg-white border border-slate-200 px-2.5 py-0.5 text-[11px] text-slate-400 shadow-sm">
              {formatDate(enquiry.created_at)}
            </span>
          </div>
          {/* badges */}
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            <Badge text={enquiry.business_type} color="blue" />
            <Badge text={enquiry.requirement} color="accent" />
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="px-4 py-3 space-y-2.5">
        {/* Contact info */}
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <a href={`mailto:${enquiry.email}`}
            className="flex items-center gap-2 text-[13px] text-slate-600 hover:text-[hsl(var(--accent))] transition-colors min-w-0">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-50 border border-amber-100">
              <Mail size={13} className="text-amber-600"/>
            </span>
            <span className="truncate max-w-[220px] sm:max-w-none">{enquiry.email}</span>
          </a>
          <a href={`tel:${enquiry.phone}`}
            className="flex items-center gap-2 text-[13px] text-slate-600 hover:text-[hsl(var(--accent))] transition-colors">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sky-50 border border-sky-100">
              <Phone size={13} className="text-sky-600"/>
            </span>
            <span>{enquiry.phone}</span>
          </a>
        </div>

        {/* Message */}
        {enquiry.message && (
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
            <p className="line-clamp-3 text-[13px] leading-relaxed text-slate-600 whitespace-pre-wrap">
              {enquiry.message}
            </p>
          </div>
        )}
      </div>

      {/* ── Footer / Actions ── */}
      <div className="flex gap-2 border-t border-slate-100 bg-slate-50/80 px-4 py-2.5">
        <a href={`mailto:${enquiry.email}?subject=Re: ${encodeURIComponent(enquiry.requirement)} – Freya Poly Fab`}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[hsl(var(--accent))] py-2.5 text-[12px] font-semibold text-[hsl(var(--accent-foreground))] shadow-sm transition hover:opacity-90 active:scale-[.98]">
          <Mail size={13}/> Reply via Email
        </a>
        <a href={`tel:${enquiry.phone}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-[12px] font-semibold text-slate-700 shadow-sm transition hover:border-[hsl(var(--accent)/.4)] hover:text-[hsl(var(--accent))] active:scale-[.98]">
          <Phone size={13}/> Call
        </a>
      </div>
    </div>
  );
}

// ─── Filter + Sort Sheet (mobile bottom drawer) ───────────────────────────────

function FilterSortSheet({
  open, onClose,
  sortKey, sortDir, toggleSort,
  datePreset, setDatePreset,
  customFrom, setCustomFrom,
  customTo, setCustomTo,
  clearDate,
}: {
  open: boolean; onClose: ()=>void;
  sortKey: SortKey; sortDir: SortDir; toggleSort: (k:SortKey)=>void;
  datePreset: DatePreset; setDatePreset: (p:DatePreset)=>void;
  customFrom: string; setCustomFrom: (v:string)=>void;
  customTo: string; setCustomTo: (v:string)=>void;
  clearDate: ()=>void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    if(!open) return;
    const h=(e:MouseEvent)=>{ if(ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    document.addEventListener('mousedown',h);
    return ()=>document.removeEventListener('mousedown',h);
  },[open,onClose]);
  useEffect(()=>{ document.body.style.overflow=open?'hidden':''; return ()=>{ document.body.style.overflow=''; }; },[open]);
  if(!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/50 backdrop-blur-sm">
      <div ref={ref} className="max-h-[88dvh] overflow-y-auto rounded-t-3xl border-t border-slate-200 bg-white px-5 pb-8 pt-5 shadow-2xl">
        {/* drag handle */}
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-200"/>
        {/* header */}
        <div className="mb-5 flex items-center justify-between">
          <p className="flex items-center gap-2 text-[15px] font-bold text-slate-800">
            <SlidersHorizontal size={15} className="text-slate-500"/> Filters &amp; Sort
          </p>
          <button type="button" onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 transition hover:bg-slate-100">
            <X size={15}/>
          </button>
        </div>

        {/* sort */}
        <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest text-slate-400">Sort By</p>
        <div className="mb-6 grid grid-cols-3 gap-2">
          {([{key:'created_at',label:'Date'},{key:'full_name',label:'Name'},{key:'company',label:'Company'}] as {key:SortKey;label:string}[]).map(s=>(
            <button key={s.key} type="button" onClick={()=>toggleSort(s.key)}
              className={`flex items-center justify-center gap-1.5 rounded-xl border py-3 text-[12px] font-semibold transition ${
                sortKey===s.key
                  ? 'border-[hsl(var(--accent)/.4)] bg-amber-50 text-amber-700'
                  : 'border-slate-200 bg-slate-50 text-slate-500'
              }`}>
              {s.label}
              {sortKey===s.key && (sortDir==='asc' ? <ChevronUp size={12}/> : <ChevronDown size={12}/>)}
            </button>
          ))}
        </div>

        {/* date */}
        <div className="mb-2.5 flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Date Range</p>
          {datePreset !== 'all' && (
            <button type="button" onClick={clearDate}
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-[12px] font-medium text-red-500 hover:bg-red-50 transition">
              <X size={11}/>Clear
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {DATE_PRESETS.map(p=>(
            <button key={p.key} type="button" onClick={()=>setDatePreset(p.key)}
              className={`rounded-xl border py-3 text-[12px] font-semibold transition ${
                datePreset===p.key
                  ? 'border-[hsl(var(--accent)/.4)] bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] shadow-sm'
                  : 'border-slate-200 bg-slate-50 text-slate-500'
              }`}>
              {p.label}
            </button>
          ))}
        </div>
        {datePreset==='custom' && (
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-slate-400">From</label>
              <input type="date" value={customFrom} max={customTo||toInputVal(new Date())} onChange={e=>setCustomFrom(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-[13px] outline-none focus:border-[hsl(var(--accent)/.6)] transition"/>
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-slate-400">To</label>
              <input type="date" value={customTo} min={customFrom} max={toInputVal(new Date())} onChange={e=>setCustomTo(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-[13px] outline-none focus:border-[hsl(var(--accent)/.6)] transition"/>
            </div>
          </div>
        )}

        <button type="button" onClick={onClose}
          className="mt-6 w-full rounded-2xl bg-[hsl(var(--primary))] py-3.5 text-[14px] font-bold text-[hsl(var(--primary-foreground))] shadow-sm active:scale-[.98] transition">
          Apply Filters
        </button>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const [enquiries, setEnquiries]   = useState<Enquiry[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [search, setSearch]         = useState('');
  const [sortKey, setSortKey]       = useState<SortKey>('created_at');
  const [sortDir, setSortDir]       = useState<SortDir>('desc');
  const [adminEmail, setAdminEmail] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  // Date filter
  const [datePreset, setDatePreset] = useState<DatePreset>('all');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo,   setCustomTo]   = useState('');

  // Multi-select
  const [selected, setSelected]   = useState<Set<string>>(new Set());
  const [deleting, setDeleting]   = useState(false);

  // ── fetch ──
  const fetchEnquiries = async () => {
    setLoading(true); setError(''); setSelected(new Set());
    const { data, error: e } = await supabase.from('contact_enquiries').select('*').order(sortKey,{ascending:sortDir==='asc'});
    if(e) setError('Failed to load enquiries. Please try again.');
    else  setEnquiries(data??[]);
    setLoading(false);
  };

  useEffect(()=>{
    supabase.auth.getSession().then(({data})=>{
      if(!data.session) navigate('/admin/login');
      else { setAdminEmail(data.session.user.email??''); fetchEnquiries(); }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[sortKey,sortDir]);

  const handleLogout = async()=>{ await supabase.auth.signOut(); navigate('/admin/login'); };
  const toggleSort   = (key:SortKey)=>{ if(sortKey===key) setSortDir(d=>d==='asc'?'desc':'asc'); else{ setSortKey(key); setSortDir('desc'); } };
  const clearDate    = ()=>{ setDatePreset('all'); setCustomFrom(''); setCustomTo(''); };

  // ── active date range ──
  const activeDateRange = datePreset==='custom'
    ? { from: customFrom ? startOfDay(new Date(customFrom)) : null, to: customTo ? endOfDay(new Date(customTo)) : null }
    : presetRange(datePreset);
  const isDateFiltered = datePreset!=='all';
  const activeDateLabel = DATE_PRESETS.find(p=>p.key===datePreset)?.label??'All Time';

  // ── filtered list ──
  const filtered = enquiries.filter(e=>{
    const q=search.toLowerCase();
    const matchSearch = e.full_name.toLowerCase().includes(q)||e.company.toLowerCase().includes(q)||
      e.email.toLowerCase().includes(q)||e.business_type.toLowerCase().includes(q)||e.requirement.toLowerCase().includes(q);
    if(!matchSearch) return false;
    if(activeDateRange.from||activeDateRange.to){
      const c=new Date(e.created_at);
      if(activeDateRange.from&&c<activeDateRange.from) return false;
      if(activeDateRange.to&&c>activeDateRange.to)     return false;
    }
    return true;
  });

  // ── selection ──
  const allSel   = filtered.length>0 && filtered.every(e=>selected.has(e.id));
  const someSel  = selected.size>0;
  const toggleSelectAll = ()=>{
    if(allSel) setSelected(prev=>{ const n=new Set(prev); filtered.forEach(e=>n.delete(e.id)); return n; });
    else       setSelected(prev=>{ const n=new Set(prev); filtered.forEach(e=>n.add(e.id));    return n; });
  };
  const toggleSelect = (id:string)=>setSelected(prev=>{ const n=new Set(prev); n.has(id)?n.delete(id):n.add(id); return n; });

  const deleteSelected = async()=>{
    if(!window.confirm(`Delete ${selected.size} enquir${selected.size===1?'y':'ies'}? This cannot be undone.`)) return;
    setDeleting(true);
    const ids=Array.from(selected);
    const {error:de}=await supabase.from('contact_enquiries').delete().in('id',ids);
    setDeleting(false);
    if(de){ setError('Failed to delete. Please try again.'); return; }
    setEnquiries(prev=>prev.filter(e=>!selected.has(e.id)));
    setSelected(new Set());
  };

  const activeFilterCount = (isDateFiltered?1:0)+(sortKey!=='created_at'||sortDir!=='desc'?1:0);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-[1280px] items-center justify-between gap-3 px-4 sm:h-16 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <a href="/"><img src={logoPath} alt="Freya Poly Fab" className="h-8 w-auto object-contain"/></a>
            <div className="h-6 w-px bg-slate-200"/>
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-widest text-amber-700">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <button type="button" onClick={fetchEnquiries} disabled={loading} aria-label="Refresh"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-[hsl(var(--accent)/.4)] hover:text-[hsl(var(--accent))] disabled:opacity-40">
              <RefreshCw size={14} className={loading?'animate-spin':''}/>
            </button>
            {adminEmail && (
              <span className="hidden items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-[12px] text-slate-500 shadow-sm sm:flex">
                <User size={12} className="text-slate-400"/>
                <span className="max-w-[160px] truncate">{adminEmail}</span>
              </span>
            )}
            <button type="button" onClick={handleLogout}
              className="flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-[12px] font-semibold text-slate-600 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600">
              <LogOut size={13}/><span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8">

        {/* ── Page Title + Stats ── */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-[26px]">Contact Enquiries</h1>
            <p className="mt-0.5 text-[13px] text-slate-400">
              {loading ? 'Loading…' : `${filtered.length} of ${enquiries.length} enquiries${isDateFiltered ? ` · ${activeDateLabel}` : ''}`}
            </p>
          </div>
          {/* Stats row */}
          <div className="grid grid-cols-4 gap-2 sm:flex sm:gap-2.5">
            {[
              { label: 'Total',   value: enquiries.length,                                                                                                                          color: 'bg-slate-100 text-slate-700 border-slate-200' },
              { label: 'Month',   value: enquiries.filter(e=>{ const d=new Date(e.created_at),n=new Date(); return d.getMonth()===n.getMonth()&&d.getFullYear()===n.getFullYear(); }).length, color: 'bg-blue-50 text-blue-700 border-blue-200'   },
              { label: 'Bulk',    value: enquiries.filter(e=>e.business_type==='Bulk Buyer').length,                                                                                 color: 'bg-amber-50 text-amber-700 border-amber-200' },
              { label: 'Garment', value: enquiries.filter(e=>e.business_type==='Garment Manufacturer').length,                                                                       color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
            ].map(s => (
              <div key={s.label} className={`flex flex-col items-center justify-center rounded-xl border px-4 py-2.5 text-center ${s.color}`}>
                <p className="text-[10px] font-semibold uppercase tracking-widest opacity-70">{s.label}</p>
                <p className="text-xl font-bold sm:text-2xl">{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Search + Filter row ── */}
        <div className="mb-3 flex items-center gap-2.5">
          <div className="relative min-w-0 flex-1">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
            <input type="search" placeholder="Search name, email, company…" value={search} onChange={e=>setSearch(e.target.value)}
              className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-[13px] text-slate-700 shadow-sm outline-none placeholder:text-slate-400 focus:border-[hsl(var(--accent)/.6)] focus:ring-2 focus:ring-[hsl(var(--accent)/.12)] transition"/>
          </div>

          {/* Mobile: unified filter+sort button */}
          <button type="button" onClick={()=>setFilterOpen(true)}
            className={`relative flex h-10 items-center gap-1.5 rounded-xl border px-3.5 text-[12px] font-semibold shadow-sm transition sm:hidden ${
              activeFilterCount > 0
                ? 'border-[hsl(var(--accent)/.4)] bg-amber-50 text-amber-700'
                : 'border-slate-200 bg-white text-slate-600'
            }`}>
            <SlidersHorizontal size={14}/> Filter
            {activeFilterCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[hsl(var(--accent))] text-[9px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Desktop: sort buttons inline */}
          <div className="hidden gap-2 sm:flex">
            {([{key:'created_at',label:'Date'},{key:'full_name',label:'Name'},{key:'company',label:'Company'}] as {key:SortKey;label:string}[]).map(s=>(
              <button key={s.key} type="button" onClick={()=>toggleSort(s.key)}
                className={`flex h-10 items-center gap-1.5 rounded-xl border px-3.5 text-[12px] font-semibold shadow-sm transition ${
                  sortKey===s.key
                    ? 'border-[hsl(var(--accent)/.4)] bg-amber-50 text-amber-700'
                    : 'border-slate-200 bg-white text-slate-500 hover:text-slate-700'
                }`}>
                {s.label}
                {sortKey===s.key && (sortDir==='asc' ? <ChevronUp size={12}/> : <ChevronDown size={12}/>)}
              </button>
            ))}
          </div>
        </div>

        {/* ── Desktop date filter ── */}
        <div className="mb-4 hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:block">
          <div className="mb-3 flex items-center gap-2">
            <CalendarDays size={14} className="text-slate-400"/>
            <span className="text-[12px] font-semibold uppercase tracking-wider text-slate-500">Filter by Date</span>
            {isDateFiltered && (
              <button type="button" onClick={clearDate}
                className="ml-auto flex items-center gap-1 rounded-lg px-2 py-1 text-[12px] font-medium text-red-500 hover:bg-red-50 transition">
                <X size={11}/>Clear
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {DATE_PRESETS.map(p=>(
              <button key={p.key} type="button" onClick={()=>setDatePreset(p.key)}
                className={`rounded-xl border px-3.5 py-1.5 text-[12px] font-semibold transition ${
                  datePreset===p.key
                    ? 'border-[hsl(var(--accent)/.4)] bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300 hover:bg-white hover:text-slate-700'
                }`}>{p.label}
              </button>
            ))}
          </div>
          {datePreset==='custom' && (
            <div className="mt-3 flex flex-wrap items-end gap-3">
              <div>
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-slate-400">From</label>
                <input type="date" value={customFrom} max={customTo||toInputVal(new Date())} onChange={e=>setCustomFrom(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[13px] outline-none focus:border-[hsl(var(--accent)/.6)] focus:ring-2 focus:ring-[hsl(var(--accent)/.12)] transition"/>
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-slate-400">To</label>
                <input type="date" value={customTo} min={customFrom} max={toInputVal(new Date())} onChange={e=>setCustomTo(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[13px] outline-none focus:border-[hsl(var(--accent)/.6)] focus:ring-2 focus:ring-[hsl(var(--accent)/.12)] transition"/>
              </div>
              {(customFrom||customTo) && (
                <button type="button" onClick={()=>{setCustomFrom('');setCustomTo('');}}
                  className="flex items-center gap-1 pb-2 text-[12px] text-slate-400 hover:text-red-500 transition">
                  <X size={12}/>Reset
                </button>
              )}
            </div>
          )}
          {isDateFiltered && activeDateRange.from && (
            <p className="mt-3 rounded-lg bg-amber-50 border border-amber-100 px-3 py-1.5 text-[12px] text-amber-700">
              Showing&nbsp;
              <span className="font-semibold">
                {activeDateRange.from.toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}
                {activeDateRange.to && activeDateRange.to.toDateString()!==activeDateRange.from.toDateString()
                  ? ` → ${activeDateRange.to.toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}`
                  : ''}
              </span>
              &nbsp;·&nbsp;<span className="font-semibold">{filtered.length} results</span>
            </p>
          )}
        </div>

        {/* ── Select-all bar ── */}
        {!loading && filtered.length > 0 && (
          <div className="mb-3 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
            <div onClick={toggleSelectAll} className="flex cursor-pointer items-center gap-2.5">
              <div className={`flex h-4 w-4 items-center justify-center rounded border-2 transition ${
                allSel ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent))]'
                : someSel ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent)/.2)]'
                : 'border-slate-300'
              }`}>
                {allSel && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                {!allSel && someSel && <div className="h-1.5 w-1.5 rounded-sm bg-[hsl(var(--accent))]"/>}
              </div>
              <span className="text-[13px] font-medium text-slate-600">
                {allSel ? 'Deselect all' : `Select all (${filtered.length})`}
              </span>
            </div>
            {someSel && (
              <div className="ml-auto flex items-center gap-3">
                <span className="text-[12px] text-slate-400">{selected.size} selected</span>
                <button type="button" onClick={deleteSelected} disabled={deleting}
                  className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-1.5 text-[12px] font-semibold text-red-600 shadow-sm transition hover:bg-red-100 disabled:opacity-50">
                  <Trash2 size={13}/>{deleting ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Error ── */}
        {error && (
          <div className="mb-4 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-600 shadow-sm">
            {error}
            <button type="button" onClick={()=>setError('')} className="ml-3 rounded-lg p-1 hover:bg-red-100 transition">
              <X size={14}/>
            </button>
          </div>
        )}

        {/* ── Loading skeleton ── */}
        {loading && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-[200px] animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm"/>
            ))}
          </div>
        )}

        {/* ── Empty ── */}
        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
              <Inbox size={26} className="text-slate-300"/>
            </div>
            <p className="text-[15px] font-semibold text-slate-700">
              {search || isDateFiltered ? 'No matching enquiries' : 'No enquiries yet'}
            </p>
            <p className="mt-1.5 text-[13px] text-slate-400">
              {search || isDateFiltered ? 'Try adjusting your filters.' : 'Form submissions will appear here.'}
            </p>
            {isDateFiltered && (
              <button type="button" onClick={clearDate}
                className="mt-4 rounded-xl border border-[hsl(var(--accent)/.3)] bg-amber-50 px-5 py-2 text-[13px] font-semibold text-amber-700 transition hover:bg-amber-100">
                Clear date filter
              </button>
            )}
          </div>
        )}

        {/* ── List ── */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map(enquiry => (
              <EnquiryCard key={enquiry.id} enquiry={enquiry} selected={selected.has(enquiry.id)} onSelect={toggleSelect}/>
            ))}
          </div>
        )}
      </main>

      {/* ── Mobile filter+sort sheet ── */}
      <FilterSortSheet
        open={filterOpen} onClose={()=>setFilterOpen(false)}
        sortKey={sortKey} sortDir={sortDir} toggleSort={toggleSort}
        datePreset={datePreset} setDatePreset={setDatePreset}
        customFrom={customFrom} setCustomFrom={setCustomFrom}
        customTo={customTo} setCustomTo={setCustomTo}
        clearDate={clearDate}
      />
    </div>
  );
}
