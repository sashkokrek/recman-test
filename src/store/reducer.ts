import { nanoid } from 'nanoid';
import type { AppState } from '@/types/AppState';
import type { Task } from '@/types/Task';
import type { AppAction } from '@/types/AppAction';
import {
  clamp,
  getExistingTaskIds,
  getUniqueExistingTaskIds,
  removeTaskIdsFromColumns,
  removeTasksByIds,
  reorderItems,
} from './reducer.utils';

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'TASK_ADD': {
      const { columnId, text } = action.payload;
      const column = state.columns[columnId];
      const trimmedText = text.trim();

      if (!column) {
        return state;
      }

      if (!trimmedText) {
        return state;
      }

      const taskId = nanoid();
      const task: Task = {
        id: taskId,
        text: trimmedText,
        completed: false,
        createdAt: Date.now(),
      };

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [taskId]: task,
        },
        columns: {
          ...state.columns,
          [columnId]: {
            ...column,
            taskIds: [...column.taskIds, taskId],
          },
        },
      };
    }

    case 'TASK_DELETE': {
      const { taskId } = action.payload;
      if (!state.tasks[taskId]) {
        return state;
      }

      const taskIdsSet = new Set([taskId]);
      const tasks = removeTasksByIds(state.tasks, taskIdsSet);
      const columns = removeTaskIdsFromColumns(state.columns, taskIdsSet);

      return {
        ...state,
        tasks,
        columns,
        selectedTaskIds: state.selectedTaskIds.filter((id) => !taskIdsSet.has(id)),
      };
    }

    case 'TASK_DELETE_BULK': {
      const { taskIds } = action.payload;
      const validTaskIds = getExistingTaskIds(taskIds, state.tasks);
      if (validTaskIds.length === 0) {
        return state;
      }

      const taskIdsSet = new Set(validTaskIds);
      const tasks = removeTasksByIds(state.tasks, taskIdsSet);
      const columns = removeTaskIdsFromColumns(state.columns, taskIdsSet);

      return {
        ...state,
        tasks,
        columns,
        selectedTaskIds: [],
      };
    }

    case 'TASK_TOGGLE': {
      const { taskId } = action.payload;
      const task = state.tasks[taskId];
      if (!task) {
        return state;
      }

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [taskId]: {
            ...task,
            completed: !task.completed,
          },
        },
      };
    }

    case 'TASK_TOGGLE_BULK': {
      const { taskIds, completed } = action.payload;
      const validTaskIds = getExistingTaskIds(taskIds, state.tasks);
      if (validTaskIds.length === 0) {
        return state;
      }

      const taskIdsSet = new Set(validTaskIds);
      const nextTaskEntries = Object.entries(state.tasks).map(([taskId, task]) => {
        if (!taskIdsSet.has(taskId)) {
          return [taskId, task] as const;
        }

        return [
          taskId,
          {
            ...task,
            completed,
          },
        ] as const;
      });

      return {
        ...state,
        tasks: Object.fromEntries(nextTaskEntries) as Record<string, Task>,
        selectedTaskIds: [],
      };
    }

    case 'TASK_EDIT': {
      const { taskId, text } = action.payload;
      const task = state.tasks[taskId];
      const trimmedText = text.trim();

      if (!task) {
        return state;
      }

      if (!trimmedText) {
        return state;
      }

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [taskId]: {
            ...task,
            text: trimmedText,
          },
        },
      };
    }

    case 'TASK_REORDER': {
      const { columnId, fromIndex, toIndex } = action.payload;
      const column = state.columns[columnId];
      if (!column) {
        return state;
      }

      const reorderedTaskIds = reorderItems(column.taskIds, fromIndex, toIndex);
      if (!reorderedTaskIds) {
        return state;
      }

      return {
        ...state,
        columns: {
          ...state.columns,
          [columnId]: {
            ...column,
            taskIds: reorderedTaskIds,
          },
        },
      };
    }

    case 'TASK_MOVE': {
      const { taskId, fromColumnId, toColumnId, toIndex } = action.payload;
      const task = state.tasks[taskId];
      const fromColumn = state.columns[fromColumnId];
      const toColumn = state.columns[toColumnId];

      if (!task || !fromColumn || !toColumn) {
        return state;
      }

      if (!fromColumn.taskIds.includes(taskId)) {
        return state;
      }

      if (fromColumnId === toColumnId) {
        const taskIds = [...fromColumn.taskIds];
        const currentIndex = taskIds.indexOf(taskId);
        if (currentIndex === -1) {
          return state;
        }

        taskIds.splice(currentIndex, 1);
        const boundedToIndex = clamp(toIndex, 0, taskIds.length);
        taskIds.splice(boundedToIndex, 0, taskId);

        return {
          ...state,
          columns: {
            ...state.columns,
            [fromColumnId]: {
              ...fromColumn,
              taskIds,
            },
          },
        };
      }

      const boundedToIndex = clamp(toIndex, 0, toColumn.taskIds.length);
      const fromTaskIds = fromColumn.taskIds.filter((id) => id !== taskId);
      const toTaskIds = [...toColumn.taskIds];
      toTaskIds.splice(boundedToIndex, 0, taskId);

      return {
        ...state,
        columns: {
          ...state.columns,
          [fromColumnId]: {
            ...fromColumn,
            taskIds: fromTaskIds,
          },
          [toColumnId]: {
            ...toColumn,
            taskIds: toTaskIds,
          },
        },
      };
    }

    case 'TASK_MOVE_BULK': {
      const { taskIds, toColumnId } = action.payload;
      const targetColumn = state.columns[toColumnId];
      if (!targetColumn) {
        return state;
      }

      const validTaskIds = getUniqueExistingTaskIds(taskIds, state.tasks);
      if (validTaskIds.length === 0) {
        return state;
      }

      const taskIdsSet = new Set(validTaskIds);
      const columns = removeTaskIdsFromColumns(state.columns, taskIdsSet);
      const nextTargetColumn = columns[toColumnId];
      if (!nextTargetColumn) {
        return state;
      }

      columns[toColumnId] = {
        ...nextTargetColumn,
        taskIds: [...nextTargetColumn.taskIds, ...validTaskIds],
      };

      return {
        ...state,
        columns,
        selectedTaskIds: [],
      };
    }

    case 'COLUMN_ADD': {
      const title = action.payload.title.trim();
      if (!title) {
        return state;
      }

      const columnId = nanoid();
      return {
        ...state,
        columns: {
          ...state.columns,
          [columnId]: {
            id: columnId,
            title,
            taskIds: [],
          },
        },
        columnOrder: [...state.columnOrder, columnId],
      };
    }

    case 'COLUMN_DELETE': {
      const { columnId } = action.payload;
      const column = state.columns[columnId];
      if (!column) {
        return state;
      }

      const taskIdsSet = new Set(column.taskIds);
      const remainingColumns = { ...state.columns };
      delete remainingColumns[columnId];
      const tasks = removeTasksByIds(state.tasks, taskIdsSet);

      return {
        ...state,
        tasks,
        columns: remainingColumns,
        columnOrder: state.columnOrder.filter((id) => id !== columnId),
        selectedTaskIds: state.selectedTaskIds.filter((id) => !taskIdsSet.has(id)),
      };
    }

    case 'COLUMN_RENAME': {
      const { columnId, title: nextTitle } = action.payload;
      const column = state.columns[columnId];
      if (!column) {
        return state;
      }

      const title = nextTitle.trim();
      if (!title) {
        return state;
      }

      return {
        ...state,
        columns: {
          ...state.columns,
          [columnId]: {
            ...column,
            title,
          },
        },
      };
    }

    case 'COLUMN_REORDER': {
      const { fromIndex, toIndex } = action.payload;
      const reorderedColumns = reorderItems(state.columnOrder, fromIndex, toIndex);
      if (!reorderedColumns) {
        return state;
      }

      return {
        ...state,
        columnOrder: reorderedColumns,
      };
    }

    case 'FILTER_SET': {
      return {
        ...state,
        filter: action.payload,
      };
    }

    case 'SEARCH_SET': {
      return {
        ...state,
        searchQuery: action.payload,
      };
    }

    case 'TASK_SELECT_TOGGLE': {
      const { taskId } = action.payload;
      const isSelected = state.selectedTaskIds.includes(taskId);
      if (isSelected) {
        return {
          ...state,
          selectedTaskIds: state.selectedTaskIds.filter((id) => id !== taskId),
        };
      }

      return {
        ...state,
        selectedTaskIds: [...state.selectedTaskIds, taskId],
      };
    }

    case 'COLUMN_SELECT_ALL': {
      const { columnId } = action.payload;
      const column = state.columns[columnId];
      if (!column) {
        return state;
      }

      if (column.taskIds.length === 0) {
        return state;
      }

      const selectedTaskIdsSet = new Set(state.selectedTaskIds);
      const allAlreadySelected = column.taskIds.every((taskId) => selectedTaskIdsSet.has(taskId));
      if (allAlreadySelected) {
        const columnTaskIdsSet = new Set(column.taskIds);
        return {
          ...state,
          selectedTaskIds: state.selectedTaskIds.filter((taskId) => !columnTaskIdsSet.has(taskId)),
        };
      }

      const combinedSelectedIds = new Set([...state.selectedTaskIds, ...column.taskIds]);
      return {
        ...state,
        selectedTaskIds: Array.from(combinedSelectedIds),
      };
    }

    case 'SELECTION_CLEAR': {
      return {
        ...state,
        selectedTaskIds: [],
      };
    }

    default: {
      return state;
    }
  }
}
