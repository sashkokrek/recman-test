import { useEffect, useRef, useState } from 'react';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

type DropState = 'idle' | 'over-top' | 'over-bottom';

interface UseTaskDropTargetResult {
  dropRef: React.MutableRefObject<HTMLDivElement | null>;
  dropState: DropState;
}

export function useTaskDropTarget(taskId: string, columnId: string): UseTaskDropTargetResult {
  const dropRef = useRef<HTMLDivElement | null>(null);
  const [dropState, setDropState] = useState<DropState>('idle');

  useEffect(() => {
    const el = dropRef.current;
    if (!el) {
      return;
    }

    return dropTargetForElements({
      element: el,
      canDrop: ({ source }) => source.data.type === 'task' && source.data.taskId !== taskId,
      getData: () => ({ type: 'task-drop-target', taskId, columnId }),
      onDragEnter: () => {
        setDropState('over-top');
      },
      onDrag: ({ location }) => {
        const rect = el.getBoundingClientRect();
        const midY = rect.top + rect.height / 2;
        const clientY = location.current.input.clientY;
        setDropState(clientY < midY ? 'over-top' : 'over-bottom');
      },
      onDragLeave: () => setDropState('idle'),
      onDrop: () => setDropState('idle'),
    });
  }, [taskId, columnId]);

  return { dropRef, dropState };
}
