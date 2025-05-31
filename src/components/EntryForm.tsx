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

  // Если категория заканчивается на "_wish" или равна "goals", скрываем дату и ключевые слова
  const isNoDate = activeCategory.endsWith('_wish') || activeCategory === 'goals';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    // Разбираем строку ключевых слов через ';', только если это не вишлист и не цели
    const raw = keywordsInput.trim();
    const keywordsArray: string[] =
      !isNoDate && raw
        ? raw
            .split(';')
            .map((s) => s.trim())
            .filter((s) => s.length > 0)
        : [];

    // Если категория goals, передаём пустую дату
    const dateValue = activeCategory === 'goals' ? '' : date;

    onAdd({
      date: dateValue,
      title: trimmed,
      category: activeCategory,
      ...(keywordsArray.length > 0 ? { keywords: keywordsArray } : {}),
    });

    // Сбрасываем поля после отправки
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
      {/* Первая строка: календарь + поле «Название» + кнопка */}
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

      {/* Вторая строка: поле для ввода ключевых слов (скрываем для вишлистов и целей) */}
      {!isNoDate && (
        <div className="entry-row entry-row--bottom">
          <input
            type="text"
            placeholder="Ключевые слова через `;` (необязательно)"
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
