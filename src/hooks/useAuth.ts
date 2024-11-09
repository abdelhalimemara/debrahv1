import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
      
      // Update local storage based on session state
      if (session) {
        localStorage.setItem('office_id', session.user.user_metadata.office_id);
        localStorage.setItem('user_role', session.user.user_metadata.role);
      } else {
        localStorage.removeItem('office_id');
        localStorage.removeItem('user_role');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return { session, loading };
}