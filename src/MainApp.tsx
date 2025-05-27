// src/MainApp.tsx
import React, { useState, useEffect } from 'react';
import Tabs, { Category } from './components/Tabs';
import EntryForm from './components/EntryForm';
import EntriesList from './components/EntriesList';
import WishlistEntriesList from './components/WishlistEntriesList'; // ← новый импорт
import { useEntries } from './hooks/useEntries';
import { useAuth } from './contexts/AuthContext';

const MainApp: React.FC = () => {
  const { user, signOut } = useAuth();
  const [category, setCategory] = useState<Category>('read');

  // тема
  const [theme, setTheme] = useState<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  );
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // записи
  const { entries, addEntry, removeEntry, error } = useEntries();
  const filtered = entries.filter(e => e.category === category);

  // 4. markAsDone: перенос из вишлиста в основную категорию
  const markAsDone = async (entry: typeof filtered[0]) => {
    const targetCat: Category =
      entry.category === 'read_wish' ? 'read' : 'films';
    const today = new Date().toISOString().slice(0, 10);

    // создаём новую запись в основной вкладке
    await addEntry({
      date: today,
      title: entry.title,
      category: targetCat,
    });
    // удаляем из вишлиста
    await removeEntry(entry.id);
  };

  // аватар
  const avatarSrc = user?.photoURL || '/default-U-icon.svg';

  return (
    <div className="container">
      <div className="header">
        <h1>Tracker</h1>
        <div className="header-controls">
          <button
            className="theme-btn"
            onClick={() => setTheme(t => (t === 'light' ? 'dark' : 'light'))}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button className="user-icon" aria-label="Sign out" onClick={signOut}>
            <img src={avatarSrc} alt="User avatar" />
          </button>
        </div>
      </div>

      <Tabs active={category} onChange={setCategory} />

      <EntryForm activeCategory={category} onAdd={addEntry} />

      {error && <div className="error">Ошибка: {error}</div>}

      {/* 5. Условный рендер: обычные или вишлист */}
      {category === 'read_wish' || category === 'films_wish' ? (
        <WishlistEntriesList
          entries={filtered}
          onRemove={removeEntry}
          onComplete={markAsDone}
        />
      ) : (
        <EntriesList entries={filtered} onRemove={removeEntry} />
      )}
    </div>
  );
};

export default MainApp;
