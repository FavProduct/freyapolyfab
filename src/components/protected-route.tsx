import { useEffect, useState, type ReactNode } from 'react';
import { useLocation } from 'wouter';
import { supabase } from '@/lib/supabase';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const [, navigate] = useLocation();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        navigate('/admin/login');
      } else {
        setChecking(false);
      }
    });
  }, [navigate]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[hsl(var(--background))]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[hsl(var(--border))] border-t-[hsl(var(--accent))]" />
      </div>
    );
  }

  return <>{children}</>;
}
