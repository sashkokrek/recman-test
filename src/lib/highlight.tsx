import type { ReactNode } from 'react';

export function highlightMatch(text: string, query: string): ReactNode {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return text;
  }

  const startIndex = text.toLowerCase().indexOf(normalizedQuery);
  if (startIndex === -1) {
    return text;
  }

  const endIndex = startIndex + normalizedQuery.length;

  return (
    <>
      {text.slice(0, startIndex)}
      <mark className="rounded bg-yellow-100 px-0.5 text-inherit">
        {text.slice(startIndex, endIndex)}
      </mark>
      {text.slice(endIndex)}
    </>
  );
}
