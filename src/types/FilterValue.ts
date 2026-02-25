export const FilterValue = {
  ALL: 'all',
  COMPLETE: 'complete',
  INCOMPLETE: 'incomplete',
} as const;

export type FilterValue = (typeof FilterValue)[keyof typeof FilterValue];
