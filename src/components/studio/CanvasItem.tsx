import { useRef, useCallback, MouseEvent as ReactMouseEvent } from 'react';
import { Trash2 } from 'lucide-react';
import type { CanvasElement } from '@/types';
import { ElementVisual } from './ElementVisual';
import { cn, clamp } from '@/lib/utils';

interface Props {
  element: CanvasElement;
  selected: boolean;
  zoom: number;
  density: number;
  onSelect: (id: string) => void;
  onChange: (el: CanvasElement) => void;
  onDelete?: (id: string) => void;
  onInteractionStart?: () => void;
  canvasWidth: number;
  canvasHeight: number;
}

type DragMode = 'move' | 'resize' | 'rotate' | null;

export function CanvasItem({
  element,
  selected,
  zoom,
  density,
  onSelect,
  onChange,
  onDelete,
  onInteractionStart,
  canvasWidth,
  canvasHeight,
}: Props) {
  const modeRef = useRef<DragMode>(null);
  const startRef = useRef({
    mx: 0,
    my: 0,
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    rot: 0,
  });

  const begin = useCallback(
    (mode: DragMode, e: ReactMouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      onSelect(element.id);
      onInteractionStart?.();
      modeRef.current = mode;
      startRef.current = {
        mx: e.clientX,
        my: e.clientY,
        x: element.x,
        y: element.y,
        w: element.width,
        h: element.height,
        rot: element.rotation,
      };

      const onMove = (ev: globalThis.MouseEvent) => {
        if (!modeRef.current) return;
        const dx = (ev.clientX - startRef.current.mx) / zoom;
        const dy = (ev.clientY - startRef.current.my) / zoom;

        if (modeRef.current === 'move') {
          onChange({
            ...element,
            x: clamp(startRef.current.x + dx, 0, canvasWidth - element.width),
            y: clamp(startRef.current.y + dy, 0, canvasHeight - element.height),
          });
        } else if (modeRef.current === 'resize') {
          onChange({
            ...element,
            width: clamp(startRef.current.w + dx, 40, canvasWidth - element.x),
            height: clamp(startRef.current.h + dy, 30, canvasHeight - element.y),
          });
        } else if (modeRef.current === 'rotate') {
          const angle = startRef.current.rot + dx * 0.5;
          onChange({ ...element, rotation: Math.round(angle) % 360 });
        }
      };

      const onUp = () => {
        modeRef.current = null;
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
      };

      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    },
    [element, onSelect, onChange, onInteractionStart, zoom, canvasWidth, canvasHeight],
  );

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${element.name}, selected: ${selected}`}
      aria-pressed={selected}
      className={cn(
        'absolute select-none touch-none group',
        selected ? 'z-50' : 'z-10',
      )}
      style={{
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        transform: `rotate(${element.rotation}deg)`,
        zIndex: selected ? 1000 : element.zIndex,
      }}
      onMouseDown={(e) => begin('move', e)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(element.id);
        }
      }}
    >
      <div
        className={cn(
          'w-full h-full rounded-lg transition-shadow',
          selected && 'ring-2 ring-champagne ring-offset-2 ring-offset-transparent shadow-lg',
        )}
      >
        <ElementVisual element={element} density={density} />
      </div>

      {selected && (
        <>
          <span className="absolute -top-6 left-0 text-[10px] font-medium text-forest bg-ivory/90 px-1.5 py-0.5 rounded whitespace-nowrap max-w-[70%] truncate">
            {element.name}
          </span>
          <button
            type="button"
            aria-label={`Delete ${element.name}`}
            title="Delete"
            className="absolute -top-3 -right-3 h-6 w-6 rounded-full bg-red-700 text-white border-2 border-white shadow flex items-center justify-center hover:bg-red-800 cursor-pointer"
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onDelete?.(element.id);
            }}
          >
            <Trash2 className="h-3 w-3" />
          </button>
          <button
            type="button"
            aria-label="Resize element"
            className="absolute -right-2 -bottom-2 h-4 w-4 rounded-full bg-champagne border-2 border-white cursor-se-resize"
            onMouseDown={(e) => begin('resize', e)}
          />
          <button
            type="button"
            aria-label="Rotate element"
            className="absolute left-1/2 -top-3 -translate-x-1/2 h-3.5 w-3.5 rounded-full bg-forest border-2 border-white cursor-grab"
            onMouseDown={(e) => begin('rotate', e)}
          />
        </>
      )}
    </div>
  );
}
