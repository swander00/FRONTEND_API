import { useEffect, useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseBrowserClient } from '@/lib/supabaseClient';

export function useSupabaseBrowserClient(): SupabaseClient | null {
  const [client, setClient] = useState<SupabaseClient | null>(() => getSupabaseBrowserClient());

  useEffect(() => {
    if (!client) {
      setClient(getSupabaseBrowserClient());
    }
  }, [client]);

  return client;
}

