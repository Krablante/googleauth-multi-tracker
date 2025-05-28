// src/components/ResourcesList.tsx
import React from 'react';
import { ResourceEntry } from '../types';

interface ResourcesListProps {
  entries: ResourceEntry[];
  onRemove: (id: string) => void;
  onSwap: (id: string, otherId: string) => void;
}

const ResourcesList: React.FC<ResourcesListProps> = ({ entries, onRemove, onSwap }) => (
  <ul className="wishlist-entries">
    {entries.map((e, idx) => (
      <li key={e.id} className="wishlist-item">
        <a
          href={e.url}
          target="_blank"
          rel="noopener noreferrer"
          className="title"
        >
          {e.title}
        </a>
        <div className="actions">
          <button
            className="arrow-btn"
            disabled={idx === 0}
            onClick={() => onSwap(e.id, entries[idx - 1].id)}
            title="Переместить вверх"
          >
            ↑
          </button>
          <button
            className="arrow-btn"
            disabled={idx === entries.length - 1}
            onClick={() => onSwap(e.id, entries[idx + 1].id)}
            title="Переместить вниз"
          >
            ↓
          </button>
          <button
            className="delete-btn"
            onClick={() => onRemove(e.id)}
            title="Удалить"
          >
            ×
          </button>
        </div>
      </li>
    ))}
  </ul>
);

export default ResourcesList;
