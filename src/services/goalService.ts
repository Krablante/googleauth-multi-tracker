// src/services/goalService.ts

import { Goal } from '../types';

export interface GoalService {
  subscribe: (
    onUpdate: (goals: Goal[]) => void,
    onError?: (e: Error) => void
  ) => () => void;

  add: (goal: Omit<Goal, 'id' | 'createdAt'>) => Promise<Goal>;

  remove: (id: string) => Promise<void>;

  updateOrder: (id: string, newOrder: number) => Promise<void>;
}
