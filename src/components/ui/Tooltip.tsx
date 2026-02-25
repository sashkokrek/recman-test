import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/cn';

export const TooltipAlign = {
  Left: 'left',
  Center: 'center',
  Right: 'right',
} as const;

export type TooltipAlign = (typeof TooltipAlign)[keyof typeof TooltipAlign];

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  className?: string;
  align?: TooltipAlign;
}

const OFFSET_PX = 8;
const tooltipRootStyles = cva('relative inline-flex');
const tooltipBubbleStyles = cva(
  'pointer-events-none fixed z-9999 whitespace-nowrap rounded-md bg-slate-800 px-2 py-1 text-xs text-white select-none'
);
const tooltipArrowStyles = cva(
  'absolute top-full border-[5px] border-transparent border-t-slate-800',
  {
    variants: {
      align: {
        right: 'right-2',
        left: 'left-2',
        center: 'left-1/2 -translate-x-1/2',
      },
    },
  }
);

export function Tooltip({
  content,
  children,
  className,
  align = TooltipAlign.Center,
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState({ top: 0, left: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const show = () => {
    if (!ref.current) {
      return;
    }

    // Get the wrapper's position and size relative to the viewport
    const r = ref.current.getBoundingClientRect();

    /* Set the anchor point in viewport coordinates that we'll use to position the tooltip bubble.
        top: use the element's top edge.
        left: depending on `align`, use the element's right edge, left edge, or horizontal center.
    */
    setAnchor({
      top: r.top,
      left:
        align === TooltipAlign.Right
          ? r.right // bind to right edge
          : align === TooltipAlign.Left
            ? r.left // bind to left edge
            : r.left + r.width / 2, // bind to center
    });
    setOpen(true);
  };

  const hide = () => setOpen(false);

  // Only hide on blur when focus truly leaves the wrapper
  const handleBlur = (e: React.FocusEvent) => {
    if (!ref.current?.contains(e.relatedTarget as Node)) {
      hide();
    }
  };

  // Close tooltip when any scroll container scrolls
  useEffect(() => {
    if (!open) {
      return;
    }

    window.addEventListener('scroll', hide, true);

    return () => window.removeEventListener('scroll', hide, true);
  }, [open]);

  const translateX =
    align === TooltipAlign.Right
      ? 'translateX(-100%)'
      : align === TooltipAlign.Center
        ? 'translateX(-50%)'
        : '';

  return (
    <div
      ref={ref}
      className={cn(tooltipRootStyles(), className)}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={handleBlur}
    >
      {children}
      {open &&
        createPortal(
          <div
            className={tooltipBubbleStyles()}
            style={{
              // top: place the bubble above the element with a small gap
              top: anchor.top - OFFSET_PX,
              // left: the anchor point chosen above
              left: anchor.left,
              // transform: shift horizontally to align (based on align),
              // and translateY(-100%) lifts the bubble fully above the anchor
              transform: `${translateX} translateY(-100%)`,
            }}
            role="tooltip"
          >
            {content}
            <div className={tooltipArrowStyles({ align })} />
          </div>,
          document.body
        )}
    </div>
  );
}
