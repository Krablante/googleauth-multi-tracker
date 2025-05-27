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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
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
      {/* полностью скрытый инпут */}
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

      <input
        type="text"
        placeholder="Title"
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
