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

// Regular expression for searching URLs
const URL_REGEX = /https?:\/\/[\w\-._~:/?#[\]@!&;'()*+,;=%]+/g;

const GoalsList: React.FC<Props> = ({ entries, onRemove, onReorder }) => {
  const [items, setItems] = useState<Goal[]>([]);

  useEffect(() => {
    const sorted = [...entries].sort((a, b) => a.order - b.order);
    setItems(sorted);
  }, [entries]);

  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex(item => item.id === active.id);
    const newIndex = items.findIndex(item => item.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);
    onReorder(newItems.map(item => item.id));
  };

  // Function that splits text into segments: plain text + clickable <a> for URL
  const renderTitle = (text: string) => {
    const segments: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = URL_REGEX.exec(text)) !== null) {
      const url = match[0];
      const index = match.index;

      // Add everything before the URL as plain text
      if (index > lastIndex) {
        segments.push(text.slice(lastIndex, index));
      }

      // Add the URL itself as a link
      segments.push(
        <a
          key={index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="title"
        >
          {url}
        </a>
      );

      lastIndex = index + url.length;
    }

    // If there is normal text left after the last match
    if (lastIndex < text.length) {
      segments.push(text.slice(lastIndex));
    }

    // If no URL is found, just return the original string
    return segments.length > 0 ? segments : text;
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
          {items.map(goal => (
            <SortableItem key={goal.id} id={goal.id}>
              <span className="title">{renderTitle(goal.title)}</span>
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
