import { cva } from 'class-variance-authority';
import { useAppDispatch, useAppState } from '@/store';
import { FilterValue } from '@/types/FilterValue';

const filterToggleRootStyles = cva('flex items-center gap-0.5 rounded-lg bg-slate-100 p-0.5');
const filterToggleOptionStyles = cva('cursor-pointer rounded-md px-3 py-1.5 text-xs font-medium transition-all', {
  variants: {
    active: {
      true: 'bg-white text-slate-800 shadow-sm',
      false: 'text-slate-500 hover:text-slate-700',
    },
  },
  defaultVariants: {
    active: false,
  },
});

const OPTIONS: { value: FilterValue; label: string }[] = [
  { value: FilterValue.ALL, label: 'All' },
  { value: FilterValue.INCOMPLETE, label: 'Active' },
  { value: FilterValue.COMPLETE, label: 'Done' },
];

export function FilterToggle() {
  const dispatch = useAppDispatch();
  const { filter } = useAppState();

  return (
    <div className={filterToggleRootStyles()}>
      {OPTIONS.map(({ value, label }) => {
        const isActive = filter === value;

        return (
          <button
            key={value}
            className={filterToggleOptionStyles({ active: isActive })}
            onClick={() => dispatch({ type: 'FILTER_SET', payload: value })}
            aria-pressed={isActive}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
