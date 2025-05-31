// src/components/EntriesList.tsx
import React, { useState } from 'react';
import { Entry } from '../types';

interface Props {
  entries: Entry[];
  onRemove: (id: string) => void;
}

const EntriesList: React.FC<Props> = ({ entries, onRemove }) => {
  // date sort
  const groups = entries.reduce<Record<string, Entry[]>>((acc, entry) => {
    (acc[entry.date] ||= []).push(entry);
    return acc;
  }, {});

  const sortedDates = Object.keys(groups).sort((a, b) => (a < b ? 1 : -1));

  // keywords check
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleKeywords = (id: string) => {
    const newSet = new Set(expandedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedIds(newSet);
  };

  return (
    <ul id="entries">
      {sortedDates.map(date => {
        const [y, m, d] = date.split('-');
        const formatted = `${d}.${m}.${y}`;

        return (
          <li key={date} className="entry-group">
            <div className="date">{formatted}</div>
            <div className="items">
              {groups[date].map(e => (
                <div key={e.id} className="item">
                  <div className="item-main">
                    <button
                      className="toggle-keywords-btn"
                      onClick={() => toggleKeywords(e.id)}
                      title={expandedIds.has(e.id) ? 'Скрыть ключевые слова' : 'Показать ключевые слова'}
                    >
                      🔖
                    </button>
                    <span className="title">{e.title}</span>
                    <button
                      className="delete-btn"
                      onClick={() => onRemove(e.id)}
                      title="Удалить запись"
                    >
                      ×
                    </button>
                  </div>
                  {expandedIds.has(e.id) && e.keywords && e.keywords.length > 0 && (
                    <div className="keywords-list">
                      {e.keywords.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default EntriesList;
