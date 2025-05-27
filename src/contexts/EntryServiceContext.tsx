import React, { createContext, useContext, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { EntryService } from '../services/entryService';
import { FirestoreEntryService } from '../services/firestoreEntryService';

const EntryServiceContext = createContext<EntryService | null>(null);

export const EntryServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const service = useMemo<EntryService>(() => {
    if (!user) throw new Error('EntryService requires auth');
    return new FirestoreEntryService(user.uid);
  }, [user]);

  return (
    <EntryServiceContext.Provider value={service}>
      {children}
    </EntryServiceContext.Provider>
  );
};

export const useEntryService = () => {
  const ctx = useContext(EntryServiceContext);
  if (!ctx) throw new Error('useEntryService must be inside EntryServiceProvider');
  return ctx;
};
