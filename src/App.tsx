// src/App.tsx
import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { EntryServiceProvider } from './contexts/EntryServiceContext';
import MainApp from './MainApp';

function AppInner() {
  const { user, signIn } = useAuth();
  if (!user) {
    return (
      <div style={{ textAlign: 'center', marginTop: '4rem' }}>
        <h2>Пожалуйста, войдите через Google</h2>
        <button onClick={signIn}>Войти</button>
      </div>
    );
  }
  return (
    <EntryServiceProvider>
      <MainApp />
    </EntryServiceProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}

export default App;
