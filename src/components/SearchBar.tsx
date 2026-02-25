import { useState, useEffect } from 'react';
import { cva } from 'class-variance-authority';
import { Input } from '@/components/ui/Input';
import { useAppDispatch, useAppState } from '@/store';
import { useDebounce } from '@/hooks/useDebounce';

const searchRootStyles = cva('relative');
const searchIconStyles = cva(
  'pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400'
);
const searchInputStyles = cva('pl-9 pr-8');
const clearButtonStyles = cva(
  'absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600'
);

export function SearchBar() {
  const dispatch = useAppDispatch();
  const { searchQuery } = useAppState();

  const [localQuery, setLocalQuery] = useState(searchQuery);
  const debouncedQuery = useDebounce(localQuery, 150);

  useEffect(() => {
    dispatch({ type: 'SEARCH_SET', payload: debouncedQuery });
  }, [debouncedQuery, dispatch]);

  const handleClear = () => {
    setLocalQuery('');
    dispatch({ type: 'SEARCH_SET', payload: '' });
  };

  return (
    <div className={searchRootStyles()}>
      <span className={searchIconStyles()}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="6.5" cy="6.5" r="4.5" />
          <line x1="10.5" y1="10.5" x2="14" y2="14" />
        </svg>
      </span>
      <Input
        variant="bordered"
        className={searchInputStyles()}
        placeholder="Search tasks…"
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        aria-label="Search tasks"
      />
      {localQuery && (
        <button className={clearButtonStyles()} onClick={handleClear} aria-label="Clear search">
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
      )}
    </div>
  );
}
