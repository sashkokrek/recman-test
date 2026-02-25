import { AppState } from '@/types/AppState';

const STATE_KEYS: (keyof AppState)[] = ['filter', 'searchQuery', 'selectedTaskIds'];

export function loadState(key: string): Partial<AppState> | null {
  try {
    const raw = localStorage.getItem(key);

    if (!raw) {
      return null;
    }

    const parsed: unknown = JSON.parse(raw);

    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return null;
    }

    return parsed as Partial<AppState>;
  } catch {
    window.alert('Failed to load state');
    return null;
  }
}

export function saveState(key: string, state: AppState): void {
  try {
    const toSave = Object.fromEntries(
      Object.entries(state).filter(([k]) => !STATE_KEYS.includes(k as keyof AppState))
    );
    localStorage.setItem(key, JSON.stringify(toSave));
  } catch {
    window.alert('Failed to save state');
  }
}
