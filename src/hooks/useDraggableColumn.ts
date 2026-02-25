import { useEffect, useRef, useState } from 'react';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

interface UseDraggableColumnResult {
  columnRef: React.RefObject<HTMLDivElement | null>;
  dragHandleRef: React.RefObject<HTMLDivElement | null>;
  isDragging: boolean;
}

export function useDraggableColumn(columnId: string): UseDraggableColumnResult {
  const columnRef = useRef<HTMLDivElement | null>(null);
  const dragHandleRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const el = columnRef.current;
    const handle = dragHandleRef.current;
    if (!el) {
      return;
    }

    return draggable({
      element: el,
      dragHandle: handle ?? el,
      getInitialData: () => ({ type: 'column', columnId }),
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false),
    });
  }, [columnId]);

  return { columnRef, dragHandleRef, isDragging };
}
