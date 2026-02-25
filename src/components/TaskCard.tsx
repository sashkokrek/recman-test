import { useState } from 'react';
import { cva } from 'class-variance-authority';
import { Tooltip, TooltipAlign } from '@/components/ui/Tooltip';
import { Input } from '@/components/ui/Input';
import { highlightMatch } from '@/lib/highlight';
import type { Task } from '@/types';

const taskCardStyles = cva(
  'group relative flex select-none items-center gap-2 rounded-lg border bg-white px-3 py-2.5 transition-all',
  {
    variants: {
      dragging: {
        true: 'z-50 rotate-1 scale-105 border-indigo-300 opacity-90 shadow-[--shadow-drag]',
        false: 'border-slate-200 shadow-[--shadow-card] hover:border-slate-300',
      },
      selected: {
        true: 'border-indigo-200 ring-2 ring-indigo-400',
        false: '',
      },
      completed: {
        true: 'opacity-60',
        false: '',
      },
    },
    defaultVariants: {
      dragging: false,
      selected: false,
      completed: false,
    },
  }
);
const taskCardDragHandleStyles = cva(
  'shrink-0 cursor-grab text-slate-300 opacity-0 transition-colors group-hover:opacity-100 hover:text-slate-500 active:cursor-grabbing'
);
const taskCardToggleStyles = cva(
  'flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 transition-all',
  {
    variants: {
      state: {
        selected: 'border-indigo-400 bg-indigo-100 ring-2 ring-indigo-400',
        completed:
          'border-emerald-500 bg-emerald-500 hover:border-emerald-400 hover:bg-emerald-400',
        active: 'border-slate-300 hover:border-indigo-400 hover:bg-indigo-50',
      },
    },
    defaultVariants: {
      state: 'active',
    },
  }
);
const taskCardTextSlotStyles = cva('min-w-0 flex-1');
const taskCardTextStyles = cva(
  'block cursor-pointer truncate text-sm text-slate-800 transition-colors hover:text-indigo-600',
  {
    variants: {
      completed: {
        true: 'text-slate-400 line-through',
        false: '',
      },
    },
    defaultVariants: {
      completed: false,
    },
  }
);
const taskCardActionButtonStyles = cva(
  'shrink-0 cursor-pointer rounded p-0.5 opacity-0 transition-colors group-hover:opacity-100',
  {
    variants: {
      tone: {
        default: 'text-slate-300 hover:text-indigo-500',
        danger: 'text-slate-300 hover:text-red-500',
      },
    },
    defaultVariants: {
      tone: 'default',
    },
  }
);

interface TaskCardProps {
  task: Task;
  isSelected: boolean;
  searchQuery: string;
  dragHandleRef?: React.RefObject<HTMLDivElement | null>;
  isDragging?: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: (text: string) => void;
  onSelect: () => void;
}

export function TaskCard({
  task,
  isSelected,
  searchQuery,
  dragHandleRef,
  isDragging = false,
  onToggle,
  onDelete,
  onEdit,
  onSelect,
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.text);

  const startEditing = () => {
    setEditValue(task.text);
    setIsEditing(true);
  };

  const handleEditCommit = () => {
    const trimmed = editValue.trim();

    if (trimmed && trimmed !== task.text) {
      onEdit(trimmed);
    } else {
      setEditValue(task.text);
    }

    setIsEditing(false);
  };

  const toggleState = isSelected ? 'selected' : task.completed ? 'completed' : 'active';

  return (
    <div
      className={taskCardStyles({
        dragging: isDragging,
        selected: isSelected,
        completed: task.completed,
      })}
    >
      <div ref={dragHandleRef} className={taskCardDragHandleStyles()} aria-label="Drag to reorder">
        <svg width="12" height="16" viewBox="0 0 12 16" fill="currentColor">
          <circle cx="4" cy="4" r="1.5" />
          <circle cx="8" cy="4" r="1.5" />
          <circle cx="4" cy="8" r="1.5" />
          <circle cx="8" cy="8" r="1.5" />
          <circle cx="4" cy="12" r="1.5" />
          <circle cx="8" cy="12" r="1.5" />
        </svg>
      </div>

      <Tooltip content={task.completed ? 'Mark as active' : 'Mark as done'}>
        <button
          className={taskCardToggleStyles({ state: toggleState })}
          onClick={(e) => {
            if (e.shiftKey) {
              onSelect();
            } else {
              onToggle();
            }
          }}
          aria-label={task.completed ? 'Mark as active' : 'Mark as done'}
        >
          {task.completed && (
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="white" strokeWidth="2">
              <polyline points="1,4 3,6 7,2" />
            </svg>
          )}
        </button>
      </Tooltip>

      <div className={taskCardTextSlotStyles()}>
        {isEditing ? (
          <Input
            variant="ghost"
            value={editValue}
            autoFocus
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleEditCommit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleEditCommit();
              }

              if (e.key === 'Escape') {
                setEditValue(task.text);
                setIsEditing(false);
              }
            }}
          />
        ) : (
          <span
            className={taskCardTextStyles({ completed: task.completed })}
            onDoubleClick={startEditing}
            title="Double-click to edit"
          >
            {highlightMatch(task.text, searchQuery)}
          </span>
        )}
      </div>

      {!isEditing && (
        <Tooltip content="Edit task" align={TooltipAlign.Right}>
          <button
            className={taskCardActionButtonStyles({ tone: 'default' })}
            onClick={startEditing}
            aria-label="Edit task"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M2.5,11.5l2.8-0.6l5.3-5.3a1,1 0 0 0 0-1.4l-1.5-1.5a1,1 0 0 0-1.4,0L2.4,8L1.8,10.8z" />
              <line x1="7.2" y1="3.2" x2="10.8" y2="6.8" />
            </svg>
          </button>
        </Tooltip>
      )}

      {!isEditing && (
        <Tooltip content={isSelected ? 'Deselect task' : 'Select task'} align={TooltipAlign.Right}>
          <button
            className={taskCardActionButtonStyles({ tone: 'default' })}
            onClick={onSelect}
            aria-label={isSelected ? 'Deselect task' : 'Select task'}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="2" y="2" width="10" height="10" rx="2" />
              {isSelected && <polyline points="4,7 6.5,9.5 10,5" strokeWidth="2" />}
            </svg>
          </button>
        </Tooltip>
      )}

      {!isEditing && (
        <Tooltip content="Delete task" align={TooltipAlign.Right}>
          <button
            className={taskCardActionButtonStyles({ tone: 'danger' })}
            onClick={onDelete}
            aria-label="Delete task"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="3" y1="3" x2="11" y2="11" />
              <line x1="11" y1="3" x2="3" y2="11" />
            </svg>
          </button>
        </Tooltip>
      )}
    </div>
  );
}
