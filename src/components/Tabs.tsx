import React from 'react';

export type Category = 'read' | 'read_wish' | 'films' | 'films_wish';

interface TabsProps {
  active: Category;
  onChange: (category: Category) => void;
}

const TABS: { key: Category; label: string }[] = [
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
