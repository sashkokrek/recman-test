import { cva } from 'class-variance-authority';
import { useAppState } from '@/store';
import { Column } from '@/components/Column';
import { AddColumnButton } from '@/components/AddColumnButton';
import { filterBySearch } from '@/lib/filterBySearch';
import { FilterValue } from '@/types/FilterValue';
import type { Task } from '@/types';

const boardViewStyles = cva(
  'flex min-h-[calc(100vh-56px)] flex-col items-start gap-4 p-4 pb-24 sm:flex-row sm:overflow-x-auto'
);
const boardEmptyStateStyles = cva(
  'flex min-h-[calc(100vh-56px)] w-full items-center justify-center p-10'
);
const boardEmptyStateTextStyles = cva('text-base font-medium text-slate-500');

function matchesFilter(task: Task, filter: FilterValue): boolean {
  if (filter === FilterValue.COMPLETE) {
    return task.completed;
  }

  if (filter === FilterValue.INCOMPLETE) {
    return !task.completed;
  }

  return true;
}

export function BoardView() {
  const { tasks, columns, columnOrder, filter, searchQuery } = useAppState();
  const hasSearch = searchQuery.trim().length > 0;
  const hasNonDefaultFilter = filter !== FilterValue.ALL;
  const hasActiveFiltering = hasSearch || hasNonDefaultFilter;

  const visibleColumnOrder = hasActiveFiltering
    ? columnOrder.filter((colId) => {
        const column = columns[colId];
        if (!column) {
          return false;
        }

        const statusMatchedTasks = column.taskIds
          .map((taskId) => tasks[taskId])
          .filter((task): task is Task => Boolean(task))
          .filter((task) => matchesFilter(task, filter));

        return filterBySearch(statusMatchedTasks, searchQuery).length > 0;
      })
    : columnOrder;

  if (hasActiveFiltering && visibleColumnOrder.length === 0) {
    return (
      <div className={boardEmptyStateStyles()}>
        <p className={boardEmptyStateTextStyles()}>No search results</p>
      </div>
    );
  }

  return (
    <div className={boardViewStyles()}>
      {visibleColumnOrder.map((colId) => (
        <Column key={colId} column={columns[colId]} />
      ))}
      <AddColumnButton />
    </div>
  );
}
