// src/contexts/ResourceServiceContext.tsx
import React, { createContext, useContext, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { ResourceService } from '../services/resourceService';
import { FirestoreResourceService } from '../services/firestoreResourceService';

const ResourceServiceContext = createContext<ResourceService | null>(null);

export const ResourceServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const service = useMemo<ResourceService>(() => {
    if (!user) throw new Error('ResourceService requires auth');
    return new FirestoreResourceService(user.uid);
  }, [user]);

  return (
    <ResourceServiceContext.Provider value={service}>
      {children}
    </ResourceServiceContext.Provider>
  );
};

export const useResourceService = () => {
  const ctx = useContext(ResourceServiceContext);
  if (!ctx) throw new Error('useResourceService must be inside ResourceServiceProvider');
  return ctx;
};