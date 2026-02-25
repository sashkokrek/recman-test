interface SearchableTask {
  text: string;
}

export function filterBySearch<T extends SearchableTask>(items: T[], query: string): T[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return items;
  }

  const terms = normalizedQuery.split(/\s+/).filter(Boolean);

  return items.filter((item) => {
    const text = item.text.toLowerCase();
    return terms.every((term) => text.includes(term));
  });
}
