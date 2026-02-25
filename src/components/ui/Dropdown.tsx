import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
  'fixed z-50 min-w-40 rounded-lg border border-slate-200 bg-white py-1 shadow-lg'
);
const dropdownOptionStyles = cva(
  'w-full px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50'
);

/**
 * Select
 * Closes on outside click or Escape key.
 * Menu is rendered via portal to escape overflow-hidden ancestors.
 */

export function Dropdown({ trigger, options, onSelect, className }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleTriggerClick = () => {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
    }
    setOpen((v) => !v);
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      const clickedInsideTrigger = triggerRef.current?.contains(target);
      const clickedInsideMenu = menuRef.current?.contains(target);

      if (!clickedInsideTrigger && !clickedInsideMenu) {
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
    <div ref={triggerRef} className={cn(dropdownRootStyles(), className)}>
      <div onClick={handleTriggerClick}>{trigger}</div>
      {open &&
        createPortal(
          <div
            ref={menuRef}
            className={dropdownMenuStyles()}
            style={{ top: menuPos.top, right: menuPos.right }}
          >
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
          </div>,
          document.body
        )}
    </div>
  );
}
