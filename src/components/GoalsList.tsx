// src/components/GoalsList.tsx
import React, { useRef } from 'react';
import { Goal } from '../types';

interface Props {
  entries: Goal[];
  onRemove: (id: string) => void;
  onReorder: (newOrderIds: string[]) => void;
}

const GoalsList: React.FC<Props> = ({ entries, onRemove, onReorder }) => {
  // Сортируем по полю order (хотя Firestore уже возвращает их в правильном порядке)
  const sorted = [...entries].sort((a, b) => a.order - b.order);

  // Ref, чтобы помнить, какой элемент тащим
  const draggingId = useRef<string | null>(null);

  // Когда начали тянуть
  const handleDragStart = (e: React.DragEvent<HTMLLIElement>, id: string) => {
    draggingId.current = id;
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  // Разрешаем drop (по умолчанию браузер не отдаёт onDrop)
  const handleDragOver = (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Когда отпустили на другом элементе
  const handleDrop = (e: React.DragEvent<HTMLLIElement>, targetId: string) => {
    e.preventDefault();
    const sourceId = draggingId.current || e.dataTransfer.getData('text/plain');
    if (!sourceId || sourceId === targetId) return;

    const oldIndex = sorted.findIndex(item => item.id === sourceId);
    const newIndex = sorted.findIndex(item => item.id === targetId);
    if (oldIndex < 0 || newIndex < 0) return;

    const newSorted = Array.from(sorted);
    const [movedItem] = newSorted.splice(oldIndex, 1);
    newSorted.splice(newIndex, 0, movedItem);

    // Передаём наверх новый массив ID-шек
    onReorder(newSorted.map(item => item.id));

    draggingId.current = null;
  };

  // По окончании drag, сбрасываем ref
  const handleDragEnd = () => {
    draggingId.current = null;
  };

  if (sorted.length === 0) {
    return <div className="empty">No goals yet</div>;
  }

  return (
    <ul className="wishlist-entries">
      {sorted.map(goal => (
        <li
          key={goal.id}
          className="wishlist-item"
          draggable
          onDragStart={e => handleDragStart(e, goal.id)}
          onDragOver={handleDragOver}
          onDrop={e => handleDrop(e, goal.id)}
          onDragEnd={handleDragEnd}
        >
          <span className="title">{goal.title}</span>
          <div className="actions">
            <button
              className="complete-btn"
              title="Done"
              onClick={() => onRemove(goal.id)}
            >
              ✓
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default GoalsList;
