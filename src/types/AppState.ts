import { Column } from './Column';
import type { FilterValue } from './FilterValue';
import { Task } from './Task';

export interface AppState {
  tasks: Record<string, Task>;
  columns: Record<string, Column>;
  columnOrder: string[];
  filter: FilterValue;
  searchQuery: string;
  selectedTaskIds: string[];
}
