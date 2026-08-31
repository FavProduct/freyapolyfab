import { useState, type FormEvent } from 'react';
import { useLocation } from 'wouter';
import { supabase } from '@/lib/supabase';
import logoPath from '/logo.png';
import { Eye, EyeOff, LogIn } from 'lucide-react';

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (authError) {
      setError('Invalid email or password. Please try again.');
    } else {
      navigate('/admin');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[hsl(var(--background))] px-4">
      {/* Background accent */}
      <div
        className="pointer-events-none fixed inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(circle at 70% 20%, rgba(229,212,184,.38), transparent 40%)',
        }}
      />

      <div className="relative w-full max-w-[420px]">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <a href="/" aria-label="Go to homepage">
            <img src={logoPath} alt="Freya Poly Fab logo" className="h-12 w-auto object-contain" />
          </a>
        </div>

        <div className="border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-8 shadow-sm">
          <h1 className="text-xl font-semibold text-[hsl(var(--primary))]">Admin Login</h1>
          <p className="mt-1.5 text-sm text-[hsl(var(--muted-foreground))]">
            Sign in to manage contact enquiries.
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-xs font-semibold uppercase tracking-[.12em] text-[hsl(var(--foreground))]"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="admin@example.com"
                className="w-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-3 text-sm text-[hsl(var(--foreground))] outline-none transition placeholder:text-[hsl(var(--muted-foreground)/.55)] focus:border-[hsl(var(--accent))] focus:ring-1 focus:ring-[hsl(var(--accent)/.3)]"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-xs font-semibold uppercase tracking-[.12em] text-[hsl(var(--foreground))]"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="••••••••"
                  className="w-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-3 pr-11 text-sm text-[hsl(var(--foreground))] outline-none transition placeholder:text-[hsl(var(--muted-foreground)/.55)] focus:border-[hsl(var(--accent))] focus:ring-1 focus:ring-[hsl(var(--accent)/.3)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] transition hover:text-[hsl(var(--foreground))]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="rounded border border-[hsl(var(--destructive)/.3)] bg-[hsl(var(--destructive)/.07)] px-3 py-2.5 text-xs text-[hsl(var(--destructive))]" role="alert">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2.5 bg-[hsl(var(--primary))] px-6 py-3.5 text-xs font-semibold uppercase tracking-[.15em] text-[hsl(var(--primary-foreground))] transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70"
            >
              {loading ? (
                'Signing in…'
              ) : (
                <>
                  <LogIn size={15} />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-[hsl(var(--muted-foreground))]">
          <a href="/" className="underline decoration-[hsl(var(--accent))] underline-offset-4 hover:text-[hsl(var(--foreground))]">
            ← Back to website
          </a>
        </p>
      </div>
    </div>
  );
}
