// src/components/EntriesList.tsx
import React from 'react';
import { Entry } from '../types';

interface Props {
  entries: Entry[];
  onRemove: (id: string) => void;
}

const EntriesList: React.FC<Props> = ({ entries, onRemove }) => {
  // сгруппируем по дате
  const groups = entries.reduce<Record<string, Entry[]>>((acc, entry) => {
    (acc[entry.date] ||= []).push(entry);
    return acc;
  }, {});

  // отсортируем даты по убыванию (новые наверху)
  const sortedDates = Object.keys(groups).sort((a, b) => (a < b ? 1 : -1));

  return (
    <ul id="entries">
      {sortedDates.map(date => {
        // превратим "2025-05-27" в "27.05.2025"
        const [y, m, d] = date.split('-');
        const formatted = `${d}.${m}.${y}`;

        return (
          <li key={date} className="entry-group">
            <div className="date">{formatted}</div>
            <div className="items">
              {groups[date].map(e => (
                <div key={e.id} className="item">
                  <span className="title">{e.title}</span>
                  <button
                    className="delete-btn"
                    onClick={() => onRemove(e.id)}
                  >
                    ×
                  </button>
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
