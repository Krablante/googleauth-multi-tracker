// src/MainApp.tsx
import React, { useState, useEffect } from 'react';
import Tabs, { Category } from './components/Tabs';
import EntryForm from './components/EntryForm';
import EntriesList from './components/EntriesList';
import { useEntries } from './hooks/useEntries';
import { useAuth } from './contexts/AuthContext';

const MainApp: React.FC = () => {
  const { user, signOut } = useAuth();
  const [category, setCategory] = useState<Category>('read');

  // 1) Тема
  const [theme, setTheme] = useState<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  );
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // 2) Записи
  const { entries, addEntry, removeEntry, error } = useEntries();
  const filtered = entries.filter((e) => e.category === category);

  // Источник аватара (с fallback)
  const avatarSrc = user?.photoURL || '/default-U-icon.svg';

  return (
    <div className="container">
      <div className="header">
        <h1>Tracker</h1>
        <div className="header-controls">
          <button
            className="theme-btn"
            onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          <button
            className="user-icon"
            aria-label="Sign out"
            onClick={signOut}
          >
            <img src={avatarSrc} alt="User avatar" />
          </button>
        </div>
      </div>

      <Tabs active={category} onChange={setCategory} />

      <EntryForm activeCategory={category} onAdd={addEntry} />

      {error && <div className="error">Ошибка: {error}</div>}

      <EntriesList entries={filtered} onRemove={removeEntry} />
    </div>
  );
};

export default MainApp;