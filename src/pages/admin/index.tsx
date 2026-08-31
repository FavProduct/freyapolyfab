import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { supabase } from '@/lib/supabase';
import {
  LogOut, Mail, Phone, Building2, MessageSquare,
  RefreshCw, ChevronDown, ChevronUp, Search, Inbox,
  User, X, SlidersHorizontal, ArrowUpDown, Trash2, CalendarDays,
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
    <span className={`inline-block max-w-full truncate rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide ${
      color==='blue' ? 'bg-[#0f3d5c1a] text-[#0f3d5c]' : 'bg-[hsl(var(--accent)/.13)] text-[hsl(var(--accent))]'
    }`}>{text}</span>
  );
}

// ─── Enquiry Card ─────────────────────────────────────────────────────────────

function EnquiryCard({ enquiry, selected, onSelect }: {
  enquiry: Enquiry; selected: boolean; onSelect: (id:string)=>void;
}) {
  return (
    <div className={`overflow-hidden rounded-lg border bg-[hsl(var(--card))] transition-all ${
      selected ? 'border-[hsl(var(--accent))] ring-1 ring-[hsl(var(--accent)/.25)]'
               : 'border-[hsl(var(--border))] hover:border-[hsl(var(--accent)/.35)] hover:shadow-sm'
    }`}>
      {/* ── top: checkbox + name + company ── */}
      <div className="flex items-center gap-2 border-b border-[hsl(var(--border))] px-3 py-2">
        {/* checkbox */}
        <div onClick={() => onSelect(enquiry.id)}
          className={`flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded border-2 transition ${
            selected ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent))]' : 'border-[hsl(var(--border))]'
          }`}>
          {selected && (
            <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
              <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
        <span className="text-sm font-semibold text-[hsl(var(--foreground))]">{enquiry.full_name}</span>
        <span className="flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))]">
          <Building2 size={11} className="shrink-0"/>{enquiry.company}
        </span>
        <span className="ml-auto text-[10px] text-[hsl(var(--muted-foreground)/.5)]">{formatDate(enquiry.created_at)}</span>
      </div>

      {/* ── body: left details | right message ── */}
      <div className="flex flex-col sm:flex-row">

        {/* Left */}
        <div className="min-w-0 flex-1 px-3 py-2.5">
          {/* badges */}
          <div className="flex flex-wrap gap-1 mb-2">
            <Badge text={enquiry.business_type} color="blue" />
            <Badge text={enquiry.requirement} color="accent" />
          </div>
          {/* contact */}
          <a href={`mailto:${enquiry.email}`} className="flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--accent))] mb-1">
            <Mail size={11} className="shrink-0 text-[hsl(var(--accent))]"/><span className="truncate">{enquiry.email}</span>
          </a>
          <a href={`tel:${enquiry.phone}`} className="flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--accent))]">
            <Phone size={11} className="shrink-0 text-[hsl(var(--accent))]"/>{enquiry.phone}
          </a>
          {/* actions */}
          <div className="mt-2.5 flex gap-1.5">
            <a href={`mailto:${enquiry.email}?subject=Re: ${encodeURIComponent(enquiry.requirement)} – Freya Poly Fab`}
              className="flex items-center gap-1 rounded-md bg-[hsl(var(--accent))] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[hsl(var(--accent-foreground))] hover:opacity-90">
              <Mail size={10}/> Reply
            </a>
            <a href={`tel:${enquiry.phone}`}
              className="flex items-center gap-1 rounded-md border border-[hsl(var(--border))] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[hsl(var(--foreground))] hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))]">
              <Phone size={10}/> Call
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-3 border-t border-[hsl(var(--border))] sm:mx-0 sm:border-t-0 sm:border-l" />

        {/* Right: message — visible on BOTH mobile and desktop */}
        <div className="min-w-0 flex-1 bg-[hsl(var(--background)/.45)] px-3 py-2.5">
          <p className="mb-1 flex items-center gap-1 text-[9px] font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
            <MessageSquare size={9}/> Message
          </p>
          <p className="line-clamp-4 whitespace-pre-wrap text-xs leading-relaxed text-[hsl(var(--foreground))]">
            {enquiry.message}
          </p>
        </div>

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
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40 backdrop-blur-sm">
      <div ref={ref} className="max-h-[88dvh] overflow-y-auto rounded-t-2xl border-t border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 pb-8 pt-5 shadow-2xl">
        {/* header */}
        <div className="mb-4 flex items-center justify-between">
          <p className="flex items-center gap-2 text-sm font-semibold text-[hsl(var(--foreground))]">
            <SlidersHorizontal size={14}/> Filters &amp; Sort
          </p>
          <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-[hsl(var(--muted-foreground))]"><X size={16}/></button>
        </div>

        {/* sort */}
        <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]"><ArrowUpDown size={12}/> Sort By</p>
        <div className="mb-5 grid grid-cols-3 gap-2">
          {([{key:'created_at',label:'Date'},{key:'full_name',label:'Name'},{key:'company',label:'Company'}] as {key:SortKey;label:string}[]).map(s=>(
            <button key={s.key} type="button" onClick={()=>toggleSort(s.key)}
              className={`flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-xs font-semibold transition ${sortKey===s.key?'border-[hsl(var(--accent))] bg-[hsl(var(--accent)/.1)] text-[hsl(var(--accent))]':'border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]'}`}>
              {s.label}
              {sortKey===s.key&&(sortDir==='asc'?<ChevronUp size={11}/>:<ChevronDown size={11}/>)}
            </button>
          ))}
        </div>

        {/* date */}
        <div className="mb-2 flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]"><CalendarDays size={12}/> Date Range</p>
          {datePreset!=='all'&&<button type="button" onClick={clearDate} className="flex items-center gap-1 text-xs text-red-500"><X size={11}/>Clear</button>}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {DATE_PRESETS.map(p=>(
            <button key={p.key} type="button" onClick={()=>setDatePreset(p.key)}
              className={`rounded-xl border py-2.5 text-xs font-semibold transition ${datePreset===p.key?'border-[hsl(var(--accent))] bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]':'border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]'}`}>
              {p.label}
            </button>
          ))}
        </div>
        {datePreset==='custom'&&(
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">From</label>
              <input type="date" value={customFrom} max={customTo||toInputVal(new Date())} onChange={e=>setCustomFrom(e.target.value)}
                className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm outline-none focus:border-[hsl(var(--accent))]"/>
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">To</label>
              <input type="date" value={customTo} min={customFrom} max={toInputVal(new Date())} onChange={e=>setCustomTo(e.target.value)}
                className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm outline-none focus:border-[hsl(var(--accent))]"/>
            </div>
          </div>
        )}

        <button type="button" onClick={onClose}
          className="mt-6 w-full rounded-xl bg-[hsl(var(--primary))] py-3 text-sm font-semibold text-[hsl(var(--primary-foreground))] active:scale-[.98]">
          Apply
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
    <div className="min-h-screen bg-[hsl(var(--background))]">

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b border-[hsl(var(--border))] bg-[hsl(var(--card)/.92)] backdrop-blur">
        <div className="mx-auto flex h-12 max-w-[1280px] items-center justify-between gap-3 px-4 sm:h-14 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <a href="/"><img src={logoPath} alt="Freya Poly Fab" className="h-8 w-auto object-contain"/></a>
            <span className="border-l border-[hsl(var(--border))] pl-2.5 text-[11px] font-bold uppercase tracking-widest text-[hsl(var(--accent))]">Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={fetchEnquiries} disabled={loading} aria-label="Refresh"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))] disabled:opacity-40">
              <RefreshCw size={14} className={loading?'animate-spin':''}/>
            </button>
            {adminEmail&&<span className="hidden items-center gap-1 text-xs text-[hsl(var(--muted-foreground))] sm:flex"><User size={12}/><span className="max-w-[140px] truncate">{adminEmail}</span></span>}
            <button type="button" onClick={handleLogout}
              className="flex h-8 items-center gap-1.5 rounded-lg border border-[hsl(var(--border))] px-2.5 text-[11px] font-semibold uppercase tracking-wide text-[hsl(var(--foreground))] hover:border-red-300 hover:text-red-500">
              <LogOut size={12}/><span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-4 py-4 sm:px-6 sm:py-5 lg:px-8">

        {/* ── Title ── */}
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-[hsl(var(--primary))] sm:text-xl">Contact Enquiries</h1>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">
              {loading?'Loading…':`${filtered.length} of ${enquiries.length} enquiries${isDateFiltered?` · ${activeDateLabel}`:''}`}
            </p>
          </div>
          {/* desktop stats */}
          <div className="hidden items-center gap-2 sm:flex">
            {[
              {label:'Total',   value:enquiries.length},
              {label:'Month',   value:enquiries.filter(e=>{ const d=new Date(e.created_at),n=new Date(); return d.getMonth()===n.getMonth()&&d.getFullYear()===n.getFullYear(); }).length},
              {label:'Bulk',    value:enquiries.filter(e=>e.business_type==='Bulk Buyer').length},
              {label:'Mfrs',    value:enquiries.filter(e=>e.business_type==='Garment Manufacturer').length},
            ].map(s=>(
              <div key={s.label} className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-1.5 text-center">
                <p className="text-[9px] font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">{s.label}</p>
                <p className="text-sm font-bold text-[hsl(var(--primary))]">{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* mobile stats */}
        <div className="mb-3 grid grid-cols-4 gap-2 sm:hidden">
          {[
            {label:'Total', value:enquiries.length},
            {label:'Month', value:enquiries.filter(e=>{ const d=new Date(e.created_at),n=new Date(); return d.getMonth()===n.getMonth()&&d.getFullYear()===n.getFullYear(); }).length},
            {label:'Bulk',  value:enquiries.filter(e=>e.business_type==='Bulk Buyer').length},
            {label:'Mfrs',  value:enquiries.filter(e=>e.business_type==='Garment Manufacturer').length},
          ].map(s=>(
            <div key={s.label} className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-2 py-2 text-center">
              <p className="text-[9px] font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">{s.label}</p>
              <p className="text-base font-bold text-[hsl(var(--primary))]">{s.value}</p>
            </div>
          ))}
        </div>

        {/* ── Search + Filter row ── */}
        <div className="mb-2 flex items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <Search size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]"/>
            <input type="search" placeholder="Search name, email, company…" value={search} onChange={e=>setSearch(e.target.value)}
              className="h-9 w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] pl-8 pr-3 text-sm outline-none placeholder:text-[hsl(var(--muted-foreground)/.5)] focus:border-[hsl(var(--accent))] focus:ring-2 focus:ring-[hsl(var(--accent)/.15)]"/>
          </div>

          {/* Mobile: unified filter+sort button */}
          <button type="button" onClick={()=>setFilterOpen(true)}
            className={`relative flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition sm:hidden ${
              activeFilterCount>0 ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent)/.08)] text-[hsl(var(--accent))]' : 'border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]'
            }`}>
            <SlidersHorizontal size={13}/> Filter
            {activeFilterCount>0&&(
              <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[hsl(var(--accent))] text-[9px] font-bold text-white">{activeFilterCount}</span>
            )}
          </button>

          {/* Desktop: sort buttons inline */}
          <div className="hidden gap-1.5 sm:flex">
            {([{key:'created_at',label:'Date'},{key:'full_name',label:'Name'},{key:'company',label:'Company'}] as {key:SortKey;label:string}[]).map(s=>(
              <button key={s.key} type="button" onClick={()=>toggleSort(s.key)}
                className={`flex h-9 items-center gap-1 rounded-lg border px-3 text-[11px] font-semibold uppercase tracking-wide transition ${
                  sortKey===s.key ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent)/.08)] text-[hsl(var(--accent))]' : 'border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
                }`}>
                {s.label}{sortKey===s.key&&(sortDir==='asc'?<ChevronUp size={11}/>:<ChevronDown size={11}/>)}
              </button>
            ))}
          </div>
        </div>

        {/* ── Desktop date filter ── */}
        <div className="mb-3 hidden rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-3 sm:block">
          <div className="mb-2.5 flex items-center gap-2">
            <CalendarDays size={13} className="text-[hsl(var(--muted-foreground))]"/>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Filter by Date</span>
            {isDateFiltered&&<button type="button" onClick={clearDate} className="ml-auto flex items-center gap-1 text-xs text-red-500 hover:underline"><X size={11}/>Clear</button>}
          </div>
            <div className="flex flex-wrap gap-1.5">
            {DATE_PRESETS.map(p=>(
              <button key={p.key} type="button" onClick={()=>setDatePreset(p.key)}
                className={`whitespace-nowrap rounded-lg border px-3 py-1 text-[11px] font-semibold transition ${
                  datePreset===p.key ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]'
                                     : 'border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--accent)/.4)] hover:text-[hsl(var(--foreground))]'
                }`}>{p.label}</button>
            ))}
          </div>
          {datePreset==='custom'&&(
            <div className="mt-2.5 flex flex-wrap items-end gap-3">
              <div>
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">From</label>
                <input type="date" value={customFrom} max={customTo||toInputVal(new Date())} onChange={e=>setCustomFrom(e.target.value)}
                  className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-1.5 text-sm outline-none focus:border-[hsl(var(--accent))]"/>
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">To</label>
                <input type="date" value={customTo} min={customFrom} max={toInputVal(new Date())} onChange={e=>setCustomTo(e.target.value)}
                  className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-1.5 text-sm outline-none focus:border-[hsl(var(--accent))]"/>
              </div>
              {(customFrom||customTo)&&<button type="button" onClick={()=>{setCustomFrom('');setCustomTo('');}} className="flex items-center gap-1 pb-1.5 text-xs text-[hsl(var(--muted-foreground))] hover:text-red-500"><X size={12}/>Reset</button>}
            </div>
          )}
          {isDateFiltered&&activeDateRange.from&&(
            <p className="mt-2 text-[11px] text-[hsl(var(--muted-foreground))]">
              Showing: <span className="font-medium text-[hsl(var(--foreground))]">
                {activeDateRange.from.toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}
                {activeDateRange.to&&activeDateRange.to.toDateString()!==activeDateRange.from.toDateString()?` → ${activeDateRange.to.toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}` :''}
              </span>
              <span className="ml-1.5 text-[hsl(var(--accent))]">({filtered.length} results)</span>
            </p>
          )}
        </div>

        {/* ── Select-all bar ── */}
        {!loading&&filtered.length>0&&(
          <div className="mb-2 flex items-center gap-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2">
            <div onClick={toggleSelectAll} className="flex cursor-pointer items-center gap-2">
              <div className={`flex h-4 w-4 items-center justify-center rounded border-2 transition ${
                allSel ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent))]'
                : someSel ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent)/.2)]'
                : 'border-[hsl(var(--border))]'
              }`}>
                {allSel&&<svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                {!allSel&&someSel&&<div className="h-1.5 w-1.5 rounded-sm bg-[hsl(var(--accent))]"/>}
              </div>
              <span className="text-xs font-medium text-[hsl(var(--foreground))]">
                {allSel?'Deselect all':`Select all (${filtered.length})`}
              </span>
            </div>
            {someSel&&(
              <div className="ml-auto flex items-center gap-2">
                <span className="text-xs text-[hsl(var(--muted-foreground))]">{selected.size} selected</span>
                <button type="button" onClick={deleteSelected} disabled={deleting}
                  className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-[11px] font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50">
                  <Trash2 size={12}/>{deleting?'Deleting…':'Delete'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Error ── */}
        {error&&(
          <div className="mb-3 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">
            {error}<button type="button" onClick={()=>setError('')}><X size={14}/></button>
          </div>
        )}

        {/* ── Loading skeleton ── */}
        {loading&&(
          <div className="space-y-2">
            {[1,2,3,4].map(i=><div key={i} className="h-[100px] animate-pulse rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))]"/>)}
          </div>
        )}

        {/* ── Empty ── */}
        {!loading&&!error&&filtered.length===0&&(
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[hsl(var(--secondary))]">
              <Inbox size={24} className="text-[hsl(var(--muted-foreground)/.4)]"/>
            </div>
            <p className="text-sm font-semibold text-[hsl(var(--foreground))]">{search||isDateFiltered?'No matching enquiries':'No enquiries yet'}</p>
            <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">{search||isDateFiltered?'Try adjusting your filters.':'Form submissions will appear here.'}</p>
            {isDateFiltered&&<button type="button" onClick={clearDate} className="mt-3 rounded-lg border border-[hsl(var(--accent)/.4)] px-4 py-2 text-xs font-semibold text-[hsl(var(--accent))] hover:bg-[hsl(var(--accent)/.08)]">Clear date filter</button>}
          </div>
        )}

        {/* ── List ── */}
        {!loading&&filtered.length>0&&(
          <div className="space-y-2">
            {filtered.map(enquiry=>(
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
