import { useState, type FormEvent } from 'react';
import { useLocation } from 'wouter';
import { supabase } from '@/lib/supabase';
import logoPath from '/logo.png';
import { Eye, EyeOff, LogIn, ArrowLeft, Shield, Lock, Mail } from 'lucide-react';

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }
    setError('');
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (authError) {
      setError('Invalid credentials. Please verify your email and password.');
    } else {
      navigate('/admin');
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[hsl(var(--background))] px-4 py-12">
      {/* Background Subtle Accent Gradients */}
      <div
        className="pointer-events-none fixed inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(circle at 75% 20%, rgba(229,212,184,.35), transparent 45%), radial-gradient(circle at 20% 80%, rgba(229,212,184,.2), transparent 40%)',
        }}
      />

      <div className="relative z-10 w-full max-w-[420px]">
        {/* Brand Logo */}
        <div className="mb-8 flex flex-col items-center text-center">
          <a
            href="/"
            className="group inline-flex items-center justify-center rounded-sm transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]"
            aria-label="Return to Freya Poly Fab homepage"
          >
            <img
              src={logoPath}
              alt="Freya Poly Fab logo"
              className="h-11 w-auto object-contain sm:h-12"
              loading="eager"
            />
          </a>
          <div className="mt-4 flex items-center gap-1.5 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-1 text-[11px] font-semibold uppercase tracking-[.14em] text-[hsl(var(--accent))] shadow-xs">
            <Shield size={12} className="text-[hsl(var(--accent))]" />
            <span>Secure Business Portal</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-7 shadow-sm sm:p-9">
          <div className="border-b border-[hsl(var(--border))] pb-5">
            <h1 className="text-xl font-semibold tracking-tight text-[hsl(var(--foreground))] sm:text-2xl">
              Admin Sign In
            </h1>
            <p className="mt-1.5 text-xs leading-relaxed text-[hsl(var(--muted-foreground))] sm:text-sm">
              Enter your credentials to access business enquiries and manage website content.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
            {/* Email Field */}
            <div>
              <label
                htmlFor="admin-email"
                className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[.11em] text-[hsl(var(--foreground))]"
              >
                <Mail size={13} className="text-[hsl(var(--muted-foreground))]" />
                Email Address
              </label>
              <div className="relative">
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="admin@freyapolyfab.com"
                  className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-3 text-sm text-[hsl(var(--foreground))] shadow-xs outline-none transition placeholder:text-[hsl(var(--muted-foreground)/.5)] focus:border-[hsl(var(--accent))] focus:ring-2 focus:ring-[hsl(var(--accent)/.15)]"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="admin-password"
                className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[.11em] text-[hsl(var(--foreground))]"
              >
                <Lock size={13} className="text-[hsl(var(--muted-foreground))]" />
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-3 pr-11 text-sm text-[hsl(var(--foreground))] shadow-xs outline-none transition placeholder:text-[hsl(var(--muted-foreground)/.5)] focus:border-[hsl(var(--accent))] focus:ring-2 focus:ring-[hsl(var(--accent)/.15)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-[hsl(var(--muted-foreground))] transition hover:bg-[hsl(var(--secondary)/.6)] hover:text-[hsl(var(--foreground))]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div
                className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 shadow-xs"
                role="alert"
              >
                <span className="mt-0.5 font-bold">•</span>
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-[hsl(var(--accent))] px-6 py-3 text-xs font-semibold uppercase tracking-[.14em] text-[hsl(var(--accent-foreground))] shadow-xs transition hover:opacity-90 active:scale-[.99] disabled:cursor-wait disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Authenticating…
                </span>
              ) : (
                <>
                  <LogIn size={15} />
                  Access Dashboard
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[hsl(var(--muted-foreground))] transition hover:text-[hsl(var(--foreground))]"
          >
            <ArrowLeft size={13} />
            <span>Return to Public Website</span>
          </a>
        </div>
      </div>
    </div>
  );
}
