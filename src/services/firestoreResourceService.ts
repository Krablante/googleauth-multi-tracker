// src/services/firestoreResourceService.ts
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { ResourceEntry } from '../types';
import { ResourceService } from './resourceService';

export class FirestoreResourceService implements ResourceService {
  private db = getFirestore();
  private uid: string;
  private collName = 'resources';

  constructor(uid: string) {
    this.uid = uid;
  }

  subscribe(
    onUpdate: (entries: ResourceEntry[]) => void,
    onError?: (e: Error) => void
  ) {
    const q = query(
      collection(this.db, this.collName),
      where('owner', '==', this.uid),
      orderBy('order', 'asc')
    );
    const unsub = onSnapshot(
      q,
      snapshot => {
        const items: ResourceEntry[] = snapshot.docs.map(d => ({
          id: d.id,
          ...(d.data() as Omit<ResourceEntry, 'id'>)
        }));
        onUpdate(items);
      },
      err => onError?.(err)
    );
    return unsub;
  }

  async add(
    entry: Omit<ResourceEntry, 'id' | 'order' | 'createdAt'>
  ): Promise<ResourceEntry> {
    // Определяем текущий максимальный order для пользователя
    const snapshot = await getDocs(
      query(
        collection(this.db, this.collName),
        where('owner', '==', this.uid),
        orderBy('order', 'desc')
      )
    );
    const maxOrder = snapshot.docs[0]?.data().order || 0;
    const newOrder = maxOrder + 1;

    const ref = await addDoc(collection(this.db, this.collName), {
      owner: this.uid,
      title: entry.title,
      url: entry.url,
      order: newOrder,
      createdAt: serverTimestamp(),
    });

    return { id: ref.id, title: entry.title, url: entry.url, order: newOrder };
  }

  async remove(id: string): Promise<void> {
    await deleteDoc(doc(this.db, this.collName, id));
  }

  async updateOrder(id: string, newOrder: number): Promise<void> {
    const ref = doc(this.db, this.collName, id);
    await updateDoc(ref, { order: newOrder });
  }
}
