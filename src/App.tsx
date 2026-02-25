import { cva } from 'class-variance-authority';
import { StoreProvider } from '@/store/StoreProvider';
import { BoardView } from './components/BoardView';
import { Header } from './components/Header';

const appShellStyles = cva('min-h-screen bg-[--color-board-bg]');

export function App() {
  return (
    <StoreProvider>
      <div className={appShellStyles()}>
        <Header />
        <main>
          <BoardView />
        </main>
      </div>
    </StoreProvider>
  );
}
