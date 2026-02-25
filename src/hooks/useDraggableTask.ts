import { useEffect, useRef, useState } from 'react';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

interface DraggableTaskData extends Record<string, unknown> {
  type: 'task';
  taskId: string;
  sourceColumnId: string;
}

interface UseDraggableTaskResult {
  cardRef: React.MutableRefObject<HTMLDivElement | null>;
  dragHandleRef: React.MutableRefObject<HTMLDivElement | null>;
  isDragging: boolean;
}

export function useDraggableTask(taskId: string, columnId: string): UseDraggableTaskResult {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const dragHandleRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    const handle = dragHandleRef.current;
    if (!el) {
      return;
    }

    const data: DraggableTaskData = { type: 'task', taskId, sourceColumnId: columnId };

    return draggable({
      element: el,
      dragHandle: handle ?? el,
      getInitialData: () => data,
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false),
    });
  }, [taskId, columnId]);

  return { cardRef, dragHandleRef, isDragging };
}
