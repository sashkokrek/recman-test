import { useContext } from 'react';
import { StoreContext } from './context';
import { type AppAction } from '@/types/AppAction';
import { type AppState } from '@/types/AppState';

export function useAppState(): AppState {
  const ctx = useContext(StoreContext);

  if (!ctx) {
    throw new Error('useAppState must be used within StoreProvider');
  }
  return ctx.state;
}

export function useAppDispatch(): React.Dispatch<AppAction> {
  const ctx = useContext(StoreContext);

  if (!ctx) {
    throw new Error('useAppDispatch must be used within StoreProvider');
  }

  return ctx.dispatch;
}
