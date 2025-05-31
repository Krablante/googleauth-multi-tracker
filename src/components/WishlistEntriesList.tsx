// src/components/WishlistEntriesList.tsx
import React, { useState } from 'react';
import { Entry } from '../types';

interface Props {
  entries: Entry[];
  onRemove: (id: string) => void;
  // раньше было onComplete: (entry: Entry) => void
  onComplete: (entry: Entry, keywords?: string[]) => void;
}

// Регулярное выражение для поиска URL-ов (если необходимо оставлять кликабельные ссылки)
const URL_REGEX = /https?:\/\/[\w\-._~:/?#[\]@!&;'()*+,;=%]+/g;

const WishlistEntriesList: React.FC<Props> = ({ entries, onRemove, onComplete }) => {
  // отсортированный по createdAt вишлист
  const sorted = [...entries].sort((a, b) => {
    const ta = a.createdAt?.seconds ?? 0;
    const tb = b.createdAt?.seconds ?? 0;
    return tb - ta;
  });

  // Локальный state: id элемента, для которого сейчас открыт «режим ввода ключевых слов»
  const [editingId, setEditingId] = useState<string | null>(null);
  const [keywordsInput, setKeywordsInput] = useState<string>('');

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

  // Вызывается при клике «✓» на обычной строке (еще без ввода ключевых слов):
  const handleStartEdit = (entry: Entry) => {
    setEditingId(entry.id);
    setKeywordsInput('');
  };

  // Вызывается, когда пользователь в «режиме ввода» либо подтвердил теги, либо пропустил:
  const handleConfirm = (entry: Entry) => {
    const raw = keywordsInput.trim();
    const keywordsArray: string[] = raw
      ? raw
          .split(';')
          .map((s) => s.trim())
          .filter((s) => s.length > 0)
      : [];
    // Передаём либо []: в MainApp он поймёт, что это пустой массив
    onComplete(entry, keywordsArray);
    // Сбрасываем локальные state
    setEditingId(null);
    setKeywordsInput('');
  };

  // Если пользователь нажал «×» во время ввода тегов:
  const handleCancelEdit = () => {
    setEditingId(null);
    setKeywordsInput('');
  };

  return (
    <ul className="wishlist-entries">
      {sorted.map((e) => (
        <li key={e.id} className="wishlist-item">
          {/* Если этот элемент сейчас в «режиме ввода ключевых слов», показываем особый блок */}
          {editingId === e.id ? (
            <div className="wishlist-item-editing">
              {/* Основная строка с заголовком (без кнопки ✓, т.к. мы уже в режиме редактирования) */}
              <div className="item-main">
                <span className="title">{renderTitle(e.title)}</span>
                {/* Кнопка отмены ввода тегов */}
                <button
                  className="delete-btn"
                  onClick={handleCancelEdit}
                  title="Отменить"
                >
                  ×
                </button>
              </div>
              {/* Форма для ключевых слов */}
              <div className="keywords-input-block">
                <input
                  type="text"
                  placeholder="keywords `;`"
                  value={keywordsInput}
                  onChange={(ev) => setKeywordsInput(ev.target.value)}
                  className="keywords-input"
                />
                <button
                  className="complete-btn"
                  title="Подтвердить и переместить"
                  onClick={() => handleConfirm(e)}
                >
                  ✓
                </button>
              </div>
            </div>
          ) : (
            /* Обычная строка вишлиста */
            <div className="item-main">
              <span className="title">{renderTitle(e.title)}</span>
              <div className="actions">
                <button
                  className="complete-btn"
                  title="Отметить как прочитанное"
                  onClick={() => handleStartEdit(e)}
                >
                  ✓
                </button>
                <button
                  className="delete-btn"
                  title="Удалить"
                  onClick={() => onRemove(e.id)}
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default WishlistEntriesList;
