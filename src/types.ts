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
