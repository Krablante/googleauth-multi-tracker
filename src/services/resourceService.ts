import { ResourceEntry } from '../types';

export interface ResourceService {
  /** Subscribe to resource list changes */
  subscribe: (
    onUpdate: (entries: ResourceEntry[]) => void,
    onError?: (e: Error) => void
  ) => () => void;

  /** Add resource (title, url); order is assigned automatically */
  add: (
    entry: Omit<ResourceEntry, 'id' | 'order' | 'createdAt'>
  ) => Promise<ResourceEntry>;

  /** Delete resource */
  remove: (id: string) => Promise<void>;

  /** Update resource order */
  updateOrder: (id: string, newOrder: number) => Promise<void>;
}
