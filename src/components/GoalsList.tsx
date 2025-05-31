// src/components/GoalsList.tsx
import React, { useState, useEffect } from 'react';
import { Goal } from '../types';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  MeasuringStrategy, // <-- заменили LayoutMeasuringStrategy на MeasuringStrategy
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

  useEffect(() => {
    const sorted = [...entries].sort((a, b) => a.order - b.order);
    setItems(sorted);
  }, [entries]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

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
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }} // <-- здесь тоже
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map(goal => goal.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul className="wishlist-entries">
          {items.map((goal, index) => (
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
