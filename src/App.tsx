// src/App.tsx

import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { EntryServiceProvider } from './contexts/EntryServiceContext';
import { ResourceServiceProvider } from './contexts/ResourceServiceContext';
import { GoalServiceProvider } from './contexts/GoalServiceContext';
import MainApp from './MainApp';

function AppInner() {
  const { user, loading, signIn } = useAuth();

  // 1) Если ещё идёт проверка авторизации — показываем спиннер
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  // 2) Если пользователь не залогинен — показываем экран входа
  if (!user) {
    return (
      <div className="login-screen">
        <div className="login-card">
          <h2>Please sign in with Google</h2>
          <button className="google-btn" onClick={signIn}>
            <img src="/google-logo.svg" alt="Google logo" />
            Login with Google
          </button>
        </div>
      </div>
    );
  }

  // 3) Как только user !== null, можно безопасно монтировать провайдеры,
  //    которые требуют наличия user (EntryService, ResourceService, GoalService)
  return (
    <EntryServiceProvider>
      <ResourceServiceProvider>
        <GoalServiceProvider>
          <MainApp />
        </GoalServiceProvider>
      </ResourceServiceProvider>
    </EntryServiceProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
