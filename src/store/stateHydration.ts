import { loadState } from '@/lib/localStorage';
import { STORAGE_KEY } from '@/lib/constants';
import type { AppState } from '@/types/AppState';
import type { Column } from '@/types/Column';
import { FilterValue } from '@/types/FilterValue';
import type { Task } from '@/types/Task';

type PersistentState = Pick<AppState, 'tasks' | 'columns' | 'columnOrder'>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function sanitizeTask(idFromKey: string, value: unknown): Task | null {
  if (!isRecord(value)) {
    return null;
  }

  if (typeof value.text !== 'string') {
    return null;
  }

  if (typeof value.completed !== 'boolean') {
    return null;
  }

  if (typeof value.createdAt !== 'number' || !Number.isFinite(value.createdAt)) {
    return null;
  }

  return {
    id: idFromKey,
    text: value.text,
    completed: value.completed,
    createdAt: value.createdAt,
  };
}

function sanitizeColumn(
  idFromKey: string,
  value: unknown,
  tasks: Record<string, Task>
): Column | null {
  if (!isRecord(value)) {
    return null;
  }

  if (typeof value.title !== 'string') {
    return null;
  }

  if (!Array.isArray(value.taskIds)) {
    return null;
  }

  const title = value.title.trim();
  if (!title) {
    return null;
  }

  const dedupedTaskIds = Array.from(
    new Set(
      value.taskIds.filter((taskId): taskId is string => {
        if (typeof taskId !== 'string') {
          return false;
        }

        return Boolean(tasks[taskId]);
      })
    )
  );

  return {
    id: idFromKey,
    title,
    taskIds: dedupedTaskIds,
  };
}

function sanitizePersistedState(saved: Partial<AppState>): PersistentState | null {
  if (!isRecord(saved.tasks) || !isRecord(saved.columns) || !Array.isArray(saved.columnOrder)) {
    return null;
  }

  const tasks: Record<string, Task> = {};
  for (const [taskId, taskValue] of Object.entries(saved.tasks)) {
    const task = sanitizeTask(taskId, taskValue);
    if (task) {
      tasks[taskId] = task;
    }
  }

  const columns: Record<string, Column> = {};
  for (const [columnId, columnValue] of Object.entries(saved.columns)) {
    const column = sanitizeColumn(columnId, columnValue, tasks);
    if (column) {
      columns[columnId] = column;
    }
  }

  if (Object.keys(columns).length === 0) {
    return null;
  }

  const orderedColumnIds = saved.columnOrder.filter((columnId): columnId is string => {
    if (typeof columnId !== 'string') {
      return false;
    }

    return Boolean(columns[columnId]);
  });

  const orderedSet = new Set(orderedColumnIds);
  const remainingColumnIds = Object.keys(columns).filter((columnId) => !orderedSet.has(columnId));
  const columnOrder = [...orderedColumnIds, ...remainingColumnIds];

  if (columnOrder.length === 0) {
    return null;
  }

  return {
    tasks,
    columns,
    columnOrder,
  };
}

function withDefaultUiState(state: PersistentState): AppState {
  return {
    ...state,
    filter: FilterValue.ALL,
    searchQuery: '',
    selectedTaskIds: [],
  };
}

function createEmptyState(): AppState {
  return withDefaultUiState({
    tasks: {},
    columns: {},
    columnOrder: [],
  });
}

export function buildInitialState(): AppState {
  const saved = loadState(STORAGE_KEY);

  if (saved) {
    const hydrated = sanitizePersistedState(saved);

    if (hydrated) {
      return withDefaultUiState(hydrated);
    }
  }

  return createEmptyState();
}
