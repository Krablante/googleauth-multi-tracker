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

  return (
    <form onSubmit={handleSubmit} className="entry-form">
      <div>
      <input
        type="date"
        id="date-input"
        className="visually-hidden"
        value={date}
        onChange={e => setDate(e.target.value)}
      />

      {/* <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          required
        /> */}
      </div>
      <div>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
      </div>
      <button type="submit">A</button>
    </form>
  );
};

export default EntryForm;
