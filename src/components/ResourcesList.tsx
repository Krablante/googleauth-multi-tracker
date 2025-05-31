// src/components/ResourcesList.tsx
import React, { useState, useEffect } from 'react';
import { ResourceEntry } from '../types';

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
  entries: ResourceEntry[];
  onRemove: (id: string) => void;
  onReorder: (newOrderIds: string[]) => void;
}

const ResourcesList: React.FC<Props> = ({ entries, onRemove, onReorder }) => {
  // Локальное состояние, чтобы хранить текущий отсортированный массив
  const [items, setItems] = useState<ResourceEntry[]>([]);

  // При любом изменении props.entries пересортируем локальный state
  useEffect(() => {
    const sorted = [...entries].sort((a, b) => a.order - b.order);
    setItems(sorted);
  }, [entries]);

  // 1) Настраиваем сенсоры: TouchSensor (для Chrome Mobile long-press) + PointerSensor
  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,   // 200ms долгого нажатия, затем drag
        tolerance: 5, // небольшое смещение (в пикселях) для начала drag
      },
    }),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // drag начнётся после перемещения курсора/пальца на 8px
      },
    })
  );

  // 2) Обработчик окончания drag
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    // Индексы старой и новой позиции
    const oldIndex = items.findIndex(item => item.id === active.id);
    const newIndex = items.findIndex(item => item.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    // Меняем порядок в локальном state
    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);

    // Спускаем наверх новый порядок ID-шек
    onReorder(newItems.map(item => item.id));
  };

  // Если список пустой, показываем плейсхолдер
  if (items.length === 0) {
    return <div className="empty">No resources yet</div>;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      // Используем новый MeasuringStrategy (аналог LayoutMeasuringStrategy)
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map(item => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul className="wishlist-entries">
          {items.map(resource => (
            <SortableResourceItem key={resource.id} id={resource.id}>
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="title"
              >
                {resource.title}
              </a>
              <div className="actions">
                <button
                  className="delete-btn"
                  onClick={() => onRemove(resource.id)}
                  title="Удалить"
                >
                  ×
                </button>
              </div>
            </SortableResourceItem>
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
};

export default ResourcesList;

/** Отдельный компонент для каждого элемента списка */
interface SortableResourceItemProps {
  id: string;
  children: React.ReactNode;
}

const SortableResourceItem: React.FC<SortableResourceItemProps> = ({ id, children }) => {
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
