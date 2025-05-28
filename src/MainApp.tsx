// src/MainApp.tsx
import React, { useState, useEffect } from 'react';
import Tabs, { Category } from './components/Tabs';
import EntryForm from './components/EntryForm';
import EntriesList from './components/EntriesList';
import WishlistEntriesList from './components/WishlistEntriesList';
import ResourceForm from './components/ResourceForm';
import ResourcesList from './components/ResourcesList';
import { useEntries } from './hooks/useEntries';
import { useResources } from './hooks/useResources';
import { useAuth } from './contexts/AuthContext';
import { Entry } from './types';
import ImportExportModal from './components/ImportExportModal';

const MainApp: React.FC = () => {
  const { user, signOut } = useAuth();
  const [category, setCategory] = useState<Category>('read');

  // Тема
  const [theme, setTheme] = useState<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  );
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Read/Films
  const { entries, addEntry, removeEntry, error: entryError } = useEntries();
  const filteredEntries = entries.filter(e => e.category === category);

  const markAsDone = async (entry: Entry) => {
    const targetCat: Category =
      entry.category === 'read_wish' ? 'read' : 'films';
    const today = new Date().toISOString().slice(0, 10);
    await addEntry({ date: today, title: entry.title, category: targetCat });
    await removeEntry(entry.id);
  };

  // Resources
  const {
    resources,
    addResource,
    removeResource,
    updateOrder,
    error: resourceError
  } = useResources();

  // swap elements
  const swapResourceOrder = async (id: string, otherId: string) => {
    const current = resources.find(r => r.id === id);
    const other = resources.find(r => r.id === otherId);
    if (!current || !other) return;
    await updateOrder(current.id, other.order);
    await updateOrder(other.id, current.order);
  };

  const avatarSrc = user?.photoURL || '/default-U-icon.svg';

  return (
    <div className="container">
      <div className="header">
        <div className="header-main">
          <h1>Tracker</h1>
          <button
            className={`icon-tab ${category === 'resources' ? 'tab--active' : ''}`}
            onClick={() => setCategory('resources')}
            aria-label="Resources"
          >
            📰
          </button>
        </div>
        <div className="header-controls">
          <button
            className="theme-btn"
            onClick={() => setTheme(t => (t === 'light' ? 'dark' : 'light'))}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          {/* Import/Export */}
          <ImportExportModal />
          {/* avatar + sigh out */}
          <button className="user-icon" aria-label="Sign out" onClick={signOut}>
            <img src={avatarSrc} alt="User avatar" />
          </button>
        </div>
      </div>

      <Tabs active={category} onChange={setCategory} />

      {category === 'resources' ? (
        <>
          <ResourceForm onAdd={addResource} />
          {resourceError && <div className="error">Ошибка: {resourceError}</div>}
          <ResourcesList
            entries={resources}
            onRemove={removeResource}
            onSwap={swapResourceOrder}
          />
        </>
      ) : (
        <>
          <EntryForm activeCategory={category} onAdd={addEntry} />
          {entryError && <div className="error">Ошибка: {entryError}</div>}
          {(category === 'read_wish' || category === 'films_wish') ? (
            <WishlistEntriesList
              entries={filteredEntries}
              onRemove={removeEntry}
              onComplete={markAsDone}
            />
          ) : (
            <EntriesList entries={filteredEntries} onRemove={removeEntry} />
          )}
        </>
      )}
    </div>
  );
};

export default MainApp;
