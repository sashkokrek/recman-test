import { useState } from 'react';
import { cva } from 'class-variance-authority';
import { useAppDispatch } from '@/store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const addColumnButtonCollapsedShellStyles = cva('w-72 shrink-0');
const addColumnButtonTriggerStyles = cva(
  'w-full border-2 border-dashed border-slate-200 py-3 text-slate-400 hover:border-indigo-300 hover:text-indigo-500'
);
const addColumnButtonExpandedShellStyles = cva(
  'w-72 shrink-0 space-y-2 rounded-xl border border-slate-200 bg-white p-3 shadow-[--shadow-card]'
);
const addColumnButtonActionsStyles = cva('flex gap-2');
const addColumnPrimaryActionStyles = cva('flex-1');

export function AddColumnButton() {
  const dispatch = useAppDispatch();
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const trimmedTitle = title.trim();
  const canSubmit = trimmedTitle.length > 0;

  const submit = () => {
    if (!canSubmit) {
      return;
    }

    dispatch({ type: 'COLUMN_ADD', payload: { title: trimmedTitle } });
    setTitle('');
    setIsAdding(false);
  };

  if (!isAdding) {
    return (
      <div className={addColumnButtonCollapsedShellStyles()}>
        <Button
          variant="ghost"
          className={addColumnButtonTriggerStyles()}
          onClick={() => setIsAdding(true)}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="8" y1="2" x2="8" y2="14" />
            <line x1="2" y1="8" x2="14" y2="8" />
          </svg>
          Add column
        </Button>
      </div>
    );
  }

  return (
    <div className={addColumnButtonExpandedShellStyles()}>
      <Input
        variant="bordered"
        placeholder="Column name…"
        value={title}
        autoFocus
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            submit();
          }

          if (e.key === 'Escape') {
            setTitle('');
            setIsAdding(false);
          }
        }}
      />
      <div className={addColumnButtonActionsStyles()}>
        <Button
          variant="primary"
          size="sm"
          onClick={submit}
          disabled={!canSubmit}
          className={addColumnPrimaryActionStyles()}
        >
          Add
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setTitle('');
            setIsAdding(false);
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
