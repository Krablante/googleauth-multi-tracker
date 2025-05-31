// src/components/EntryForm.tsx
import React, { useState } from 'react';
import { Category } from './Tabs';

interface EntryFormProps {
  activeCategory: Category;
  onAdd: (entry: { date: string; title: string; category: Category; keywords?: string[] }) => void;
}

const EntryForm: React.FC<EntryFormProps> = ({ activeCategory, onAdd }) => {
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState<string>(today);
  const [title, setTitle] = useState<string>('');
  const [keywordsInput, setKeywordsInput] = useState<string>('');

  // If category ends with "_wish" or equals "goals", hide date and keywords
  const isNoDate = activeCategory.endsWith('_wish') || activeCategory === 'goals';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    // Parse the keyword string through ';', only if it is not a wishlist or goals
    const raw = keywordsInput.trim();
    const keywordsArray: string[] =
      !isNoDate && raw
        ? raw
            .split(';')
            .map((s) => s.trim())
            .filter((s) => s.length > 0)
        : [];

    // If the category is goals, pass an empty date
    const dateValue = activeCategory === 'goals' ? '' : date;

    onAdd({
      date: dateValue,
      title: trimmed,
      category: activeCategory,
      ...(keywordsArray.length > 0 ? { keywords: keywordsArray } : {}),
    });

    // Reset fields after sending
    setTitle('');
    setDate(today);
    setKeywordsInput('');
  };

  const openPicker = () => {
    const input = document.getElementById('date-input') as HTMLInputElement | null;
    if (input && typeof input.showPicker === 'function') {
      input.showPicker();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="entry-form">
      {/* First line: calendar + "Title" field + button */}
      <div className="entry-row entry-row--top">
        {!isNoDate && (
          <>
            <input
              type="date"
              id="date-input"
              className="visually-hidden"
              value={date}
              onChange={(e) => setDate(e.target.value)}
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
          onChange={(e) => setTitle(e.target.value)}
          className="title-input"
          required
        />

        <button type="submit" className="submit-btn">
          A
        </button>
      </div>

      {/* Second line: field for entering keywords (hide for wishlists and goals) */}
      {!isNoDate && (
        <div className="entry-row entry-row--bottom">
          <input
            type="text"
            placeholder="keywords `;`"
            value={keywordsInput}
            onChange={(e) => setKeywordsInput(e.target.value)}
            className="keywords-input"
          />
        </div>
      )}
    </form>
  );
};

export default EntryForm;
