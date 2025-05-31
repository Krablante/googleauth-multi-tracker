// src/components/GoalsList.tsx
import React, { useState, useEffect } from 'react';
import { Goal } from '../types';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  MeasuringStrategy,
} from '@dnd-kit/core';

import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';

interface Props {
  entries: Goal[];
  onRemove: (id: string) => void;
  onReorder: (newOrderIds: string[]) => void;
}

const GoalsList: React.FC<Props> = ({ entries, onRemove, onReorder }) => {
  const [items, setItems] = useState<Goal[]>([]);

  // При обновлении props.entries — пересортируем локальный state
  useEffect(() => {
    const sorted = [...entries].sort((a, b) => a.order - b.order);
    setItems(sorted);
  }, [entries]);

  // 1. Настраиваем сенсоры: TouchSensor + PointerSensor
  //    - TouchSensor с delay, чтобы поймать long-press в Chrome Mobile
  //    - PointerSensor для мыши и Firefox Mobile
  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,       // 200 мс «задержка» после тача, прежде чем начнётся drag
        tolerance: 5,     // небольшое смещение до начала drag
      },
    }),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,      // drag начнётся после перемещения курсора (или пальца) на 8px
      },
    })
  );

  // 2. Обработчик окончания drag
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = items.findIndex(item => item.id === active.id);
    const newIndex = items.findIndex(item => item.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);
    onReorder(newItems.map(item => item.id));
  };

  if (items.length === 0) {
    return <div className="empty">No goals yet</div>;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map(goal => goal.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul className="wishlist-entries">
          {items.map((goal) => (
            <SortableItem key={goal.id} id={goal.id}>
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
            </SortableItem>
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
};

export default GoalsList;

/** Отдельный компонент для каждого <li> */
interface SortableItemProps {
  id: string;
  children: React.ReactNode;
}

const SortableItem: React.FC<SortableItemProps> = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.9 : 1,
    zIndex: isDragging ? 999 : 'auto',
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="wishlist-item"
    >
      {children}
    </li>
  );
};
