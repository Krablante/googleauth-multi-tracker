// src/services/firestoreEntryService.ts

import { EntryService } from './entryService';
import { Entry } from '../types';
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  orderBy,
  updateDoc,
} from 'firebase/firestore';

export class FirestoreEntryService implements EntryService {
  private db = getFirestore();
  private uid: string;

  constructor(uid: string) {
    this.uid = uid;
  }

  subscribe(onUpdate: (entries: Entry[]) => void, onError?: (e: Error) => void) {
    const q = query(
      collection(this.db, 'readings'),
      where('owner', '==', this.uid),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(
      q,
      snapshot => {
        const notes: Entry[] = snapshot.docs.map(d => ({
          id: d.id,
          ...(d.data() as Omit<Entry, 'id'>),
        }));
        onUpdate(notes);
      },
      err => onError?.(err)
    );
    return unsub;
  }

  async add(entry: Omit<Entry, 'id'>): Promise<Entry> {
      // Соберём объект для записи, добавляя keywords только если оно есть
      const dataToSave: any = {
        owner: this.uid,
        title: entry.title,
        date: entry.date,
        category: entry.category,
        createdAt: serverTimestamp(),
      };
      // Если пользователь передал keywords (и там хотя бы один непустой элемент) — сохраним его
      if (entry.keywords && entry.keywords.length > 0) {
        dataToSave.keywords = entry.keywords;
      }

      const ref = await addDoc(collection(this.db, 'readings'), dataToSave);
    return { id: ref.id, ...entry };
  }

  async remove(id: string): Promise<void> {
    await deleteDoc(doc(this.db, 'readings', id));
  }

  async updateOrder(id: string, newOrder: number): Promise<void> {
    const refDoc = doc(this.db, 'readings', id);
    await updateDoc(refDoc, { order: newOrder });
  }
}
