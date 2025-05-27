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
      where('owner', '==', this.uid)
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
    const ref = await addDoc(collection(this.db, 'readings'), {
      owner: this.uid,
      ...entry,
    });
    return { id: ref.id, ...entry };
  }

  async remove(id: string): Promise<void> {
    await deleteDoc(doc(this.db, 'readings', id));
  }
}
