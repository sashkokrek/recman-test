import type { FilterValue } from './FilterValue';

export type AppAction =
  // Tasks
  | { type: 'TASK_ADD'; payload: { columnId: string; text: string } }
  | { type: 'TASK_DELETE'; payload: { taskId: string } }
  | { type: 'TASK_DELETE_BULK'; payload: { taskIds: string[] } }
  | { type: 'TASK_TOGGLE'; payload: { taskId: string } }
  | { type: 'TASK_TOGGLE_BULK'; payload: { taskIds: string[]; completed: boolean } }
  | { type: 'TASK_EDIT'; payload: { taskId: string; text: string } }
  | { type: 'TASK_REORDER'; payload: { columnId: string; fromIndex: number; toIndex: number } }
  | {
      type: 'TASK_MOVE';
      payload: { taskId: string; fromColumnId: string; toColumnId: string; toIndex: number };
    }
  | { type: 'TASK_MOVE_BULK'; payload: { taskIds: string[]; toColumnId: string } }

  // Columns
  | { type: 'COLUMN_ADD'; payload: { title: string } }
  | { type: 'COLUMN_DELETE'; payload: { columnId: string } }
  | { type: 'COLUMN_RENAME'; payload: { columnId: string; title: string } }
  | { type: 'COLUMN_REORDER'; payload: { fromIndex: number; toIndex: number } }

  // UI state
  | { type: 'FILTER_SET'; payload: FilterValue }
  | { type: 'SEARCH_SET'; payload: string }
  | { type: 'TASK_SELECT_TOGGLE'; payload: { taskId: string } }
  | { type: 'COLUMN_SELECT_ALL'; payload: { columnId: string } }
  | { type: 'SELECTION_CLEAR' };
