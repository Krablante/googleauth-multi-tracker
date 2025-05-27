// src/components/EntryForm.tsx
import React, { useState } from 'react';
import { Category } from './Tabs';

interface EntryFormProps {
  activeCategory: Category;
  onAdd: (entry: { date: string; title: string; category: Category }) => void;
}

const EntryForm: React.FC<EntryFormProps> = ({ activeCategory, onAdd }) => {
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate]   = useState<string>(today);
  const [title, setTitle] = useState<string>('');

  // считаем, что вишлист, если категория заканчивается на "_wish"
  const isWishlist = activeCategory.endsWith('_wish');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    // Если вишлист — всё равно сохраняем date (на будущее переносов)
    onAdd({ date, title: trimmed, category: activeCategory });
    setTitle('');
    setDate(today);
  };

  const openPicker = () => {
    const input = document.getElementById('date-input') as HTMLInputElement | null;
    if (input && typeof input.showPicker === 'function') {
      input.showPicker();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="entry-form">
      {/* Для обычных категорий — скрытый date-input + кнопка */}
      {!isWishlist && (
        <>
          <input
            type="date"
            id="date-input"
            className="visually-hidden"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
          <button
            type="button"
            className="date-btn"
            onClick={openPicker}
            aria-label="Select date"
          >
            📅
          </button>
        </>
      )}

      <input
        type="text"
        placeholder="..."
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="title-input"
        required
      />
      <button type="submit" className="submit-btn">A</button>
    </form>
  );
};

export default EntryForm;
