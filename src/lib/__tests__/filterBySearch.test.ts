import { describe, expect, it } from 'vitest';
import { filterBySearch } from '@/lib/filterBySearch';


interface TestItem {
  id: string;
  text: string;
}

const ITEMS: TestItem[] = [
  { id: '1', text: 'Write release notes' },
  { id: '2', text: 'Fix login bug' },
  { id: '3', text: 'Plan sprint backlog' },
];

describe('filterBySearch', () => {
  it('returns all items for empty query', () => {
    expect(filterBySearch(ITEMS, '')).toEqual(ITEMS);
    expect(filterBySearch(ITEMS, '   ')).toEqual(ITEMS);
  });

  it('matches case-insensitively', () => {
    expect(filterBySearch(ITEMS, 'LOGIN')).toEqual([{ id: '2', text: 'Fix login bug' }]);
  });

  it('requires all terms to match', () => {
    expect(filterBySearch(ITEMS, 'plan sprint')).toEqual([
      { id: '3', text: 'Plan sprint backlog' },
    ]);
    expect(filterBySearch(ITEMS, 'plan login')).toEqual([]);
  });
});
