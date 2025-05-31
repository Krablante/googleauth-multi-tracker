// src/components/Tabs.tsx
import React from 'react';

// Здесь мы оставляем категорию 'goals', но не показываем её в самих табах:
// (кнопка Goals вынесена вручную в MainApp, через 🎯)
export type Category = 'read' | 'read_wish' | 'films' | 'films_wish' | 'resources' | 'goals';

interface TabsProps {
  active: Category;
  onChange: (category: Category) => void;
}

const TABS: { key: Exclude<Category, 'resources'>; label: string }[] = [
  { key: 'read',       label: 'READ'     },
  { key: 'read_wish',  label: 'READ (W)' },
  { key: 'films',      label: 'FILMS'    },
  { key: 'films_wish', label: 'FILMS (W)' },
];

const Tabs: React.FC<TabsProps> = ({ active, onChange }) => (
  <div className="tabs">
    {TABS.map(({ key, label }) => (
      <button
        key={key}
        className={`tab ${active === key ? 'tab--active' : ''}`}
        onClick={() => onChange(key)}
      >
        {label}
      </button>
    ))}
  </div>
);

export default Tabs;
