// src/services/firestoreGoalService.ts

import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDocs,
  limit,
} from 'firebase/firestore';
import { Goal } from '../types';
import { GoalService } from './goalService';

export class FirestoreGoalService implements GoalService {
  private db = getFirestore();
  private uid: string;
  private collName = 'goals'; // <— здесь мы выбираем отдельную коллекцию

  constructor(uid: string) {
    this.uid = uid;
  }

  subscribe(
    onUpdate: (goals: Goal[]) => void,
    onError?: (e: Error) => void
  ) {
    // Подписываемся на все документы в коллекции `goals`,
    // принадлежащие текущему пользователю (owner===uid),
    // сортируем по полю 'order' (возрастание).
    const q = query(
      collection(this.db, this.collName),
      where('owner', '==', this.uid),
      orderBy('order', 'asc')
    );
    const unsub = onSnapshot(
      q,
      snapshot => {
        const items: Goal[] = snapshot.docs.map(d => {
          const data = d.data() as Omit<Goal, 'id'> & { owner: string };
          return {
            id: d.id,
            title: data.title,
            order: data.order,
            createdAt: data.createdAt,
          };
        });
        onUpdate(items);
      },
      err => {
        if (onError) onError(err);
      }
    );
    return unsub;
  }

  async add(goal: Omit<Goal, 'id' | 'createdAt'>): Promise<Goal> {
    // 1) Определяем максимальный order среди существующих целей
    const goalsQuery = query(
      collection(this.db, this.collName),
      where('owner', '==', this.uid),
      orderBy('order', 'desc'),
      limit(1)
    );
    const snapshot = await getDocs(goalsQuery);
    const maxOrderDoc = snapshot.docs[0];
    const maxOrder = maxOrderDoc ? (maxOrderDoc.data() as any).order : 0;
    const newOrder = maxOrder + 1;

    // 2) Создаём документ в коллекции `goals`
    const ref = await addDoc(collection(this.db, this.collName), {
      owner: this.uid,
      title: goal.title,
      order: newOrder,
      createdAt: serverTimestamp(),
    });

    return {
      id: ref.id,
      title: goal.title,
      order: newOrder,
      // createdAt поле сработает в onSnapshot, подробнее — ниже
    };
  }

  async remove(id: string): Promise<void> {
    await deleteDoc(doc(this.db, this.collName, id));
  }

  async updateOrder(id: string, newOrder: number): Promise<void> {
    const refDoc = doc(this.db, this.collName, id);
    await updateDoc(refDoc, { order: newOrder });
  }
}
