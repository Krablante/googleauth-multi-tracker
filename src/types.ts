// src/types.ts
import { Category } from './components/Tabs';
import { Timestamp } from 'firebase/firestore';

export interface Entry {
  id: string;
  date: string;              // YYYY-MM-DD
  title: string;
  category: Category;
  keywords?: string[];
  createdAt?: Timestamp;
}


export interface Goal {
    id: string;
    title: string;
    order: number;     
    createdAt?: Timestamp;
  }
  // --------------------------------------------------

// news
export interface ResourceEntry {
  id: string;
  title: string;
  url: string;
  order: number;     
  createdAt?: Timestamp;
}
