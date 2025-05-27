// src/types.ts
import { Category } from './components/Tabs';

export interface Entry {
  id: string;
  date: string;       // в формате YYYY-MM-DD
  title: string;
  category: Category;
}
