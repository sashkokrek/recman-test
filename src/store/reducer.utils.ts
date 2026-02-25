import type { Column } from '@/types/Column';
import type { Task } from '@/types/Task';

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}

export function reorderItems<T>(items: T[], fromIndex: number, toIndex: number): T[] | null {
  if (fromIndex < 0 || toIndex < 0) {
    return null;
  }

  if (fromIndex >= items.length || toIndex >= items.length) {
    return null;
  }

  if (fromIndex === toIndex) {
    return null;
  }

  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);

  if (moved === undefined) {
    return null;
  }

  next.splice(toIndex, 0, moved);

  return next;
}

export function removeTaskIdsFromColumns(
  columns: Record<string, Column>,
  taskIdsSet: Set<string>
): Record<string, Column> {
  const nextEntries = Object.entries(columns).map(([columnId, column]) => {
    return [
      columnId,
      {
        ...column,
        taskIds: column.taskIds.filter((taskId) => !taskIdsSet.has(taskId)),
      },
    ];
  });

  return Object.fromEntries(nextEntries) as Record<string, Column>;
}

export function removeTasksByIds(
  tasks: Record<string, Task>,
  taskIdsSet: Set<string>
): Record<string, Task> {
  const nextEntries = Object.entries(tasks).filter(([taskId]) => !taskIdsSet.has(taskId));

  return Object.fromEntries(nextEntries) as Record<string, Task>;
}

export function getExistingTaskIds(taskIds: string[], tasks: Record<string, Task>): string[] {
  return taskIds.filter((taskId) => Boolean(tasks[taskId]));
}

export function getUniqueExistingTaskIds(taskIds: string[], tasks: Record<string, Task>): string[] {
  return Array.from(new Set(getExistingTaskIds(taskIds, tasks)));
}
