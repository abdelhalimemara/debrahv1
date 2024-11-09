import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Payable } from '../types';

export function usePayables() {
  const [payables, setPayables] = useState<Payable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayables = async () => {
      try {
        const officeId = localStorage.getItem('office_id');
        if (!officeId) throw new Error('No office ID found');

        const { data, error: fetchError } = await supabase
          .from('payables')
          .select(`
            *,
            contract:contracts (
              tenant:tenants (
                id,
                full_name
              ),
              unit:units (
                id,
                unit_number,
                building:buildings (
                  id,
                  name
                )
              )
            )
          `)
          .eq('office_id', officeId)
          .order('due_date', { ascending: false });

        if (fetchError) throw fetchError;
        setPayables(data || []);
      } catch (err) {
        console.error('Error fetching payables:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch payables');
      } finally {
        setLoading(false);
      }
    };

    fetchPayables();
  }, []);

  return { payables, loading, error };
}