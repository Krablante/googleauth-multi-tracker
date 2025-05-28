import { ResourceEntry } from '../types';

export interface ResourceService {
  /** Подписка на изменения списка ресурсов */
  subscribe: (
    onUpdate: (entries: ResourceEntry[]) => void,
    onError?: (e: Error) => void
  ) => () => void;

  /** Добавить ресурс (title, url); порядок назначается автоматически */
  add: (
    entry: Omit<ResourceEntry, 'id' | 'order' | 'createdAt'>
  ) => Promise<ResourceEntry>;

  /** Удалить ресурс */
  remove: (id: string) => Promise<void>;

  /** Обновить порядок ресурса */
  updateOrder: (id: string, newOrder: number) => Promise<void>;
}
