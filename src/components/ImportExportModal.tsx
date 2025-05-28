// src/components/ImportExportModal.tsx
import React, { useState, useRef } from 'react';
import { useEntries } from '../hooks/useEntries';
import { Category } from './Tabs';

// Categories available for import/export
const CATEGORIES: Category[] = ['read', 'read_wish', 'films', 'films_wish'];

const sampleTemplate = (cat: Category) => {
  return JSON.stringify([
    { date: 'YYYY-MM-DD', title: 'Post Title' }
  ], null, 2);
};

const ImportExportModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'import' | 'export' | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { entries, addEntry } = useEntries();

  // Resets mode, category and error
  const resetState = () => {
    setMode(null);
    setCategory(null);
    setErrorMessage(null);
  };

  const handleOpen = () => {
    resetState();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetState();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Export
  const handleExport = () => {
    if (!category) return;
    const data = entries.filter(e => e.category === category);
    if (data.length === 0) {
      setErrorMessage('There are no records to export in this category');
      return;
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${category}-export-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    handleClose();
  };

  // Import
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!category) return;
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.json') || file.type !== 'application/json') {
      setErrorMessage('Пожалуйста, выберите корректный JSON-файл');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    try {
      const text = await file.text();
      const items: Array<{ date: string; title: string }> = JSON.parse(text);
      let count = 0;
      for (const item of items) {
        if (item.date && item.title) {
          await addEntry({ date: item.date, title: item.title.trim(), category });
          count++;
        }
      }
      setErrorMessage(`Imported ${count} records from category ${category}`);
    } catch (err) {
      console.error(err);
      setErrorMessage('Error parsing file: Make sure the JSON format is correct');
    }
  };

  return (
    <>
      <button
        className="import-export-button"
        onClick={handleOpen}
        aria-label="Import / Export"
      >
        📁
      </button>

      {/* Modal window */}
      {open && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={handleClose}>×</button>

            {/* Error */}
            {errorMessage && (
              <div className="modal-error">
                {errorMessage}
              </div>
            )}

            {/* JSON template for import */}
            {category && mode === 'import' && (
              <div className="template-block">
                <h4>JSON template for {category.toUpperCase()}</h4>
                <pre>{sampleTemplate(category)}</pre>
              </div>
            )}

            {/* Select mode */}
            {!mode && (
              <div className="mode-select">
                <button onClick={() => { resetState(); setMode('export'); }}>
                  Export
                </button>
                <button onClick={() => { resetState(); setMode('import'); }}>
                  Import
                </button>
              </div>
            )}

            {/* category choose */}
            {mode && !category && (
              <div className="category-select">
                <h4>CHOOSE</h4>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setErrorMessage(null); setCategory(cat); }}
                  >
                    {cat.toUpperCase()}
                  </button>
                ))}
              </div>
            )}

            {/* export */}
            {mode === 'export' && category && (
              <div className="export-block">
                <button onClick={handleExport}>Download</button>
              </div>
            )}

            {/* import */}
            {mode === 'import' && category && (
              <div className="import-block">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/json"
                  onChange={handleImport}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ImportExportModal;
