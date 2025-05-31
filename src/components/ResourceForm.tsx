// src/components/ResourceForm.tsx
import React, { useState } from 'react';

interface ResourceFormProps {
  onAdd: (entry: { title: string; url: string }) => void;
}

const ResourceForm: React.FC<ResourceFormProps> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedUrl = url.trim();
    if (!trimmedTitle || !trimmedUrl) return;
    onAdd({ title: trimmedTitle, url: trimmedUrl });
    setTitle('');
    setUrl('');
  };  
  return (
    <form onSubmit={handleSubmit} className="entry-form">
      <input
        type="text"
        placeholder="title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="title-input"
        required
      />
      <input
        type="url"
        placeholder="URL"
        value={url}
        onChange={e => setUrl(e.target.value)}
        className="title-input"
        required
      />
      <button type="submit" className="submit-btn">+</button>
    </form>
  );
};

export default ResourceForm;