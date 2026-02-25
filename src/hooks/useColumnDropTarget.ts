import { useEffect, useRef, useState } from 'react';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

interface UseColumnDropTargetResult {
  dropRef: React.MutableRefObject<HTMLDivElement | null>;
  isOver: boolean;
}

export function useColumnDropTarget(columnId: string): UseColumnDropTargetResult {
  const dropRef = useRef<HTMLDivElement | null>(null);
  const [isOver, setIsOver] = useState(false);

  useEffect(() => {
    const el = dropRef.current;
    if (!el) {
      return;
    }

    return dropTargetForElements({
      element: el,
      canDrop: ({ source }) =>
        source.data.type === 'task' ||
        (source.data.type === 'column' && source.data.columnId !== columnId),
      getData: () => ({ type: 'column-drop-target', columnId }),
      onDragEnter: () => setIsOver(true),
      onDragLeave: () => setIsOver(false),
      onDrop: () => setIsOver(false),
    });
  }, [columnId]);

  return { dropRef, isOver };
}
