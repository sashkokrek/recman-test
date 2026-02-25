import { useEffect, useRef } from 'react';
import { cva } from 'class-variance-authority';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { useAppDispatch, useAppState } from '@/store';
import { ColumnHeader } from '@/components/ColumnHeader';
import { TaskCard } from '@/components/TaskCard';
import { AddTaskInput } from '@/components/AddTaskInput';
import { useDraggableTask } from '@/hooks/useDraggableTask';
import { useTaskDropTarget } from '@/hooks/useTaskDropTarget';
import { useDraggableColumn } from '@/hooks/useDraggableColumn';
import { useColumnDropTarget } from '@/hooks/useColumnDropTarget';
import { filterBySearch } from '@/lib/filterBySearch';
import type { Column as ColumnType, Task } from '@/types';

const taskRowStyles = cva('relative');
const taskDropIndicatorStyles = cva(
  'absolute left-2 right-2 z-10 h-0.5 rounded-full bg-indigo-500',
  {
    variants: {
      edge: {
        top: '-top-0.5',
        bottom: '-bottom-0.5',
      },
    },
  }
);
const columnStyles = cva(
  'flex w-full shrink-0 flex-col rounded-xl border bg-white shadow-[--shadow-card] transition-all sm:w-72',
  {
    variants: {
      dragging: {
        true: 'border-indigo-300 opacity-50 shadow-[--shadow-drag]',
        false: 'border-slate-200',
      },
      over: {
        true: 'border-indigo-300 ring-2 ring-indigo-100',
        false: '',
      },
    },
    defaultVariants: {
      dragging: false,
      over: false,
    },
  }
);
const columnDividerStyles = cva('mx-3 h-px bg-slate-100');
const columnTaskListStyles = cva(
  'min-h-0 max-h-[calc(100vh-220px)] flex-1 space-y-1.5 overflow-y-auto p-2'
);
const columnEmptyStateStyles = cva(
  'flex h-16 items-center justify-center rounded-lg border-2 border-dashed border-slate-100'
);
const columnEmptyStateTextStyles = cva('text-xs text-slate-300');

interface TaskRowProps {
  task: Task;
  columnId: string;
  isSelected: boolean;
  searchQuery: string;
}

function TaskRow({ task, columnId, isSelected, searchQuery }: TaskRowProps) {
  const dispatch = useAppDispatch();
  const { cardRef, dragHandleRef, isDragging } = useDraggableTask(task.id, columnId);
  const { dropRef, dropState } = useTaskDropTarget(task.id, columnId);

  const mergedRef = (el: HTMLDivElement | null) => {
    cardRef.current = el;
    dropRef.current = el;
  };

  return (
    <div className={taskRowStyles()}>
      {dropState === 'over-top' && <div className={taskDropIndicatorStyles({ edge: 'top' })} />}
      <div ref={mergedRef} data-task-id={task.id}>
        <TaskCard
          task={task}
          isSelected={isSelected}
          searchQuery={searchQuery}
          dragHandleRef={dragHandleRef}
          isDragging={isDragging}
          onToggle={() => dispatch({ type: 'TASK_TOGGLE', payload: { taskId: task.id } })}
          onDelete={() => dispatch({ type: 'TASK_DELETE', payload: { taskId: task.id } })}
          onEdit={(text) => dispatch({ type: 'TASK_EDIT', payload: { taskId: task.id, text } })}
          onSelect={() => dispatch({ type: 'TASK_SELECT_TOGGLE', payload: { taskId: task.id } })}
        />
      </div>
      {dropState === 'over-bottom' && (
        <div className={taskDropIndicatorStyles({ edge: 'bottom' })} />
      )}
    </div>
  );
}

interface ColumnProps {
  column: ColumnType;
}

export function Column({ column }: ColumnProps) {
  const dispatch = useAppDispatch();
  const { tasks, columns, columnOrder, filter, searchQuery, selectedTaskIds } = useAppState();
  const { columnRef, dragHandleRef, isDragging } = useDraggableColumn(column.id);
  const { dropRef, isOver } = useColumnDropTarget(column.id);

  const mergedRef = (el: HTMLDivElement | null) => {
    columnRef.current = el;
    dropRef.current = el;
  };

  const columnsRef = useRef(columns);
  const columnOrderRef = useRef(columnOrder);

  useEffect(() => {
    columnsRef.current = columns;
  });

  useEffect(() => {
    columnOrderRef.current = columnOrder;
  });

  const columnTasks = column.taskIds.map((id) => tasks[id]).filter(Boolean);

  const filteredTasks = columnTasks.filter((task) => {
    if (filter === 'complete' && !task.completed) {
      return false;
    }

    if (filter === 'incomplete' && task.completed) {
      return false;
    }

    return true;
  });

  const visibleTasks = filterBySearch(filteredTasks, searchQuery);

  const colSelectedCount = column.taskIds.filter((id) => selectedTaskIds.includes(id)).length;
  const allSelected = column.taskIds.length > 0 && colSelectedCount === column.taskIds.length;

  // Global DnD monitor — handles task drop events for THIS column.
  useEffect(() => {
    return monitorForElements({
      onDrop: ({ source, location }) => {
        const dest = location.current.dropTargets[0];
        if (!dest) {
          return;
        }

        const cols = columnsRef.current;
        const colOrder = columnOrderRef.current;

        // Task dropped on a task target
        if (source.data.type === 'task' && dest.data.type === 'task-drop-target') {
          const { taskId, sourceColumnId } = source.data as {
            taskId: string;
            sourceColumnId: string;
          };
          const { taskId: targetTaskId, columnId: targetColumnId } = dest.data as {
            taskId: string;
            columnId: string;
          };

          if (targetColumnId !== column.id) {
            return;
          }

          const targetCol = cols[targetColumnId];
          if (!targetCol) {
            return;
          }

          const targetIndex = targetCol.taskIds.indexOf(targetTaskId);
          const rect = document
            .querySelector(`[data-task-id="${targetTaskId}"]`)
            ?.getBoundingClientRect();
          const dropY = location.current.input.clientY;
          const insertIndex =
            rect && dropY > rect.top + rect.height / 2 ? targetIndex + 1 : targetIndex;

          if (sourceColumnId === targetColumnId) {
            const fromIndex = targetCol.taskIds.indexOf(taskId);
            if (fromIndex !== -1 && fromIndex !== insertIndex && fromIndex !== insertIndex - 1) {
              const toIndex = insertIndex > fromIndex ? insertIndex - 1 : insertIndex;
              if (toIndex >= 0) {
                dispatch({
                  type: 'TASK_REORDER',
                  payload: { columnId: targetColumnId, fromIndex, toIndex },
                });
              }
            }
          } else {
            dispatch({
              type: 'TASK_MOVE',
              payload: {
                taskId,
                fromColumnId: sourceColumnId,
                toColumnId: targetColumnId,
                toIndex: insertIndex,
              },
            });
          }
        }

        if (source.data.type === 'task' && dest.data.type === 'column-drop-target') {
          const { taskId, sourceColumnId } = source.data as {
            taskId: string;
            sourceColumnId: string;
          };
          const { columnId: targetColumnId } = dest.data as { columnId: string };
          if (targetColumnId !== column.id) {
            return;
          }

          const targetCol = cols[targetColumnId];
          if (!targetCol) {
            return;
          }

          dispatch({
            type: 'TASK_MOVE',
            payload: {
              taskId,
              fromColumnId: sourceColumnId,
              toColumnId: targetColumnId,
              toIndex: targetCol.taskIds.length,
            },
          });
        }

        if (source.data.type === 'column' && dest.data.type === 'column-drop-target') {
          const { columnId: draggedColumnId } = source.data as { columnId: string };
          const { columnId: targetColumnId } = dest.data as { columnId: string };
          if (targetColumnId !== column.id) {
            return;
          }

          const fromIndex = colOrder.indexOf(draggedColumnId);
          const toIndex = colOrder.indexOf(targetColumnId);
          if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
            dispatch({ type: 'COLUMN_REORDER', payload: { fromIndex, toIndex } });
          }
        }
      },
    });
  }, [column.id, dispatch]);

  return (
    <div
      ref={mergedRef}
      className={columnStyles({ dragging: isDragging, over: isOver && !isDragging })}
    >
      <ColumnHeader
        column={column}
        taskCount={visibleTasks.length}
        selectedCount={colSelectedCount}
        allSelected={allSelected}
        dragHandleRef={dragHandleRef}
        onRename={(title) =>
          dispatch({ type: 'COLUMN_RENAME', payload: { columnId: column.id, title } })
        }
        onDelete={() => dispatch({ type: 'COLUMN_DELETE', payload: { columnId: column.id } })}
        onSelectAll={() =>
          dispatch({ type: 'COLUMN_SELECT_ALL', payload: { columnId: column.id } })
        }
      />

      <div className={columnDividerStyles()} />

      <div className={columnTaskListStyles()}>
        {visibleTasks.length === 0 ? (
          <div className={columnEmptyStateStyles()}>
            <span className={columnEmptyStateTextStyles()}>
              {searchQuery ? 'No matching tasks' : 'Drop here or add a task'}
            </span>
          </div>
        ) : (
          visibleTasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              columnId={column.id}
              isSelected={selectedTaskIds.includes(task.id)}
              searchQuery={searchQuery}
            />
          ))
        )}
      </div>

      <AddTaskInput columnId={column.id} />
    </div>
  );
}
