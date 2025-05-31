// src/hooks/useGoals.ts

import { useState, useEffect, useCallback } from 'react';
import { Goal } from '../types';
import { useGoalService } from '../contexts/GoalServiceContext';

/**
 * useGoals — хук для работы с коллекцией «цели».
 * Возвращает:
 *   - goals: Goal[]
 *   - addGoal: ( { title, order? } ) => Promise<void>
 *   - removeGoal: (id) => Promise<void>
 *   - updateOrder: (id, newOrder) => Promise<void>
 *   - error: string | null
 */
export function useGoals() {
  const service = useGoalService();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = service.subscribe(
      setGoals,
      err => setError(err.message)
    );
    return unsub;
  }, [service]);

  const addGoal = useCallback(
    async (newGoal: Omit<Goal, 'id' | 'createdAt'>) => {
      try {
        await service.add(newGoal);
      } catch (err: any) {
        setError(err.message);
      }
    },
    [service]
  );

  const removeGoal = useCallback(
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

  return { goals, addGoal, removeGoal, updateOrder, error };
}
