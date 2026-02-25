import { cva } from 'class-variance-authority';
import { SearchBar } from '@/components/SearchBar';
import { FilterToggle } from '@/components/FilterToggle';
import { BulkActionBar } from '@/components/BulkActionBar';

const headerShellStyles = cva(
  'sticky top-0 z-40 border-b border-slate-200 bg-white/90 shadow-sm backdrop-blur-sm'
);
const headerRowStyles = cva('flex max-w-full items-center gap-3 px-4 py-3');
const logoGroupStyles = cva('flex shrink-0 items-center gap-2');
const searchSlotStyles = cva('max-w-sm flex-1');

export function Header() {
  return (
    <header className={headerShellStyles()}>
      <div className={headerRowStyles()}>
        <div className={logoGroupStyles()}>Test App</div>
        <div className={searchSlotStyles()}>
          <SearchBar />
        </div>
        <FilterToggle />
      </div>
      <BulkActionBar />
    </header>
  );
}
