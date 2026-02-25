import { type AppAction } from '@/types/AppAction';
import { type AppState } from '@/types/AppState';
import { createContext } from 'react';

export interface StoreContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

export const StoreContext = createContext<StoreContextValue | null>(null);
