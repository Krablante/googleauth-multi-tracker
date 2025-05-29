// src/components/GoalsList.tsx
import React from 'react';
import { Entry } from '../types';

interface Props {
  entries: Entry[];
  onRemove: (id: string) => void;
}

const GoalsList: React.FC<Props> = ({ entries, onRemove }) => {
  if (entries.length === 0) {
    return <div className="empty">No goals yet</div>;
  }

  return (
    <ul className="wishlist-entries">
      {entries.map(e => (
        <li key={e.id} className="wishlist-item">
          <span className="title">{e.title}</span>
          <div className="actions">
            <button
              className="complete-btn"
              title="Done"
              onClick={() => onRemove(e.id)}
            >
              ✓
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default GoalsList;