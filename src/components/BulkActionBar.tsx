import { useEffect, useRef } from 'react';
import { cva } from 'class-variance-authority';
import { useAppDispatch, useAppState } from '@/store';
import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';

const bulkActionBarContainerStyles = cva(
  'overflow-hidden transition-all duration-300 ease-in-out',
  {
    variants: {
      visible: {
        true: 'max-h-32',
        false: 'max-h-0',
      },
    },
    defaultVariants: {
      visible: false,
    },
  }
);
const bulkActionBarInnerStyles = cva(
  'flex flex-wrap items-center gap-3 bg-slate-800 px-4 py-3 text-white'
);
const bulkActionBarCountGroupStyles = cva('flex shrink-0 items-center gap-2');
const bulkActionBarCountTextStyles = cva('text-sm font-medium text-slate-200');
const bulkActionBarClearButtonStyles = cva(
  'cursor-pointer p-0.5 text-slate-400 transition-colors hover:text-white'
);
const bulkActionBarDividerStyles = cva('h-4 w-px shrink-0 bg-slate-600');
const bulkActionBarActionsStyles = cva('flex flex-wrap items-center gap-2');
const bulkActionBarGhostActionStyles = cva('text-slate-200 hover:bg-slate-700 hover:text-white');
const bulkActionBarDangerActionStyles = cva('text-red-400 hover:bg-red-900/30 hover:text-red-300');

export function BulkActionBar() {
  const dispatch = useAppDispatch();
  const { selectedTaskIds, columns, columnOrder } = useAppState();
  const innerRef = useRef<HTMLDivElement>(null);

  const count = selectedTaskIds.length;
  const isVisible = count > 0;

  useEffect(() => {
    const el = innerRef.current;
    if (!el) {
      return;
    }

    if (isVisible) {
      el.removeAttribute('inert');
    } else {
      el.setAttribute('inert', '');
    }
  }, [isVisible]);

  const columnOptions = columnOrder.map((id) => ({
    value: id,
    label: columns[id].title,
  }));

  return (
    <div className={bulkActionBarContainerStyles({ visible: isVisible })}>
      <div ref={innerRef} aria-hidden={!isVisible} className={bulkActionBarInnerStyles()}>
        <div className={bulkActionBarCountGroupStyles()}>
          <span className={bulkActionBarCountTextStyles()}>{count} selected</span>
          <button
            className={bulkActionBarClearButtonStyles()}
            onClick={() => dispatch({ type: 'SELECTION_CLEAR' })}
            aria-label="Clear selection"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="2" y1="2" x2="12" y2="12" />
              <line x1="12" y1="2" x2="2" y2="12" />
            </svg>
          </button>
        </div>

        <div className={bulkActionBarDividerStyles()} />

        <div className={bulkActionBarActionsStyles()}>
          <Button
            size="sm"
            variant="ghost"
            className={bulkActionBarGhostActionStyles()}
            onClick={() =>
              dispatch({
                type: 'TASK_TOGGLE_BULK',
                payload: { taskIds: selectedTaskIds, completed: true },
              })
            }
          >
            Mark done
          </Button>

          <Button
            size="sm"
            variant="ghost"
            className={bulkActionBarGhostActionStyles()}
            onClick={() =>
              dispatch({
                type: 'TASK_TOGGLE_BULK',
                payload: { taskIds: selectedTaskIds, completed: false },
              })
            }
          >
            Mark active
          </Button>

          <Dropdown
            trigger={
              <Button size="sm" variant="ghost" className={bulkActionBarGhostActionStyles()}>
                Move to ▾
              </Button>
            }
            options={columnOptions}
            onSelect={(colId) =>
              dispatch({
                type: 'TASK_MOVE_BULK',
                payload: { taskIds: selectedTaskIds, toColumnId: colId },
              })
            }
          />

          <Button
            size="sm"
            variant="danger"
            className={bulkActionBarDangerActionStyles()}
            onClick={() =>
              dispatch({ type: 'TASK_DELETE_BULK', payload: { taskIds: selectedTaskIds } })
            }
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
