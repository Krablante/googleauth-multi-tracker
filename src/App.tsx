// src/App.tsx
import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { EntryServiceProvider } from './contexts/EntryServiceContext';
import MainApp from './MainApp';

function AppInner() {
  const { user, signIn } = useAuth();
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
