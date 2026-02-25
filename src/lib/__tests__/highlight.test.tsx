import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { highlightMatch } from '@/lib/highlight';

describe('highlightMatch', () => {
  it('returns raw text when query is empty', () => {
    expect(highlightMatch('Fix login bug', '')).toBe('Fix login bug');
  });

  it('returns raw text when query has no matches', () => {
    expect(highlightMatch('Fix login bug', 'sprint')).toBe('Fix login bug');
  });

  it('wraps matched part with mark tag', () => {
    const html = renderToStaticMarkup(<>{highlightMatch('Fix login bug', 'login')}</>);

    expect(html).toContain('<mark');
    expect(html).toContain('login');
  });
});
