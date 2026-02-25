import { useState, useRef, useEffect } from 'react';
import { cva } from 'class-variance-authority';
import { Checkbox } from '@/components/ui/Checkbox';
import { Tooltip, TooltipAlign } from '@/components/ui/Tooltip';
import type { Column } from '@/types';

const columnHeaderRootStyles = cva(
  'group/header flex cursor-grab items-center gap-2 px-3 py-2 active:cursor-grabbing'
);
const columnHeaderCheckboxStyles = cva('shrink-0');
const columnHeaderTitleSlotStyles = cva('min-w-0 flex-1');
const columnHeaderTitleInputStyles = cva(
  'w-full rounded border border-indigo-400 bg-white px-1.5 py-0.5 text-sm font-semibold text-slate-800 focus:outline-none'
);
const columnHeaderTitleRowStyles = cva('flex items-center gap-2');
const columnHeaderTitleTextStyles = cva(
  'cursor-pointer truncate text-sm font-semibold text-slate-700 transition-colors hover:text-indigo-600'
);
const columnHeaderCountBadgeStyles = cva(
  'shrink-0 rounded-full bg-slate-100 px-1.5 py-0.5 text-xs text-slate-400'
);
const columnHeaderActionButtonStyles = cva(
  'shrink-0 cursor-pointer rounded p-0.5 opacity-0 transition-colors group-hover/header:opacity-100',
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

interface ColumnHeaderProps {
  column: Column;
  taskCount: number;
  selectedCount: number;
  allSelected: boolean;
  dragHandleRef?: React.RefObject<HTMLDivElement | null>;
  onRename: (title: string) => void;
  onDelete: () => void;
  onSelectAll: () => void;
}

export function ColumnHeader({
  column,
  taskCount,
  selectedCount,
  allSelected,
  dragHandleRef,
  onRename,
  onDelete,
  onSelectAll,
}: ColumnHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(column.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.select();
    }
  }, [isEditing]);

  const commit = () => {
    const trimmed = editValue.trim();

    if (trimmed && trimmed !== column.title) {
      onRename(trimmed);
    } else {
      setEditValue(column.title);
    }

    setIsEditing(false);
  };

  const startEditing = () => {
    setEditValue(column.title);
    setIsEditing(true);
  };

  return (
    <div ref={dragHandleRef} className={columnHeaderRootStyles()}>
      <Tooltip content={allSelected && taskCount > 0 ? 'Deselect all' : 'Select all'}>
        <Checkbox
          checked={allSelected && taskCount > 0}
          indeterminate={selectedCount > 0 && !allSelected}
          onChange={onSelectAll}
          className={columnHeaderCheckboxStyles()}
          onClick={(e) => e.stopPropagation()}
        />
      </Tooltip>

      <div className={columnHeaderTitleSlotStyles()}>
        {isEditing ? (
          <input
            ref={inputRef}
            className={columnHeaderTitleInputStyles()}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                commit();
              }

              if (e.key === 'Escape') {
                setEditValue(column.title);
                setIsEditing(false);
              }
            }}
          />
        ) : (
          <div className={columnHeaderTitleRowStyles()}>
            <span
              className={columnHeaderTitleTextStyles()}
              onDoubleClick={startEditing}
              title="Double-click to rename"
            >
              {column.title}
            </span>
            <span className={columnHeaderCountBadgeStyles()}>{taskCount}</span>
          </div>
        )}
      </div>

      {!isEditing && (
        <Tooltip content="Edit column" align={TooltipAlign.Right}>
          <button
            className={columnHeaderActionButtonStyles({ tone: 'default' })}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              startEditing();
            }}
            aria-label="Edit column"
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

      <Tooltip content="Delete column" align={TooltipAlign.Right}>
        <button
          className={columnHeaderActionButtonStyles({ tone: 'danger' })}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={onDelete}
          aria-label="Delete column"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="2,4 12,4" />
            <path d="M5,4V2h4v2" />
            <path d="M3,4l1,8h6l1-8" />
          </svg>
        </button>
      </Tooltip>
    </div>
  );
}
