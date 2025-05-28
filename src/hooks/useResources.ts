// src/hooks/useResources.ts
import { useState, useEffect, useCallback } from 'react';
import { ResourceEntry } from '../types';
import { useResourceService } from '../contexts/ResourceServiceContext';

/**
 * useResources — хук для работы с ресурсами (новости, сайты и пр.)
 */
export function useResources() {
  const service = useResourceService();
  const [resources, setResources] = useState<ResourceEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = service.subscribe(
      setResources,
      err => setError(err.message)
    );
    return unsub;
  }, [service]);

  const addResource = useCallback(
    async (entry: Omit<ResourceEntry, 'id' | 'order' | 'createdAt'>) => {
      try {
        await service.add(entry);
      } catch (err: any) {
        setError(err.message);
      }
    },
    [service]
  );

  const removeResource = useCallback(
    async (id: string) => {
      try {
        await service.remove(id);
      } catch (err: any) {
        setError(err.message);
      }
    },
    [service]
  );

  const updateOrder = useCallback(
    async (id: string, newOrder: number) => {
      try {
        await service.updateOrder(id, newOrder);
      } catch (err: any) {
        setError(err.message);
      }
    },
    [service]
  );

  return { resources, addResource, removeResource, updateOrder, error };
}
