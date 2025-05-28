// src/types.ts
import { Category } from './components/Tabs';
import { Timestamp } from 'firebase/firestore';

export interface Entry {
  id: string;
  date: string;              // YYYY-MM-DD — для обычных категорий
  title: string;
  category: Category;
  createdAt?: Timestamp;
}

// Новый интерфейс для хранения ресурсов (news, сайты и пр.)
export interface ResourceEntry {
  id: string;
  title: string;
  url: string;
  order: number;            // Порядок отображения
  createdAt?: Timestamp;     // Для первичной сортировки
}
