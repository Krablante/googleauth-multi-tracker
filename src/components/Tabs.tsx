import React from 'react';

export type Category = 'read' | 'films';

interface TabsProps {
  active: Category;
  onChange: (category: Category) => void;
}

const TABS: { key: Category; label: string }[] = [
  { key: 'read',  label: 'READ'  },
  { key: 'films', label: 'FILMS' },
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
