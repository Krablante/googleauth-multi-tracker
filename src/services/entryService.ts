import { Entry } from '../types';
export interface EntryService {
  subscribe: (onUpdate: (entries: Entry[]) => void, onError?: (e: Error) => void) => () => void;
  add: (entry: Omit<Entry, 'id'>) => Promise<Entry>;
  remove: (id: string) => Promise<void>;
}
