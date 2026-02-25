import { useReducer, useEffect, type ReactNode } from 'react';
import { StoreContext } from './context';
import { appReducer } from './reducer';
import { buildInitialState } from './stateHydration';
import { saveState } from '@/lib/localStorage';
import { STORAGE_KEY } from '@/lib/constants';

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, undefined, buildInitialState);

  useEffect(() => {
    saveState(STORAGE_KEY, state);
  }, [state]);

  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>;
}
