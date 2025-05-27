import { useState, useEffect, useCallback } from 'react';
import { Entry } from '../types';
import { useEntryService } from '../contexts/EntryServiceContext';

export function useEntries() {
  const service = useEntryService();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = service.subscribe(
      setEntries,
      err => setError(err.message)
    );
    return unsub;
  }, [service]);

  const addEntry = useCallback(
    async (entry: Omit<Entry, 'id'>) => {
      try {
        await service.add(entry);
      } catch (err: any) {
        setError(err.message);
      }
    },
    [service]
  );

  const removeEntry = useCallback(
    async (id: string) => {
      try {
        await service.remove(id);
      } catch (err: any) {
        setError(err.message);
      }
    },
    [service]
  );

  return { entries, addEntry, removeEntry, error };
}
