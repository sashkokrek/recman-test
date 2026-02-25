import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const checkboxStyles = cva(
  'inline-flex h-4 w-4 items-center justify-center rounded border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      state: {
        unchecked:
          'border-slate-300 bg-white text-transparent hover:border-indigo-400 hover:bg-indigo-50',
        checked: 'border-indigo-500 bg-indigo-500 text-white',
        indeterminate: 'border-indigo-500 bg-indigo-500 text-white',
      },
    },
    defaultVariants: {
      state: 'unchecked',
    },
  }
);

interface CheckboxProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'onChange' | 'aria-checked'
> {
  checked?: boolean;
  indeterminate?: boolean;
  onChange?: () => void;
}

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  (
    { checked = false, indeterminate = false, onChange, onClick, className, disabled, ...props },
    ref
  ) => {
    const state = indeterminate ? 'indeterminate' : checked ? 'checked' : 'unchecked';
    const ariaChecked: boolean | 'mixed' = indeterminate ? 'mixed' : checked;

    return (
      <button
        type="button"
        ref={ref}
        role="checkbox"
        aria-checked={ariaChecked}
        disabled={disabled}
        className={cn(checkboxStyles({ state }), className)}
        onClick={(event) => {
          onClick?.(event);

          if (!event.defaultPrevented && !disabled) {
            onChange?.();
          }
        }}
        {...props}
      >
        {state === 'checked' && (
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="1,5 4,8 9,2" />
          </svg>
        )}

        {state === 'indeterminate' && (
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="2" y1="5" x2="8" y2="5" />
          </svg>
        )}
      </button>
    );
  }
);
Checkbox.displayName = 'Checkbox';
