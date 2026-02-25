import { StoreProvider } from '@/store/StoreProvider';

export function App() {
  return (
    <StoreProvider>
      <div className="min-h-screen bg-[--color-board-bg]">
        <main>TODO APP</main>
      </div>
    </StoreProvider>
  );
}
