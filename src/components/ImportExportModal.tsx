// src/components/ImportExportModal.tsx
import React, { useState, useRef } from 'react';
import { useEntries } from '../hooks/useEntries';
import { Category } from './Tabs';

// Категории доступные для импорта/экспорта
const CATEGORIES: Category[] = ['read', 'read_wish', 'films', 'films_wish'];

const sampleTemplate = (cat: Category) => {
  return JSON.stringify([
    { date: 'YYYY-MM-DD', title: 'Название записи' }
  ], null, 2);
};

const ImportExportModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'import' | 'export' | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { entries, addEntry } = useEntries();

  // Сбрасывает режим, категорию и ошибку
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

  // Экспорт в JSON
  const handleExport = () => {
    if (!category) return;
    const data = entries.filter(e => e.category === category);
    if (data.length === 0) {
      setErrorMessage('Нет записей для экспорта в этой категории');
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

  // Импорт из JSON
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!category) return;
    const file = e.target.files?.[0];
    if (!file) return;

    // Проверяем расширение файла
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
      setErrorMessage(`Импортировано ${count} записей из категории ${category}`);
    } catch (err) {
      console.error(err);
      setErrorMessage('Ошибка при разборе файла: убедитесь, что формат JSON корректен');
    }
  };

  return (
    <>
      {/* Кнопка открытия модалки */}
      <button
        className="import-export-button"
        onClick={handleOpen}
        aria-label="Import / Export"
      >
        📁
      </button>

      {/* Модальное окно */}
      {open && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={handleClose}>×</button>

            {/* Ошибка или сообщение */}
            {errorMessage && (
              <div className="modal-error">
                {errorMessage}
              </div>
            )}

            {/* Шаблон JSON сверху для импорта */}
            {category && mode === 'import' && (
              <div className="template-block">
                <h4>Шаблон JSON для {category.toUpperCase()}</h4>
                <pre>{sampleTemplate(category)}</pre>
              </div>
            )}

            {/* Выбор режима */}
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

            {/* Выбор категории */}
            {mode && !category && (
              <div className="category-select">
                <h4>Выберите категорию</h4>
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

            {/* Экспорт */}
            {mode === 'export' && category && (
              <div className="export-block">
                <button onClick={handleExport}>Скачать JSON</button>
              </div>
            )}

            {/* Импорт */}
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
