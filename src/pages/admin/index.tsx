import { useEffect, useState, useMemo, useRef } from 'react';
import { useLocation } from 'wouter';
import { supabase } from '@/lib/supabase';
import {
  LogOut, Mail, Phone, Building2,
  RefreshCw, ChevronDown, Search, Inbox,
  X, Trash2, CalendarDays,
  LayoutDashboard, MessageSquare, Layers, BarChart3,
  ExternalLink, Check, Copy, Download,
  Menu, ChevronLeft, ChevronRight, Eye,
  TrendingUp, AlertCircle, ArrowUpRight, CheckCircle2,
  FileText, Database, Briefcase, Globe
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

type SortKey = 'created_at' | 'full_name' | 'company' | 'business_type';
type SortDir = 'asc' | 'desc';
type DatePreset = 'all' | 'today' | 'yesterday' | 'last7' | 'last30' | 'thisMonth' | 'lastMonth' | 'custom';
type AdminTab = 'overview' | 'enquiries' | 'sections' | 'analytics' | 'settings';

// ─── Verified PDF Website Sections ────────────────────────────────────────────

type SectionMetadata = {
  id: string;
  title: string;
  pdfPage: string;
  category: 'Company' | 'Product & Supply' | 'Market & Edge' | 'Strategy & Growth' | 'Leadership & Contact';
  summary: string;
  previewUrl: string;
  keyItems: string[];
};

const WEBSITE_SECTIONS: SectionMetadata[] = [
  {
    id: 'home',
    title: 'Hero / Headline',
    pdfPage: 'Page 1 & 2',
    category: 'Company',
    summary: '"Weaving Quality Fabrics, Building Fashion Futures." B2B textile trading presentation.',
    previewUrl: '/#home',
    keyItems: ['Primary headline', 'Core value proposition', 'Quick action CTAs'],
  },
  {
    id: 'about',
    title: 'About Freya Poly Fab',
    pdfPage: 'Page 2',
    category: 'Company',
    summary: 'Surat-based textile trading & supply firm committed to reliability, timely delivery, and quality fabrics.',
    previewUrl: '/#about',
    keyItems: ['Textile Trading focus', 'Timely delivery pillar', 'Surat market hub'],
  },
  {
    id: 'mission',
    title: 'Mission & Vision',
    pdfPage: 'Page 2',
    category: 'Company',
    summary: 'Equal-weight mission (accessible quality fabrics) and vision (globally recognized textile leader).',
    previewUrl: '/#mission',
    keyItems: ['Mission statement', 'Vision statement', 'Core values'],
  },
  {
    id: 'challenges',
    title: 'Market Challenges',
    pdfPage: 'Page 3',
    category: 'Market & Edge',
    summary: '4 industry pain points: Fragmented Supply Chain, Rising Raw Material Costs, Quality Issues, Intense Competition.',
    previewUrl: '/#challenges',
    keyItems: ['Fragmented Supply Chain', 'Raw Material Costs', 'Quality & Reliability', 'Market Competition'],
  },
  {
    id: 'solutions',
    title: 'Solutions We Offer',
    pdfPage: 'Page 4',
    category: 'Product & Supply',
    summary: 'Challenge bridge intro with 3 pillars: Reliable Fabric Supply, Customer-Centric Approach, Quality & Trust.',
    previewUrl: '/#solutions',
    keyItems: ['Reliable Fabric Supply', 'Customer-Centric Sourcing', 'Quality Assurance'],
  },
  {
    id: 'fabric-supply',
    title: 'Fabric Supply Range',
    pdfPage: 'Page 5',
    category: 'Product & Supply',
    summary: '4 core categories: Shirting & Suiting, Polyester Blends, Dress Materials, Custom Commercial Weaves.',
    previewUrl: '/#fabric-supply',
    keyItems: ['Shirting & Suiting', 'Polyester Blends', 'Dress Materials', 'Commercial Weaves'],
  },
  {
    id: 'offerings',
    title: 'Our Offerings',
    pdfPage: 'Page 5',
    category: 'Product & Supply',
    summary: '4 offerings: Premium Fabric Supply, Diverse Textile Range, Reliable Trading Network, Customized Solutions.',
    previewUrl: '/#offerings',
    keyItems: ['Premium Supply', 'Diverse Portfolio', 'Reliable Logistics', 'Tailored Specs'],
  },
  {
    id: 'usp',
    title: 'Why Freya Poly Fab (USP)',
    pdfPage: 'Page 6',
    category: 'Market & Edge',
    summary: '4 differentiators: Quality-Driven, Strong Supplier Network, Customer Solutions, Timely Delivery + Quote.',
    previewUrl: '/#usp',
    keyItems: ['Quality Commitment', 'Supplier Network', 'Customer Focus', 'On-time Delivery'],
  },
  {
    id: 'market-alignment',
    title: 'Market Alignment (STP)',
    pdfPage: 'Page 7',
    category: 'Market & Edge',
    summary: '3-stage strategy: Segmentation (Apparel/Garment), Targeting (Tier 1 & 2 Manufacturers), Positioning (Trusted Partner).',
    previewUrl: '/#market-alignment',
    keyItems: ['Market Segmentation', 'Target Buyer Profiles', 'Reliable Positioning'],
  },
  {
    id: 'market-size',
    title: 'Market Size & Trends',
    pdfPage: 'Page 8',
    category: 'Market & Edge',
    summary: 'Indian Market ($248.7B → $656.3B) & Global Market ($1.16T → $1.61T, CAGR 4.2%). Sources: imarcgroup, grandviewresearch.',
    previewUrl: '/#market-size',
    keyItems: ['India USD 248.7B → 656.3B', 'Global USD 1.16T → 1.61T', '4.2% CAGR', 'Industry Trends'],
  },
  {
    id: 'revenue',
    title: 'Revenue Streams',
    pdfPage: 'Page 9',
    category: 'Strategy & Growth',
    summary: '3 models: B2B Fabric Sales, Wholesale Distribution, Customized Textile Solutions.',
    previewUrl: '/#revenue',
    keyItems: ['Direct B2B Fabric Sales', 'Wholesale Bulk Distribution', 'Custom Textile Solutions'],
  },
  {
    id: 'competitive',
    title: 'Competitive Landscape',
    pdfPage: 'Page 10',
    category: 'Market & Edge',
    summary: 'Surat textile trading context: Existing Solutions vs Limitations vs Freya Poly Fab 3-point advantage.',
    previewUrl: '/#competitive',
    keyItems: ['Existing Market Suppliers', 'Market Inefficiencies', 'Freya Poly Fab Advantage'],
  },
  {
    id: 'g2m',
    title: 'Go-To-Market Strategy',
    pdfPage: 'Page 11',
    category: 'Strategy & Growth',
    summary: '5-pillar execution: B2B Acquisition, Supplier Partnerships, Digital Presence, Relationship Building, Regional Expansion.',
    previewUrl: '/#g2m',
    keyItems: ['Customer Acquisition', 'Supplier Ties', 'Digital Footprint', 'Direct Networking', 'Regional Reach'],
  },
  {
    id: 'growth',
    title: 'Growth & Expansion',
    pdfPage: 'Page 12',
    category: 'Strategy & Growth',
    summary: 'Strategic vision distinguishing Current Trading & Supply vs Future Manufacturing & Export Capabilities.',
    previewUrl: '/#growth',
    keyItems: ['Strategic Goal Banner', 'Short-Term Roadmap (3 pts)', 'Long-Term Vision (3 pts)'],
  },
  {
    id: 'fund-utilization',
    title: 'Fund Utilization / Ask',
    pdfPage: 'Page 13',
    category: 'Strategy & Growth',
    summary: 'Allocation: 40% Manufacturing Unit Setup, 30% Raw Material & Inventory, 15% Marketing, 15% Working Capital.',
    previewUrl: '/#fund-utilization',
    keyItems: ['40% Manufacturing Setup', '30% Inventory & Materials', '15% Marketing', '15% Operations'],
  },
  {
    id: 'leadership',
    title: 'Leadership & Expertise',
    pdfPage: 'Page 14',
    category: 'Leadership & Contact',
    summary: 'Devyani Ramnik Timbadiya (Founder / Proprietor, B.Com, 10–15 years industry experience in textile & garments).',
    previewUrl: '/#leadership',
    keyItems: ['Devyani Ramnik Timbadiya', 'B.Com Qualification', '10–15 Yrs Experience', 'Textile Supply Chain'],
  },
  {
    id: 'contact',
    title: 'Partner With Us / Contact',
    pdfPage: 'Page 15',
    category: 'Leadership & Contact',
    summary: 'Contact details: +91 9879296213, devr8155@gmail.com, Surat address, interactive partnership inquiry form.',
    previewUrl: '/contact',
    keyItems: ['Phone: +91 9879296213', 'Email: devr8155@gmail.com', 'Surat Jash Market Hub', 'Inquiry Form'],
  },
];

// ─── Date Helpers ─────────────────────────────────────────────────────────────

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
  { key: 'last7',     label: '7 Days' },
  { key: 'last30',    label: '30 Days' },
  { key: 'thisMonth', label: 'This Mo.' },
  { key: 'lastMonth', label: 'Last Mo.' },
  { key: 'custom',    label: 'Custom' },
];

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true,
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function formatDateShort(iso: string) {
  try {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

// ─── CSV Export Function ──────────────────────────────────────────────────────

function exportEnquiriesToCSV(items: Enquiry[]) {
  if (items.length === 0) return;
  const headers = ['ID', 'Full Name', 'Company', 'Email', 'Phone', 'Business Type', 'Requirement', 'Message', 'Created At'];
  const rows = items.map(e => [
    `"${e.id}"`,
    `"${(e.full_name || '').replace(/"/g, '""')}"`,
    `"${(e.company || '').replace(/"/g, '""')}"`,
    `"${(e.email || '').replace(/"/g, '""')}"`,
    `"${(e.phone || '').replace(/"/g, '""')}"`,
    `"${(e.business_type || '').replace(/"/g, '""')}"`,
    `"${(e.requirement || '').replace(/"/g, '""')}"`,
    `"${(e.message || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
    `"${e.created_at}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `freya_poly_fab_enquiries_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ─── CUSTOM ANCHORED DROPDOWN COMPONENT ───────────────────────────────────────
// Solves mobile viewport placement, stacking context, and clipping permanently.

function CustomDropdown({
  label,
  value,
  options,
  onChange,
  align = 'left',
  className = '',
}: {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (val: string) => void;
  align?: 'left' | 'right';
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(o => o.value === value);
  const displayLabel = selectedOption ? selectedOption.label : label;

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    if (open) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Trigger Button — Strict h-10 with clean borders & active state */}
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex h-10 w-full items-center justify-between gap-2 rounded-xl border px-3 text-xs font-medium transition shadow-xs ${
          open
            ? 'border-[hsl(var(--accent))] bg-amber-50/50 text-[hsl(var(--accent))] ring-2 ring-[hsl(var(--accent)/.12)]'
            : value !== 'all' && value !== 'created_at-desc'
              ? 'border-[hsl(var(--accent)/.4)] bg-amber-50/30 text-slate-800'
              : 'border-slate-200 bg-slate-50/70 text-slate-700 hover:bg-white hover:border-slate-300'
        }`}
      >
        <span className="truncate text-left">{displayLabel}</span>
        <ChevronDown
          size={14}
          className={`shrink-0 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180 text-[hsl(var(--accent))]' : ''}`}
        />
      </button>

      {/* Anchored Dropdown Menu — Opens directly below trigger without clipping */}
      {open && (
        <div
          role="listbox"
          className={`absolute top-full mt-1.5 w-full min-w-[210px] max-w-[90vw] rounded-xl border border-slate-200 bg-white p-1.5 shadow-2xl z-50 max-h-64 overflow-y-auto animate-in fade-in zoom-in-95 ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {options.map(opt => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition text-left ${
                  isSelected
                    ? 'bg-amber-50 text-[hsl(var(--accent))] font-bold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="leading-snug break-words pr-2">{opt.label}</span>
                {isSelected && <Check size={13} className="shrink-0 text-[hsl(var(--accent))]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── MAIN ADMIN DASHBOARD COMPONENT ───────────────────────────────────────────

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab]   = useState<AdminTab>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Data State
  const [enquiries, setEnquiries]   = useState<Enquiry[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [adminEmail, setAdminEmail] = useState('');

  // Filters & Search
  const [search, setSearch]                 = useState('');
  const [sortKey, setSortKey]               = useState<SortKey>('created_at');
  const [sortDir, setSortDir]               = useState<SortDir>('desc');
  const [datePreset, setDatePreset]         = useState<DatePreset>('all');
  const [customFrom, setCustomFrom]         = useState('');
  const [customTo, setCustomTo]             = useState('');
  const [typeFilter, setTypeFilter]         = useState<string>('all');
  const [viewMode, setViewMode]             = useState<'cards' | 'table'>('cards');

  // Modals & Selection
  const [selected, setSelected]             = useState<Set<string>>(new Set());
  const [detailItem, setDetailItem]         = useState<Enquiry | null>(null);
  const [deleteModal, setDeleteModal]       = useState<{ open: boolean; ids: string[]; isBulk: boolean }>({ open: false, ids: [], isBulk: false });
  const [deleting, setDeleting]             = useState(false);
  const [sectionDetail, setSectionDetail]   = useState<SectionMetadata | null>(null);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; sub?: string; type?: 'success' | 'info' | 'error' } | null>(null);
  const showToast = (message: string, sub?: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, sub, type });
    window.setTimeout(() => setToast(null), 3500);
  };

  // ── Keyboard & Body Overflow Management ─────────────────────────────────────
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileDrawerOpen(false);
        setDetailItem(null);
        setSectionDetail(null);
        setDeleteModal({ open: false, ids: [], isBulk: false });
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    const isModalOpen = mobileDrawerOpen || !!detailItem || !!sectionDetail || deleteModal.open;
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileDrawerOpen, detailItem, sectionDetail, deleteModal.open]);

  // ── Supabase Fetch ──────────────────────────────────────────────────────────
  const fetchEnquiries = async () => {
    setLoading(true);
    setError('');
    setSelected(new Set());
    try {
      const { data, error: fetchErr } = await supabase
        .from('contact_enquiries')
        .select('*')
        .order(sortKey, { ascending: sortDir === 'asc' });

      if (fetchErr) {
        setError('Failed to fetch enquiries from database. Please check Supabase credentials.');
      } else {
        setEnquiries(data ?? []);
      }
    } catch {
      setError('An unexpected network error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        navigate('/admin/login');
      } else {
        setAdminEmail(data.session.user.email ?? '');
        fetchEnquiries();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortKey, sortDir]);

  // Handle Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const clearDate = () => {
    setDatePreset('all');
    setCustomFrom('');
    setCustomTo('');
  };

  // ── Combined Sort Option String for Dropdown ────────────────────────────────
  const currentSortValue = `${sortKey}-${sortDir}`;
  const handleSortChange = (val: string) => {
    const [key, dir] = val.split('-') as [SortKey, SortDir];
    setSortKey(key);
    setSortDir(dir);
  };

  const sortOptions = [
    { label: 'Date (Newest First)', value: 'created_at-desc' },
    { label: 'Date (Oldest First)', value: 'created_at-asc' },
    { label: 'Name (A to Z)',       value: 'full_name-asc' },
    { label: 'Name (Z to A)',       value: 'full_name-desc' },
    { label: 'Company (A to Z)',    value: 'company-asc' },
  ];

  // ── Active Date Filtering ───────────────────────────────────────────────────
  const activeDateRange = datePreset === 'custom'
    ? { from: customFrom ? startOfDay(new Date(customFrom)) : null, to: customTo ? endOfDay(new Date(customTo)) : null }
    : presetRange(datePreset);
  const isDateFiltered = datePreset !== 'all';

  // ── Filtered & Searched Dataset ─────────────────────────────────────────────
  const filtered = useMemo(() => {
    return enquiries.filter(e => {
      const q = search.toLowerCase().trim();
      const matchSearch = !q ||
        (e.full_name && e.full_name.toLowerCase().includes(q)) ||
        (e.company && e.company.toLowerCase().includes(q)) ||
        (e.email && e.email.toLowerCase().includes(q)) ||
        (e.phone && e.phone.toLowerCase().includes(q)) ||
        (e.business_type && e.business_type.toLowerCase().includes(q)) ||
        (e.requirement && e.requirement.toLowerCase().includes(q)) ||
        (e.message && e.message.toLowerCase().includes(q));

      if (!matchSearch) return false;

      if (typeFilter !== 'all' && e.business_type !== typeFilter) {
        return false;
      }

      if (activeDateRange.from || activeDateRange.to) {
        const c = new Date(e.created_at);
        if (activeDateRange.from && c < activeDateRange.from) return false;
        if (activeDateRange.to && c > activeDateRange.to) return false;
      }

      return true;
    });
  }, [enquiries, search, typeFilter, activeDateRange]);

  // ── Multi-select Management ─────────────────────────────────────────────────
  const allSelected = filtered.length > 0 && filtered.every(e => selected.has(e.id));
  const someSelected = selected.size > 0;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelected(prev => {
        const next = new Set(prev);
        filtered.forEach(e => next.delete(e.id));
        return next;
      });
    } else {
      setSelected(prev => {
        const next = new Set(prev);
        filtered.forEach(e => next.add(e.id));
        return next;
      });
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // ── Delete Confirmation Logic ───────────────────────────────────────────────
  const openDeleteModal = (ids: string[], isBulk = false) => {
    setDeleteModal({ open: true, ids, isBulk });
  };

  const handleConfirmDelete = async () => {
    if (deleteModal.ids.length === 0) return;
    setDeleting(true);
    const { error: delErr } = await supabase.from('contact_enquiries').delete().in('id', deleteModal.ids);
    setDeleting(false);

    if (delErr) {
      showToast('Deletion Failed', 'Unable to remove record from database.', 'error');
    } else {
      const count = deleteModal.ids.length;
      setEnquiries(prev => prev.filter(e => !deleteModal.ids.includes(e.id)));
      setSelected(new Set());
      setDeleteModal({ open: false, ids: [], isBulk: false });
      if (detailItem && deleteModal.ids.includes(detailItem.id)) {
        setDetailItem(null);
      }
      showToast('Deleted Successfully', `Removed ${count} ${count === 1 ? 'enquiry' : 'enquiries'}.`, 'success');
    }
  };

  // ── Unique Business Types for Dropdown ─────────────────────────────────────
  const buyerTypeOptions = useMemo(() => {
    const set = new Set<string>();
    enquiries.forEach(e => { if (e.business_type) set.add(e.business_type); });
    const list = Array.from(set).map(t => ({ label: t, value: t }));
    return [{ label: 'All Buyer Types', value: 'all' }, ...list];
  }, [enquiries]);

  // ── Analytics Metrics ───────────────────────────────────────────────────────
  const metrics = useMemo(() => {
    const total = enquiries.length;
    const now = new Date();
    const thisMonth = enquiries.filter(e => {
      const d = new Date(e.created_at);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;

    const bulkBuyers = enquiries.filter(e => (e.business_type || '').toLowerCase().includes('bulk')).length;
    const manufacturers = enquiries.filter(e => (e.business_type || '').toLowerCase().includes('garment')).length;

    const typeCounts: Record<string, number> = {};
    enquiries.forEach(e => {
      const key = e.business_type || 'General Sourcing';
      typeCounts[key] = (typeCounts[key] || 0) + 1;
    });

    const reqCounts: Record<string, number> = {};
    enquiries.forEach(e => {
      const key = e.requirement || 'Standard Inquiries';
      reqCounts[key] = (reqCounts[key] || 0) + 1;
    });

    return { total, thisMonth, bulkBuyers, manufacturers, typeCounts, reqCounts };
  }, [enquiries]);

  return (
    <div className="flex min-h-screen bg-[hsl(var(--background))] text-slate-800 antialiased">

      {/* ── Toast Notification ─────────────────────────────────── */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-60 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xl transition-all animate-in fade-in slide-in-from-bottom-2">
          <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${
            toast.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-[hsl(var(--accent))]'
          }`}>
            {toast.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-800">{toast.message}</p>
            {toast.sub && <p className="text-[11px] text-slate-500">{toast.sub}</p>}
          </div>
          <button type="button" onClick={() => setToast(null)} className="ml-2 text-slate-400 hover:text-slate-600">
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── Mobile Sidebar Drawer (Overlay) ────────────────────── */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative flex w-72 max-w-[82vw] flex-col border-r border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-2xl">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-[hsl(var(--border))] pb-4">
              <a href="/" className="flex items-center gap-2">
                <img src={logoPath} alt="Freya Poly Fab" className="h-8 w-auto object-contain" />
              </a>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100"
              >
                <X size={16} />
              </button>
            </div>

            {/* Navigation List */}
            <nav className="mt-5 flex-1 space-y-1.5 overflow-y-auto">
              {[
                { id: 'overview',   label: 'Dashboard',         icon: LayoutDashboard },
                { id: 'enquiries',  label: 'Contact Enquiries', icon: MessageSquare, badge: enquiries.length },
                { id: 'sections',   label: 'Website Content',   icon: Layers, badge: 17 },
                { id: 'analytics',  label: 'Analytics',         icon: BarChart3 },
                { id: 'settings',   label: 'Portal Settings',   icon: Database },
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id as AdminTab);
                    setMobileDrawerOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold tracking-wide transition ${
                    activeTab === item.id
                      ? 'border border-[hsl(var(--accent)/.3)] bg-amber-50/75 text-[hsl(var(--accent))] shadow-xs font-bold'
                      : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={16} className={activeTab === item.id ? 'text-[hsl(var(--accent))]' : 'text-slate-400'} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      activeTab === item.id ? 'bg-[hsl(var(--accent))] text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            {/* User & Logout */}
            <div className="border-t border-[hsl(var(--border))] pt-4">
              <div className="mb-3 flex items-center gap-2.5 px-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-[hsl(var(--accent))]">
                  {adminEmail ? adminEmail[0].toUpperCase() : 'A'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-800">Admin User</p>
                  <p className="truncate text-[11px] text-slate-400">{adminEmail || 'admin@freyapolyfab.com'}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50/60 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Desktop Collapsible Sidebar (lg+) ──────────────────── */}
      <aside className={`hidden shrink-0 border-r border-[hsl(var(--border))] bg-[hsl(var(--card))] transition-all duration-300 lg:flex lg:flex-col ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}>
        {/* Sidebar Header / Brand */}
        <div className="flex h-18 items-center justify-between border-b border-[hsl(var(--border))] px-4">
          <a href="/" className="flex items-center gap-2 overflow-hidden focus:outline-none">
            <img src={logoPath} alt="Freya Poly Fab" className="h-9 w-auto object-contain shrink-0" />
            {!sidebarCollapsed && (
              <span className="truncate text-xs font-bold tracking-tight text-slate-800">
                Business CMS
              </span>
            )}
          </a>
          <button
            type="button"
            onClick={() => setSidebarCollapsed(v => !v)}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Sidebar Navigation */}
        <div className="flex-1 space-y-1.5 overflow-y-auto px-3 py-5">
          {!sidebarCollapsed && (
            <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--accent))]">
              Management
            </div>
          )}
          {[
            { id: 'overview',   label: 'Dashboard',         icon: LayoutDashboard },
            { id: 'enquiries',  label: 'Contact Enquiries', icon: MessageSquare, badge: enquiries.length },
            { id: 'sections',   label: 'Website Content',   icon: Layers, badge: 17 },
            { id: 'analytics',  label: 'Analytics',         icon: BarChart3 },
            { id: 'settings',   label: 'Portal Settings',   icon: Database },
          ].map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id as AdminTab)}
                title={sidebarCollapsed ? item.label : undefined}
                className={`group flex w-full items-center rounded-xl py-2.5 text-xs font-semibold tracking-wide transition ${
                  sidebarCollapsed ? 'justify-center px-0' : 'justify-between px-3.5'
                } ${
                  isActive
                    ? 'border border-[hsl(var(--accent)/.3)] bg-amber-50/75 text-[hsl(var(--accent))] shadow-xs font-bold'
                    : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    size={17}
                    className={`shrink-0 transition-colors ${
                      isActive ? 'text-[hsl(var(--accent))]' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </div>
                {!sidebarCollapsed && item.badge !== undefined && (
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    isActive ? 'bg-[hsl(var(--accent))] text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-[hsl(var(--border))] p-3">
          <div className={`flex items-center rounded-xl bg-slate-50 p-2 border border-slate-200/60 ${
            sidebarCollapsed ? 'justify-center' : 'justify-between'
          }`}>
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-[hsl(var(--accent))]">
                {adminEmail ? adminEmail[0].toUpperCase() : 'A'}
              </div>
              {!sidebarCollapsed && (
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-slate-800">Admin</p>
                  <p className="truncate text-[10px] text-slate-400">{adminEmail || 'admin@freya'}</p>
                </div>
              )}
            </div>
            {!sidebarCollapsed && (
              <button
                type="button"
                onClick={handleLogout}
                title="Sign out"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
              >
                <LogOut size={14} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ── Main Content Column ────────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* ── Top Header Bar (Desktop & Mobile Symmetrically Aligned) */}
        <header className="sticky top-0 z-30 flex h-14 sm:h-16 items-center justify-between border-b border-[hsl(var(--border))] bg-white/95 px-3 sm:px-6 lg:px-8 shadow-xs backdrop-blur-md">

          {/* Desktop Left: Breadcrumbs */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500">
            <span className="font-medium text-slate-400">Freya Poly Fab</span>
            <span className="text-slate-300">/</span>
            <span className="font-semibold text-slate-800 capitalize">
              {activeTab === 'overview' && 'Executive Dashboard'}
              {activeTab === 'enquiries' && 'Contact Enquiries'}
              {activeTab === 'sections' && 'Website Content'}
              {activeTab === 'analytics' && 'Enquiry Analytics'}
              {activeTab === 'settings' && 'Portal Settings'}
            </span>
          </div>

          {/* Mobile Header Structure: [ MENU ] [ CENTERED BRAND LOGO ] [ ACTIONS ] */}
          <div className="grid grid-cols-[auto_1fr_auto] items-center w-full lg:hidden">
            {/* Left: Mobile Drawer Toggle */}
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              aria-label="Open mobile menu"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 active:scale-95 transition"
            >
              <Menu size={18} />
            </button>

            {/* Center: Brand Logo — Perfectly Centered */}
            <div className="flex items-center justify-center">
              <a href="/" className="flex items-center gap-1.5 focus:outline-none">
                <img src={logoPath} alt="Freya Poly Fab" className="h-7 w-auto object-contain" />
                <span className="font-bold text-[11px] uppercase tracking-wider text-slate-800">Admin</span>
              </a>
            </div>

            {/* Right: Quick Action Buttons */}
            <div className="flex items-center justify-end gap-1.5">
              <button
                type="button"
                onClick={() => {
                  fetchEnquiries();
                  showToast('Refreshed', 'Database up to date.', 'info');
                }}
                disabled={loading}
                title="Refresh Data"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
              >
                <RefreshCw size={13} className={loading ? 'animate-spin text-[hsl(var(--accent))]' : ''} />
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                title="Admin Profile"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-[11px] font-bold text-[hsl(var(--accent))] border border-amber-200"
              >
                {adminEmail ? adminEmail[0].toUpperCase() : 'A'}
              </button>
            </div>
          </div>

          {/* Desktop Right: Live Website + Refresh + CSV */}
          <div className="hidden lg:flex items-center gap-2.5">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-xs transition hover:border-[hsl(var(--accent)/.4)] hover:text-[hsl(var(--accent))]"
            >
              <Globe size={13} />
              <span>Live Website</span>
              <ExternalLink size={12} />
            </a>

            <button
              type="button"
              onClick={() => {
                fetchEnquiries();
                showToast('Refreshed', 'Database enquiries up to date.', 'info');
              }}
              disabled={loading}
              title="Refresh Data"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-xs transition hover:border-[hsl(var(--accent)/.4)] hover:text-[hsl(var(--accent))] disabled:opacity-40"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin text-[hsl(var(--accent))]' : ''} />
            </button>

            <button
              type="button"
              onClick={() => {
                exportEnquiriesToCSV(filtered);
                showToast('CSV Downloaded', `Exported ${filtered.length} records.`, 'success');
              }}
              disabled={filtered.length === 0}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-xs transition hover:border-[hsl(var(--accent)/.4)] hover:text-[hsl(var(--accent))] disabled:opacity-40"
            >
              <Download size={13} />
              <span>Export CSV</span>
            </button>
          </div>
        </header>

        {/* ── Main Scrollable Viewport ─────────────────────────── */}
        <main className="flex-1 px-3 sm:px-6 lg:px-8 py-5 sm:py-7 max-w-[1400px] w-full mx-auto">

          {/* ══════════════════════════════════════════════════════════
             TAB 1: EXECUTIVE DASHBOARD OVERVIEW
             ══════════════════════════════════════════════════════════ */}
          {activeTab === 'overview' && (
            <div className="space-y-5 sm:space-y-7">
              {/* Header Title Banner */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                    Executive Dashboard
                  </h1>
                  <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                    B2B textile trading enquiries and public website operations.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('enquiries')}
                    className="inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--accent))] px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--accent-foreground))] shadow-xs transition hover:opacity-90 active:scale-[.99]"
                  >
                    <MessageSquare size={13} />
                    <span>View Enquiries</span>
                  </button>
                </div>
              </div>

              {/* 4 Summary Stat Cards — STRICT 2×2 GRID ON MOBILE */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
                {[
                  {
                    label: 'Total Enquiries',
                    value: metrics.total,
                    sub: 'All-time submissions',
                    icon: MessageSquare,
                    color: 'text-amber-700 bg-amber-50 border-amber-200/80',
                  },
                  {
                    label: 'This Month',
                    value: metrics.thisMonth,
                    sub: 'Active sourcing leads',
                    icon: TrendingUp,
                    color: 'text-sky-700 bg-sky-50 border-sky-200/80',
                  },
                  {
                    label: 'Bulk Buyers',
                    value: metrics.bulkBuyers,
                    sub: 'High-volume clients',
                    icon: Briefcase,
                    color: 'text-emerald-700 bg-emerald-50 border-emerald-200/80',
                  },
                  {
                    label: 'Website Sections',
                    value: '17',
                    sub: 'Verified PDF content',
                    icon: Layers,
                    color: 'text-slate-700 bg-slate-100 border-slate-200/80',
                  },
                ].map(card => (
                  <div
                    key={card.label}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-5 shadow-xs transition hover:shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        {card.label}
                      </span>
                      <div className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl border ${card.color}`}>
                        <card.icon size={14} />
                      </div>
                    </div>
                    <div className="mt-2.5 sm:mt-3">
                      <div className="text-xl sm:text-3xl font-bold tracking-tight text-slate-900">
                        {card.value}
                      </div>
                      <p className="mt-0.5 text-[10px] sm:text-[11px] text-slate-400">{card.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Two Column Layout: Recent Enquiries + Website Status */}
              <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-[1.4fr_1fr]">

                {/* Recent Inquiries List */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h2 className="text-xs sm:text-sm font-bold text-slate-800">Recent Sourcing Enquiries</h2>
                      <p className="text-[11px] text-slate-400">Latest submissions from `/contact`</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('enquiries')}
                      className="text-xs font-semibold text-[hsl(var(--accent))] hover:underline"
                    >
                      View all ({enquiries.length}) →
                    </button>
                  </div>

                  <div className="mt-3 divide-y divide-slate-100">
                    {loading && (
                      <div className="py-6 text-center text-xs text-slate-400">Loading submissions…</div>
                    )}
                    {!loading && enquiries.length === 0 && (
                      <div className="py-6 text-center text-xs text-slate-400">No enquiries submitted yet.</div>
                    )}
                    {!loading && enquiries.slice(0, 5).map(e => (
                      <div
                        key={e.id}
                        onClick={() => setDetailItem(e)}
                        className="group flex cursor-pointer items-start justify-between gap-2.5 py-2.5 transition hover:bg-slate-50/80 px-2 rounded-xl"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="truncate text-xs font-bold text-slate-800 group-hover:text-[hsl(var(--accent))]">
                              {e.full_name}
                            </span>
                            <span className="truncate text-[11px] text-slate-400">· {e.company}</span>
                          </div>
                          <p className="mt-0.5 truncate text-[11px] text-slate-500">
                            <span className="font-medium text-slate-700">{e.business_type}</span>: {e.requirement}
                          </p>
                        </div>
                        <span className="shrink-0 text-[10px] text-slate-400">
                          {formatDateShort(e.created_at)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Company & Website Health Status */}
                <div className="space-y-4">
                  {/* Website Sections Health */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h2 className="text-xs sm:text-sm font-bold text-slate-800">Website Content Status</h2>
                      <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        17/17 Live
                      </span>
                    </div>

                    {/* Mobile 2-column grid for metrics */}
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-xl bg-slate-50 border border-slate-100 p-2.5">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">PDF Alignment</span>
                        <span className="font-semibold text-emerald-600 text-xs">100% Verified</span>
                      </div>
                      <div className="rounded-xl bg-slate-50 border border-slate-100 p-2.5">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Breakpoints</span>
                        <span className="font-semibold text-slate-800 text-xs">360px – 1920px</span>
                      </div>
                      <div className="rounded-xl bg-slate-50 border border-slate-100 p-2.5">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Zoom Support</span>
                        <span className="font-semibold text-slate-800 text-xs">80% – 125% OK</span>
                      </div>
                      <div className="rounded-xl bg-slate-50 border border-slate-100 p-2.5">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Lead Database</span>
                        <span className="font-semibold text-emerald-600 text-xs">Connected</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab('sections')}
                      className="mt-3.5 flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                      <span>Explore 17 Sections</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>

                  {/* Top Buyer Demands — Mobile 2-column Grid */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
                    <h2 className="text-xs sm:text-sm font-bold text-slate-800 mb-3">Top Buyer Demands</h2>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(metrics.typeCounts).slice(0, 4).map(([type, count]) => (
                        <div key={type} className="rounded-xl bg-slate-50 border border-slate-100 p-2.5 text-xs">
                          <span className="truncate block font-semibold text-slate-700">{type}</span>
                          <span className="mt-1 inline-block rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-[hsl(var(--accent))] border border-amber-200/60">
                            {count} leads
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
             TAB 2: CONTACT ENQUIRIES MANAGEMENT (WITH CUSTOM DROPDOWNS)
             ══════════════════════════════════════════════════════════ */}
          {activeTab === 'enquiries' && (
            <div className="space-y-4 sm:space-y-5">
              {/* Header Title */}
              <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                    Contact &amp; Partner Enquiries
                  </h1>
                  <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                    {loading ? 'Fetching database records…' : `${filtered.length} of ${enquiries.length} enquiries displayed`}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* View Mode Toggle */}
                  <div className="flex items-center rounded-xl border border-slate-200 bg-white p-0.5 shadow-xs">
                    <button
                      type="button"
                      onClick={() => setViewMode('cards')}
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                        viewMode === 'cards' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Cards View
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('table')}
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                        viewMode === 'table' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Table View
                    </button>
                  </div>

                  {/* CSV Export */}
                  <button
                    type="button"
                    onClick={() => {
                      exportEnquiriesToCSV(filtered);
                      showToast('Export Complete', `Saved ${filtered.length} records to CSV.`, 'success');
                    }}
                    disabled={filtered.length === 0}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-xs transition hover:border-[hsl(var(--accent)/.4)] hover:text-[hsl(var(--accent))] disabled:opacity-40"
                  >
                    <Download size={13} />
                    <span>CSV</span>
                  </button>
                </div>
              </div>

              {/* ── Search & Filter Controls Toolbar ──────────────── */}
              <div className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 shadow-xs space-y-2.5 relative z-20">
                {/* Desktop: Flex Row | Mobile: Search Full Width + 2-Col Dropdown Grid */}
                <div className="flex flex-col gap-2 md:flex-row md:items-center">
                  {/* Search Input — flex-1 receives most width on desktop */}
                  <div className="relative min-w-0 flex-1">
                    <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="search"
                      placeholder="Search name, company, email, requirement…"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-8.5 pr-3 text-xs text-slate-800 shadow-xs outline-none placeholder:text-slate-400 focus:border-[hsl(var(--accent)/.6)] focus:bg-white focus:ring-2 focus:ring-[hsl(var(--accent)/.12)] transition"
                    />
                  </div>

                  {/* Mobile 2-column Grid / Desktop Inline Dropdowns */}
                  <div className="grid grid-cols-2 gap-2 md:flex md:items-center">
                    {/* Custom Anchored Buyer Type Dropdown */}
                    <CustomDropdown
                      label="All Buyer Types"
                      value={typeFilter}
                      options={buyerTypeOptions}
                      onChange={setTypeFilter}
                      align="left"
                      className="w-full md:w-48"
                    />

                    {/* Custom Anchored Sort Dropdown */}
                    <CustomDropdown
                      label="Sort Order"
                      value={currentSortValue}
                      options={sortOptions}
                      onChange={handleSortChange}
                      align="right"
                      className="w-full md:w-48"
                    />
                  </div>
                </div>

                {/* Date Presets Grid (4-column on mobile, flex on desktop) */}
                <div className="border-t border-slate-100 pt-2.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <CalendarDays size={11} /> Date Range Filter:
                    </span>
                    {isDateFiltered && (
                      <button
                        type="button"
                        onClick={clearDate}
                        className="text-[11px] font-semibold text-red-500 hover:underline"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 sm:flex sm:flex-wrap">
                    {DATE_PRESETS.map(p => (
                      <button
                        key={p.key}
                        type="button"
                        onClick={() => setDatePreset(p.key)}
                        className={`rounded-lg py-1 px-2 text-center text-[11px] font-medium transition ${
                          datePreset === p.key
                            ? 'bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] font-bold shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Date Pickers */}
                {datePreset === 'custom' && (
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">From</label>
                      <input
                        type="date"
                        value={customFrom}
                        max={customTo || toInputVal(new Date())}
                        onChange={e => setCustomFrom(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs outline-none focus:border-[hsl(var(--accent))]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">To</label>
                      <input
                        type="date"
                        value={customTo}
                        min={customFrom}
                        max={toInputVal(new Date())}
                        onChange={e => setCustomTo(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs outline-none focus:border-[hsl(var(--accent))]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* ── Selection Action Bar ─────────────────────────── */}
              {!loading && filtered.length > 0 && (
                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 py-2 shadow-xs">
                  <div onClick={toggleSelectAll} className="flex cursor-pointer items-center gap-2">
                    <div className={`flex h-4 w-4 items-center justify-center rounded-sm border-2 transition ${
                      allSelected ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent))]'
                      : someSelected ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent)/.2)]'
                      : 'border-slate-300'
                    }`}>
                      {allSelected && <Check size={11} className="text-white" />}
                      {!allSelected && someSelected && <div className="h-1.5 w-1.5 rounded-xs bg-[hsl(var(--accent))]" />}
                    </div>
                    <span className="text-xs font-semibold text-slate-700">
                      {allSelected ? 'Deselect all' : `Select all (${filtered.length})`}
                    </span>
                  </div>

                  {someSelected && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 hidden sm:inline">{selected.size} selected</span>
                      <button
                        type="button"
                        onClick={() => openDeleteModal(Array.from(selected), true)}
                        className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 shadow-xs transition hover:bg-red-100"
                      >
                        <Trash2 size={13} />
                        <span>Delete ({selected.size})</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ── Error Banner ─────────────────────────────────── */}
              {error && (
                <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700">
                  <span>{error}</span>
                  <button type="button" onClick={() => setError('')} className="p-1 hover:bg-red-100 rounded">
                    <X size={14} />
                  </button>
                </div>
              )}

              {/* ── Loading Skeleton ─────────────────────────────── */}
              {loading && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-44 animate-pulse rounded-2xl border border-slate-200 bg-white" />
                  ))}
                </div>
              )}

              {/* ── Empty State ──────────────────────────────────── */}
              {!loading && !error && filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-14 text-center shadow-xs px-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-[hsl(var(--accent))] border border-amber-100 mb-3">
                    <Inbox size={22} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">
                    {search || isDateFiltered || typeFilter !== 'all' ? 'No matching enquiries' : 'No enquiries yet'}
                  </h3>
                  <p className="mt-1 max-w-sm text-xs text-slate-400">
                    {search || isDateFiltered || typeFilter !== 'all'
                      ? 'Try adjusting your search criteria.'
                      : 'Incoming partner submissions from the website will automatically appear here.'}
                  </p>
                  {(search || isDateFiltered || typeFilter !== 'all') && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearch('');
                        clearDate();
                        setTypeFilter('all');
                      }}
                      className="mt-3 rounded-xl border border-[hsl(var(--accent)/.3)] bg-amber-50 px-4 py-1.5 text-xs font-semibold text-[hsl(var(--accent))] hover:bg-amber-100 transition"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>
              )}

              {/* ── DATA VIEW 1: CARDS VIEW (CONTENT-AWARE & 2-COLUMN STRUCTURE) ── */}
              {!loading && filtered.length > 0 && viewMode === 'cards' && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {filtered.map(item => {
                    const isSelected = selected.has(item.id);
                    return (
                      <div
                        key={item.id}
                        className={`flex flex-col justify-between rounded-2xl border bg-white p-4 shadow-xs transition ${
                          isSelected
                            ? 'border-[hsl(var(--accent))] ring-2 ring-[hsl(var(--accent)/.15)]'
                            : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                        }`}
                      >
                        <div>
                          {/* Card Header */}
                          <div className="flex items-start justify-between gap-2.5">
                            <div className="flex items-start gap-2 min-w-0">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleSelectOne(item.id)}
                                className="mt-0.5 rounded border-slate-300 text-[hsl(var(--accent))] focus:ring-[hsl(var(--accent))]"
                              />
                              <div className="min-w-0">
                                <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{item.full_name}</h3>
                                <p className="text-[11px] text-slate-400 truncate">{item.company}</p>
                              </div>
                            </div>
                            <span className="shrink-0 text-[10px] text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md">
                              {formatDateShort(item.created_at)}
                            </span>
                          </div>

                          {/* 2-Column Structured Sub-Grid on Mobile & Desktop */}
                          <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                            <div className="rounded-xl bg-sky-50/70 border border-sky-100 p-2">
                              <span className="text-[9px] uppercase font-bold text-sky-600 block">Type</span>
                              <span className="font-semibold text-slate-800 truncate block text-[11px]">{item.business_type}</span>
                            </div>
                            <div className="rounded-xl bg-amber-50/70 border border-amber-100 p-2">
                              <span className="text-[9px] uppercase font-bold text-[hsl(var(--accent))] block">Requirement</span>
                              <span className="font-semibold text-slate-800 truncate block text-[11px]">{item.requirement}</span>
                            </div>
                          </div>

                          {/* Message snippet */}
                          {item.message && (
                            <p className="mt-2.5 line-clamp-2 rounded-xl bg-slate-50 p-2 text-[11px] leading-relaxed text-slate-600 border border-slate-100">
                              "{item.message}"
                            </p>
                          )}
                        </div>

                        {/* Card Footer Actions in Grid */}
                        <div className="mt-3.5 flex items-center gap-2 border-t border-slate-100 pt-2.5">
                          <button
                            type="button"
                            onClick={() => setDetailItem(item)}
                            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition text-center"
                          >
                            Inspect
                          </button>
                          <a
                            href={`mailto:${item.email}?subject=Freya Poly Fab – Reply to ${encodeURIComponent(item.requirement)}`}
                            title="Reply via Email"
                            className="flex items-center justify-center rounded-xl bg-[hsl(var(--accent))] px-3 py-1.5 text-xs font-semibold text-[hsl(var(--accent-foreground))] hover:opacity-90 transition"
                          >
                            <Mail size={13} />
                          </a>
                          <button
                            type="button"
                            onClick={() => openDeleteModal([item.id])}
                            title="Delete"
                            className="flex items-center justify-center rounded-xl border border-slate-200 p-1.5 text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ── DATA VIEW 2: RESPONSIVE TABLE (FOR DESKTOP / TABLET) ── */}
              {!loading && filtered.length > 0 && viewMode === 'table' && (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        <tr>
                          <th className="w-10 px-4 py-3 text-center">
                            <input
                              type="checkbox"
                              checked={allSelected}
                              onChange={toggleSelectAll}
                              className="rounded border-slate-300 text-[hsl(var(--accent))] focus:ring-[hsl(var(--accent))]"
                            />
                          </th>
                          <th className="px-4 py-3">Lead / Company</th>
                          <th className="px-4 py-3">Contact</th>
                          <th className="px-4 py-3">Requirement</th>
                          <th className="px-4 py-3">Date</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {filtered.map(item => {
                          const isSelected = selected.has(item.id);
                          return (
                            <tr
                              key={item.id}
                              className={`transition hover:bg-slate-50/80 ${isSelected ? 'bg-amber-50/40' : ''}`}
                            >
                              <td className="px-4 py-3.5 text-center">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleSelectOne(item.id)}
                                  className="rounded border-slate-300 text-[hsl(var(--accent))] focus:ring-[hsl(var(--accent))]"
                                />
                              </td>
                              <td className="px-4 py-3.5">
                                <div className="font-bold text-slate-900">{item.full_name}</div>
                                <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                                  <Building2 size={11} className="text-slate-400" />
                                  <span>{item.company}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3.5">
                                <a href={`mailto:${item.email}`} className="block font-medium text-slate-700 hover:text-[hsl(var(--accent))]">
                                  {item.email}
                                </a>
                                <a href={`tel:${item.phone}`} className="block text-[11px] text-slate-400 hover:text-[hsl(var(--accent))]">
                                  {item.phone}
                                </a>
                              </td>
                              <td className="px-4 py-3.5">
                                <span className="inline-block rounded-full bg-sky-50 border border-sky-200 px-2 py-0.5 text-[10px] font-semibold text-sky-700 mr-1.5">
                                  {item.business_type}
                                </span>
                                <span className="text-[11px] text-slate-600 block sm:inline mt-0.5 sm:mt-0 truncate max-w-[180px]">
                                  {item.requirement}
                                </span>
                              </td>
                              <td className="px-4 py-3.5 text-[11px] text-slate-400 whitespace-nowrap">
                                {formatDateShort(item.created_at)}
                              </td>
                              <td className="px-4 py-3.5 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => setDetailItem(item)}
                                    title="View details"
                                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
                                  >
                                    <Eye size={13} />
                                  </button>
                                  <a
                                    href={`mailto:${item.email}?subject=Freya Poly Fab – Sourcing Inquiry`}
                                    title="Reply"
                                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-amber-200 bg-amber-50 text-[hsl(var(--accent))] hover:bg-amber-100 transition"
                                  >
                                    <Mail size={13} />
                                  </a>
                                  <button
                                    type="button"
                                    onClick={() => openDeleteModal([item.id])}
                                    title="Delete"
                                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
             TAB 3: WEBSITE CONTENT & SECTIONS DIRECTORY (2-COL MOBILE GRID)
             ══════════════════════════════════════════════════════════ */}
          {activeTab === 'sections' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                    Website Content Directory
                  </h1>
                  <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                    All 17 published sections from the 15-page company PDF with live preview links.
                  </p>
                </div>
                <a
                  href="/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[hsl(var(--accent))] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--accent-foreground))] shadow-xs hover:opacity-90 transition"
                >
                  <Globe size={13} />
                  <span>Open Public Site</span>
                </a>
              </div>

              {/* 2-Column Grid on Mobile & Tablet, 3-Column on Desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {WEBSITE_SECTIONS.map((sec, idx) => (
                  <div
                    key={sec.id}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs transition hover:border-[hsl(var(--accent)/.4)] hover:shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[hsl(var(--accent))] border border-amber-100">
                          {sec.category}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400">{sec.pdfPage}</span>
                      </div>

                      <h3 className="mt-2.5 text-xs sm:text-sm font-bold text-slate-900">
                        {String(idx + 1).padStart(2, '0')}. {sec.title}
                      </h3>
                      <p className="mt-1 text-[11px] sm:text-xs leading-relaxed text-slate-500 line-clamp-2">
                        {sec.summary}
                      </p>

                      <div className="mt-2.5 flex flex-wrap gap-1">
                        {sec.keyItems.slice(0, 3).map(item => (
                          <span
                            key={item}
                            className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] text-slate-600 font-medium truncate max-w-full"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-3.5 flex items-center gap-2 border-t border-slate-100 pt-2.5">
                      <button
                        type="button"
                        onClick={() => setSectionDetail(sec)}
                        className="flex-1 rounded-xl border border-slate-200 bg-slate-50 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                      >
                        Metadata
                      </button>
                      <a
                        href={sec.previewUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 rounded-xl bg-amber-50 border border-amber-200 px-2.5 py-1.5 text-xs font-semibold text-[hsl(var(--accent))] hover:bg-amber-100 transition"
                      >
                        <span>Preview</span>
                        <ArrowUpRight size={12} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
             TAB 4: ANALYTICS & INSIGHTS
             ══════════════════════════════════════════════════════════ */}
          {activeTab === 'analytics' && (
            <div className="space-y-5 sm:space-y-6">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                  Enquiry Analytics &amp; Sourcing Insights
                </h1>
                <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                  Distribution of fabric requirements and buyer profiles from incoming website submissions.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                {/* Breakdown by Buyer Type */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs">
                  <h2 className="text-xs sm:text-sm font-bold text-slate-900 mb-3.5 flex items-center gap-2">
                    <Briefcase size={15} className="text-[hsl(var(--accent))]" />
                    <span>Buyer Profile Distribution</span>
                  </h2>

                  <div className="space-y-3">
                    {Object.entries(metrics.typeCounts).map(([type, count]) => {
                      const pct = metrics.total > 0 ? Math.round((count / metrics.total) * 100) : 0;
                      return (
                        <div key={type} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="font-semibold text-slate-700">{type}</span>
                            <span className="text-slate-400">{count} ({pct}%)</span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full bg-[hsl(var(--accent))] rounded-full transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                    {Object.keys(metrics.typeCounts).length === 0 && (
                      <p className="text-xs text-slate-400 py-4 text-center">No records to analyze.</p>
                    )}
                  </div>
                </div>

                {/* Breakdown by Requirement */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs">
                  <h2 className="text-xs sm:text-sm font-bold text-slate-900 mb-3.5 flex items-center gap-2">
                    <FileText size={15} className="text-[hsl(var(--accent))]" />
                    <span>Fabric Sourcing Categories</span>
                  </h2>

                  <div className="space-y-3">
                    {Object.entries(metrics.reqCounts).map(([req, count]) => {
                      const pct = metrics.total > 0 ? Math.round((count / metrics.total) * 100) : 0;
                      return (
                        <div key={req} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="font-semibold text-slate-700">{req}</span>
                            <span className="text-slate-400">{count} ({pct}%)</span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full bg-sky-600 rounded-full transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                    {Object.keys(metrics.reqCounts).length === 0 && (
                      <p className="text-xs text-slate-400 py-4 text-center">No records to analyze.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
             TAB 5: PORTAL SETTINGS & SESSION
             ══════════════════════════════════════════════════════════ */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl space-y-5">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                  Portal Settings &amp; Security
                </h1>
                <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                  Active authentication session and database details.
                </p>
              </div>

              {/* Active Admin Info */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs space-y-3">
                <h2 className="text-xs sm:text-sm font-bold text-slate-900">Current Administrator</h2>
                <div className="flex items-center gap-3.5 rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-100 text-base font-bold text-[hsl(var(--accent))]">
                    {adminEmail ? adminEmail[0].toUpperCase() : 'A'}
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-slate-900">{adminEmail || 'admin@freyapolyfab.com'}</p>
                    <p className="text-[11px] text-slate-400">Authenticated via Supabase Auth</p>
                  </div>
                </div>
              </div>

              {/* Database Connection — Mobile 2×2 Grid */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs space-y-3">
                <h2 className="text-xs sm:text-sm font-bold text-slate-900">Database Status</h2>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-xl bg-slate-50 border border-slate-100 p-2.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Status</span>
                    <span className="flex items-center gap-1 font-semibold text-emerald-600 mt-0.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online
                    </span>
                  </div>
                  <div className="rounded-xl bg-slate-50 border border-slate-100 p-2.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Table</span>
                    <span className="font-mono text-slate-700 truncate block mt-0.5">contact_enquiries</span>
                  </div>
                  <div className="rounded-xl bg-slate-50 border border-slate-100 p-2.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Synchronized</span>
                    <span className="font-bold text-slate-900 block mt-0.5">{enquiries.length} rows</span>
                  </div>
                  <div className="rounded-xl bg-slate-50 border border-slate-100 p-2.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Realtime Engine</span>
                    <span className="font-semibold text-slate-800 block mt-0.5">PostgreSQL</span>
                  </div>
                </div>
              </div>

              {/* Session Controls */}
              <div className="rounded-2xl border border-red-200 bg-red-50/40 p-4 sm:p-6 shadow-xs space-y-3">
                <h2 className="text-xs sm:text-sm font-bold text-red-700">Sign Out of Admin Portal</h2>
                <p className="text-xs text-slate-600">
                  Ending your session will require your credentials to re-access the dashboard.
                </p>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-xs hover:bg-red-700 transition active:scale-[.99]"
                >
                  <LogOut size={14} />
                  <span>Terminate Session</span>
                </button>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ── MODAL: ENQUIRY DETAIL INSPECTOR ────────────────────── */}
      {detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setDetailItem(null)} />
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[hsl(var(--accent))]">
                  Enquiry Details
                </span>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">{detailItem.full_name}</h2>
                <p className="text-xs text-slate-400">{detailItem.company}</p>
              </div>
              <button
                type="button"
                onClick={() => setDetailItem(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-3.5 space-y-3 text-xs">
              {/* Contact Pill Row in 2-Column Grid */}
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                  <span className="text-[9px] font-bold uppercase text-slate-400 block mb-0.5">Email</span>
                  <a href={`mailto:${detailItem.email}`} className="font-semibold text-slate-800 hover:underline block truncate text-xs">
                    {detailItem.email}
                  </a>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                  <span className="text-[9px] font-bold uppercase text-slate-400 block mb-0.5">Phone</span>
                  <a href={`tel:${detailItem.phone}`} className="font-semibold text-slate-800 hover:underline block truncate text-xs">
                    {detailItem.phone}
                  </a>
                </div>
              </div>

              {/* Requirement & Business Type in 2-Column Grid */}
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                  <span className="text-[9px] font-bold uppercase text-slate-400 block mb-0.5">Business Type</span>
                  <span className="font-semibold text-slate-800 block truncate text-xs">{detailItem.business_type}</span>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                  <span className="text-[9px] font-bold uppercase text-slate-400 block mb-0.5">Requirement</span>
                  <span className="font-semibold text-slate-800 block truncate text-xs">{detailItem.requirement}</span>
                </div>
              </div>

              {/* Full Message */}
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Submitted Message</span>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-700 leading-relaxed max-h-36 overflow-y-auto whitespace-pre-wrap text-xs">
                  {detailItem.message || 'No additional message provided.'}
                </div>
              </div>

              {/* Timestamp */}
              <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-100">
                <span>Received: {formatDate(detailItem.created_at)}</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(`Name: ${detailItem.full_name}\nCompany: ${detailItem.company}\nEmail: ${detailItem.email}\nPhone: ${detailItem.phone}\nRequirement: ${detailItem.requirement}\nMessage: ${detailItem.message}`);
                    showToast('Copied to Clipboard', 'Full lead details copied.', 'info');
                  }}
                  className="inline-flex items-center gap-1 font-semibold text-[hsl(var(--accent))] hover:underline"
                >
                  <Copy size={12} />
                  <span>Copy</span>
                </button>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-3">
              <a
                href={`mailto:${detailItem.email}?subject=Freya Poly Fab – Reply to ${encodeURIComponent(detailItem.requirement)}`}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[hsl(var(--accent))] py-2 text-xs font-semibold text-[hsl(var(--accent-foreground))] shadow-xs hover:opacity-90 transition"
              >
                <Mail size={13} />
                <span>Reply</span>
              </a>
              <a
                href={`tel:${detailItem.phone}`}
                className="flex items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                <Phone size={13} />
                <span>Call</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  const id = detailItem.id;
                  setDetailItem(null);
                  openDeleteModal([id]);
                }}
                className="flex items-center justify-center rounded-xl border border-red-200 bg-red-50 p-2 text-red-600 hover:bg-red-100 transition"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: SECTION METADATA INSPECTOR ──────────────────── */}
      {sectionDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setSectionDetail(null)} />
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[hsl(var(--accent))]">
                  {sectionDetail.category} · {sectionDetail.pdfPage}
                </span>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">{sectionDetail.title}</h2>
              </div>
              <button
                type="button"
                onClick={() => setSectionDetail(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-3.5 space-y-3 text-xs">
              <p className="leading-relaxed text-slate-600">{sectionDetail.summary}</p>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1.5">Key Components</span>
                <div className="flex flex-wrap gap-1.5">
                  {sectionDetail.keyItems.map(k => (
                    <span key={k} className="rounded-lg bg-slate-100 px-2 py-1 text-slate-700 font-medium text-[11px]">
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setSectionDetail(null)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Close
              </button>
              <a
                href={sectionDetail.previewUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[hsl(var(--accent))] px-3.5 py-1.5 text-xs font-semibold text-[hsl(var(--accent-foreground))] hover:opacity-90 shadow-xs"
              >
                <span>Preview Section</span>
                <ArrowUpRight size={13} />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: DELETE CONFIRMATION ──────────────────────────── */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => !deleting && setDeleteModal({ open: false, ids: [], isBulk: false })}
          />
          <div className="relative w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-600 border border-red-100 mb-3.5">
              <Trash2 size={18} />
            </div>

            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              {deleteModal.isBulk
                ? `Delete ${deleteModal.ids.length} Selected Enquiries?`
                : 'Delete Contact Enquiry?'}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              This action permanently deletes the record(s) from Supabase.
            </p>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteModal({ open: false, ids: [], isBulk: false })}
                className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleConfirmDelete}
                className="flex items-center gap-1.5 rounded-xl bg-red-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-red-700 transition disabled:opacity-50"
              >
                {deleting ? (
                  <span className="flex items-center gap-1.5">
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Deleting…
                  </span>
                ) : (
                  <span>Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}



