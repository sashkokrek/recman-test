import { useEffect, useRef, useState } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/cn';

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  trigger: React.ReactNode;
  options: DropdownOption[];
  onSelect: (value: string) => void;
  className?: string;
}

const dropdownRootStyles = cva('relative');
const dropdownMenuStyles = cva(
  'absolute right-0 z-50 mt-1 min-w-40 rounded-lg border border-slate-200 bg-white py-1 shadow-lg'
);
const dropdownOptionStyles = cva(
  'w-full px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50'
);

/**
 * Select
 * Closes on outside click or Escape key.
 */

export function Dropdown({ trigger, options, onSelect, className }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', keyHandler);

    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown', keyHandler);
    };
  }, [open]);

  return (
    <div ref={ref} className={cn(dropdownRootStyles(), className)}>
      <div onClick={() => setOpen((v) => !v)}>{trigger}</div>
      {open && (
        <div className={dropdownMenuStyles()}>
          {options.map((opt) => (
            <button
              key={opt.value}
              className={dropdownOptionStyles()}
              onClick={() => {
                onSelect(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
