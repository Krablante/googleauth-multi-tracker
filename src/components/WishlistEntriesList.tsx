// src/components/WishlistEntriesList.tsx
import React from 'react';
import { Entry } from '../types';

interface Props {
  entries: Entry[];
  onRemove: (id: string) => void;
  onComplete: (entry: Entry) => void;
}

const WishlistEntriesList: React.FC<Props> = ({ entries, onRemove, onComplete }) => {
  // если timestamp ещё не пришёл (undefined), кладём в конец
  const sorted = [...entries].sort((a, b) => {
    const ta = a.createdAt?.seconds ?? 0;
    const tb = b.createdAt?.seconds ?? 0;
    return tb - ta;
  });

  if (sorted.length === 0) {
    return <div className="empty">Nothing here yet</div>;
  }

  return (
    <ul className="wishlist-entries">
      {sorted.map(e => (
        <li key={e.id} className="wishlist-item">
          <span className="title">{e.title}</span>
          <div className="actions">
            <button
              className="complete-btn"
              title="Mark as done"
              onClick={() => onComplete(e)}
            >
              ✓
            </button>
            <button
              className="delete-btn"
              title="Remove"
              onClick={() => onRemove(e.id)}
            >
              ×
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default WishlistEntriesList;
