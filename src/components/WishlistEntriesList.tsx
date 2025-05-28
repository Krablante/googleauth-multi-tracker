// src/components/WishlistEntriesList.tsx
import React from 'react';
import { Entry } from '../types';

interface Props {
  entries: Entry[];
  onRemove: (id: string) => void;
  onComplete: (entry: Entry) => void;
}

// URL reg
const URL_REGEX = /https?:\/\/[\w\-._~:/?#[\]@!$&'()*+,;=%]+/g;

const WishlistEntriesList: React.FC<Props> = ({ entries, onRemove, onComplete }) => {
  // sort
  const sorted = [...entries].sort((a, b) => {
    const ta = a.createdAt?.seconds ?? 0;
    const tb = b.createdAt?.seconds ?? 0;
    return tb - ta;
  });

  const renderTitle = (text: string) => {
    const segments: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = URL_REGEX.exec(text)) !== null) {
      const url = match[0];
      const index = match.index;
      if (index > lastIndex) {
        segments.push(text.slice(lastIndex, index));
      }
      segments.push(
        <a
          key={index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="title"
        >
          {url}
        </a>
      );
      lastIndex = index + url.length;
    }
    if (lastIndex < text.length) {
      segments.push(text.slice(lastIndex));
    }
    return segments.length > 0 ? segments : text;
  };

  return (
    <ul className="wishlist-entries">
      {sorted.map(e => (
        <li key={e.id} className="wishlist-item">
          <span className="title">
            {renderTitle(e.title)}
          </span>
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
