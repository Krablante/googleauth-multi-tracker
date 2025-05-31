// src/contexts/GoalServiceContext.tsx

import React, { createContext, useContext, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { GoalService } from '../services/goalService';
import { FirestoreGoalService } from '../services/firestoreGoalService';

const GoalServiceContext = createContext<GoalService | null>(null);

export const GoalServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const service = useMemo<GoalService>(() => {
    if (!user) throw new Error('GoalService requires auth');
    return new FirestoreGoalService(user.uid);
  }, [user]);

  return (
    <GoalServiceContext.Provider value={service}>
      {children}
    </GoalServiceContext.Provider>
  );
};

export const useGoalService = (): GoalService => {
  const ctx = useContext(GoalServiceContext);
  if (!ctx) throw new Error('useGoalService must be inside GoalServiceProvider');
  return ctx;
};
