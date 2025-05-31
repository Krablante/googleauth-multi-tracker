// src/MainApp.tsx
import React, { useState, useEffect } from 'react';
import Tabs, { Category } from './components/Tabs';
import EntryForm from './components/EntryForm';
import EntriesList from './components/EntriesList';
import WishlistEntriesList from './components/WishlistEntriesList';
import ResourceForm from './components/ResourceForm';
import ResourcesList from './components/ResourcesList';
import GoalsList from './components/GoalsList';
import { useEntries } from './hooks/useEntries';
import { useResources } from './hooks/useResources';
import { useGoals } from './hooks/useGoals';
import { useAuth } from './contexts/AuthContext';
import ImportExportModal from './components/ImportExportModal';

const MainApp: React.FC = () => {
  const { user, signOut } = useAuth();
  const [category, setCategory] = useState<Category>('read');

  // theme
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

  /**
   * Принимает entry из вишлиста и опциональный массив keywords.
   * Переводит его в основную категорию ('read' или 'films'),
   * добавляет новую запись с сегодняшней датой + тегами (если они есть),
   * затем удаляет старую запись из вишлиста.
   */
  const markAsDone = async (entry: any, keywords: string[] = []) => {
    const targetCat: Category =
      entry.category === 'read_wish' ? 'read' : 'films';
    const today = new Date().toISOString().slice(0, 10);

    await addEntry({
      date: today,
      title: entry.title,
      category: targetCat,
      // Если пользователь указал хотя бы один тег, передаём их; иначе поле keywords отсутствует
      ...(keywords.length > 0 ? { keywords } : {}),
    });

    await removeEntry(entry.id);
  };

  // Resources
  const {
    resources,
    addResource,
    removeResource,
    updateOrder: updateResourceOrder,
    error: resourceError,
  } = useResources();

  // Goals
  const {
    goals,
    addGoal,
    removeGoal,
    updateOrder: updateGoalOrder,
    error: goalsError,
  } = useGoals();

  const avatarSrc = user?.photoURL || '/default-U-icon.svg';

  return (
    <div className="container">
      <div className="header">
        <div className="header-main">
          <h1>Tracker</h1>
          <button
            className={`icon-tab ${category === 'goals' ? 'tab--active' : ''}`}
            onClick={() => setCategory('goals')}
            aria-label="Goals"
          >
            🎯
          </button>
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
          {/* avatar + sign out */}
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
            onReorder={(newOrderIds: string[]) => {
              newOrderIds.forEach((id, idx) => {
                updateResourceOrder(id, idx);
              });
            }}
          />
        </>
      ) : category === 'goals' ? (
        <>
          <EntryForm
            activeCategory="goals"
            onAdd={({ title }) => {
              addGoal({ title, order: 0 });
            }}
          />
          {goalsError && <div className="error">Ошибка: {goalsError}</div>}
          <GoalsList
            entries={goals}
            onRemove={removeGoal}
            onReorder={(newOrderIds: string[]) => {
              newOrderIds.forEach((id, idx) => {
                updateGoalOrder(id, idx);
              });
            }}
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
              // Передаём изменённый колбэк onComplete, который принимает entry и keywords
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
